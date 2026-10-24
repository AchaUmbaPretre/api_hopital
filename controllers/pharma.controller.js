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

module.exports = {
  getControllerPharma ,
  postControllerPharma,
  postControllerPharmaStock
};
