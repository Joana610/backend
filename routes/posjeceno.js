import express from "express";
import db from "../db.js";

const router = express.Router();

/**
 * GET /posjeceno/:firebase_uid
 * vraća sva posjećena mjesta za korisnika
 */
router.get("/posjeceno/:firebase_uid", async (req, res) => {
  try {
    const { firebase_uid } = req.params;

    const [rows] = await db.query(
      `
      SELECT
        m.id_mjesta,
        m.slika1 AS slika
      FROM posjeceno p
      JOIN korisnik k ON p.id_korisnika = k.id_korisnika
      JOIN mjesto m ON p.id_mjesta = m.id_mjesta
      WHERE k.firebase_uid = ?
      `,
      [firebase_uid]
    );

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Greška kod dohvaćanja posjećenih mjesta" });
  }
});

/**
 * GET /korisnik/:firebase_uid
 * vraća ime korisnika
 */
router.get("/korisnik/:firebase_uid", async (req, res) => {
  try {
    const { firebase_uid } = req.params;

    const [rows] = await db.query(
      `
      SELECT id_korisnika, ime_korisnika
      FROM korisnik
      WHERE firebase_uid = ?
      `,
      [firebase_uid]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Korisnik ne postoji" });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Greška kod korisnika" });
  }
});

export default router;
