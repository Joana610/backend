import express from "express";
import db from "../db.js";

const router = express.Router();

// GET /komentari/:id_mjesta
router.get("/:id_mjesta", async (req, res) => {
  const { id_mjesta } = req.params;

  const [rows] = await db.query(`
    SELECT
      k.id_komentara,
      k.tekst,
      k.id_korisnika,
      u.ime_korisnika
    FROM komentari k
    JOIN korisnik u ON k.id_korisnika = u.id_korisnika
    WHERE k.id_mjesta = ?
    ORDER BY k.id_komentara DESC
  `, [id_mjesta]);

  res.json(rows);
});

// POST /komentari
router.post("/", async (req, res) => {
  const { firebase_uid, id_mjesta, tekst } = req.body;

  const [[user]] = await db.query(
    "SELECT id_korisnika FROM korisnik WHERE firebase_uid = ?",
    [firebase_uid]
  );

  if (!user) return res.status(400).json({ success: false });

  await db.query(
    "INSERT INTO komentari (id_mjesta, id_korisnika, tekst) VALUES (?, ?, ?)",
    [id_mjesta, user.id_korisnika, tekst]
  );

  res.json({ success: true });
});

// DELETE /komentari/:id_komentara
router.delete("/:id_komentara", async (req, res) => {
  const { id_komentara } = req.params;
  const { firebase_uid } = req.body;

  const [[user]] = await db.query(
    "SELECT id_korisnika FROM korisnik WHERE firebase_uid = ?",
    [firebase_uid]
  );

  const [result] = await db.query(
    "DELETE FROM komentari WHERE id_komentara = ? AND id_korisnika = ?",
    [id_komentara, user.id_korisnika]
  );

  res.json({ success: result.affectedRows === 1 });
});

export default router;
