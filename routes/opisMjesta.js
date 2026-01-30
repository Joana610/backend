import express from "express";
import db from "../db.js";

const router = express.Router();

/**
 * 1️⃣ GET /opis-mjesta/:id
 * osnovni podaci o mjestu
 */
router.get("/opis-mjesta/:id", async (req, res) => {
  try {
    const [rows] = await db.query(
      `
      SELECT 
        m.id_mjesta,
        m.naziv_mjesta,
        g.naziv_grada,
        m.opis,
        m.slika1,
        m.slika2,
        m.slika3
      FROM mjesto m
      JOIN grad g ON g.id_grada = m.id_grada
      WHERE m.id_mjesta = ?
      `,
      [req.params.id]
    );

    res.json(rows[0] || null);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "DB error" });
  }
});

/**
 * 2️⃣ GET /opis-mjesta/:id/kategorije
 */
router.get("/opis-mjesta/:id/kategorije", async (req, res) => {
  try {
    const [rows] = await db.query(
      `
      SELECT k.naziv_kategorije
      FROM kategorija k
      JOIN kategorija_u_mjestu km ON km.id_kategorije = k.id_kategorije
      WHERE km.id_mjesta = ?
      `,
      [req.params.id]
    );

    res.json(rows.map(r => r.naziv_kategorije));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "DB error" });
  }
});

/**
 * 3️⃣ GET /opis-mjesta/:id/komentari
 */
router.get("/opis-mjesta/:id/komentari", async (req, res) => {
  try {
    const [rows] = await db.query(
      `
      SELECT 
        k.id_komentara,
        k.id_korisnika,
        ko.ime_korisnika,
        k.tekst
      FROM komentar k
      JOIN korisnik ko ON ko.id_korisnika = k.id_korisnika
      WHERE k.id_mjesta = ?
      ORDER BY k.id_komentara DESC
      `,
      [req.params.id]
    );

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "DB error" });
  }
});

/**
 * 4️⃣ GET /opis-mjesta/:id/posjeceno/:firebaseUid
 */
router.get("/opis-mjesta/:id/posjeceno/:uid", async (req, res) => {
  try {
    const [rows] = await db.query(
      `
      SELECT 1
      FROM posjeceno p
      JOIN korisnik k ON k.id_korisnika = p.id_korisnika
      WHERE k.firebase_uid = ?
        AND p.id_mjesta = ?
      `,
      [req.params.uid, req.params.id]
    );

    res.json({ posjeceno: rows.length > 0 });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "DB error" });
  }
});

export default router;
