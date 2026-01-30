import express from "express";
import db from "../db.js";

const router = express.Router();

router.get("/:firebase_uid", async (req, res) => {
  const { firebase_uid } = req.params;

  try {
    const [[user]] = await db.query(
      "SELECT id_korisnika, ime_korisnika FROM korisnik WHERE firebase_uid = ?",
      [firebase_uid]
    );

    if (!user) {
      return res.status(404).json({ error: "Korisnik ne postoji" });
    }

    res.json(user);
  } catch (err) {
    console.error("GRESKA /korisnik:", err);
    res.status(500).json({ error: "Database error" });
  }
});
/**
 * POST /korisnik
 * Kreiranje korisnika (registracija nakon Firebase auth)
 */
router.post("/", async (req, res) => {
  const { ime_korisnika, email, firebase_uid } = req.body;

  if (!ime_korisnika || !email || !firebase_uid) {
    return res.status(400).json({ error: "Nedostaju podaci" });
  }

  try {
    // provjera postoji li već korisnik
    const [existing] = await db.query(
      "SELECT id_korisnika FROM korisnik WHERE firebase_uid = ?",
      [firebase_uid]
    );

    if (existing.length > 0) {
      return res.json({ success: true, message: "Korisnik već postoji" });
    }

    await db.query(
      `
      INSERT INTO korisnik (ime_korisnika, email, firebase_uid)
      VALUES (?, ?, ?)
      `,
      [ime_korisnika, email, firebase_uid]
    );

    res.json({ success: true });
  } catch (err) {
    console.error("GRESKA POST /korisnik:", err);
    res.status(500).json({ error: "Database error" });
  }
});

export default router;
