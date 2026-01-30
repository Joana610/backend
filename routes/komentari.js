import express from "express";
import db from "../db.js";

const router = express.Router();

/**
 * POST /komentari
 * body: { firebase_uid, id_mjesta, tekst }
 */
router.post("/", async (req, res) => {
  const { firebase_uid, id_mjesta, tekst } = req.body;

  try {
    const [[user]] = await db.query(
      "SELECT id_korisnika FROM korisnik WHERE firebase_uid = ?",
      [firebase_uid]
    );

    if (!user) {
      return res.status(404).json({ error: "Korisnik ne postoji" });
    }

    await db.query(
      "INSERT INTO komentari (id_mjesta, id_korisnika, tekst) VALUES (?, ?, ?)",
      [id_mjesta, user.id_korisnika, tekst]
    );

    res.json({ success: true });
  } catch (err) {
    console.error("GRESKA POST /komentari:", err);
    res.status(500).json({ error: "DB error" });
  }
});

/**
 * DELETE /komentari/:id_komentara
 * body: { firebase_uid }
 */
router.delete("/:id_komentara", async (req, res) => {
  const { firebase_uid } = req.body;
  const { id_komentara } = req.params;

  try {
    const [[user]] = await db.query(
      "SELECT id_korisnika FROM korisnik WHERE firebase_uid = ?",
      [firebase_uid]
    );

    if (!user) {
      return res.status(404).json({ error: "Korisnik ne postoji" });
    }

    // briše se samo ako je komentar od tog korisnika
    await db.query(
      "DELETE FROM komentari WHERE id_komentara = ? AND id_korisnika = ?",
      [id_komentara, user.id_korisnika]
    );

    res.json({ success: true });
  } catch (err) {
    console.error("GRESKA DELETE /komentari:", err);
    res.status(500).json({ error: "DB error" });
  }
});

export default router;
