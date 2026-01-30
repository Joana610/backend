import express from "express";
import db from "../db.js";

const router = express.Router();

/**
 * GET /naljepnice/gradovi/:firebase_uid
 * vraća: [{ naziv_grada: "Sarajevo" }, ...]
 */
router.get("/gradovi/:firebase_uid", async (req, res) => {
  const { firebase_uid } = req.params;

  try {
    const [rows] = await db.query(
      `
      SELECT DISTINCT g.naziv_grada
      FROM posjeceno p
      JOIN korisnik k ON p.id_korisnika = k.id_korisnika
      JOIN mjesto m ON p.id_mjesta = m.id_mjesta
      JOIN grad g ON m.id_grada = g.id_grada
      WHERE k.firebase_uid = ?
      `,
      [firebase_uid]
    );

    res.json(rows);
  } catch (err) {
    console.error("GRESKA /naljepnice/gradovi:", err);
    res.status(500).json({ error: "Database error" });
  }
});

export default router;
