const pharmaModel = require('../models/pharma.model');

const getControllerPharma = async (req, res, next) => {
  try {

    const data = await pharmaModel.getPharma();

    if (!data) {
      return res.status(401).json({ success: false, message: 'Utilisateur non trouvé' });
    }

    res.json(data);
  } catch (err) {
    next(err);
  }
};


const getControllerPharmaOne = async (req, res, next) => {
  const {id} = req.query;
  try {

    const data = await pharmaModel.getPharmaOne(id);

    if (!data) {
      return res.status(401).json({ success: false, message: 'Utilisateur non trouvé' });
    }

    res.json(data);
  } catch (err) {
    next(err);
  }
};


const postControllerPharma = async (req, res, next) => {
  try {
    const { nomMedicament , description, stock } = req.body;

    const resultat = await pharmaModel.createPharma(nomMedicament , description, stock);
    res.status(201).json({
      message: 'Medicament créé avec succès',
      id: resultat ? resultat.insertId : undefined,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/pharma/stock — ajustement ATOMIQUE du stock d'un
 * médicament (délivrance d'ordonnance / vente directe / réappro).
 * Body : { id: number, quantite: number } — quantite NÉGATIVE pour
 * une sortie de stock (délivrance), positive pour une entrée.
 * Réponse : { message, stock?: number } — 404 si médicament inconnu,
 * 400 si quantité invalide.
 */
const postControllerPharmaStock = async (req, res, next) => {
  try {
    const { id, quantite } = req.body;

    const resultat = await pharmaModel.ajusterStock(id, quantite);
    if (!resultat || resultat.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Medicament non trouvé' });
    }

    // Renvoie le nouveau stock : l'écran pharmacie affiche la valeur
    // réelle post-délivrance sans devoir recharger toute la liste.
    const apres = await pharmaModel.getPharmaOne(id);
    res.status(200).json({
      message: 'Stock ajusté',
      stock: Array.isArray(apres) && apres.length > 0 ? apres[0].stock : undefined,
    });
  } catch (err) {
    if (err && err.status === 400) {
      return res.status(400).json({ success: false, message: err.message });
    }
    next(err);
  }
};

/**
 * POST /api/pharma/vente — carnet de ventes directes (B3 RDC, phase 5).
 * Body : { facture_locale, client_nom?, lignes: [{medicament_id?, nom,
 * quantite, prix_usd}], montant_total_usd, taux_fc_usd, date_vente? }.
 * Réponse : { message, id_vente } — 501 tant que la migration 001
 * n'a pas créé vente_pharma (les traces restent dans l'outbox du
 * frontend et sont rejouées ensuite), 400 si lignes invalides.
 */
const postControllerPharmaVente = async (req, res, next) => {
  try {
    const { facture_locale, client_nom, lignes, montant_total_usd, taux_fc_usd, date_vente } = req.body;

    if (!Array.isArray(lignes) || lignes.length === 0) {
      return res.status(400).json({ success: false, message: 'lignes (tableau non vide) est requis' });
    }
    if (!facture_locale) {
      return res.status(400).json({ success: false, message: 'facture_locale (référence VTE-…) est requise' });
    }

    const resultat = await pharmaModel.createVente({
      referenceLocale: String(facture_locale),
      clientNom: client_nom ? String(client_nom) : null,
      lignesJson: JSON.stringify(lignes),
      montantTotalUsd: Number(montant_total_usd) || 0,
      tauxFcUsd: Number(taux_fc_usd) || null,
      dateVente: date_vente || new Date().toISOString().slice(0, 19).replace('T', ' '),
    });
    res.status(201).json({
      message: 'Vente enregistrée',
      id_vente: resultat ? resultat.insertId : undefined,
    });
  } catch (err) {
    if (err && err.status === 501) {
      return res.status(501).json({ success: false, message: err.message });
    }
    next(err);
  }
};

/**
 * GET /api/pharma/vente — carnet des ventes directes récentes (100
 * dernières) pour la réconciliation et le contrôle journalier.
 */
const getControllerPharmaVentes = async (req, res, next) => {
  try {
    const data = await pharmaModel.getVentes();
    res.json(data);
  } catch (err) {
    if (err && err.status === 501) {
      return res.status(501).json({ success: false, message: err.message });
    }
    next(err);
  }
};

module.exports = {
  getControllerPharma ,
  postControllerPharma,
  postControllerPharmaStock,
  postControllerPharmaVente,
  getControllerPharmaVentes
};
