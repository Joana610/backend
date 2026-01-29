import express from "express";
import db from "../db.js";

const router = express.Router();

// GET /kategorije/:id_mjesta
router.get("/:id_mjesta", async (req, res) => {
  const { id_mjesta } = req.params;

  const [rows] = await db.query(`
    SELECT k.naziv_kategorije
    FROM kategorija_u_mjestu km
    JOIN kategorija k ON km.id_kategorije = k.id_kategorije
    WHERE km.id_mjesta = ?
    LIMIT 3
  `, [id_mjesta]);

  res.json(rows.map(r => r.naziv_kategorije));
});

export default router;
