/**
 * MIDDLEWARE D'IDEMPOTENCE (B2 RDC) — dédupe serveur des rejeux offline.
 *
 * Le moteur de synchronisation du frontend envoie DÉJÀ l'en-tête
 * `X-Idempotence-Key` sur chaque mutation (offline/outbox.ts). Tant que
 * ce middleware n'existait pas, une coupure réseau APRÈS l'exécution
 * d'un POST (réponse perdue) faisait rejouer la mutation → doublon en
 * base (consultation, facture, ligne d'ordonnance…).
 *
 * Comportement :
 *  - pas d'en-tête, ou méthode GET/DELETE → aucun effet (pass-through) ;
 *  - clé inconnue → la requête s'exécute normalement ; la réponse est
 *    stockée (table `idempotence_cles`, migration 001_rdc_metier.sql) ;
 *  - clé connue → la réponse stockée est REJOUE telle quelle (même
 *    statut, même corps) : la requête n'est JAMAIS ré-exécutée ;
 *  - table absente (migration non appliquée) → pass-through silencieux
 *    (l'application héritée n'est jamais cassée) ;
 *  - les clés de plus de 48 h sont purgées à l'insertion.
 */

const { tableIdempotenceDisponible } = require('../utils/rdcColumns');

const DUREE_DE_VIE_HEURES = 48;

function requeteAsync(sql, params) {
  return new Promise((resolve, reject) => {
    // require tardif : évite tout cycle au chargement du module.
    const pool = require('../config/db.config');
    pool.query(sql, params, (error, results) => {
      if (error) reject(error);
      else resolve(results);
    });
  });
}

async function chercherCle(cle) {
  const lignes = await requeteAsync(
    'SELECT statut, reponse FROM idempotence_cles WHERE cle = ? LIMIT 1',
    [cle],
  );
  if (!Array.isArray(lignes) || lignes.length === 0) return null;
  const ligne = lignes[0];
  let corps = null;
  try {
    corps = ligne.reponse ? JSON.parse(ligne.reponse) : null;
  } catch {
    corps = null;
  }
  return { statut: Number(ligne.statut) || 200, corps };
}

async function enregistrerCle(cle, endpoint, statut, corps) {
  // Purge opportuniste des clés expirées (filet : la migration purge aussi).
  try {
    await requeteAsync(
      'DELETE FROM idempotence_cles WHERE cree_le < (NOW() - INTERVAL ? HOUR)',
      [DUREE_DE_VIE_HEURES],
    );
  } catch {
    // purge impossible : non bloquant
  }
  await requeteAsync(
    'INSERT INTO idempotence_cles (cle, endpoint, statut, reponse) VALUES (?, ?, ?, ?) ' +
      'ON DUPLICATE KEY UPDATE endpoint = VALUES(endpoint), statut = VALUES(statut), reponse = VALUES(reponse)',
    [cle, endpoint, statut, corps === undefined ? null : JSON.stringify(corps)],
  );
}

/**
 * À monter AVANT les routers concernés : app.use('/api/patient', idempotence, patientRoutes)…
 * Seules les méthodes d'écriture avec en-tête sont dédupliquées.
 */
function idempotence(req, res, next) {
  const cle = req.get('X-Idempotence-Key');
  if (!cle || cle.length > 128) return next();
  if (req.method !== 'POST' && req.method !== 'PUT') return next();

  tableIdempotenceDisponible()
    .then((disponible) => {
      if (!disponible) return next(); // migration non appliquée : héritage intact
      return chercherCle(cle).then((existante) => {
        if (existante) {
          // Rejeu de la réponse stockée : zéro effet de bord en base.
          return res.status(existante.statut).json({
            dedupe: true,
            ...(existante.corps && typeof existante.corps === 'object' ? existante.corps : {}),
          });
        }
        // Interception de res.json/res.send pour stocker la réponse.
        const jsonOriginal = res.json.bind(res);
        const sendOriginal = res.send.bind(res);
        const stocker = (corps) => {
          enregistrerCle(cle, `${req.method} ${req.originalUrl}`, res.statusCode, corps).catch(() => {
            // échec de stockage : non bloquant (le rejeu éventuel
            // retournera alors au comportement hérité)
          });
        };
        res.json = (corps) => {
          stocker(corps);
          return jsonOriginal(corps);
        };
        res.send = (corps) => {
          stocker(corps);
          return sendOriginal(corps);
        };
        return next();
      });
    })
    .catch(() => next());
}

module.exports = { idempotence };
