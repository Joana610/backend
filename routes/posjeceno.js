import express from "express";
import db from "../db.js";

const router = express.Router();

/**
 * GET /posjeceno/user/:firebase_uid
 * Vraca listu posjecenih mjesta za usera
 */
router.get("/user/:firebase_uid", async (req, res) => {
  try {
    const { firebase_uid } = req.params;

    const [rows] = await db.query(`
      SELECT 
        m.id_mjesta,
        m.slika1 AS slika
      FROM posjeceno p
      JOIN korisnik k ON p.id_korisnika = k.id_korisnika
      JOIN mjesto m ON p.id_mjesta = m.id_mjesta
      WHERE k.firebase_uid = ?
    `, [firebase_uid]);

    res.json(rows); // 👈 ARRAY
  } catch (err) {
    console.error("GRESKA /posjeceno/user:", err);
    res.status(500).json({ error: "Database error" });
  }
});

/**
 * GET /posjeceno/:id_mjesta/:firebase_uid
 * Provjera da li je mjesto posjeceno
 */
router.get("/:id_mjesta/:firebase_uid", async (req, res) => {
  try {
    const { id_mjesta, firebase_uid } = req.params;

    const [[row]] = await db.query(`
      SELECT COUNT(*) AS cnt
      FROM posjeceno p
      JOIN korisnik k ON p.id_korisnika = k.id_korisnika
      WHERE p.id_mjesta = ? AND k.firebase_uid = ?
    `, [id_mjesta, firebase_uid]);

    res.json({ posjeceno: row.cnt > 0 });
  } catch (err) {
    console.error("GRESKA /posjeceno check:", err);
    res.status(500).json({ error: "Database error" });
  }
});

/**
 * POST /posjeceno
 */
router.post("/", async (req, res) => {
  try {
    const { firebase_uid, id_mjesta } = req.body;

    const [[user]] = await db.query(
      "SELECT id_korisnika FROM korisnik WHERE firebase_uid = ?",
      [firebase_uid]
    );

    await db.query(
      "INSERT IGNORE INTO posjeceno (id_korisnika, id_mjesta) VALUES (?, ?)",
      [user.id_korisnika, id_mjesta]
    );

    res.json({ success: true });
  } catch (err) {
    console.error("GRESKA POST /posjeceno:", err);
    res.status(500).json({ error: "Database error" });
  }
});

/**
 * DELETE /posjeceno
 */
router.delete("/", async (req, res) => {
  try {
    const { firebase_uid, id_mjesta } = req.body;

    const [[user]] = await db.query(
      "SELECT id_korisnika FROM korisnik WHERE firebase_uid = ?",
      [firebase_uid]
    );

    await db.query(
      "DELETE FROM posjeceno WHERE id_korisnika = ? AND id_mjesta = ?",
      [user.id_korisnika, id_mjesta]
    );

    res.json({ success: true });
  } catch (err) {
    console.error("GRESKA DELETE /posjeceno:", err);
    res.status(500).json({ error: "Database error" });
  }
});

/**
 * POST /posjeceno
 * body: { firebase_uid, id_mjesta }
 */
router.post("/", async (req, res) => {
  const { firebase_uid, id_mjesta } = req.body;

  try {
    // dohvati id_korisnika
    const [[user]] = await db.query(
      "SELECT id_korisnika FROM korisnik WHERE firebase_uid = ?",
      [firebase_uid]
    );

    if (!user) {
      return res.status(404).json({ error: "Korisnik ne postoji" });
    }

    await db.query(
      "INSERT INTO posjeceno (id_korisnika, id_mjesta) VALUES (?, ?)",
      [user.id_korisnika, id_mjesta]
    );

    res.json({ success: true });
  } catch (err) {
    console.error("GRESKA POST /posjeceno:", err);
    res.status(500).json({ error: "DB error" });
  }
});

/**
 * DELETE /posjeceno
 * body: { firebase_uid, id_mjesta }
 */
router.delete("/", async (req, res) => {
  const { firebase_uid, id_mjesta } = req.body;

  try {
    const [[user]] = await db.query(
      "SELECT id_korisnika FROM korisnik WHERE firebase_uid = ?",
      [firebase_uid]
    );

    if (!user) {
      return res.status(404).json({ error: "Korisnik ne postoji" });
    }

    await db.query(
      "DELETE FROM posjeceno WHERE id_korisnika = ? AND id_mjesta = ?",
      [user.id_korisnika, id_mjesta]
    );

    res.json({ success: true });
  } catch (err) {
    console.error("GRESKA DELETE /posjeceno:", err);
    res.status(500).json({ error: "DB error" });
  }
});

export default router;
