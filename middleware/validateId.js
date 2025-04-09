export const validateId = (req, res, next) => {
  const { id } = req.params;
  if (!id || isNaN(parseInt(id))) {
    return res
      .status(400)
      .json({ message: "ID invalide. Veuillez fournir un entier valide." });
  }
  next();
};
