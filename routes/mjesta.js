import express from "express";
import db from "../db.js";

const router = express.Router();

// GET /mjesto/:id
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  const [[row]] = await db.query(`
    SELECT
      m.id_mjesta,
      m.naziv_mjesta,
      m.opis,
      m.slika1,
      m.slika2,
      m.slika3,
      g.naziv_grada
    FROM mjesto m
    JOIN grad g ON m.id_grada = g.id_grada
    WHERE m.id_mjesta = ?
  `, [id]);

  res.json(row);
});

export default router;
