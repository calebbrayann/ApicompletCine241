export const handlePrismaError = (error, res) => {
  if (error.code === "P2025") {
    return res.status(404).json({ message: "Ressource non trouvée" });
  }
  if (error.code === "P2002") {
    return res
      .status(400)
      .json({
        message: "Contrainte unique violée. Veuillez vérifier vos données.",
      });
  }
  console.error("Erreur Prisma :", error);
  res.status(500).json({ message: "Erreur interne du serveur" });
};