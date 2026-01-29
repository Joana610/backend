import express from "express";
import db from "../db.js";

const router = express.Router();

// GET /posjeceno/:firebase_uid
router.get("/:firebase_uid", async (req, res) => {
  const { firebase_uid } = req.params;

  const [rows] = await db.query(`
    SELECT m.id_mjesta, m.slika
    FROM posjeceno p
    JOIN korisnik k ON p.id_korisnika = k.id_korisnika
    JOIN mjesto m ON p.id_mjesta = m.id_mjesta
    WHERE k.firebase_uid = ?
  `, [firebase_uid]);

  res.json(rows); 
});


// GET /posjeceno/:id_mjesta/:firebase_uid
router.get("/:id_mjesta/:firebase_uid", async (req, res) => {
  const { id_mjesta, firebase_uid } = req.params;

  const [[row]] = await db.query(`
    SELECT COUNT(*) AS cnt
    FROM posjeceno p
    JOIN korisnik k ON p.id_korisnika = k.id_korisnika
    WHERE p.id_mjesta = ? AND k.firebase_uid = ?
  `, [id_mjesta, firebase_uid]);

  res.json({ posjeceno: row.cnt > 0 });
});

// POST /posjeceno
router.post("/", async (req, res) => {
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
});

// DELETE /posjeceno
router.delete("/", async (req, res) => {
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
});

export default router;
