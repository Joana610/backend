import express from "express";
import db from "../db.js";

const router = express.Router();

/**
 * GET /profil/:firebase_uid
 * Vraća: ime_korisnika, email, citat
 */
router.get("/:firebase_uid", async (req, res) => {
  const { firebase_uid } = req.params;

  try {
    const [[user]] = await db.query(
      `SELECT ime_korisnika, email, citat
       FROM korisnik
       WHERE firebase_uid = ?`,
      [firebase_uid]
    );

    if (!user) {
      return res.status(404).json({ error: "Korisnik ne postoji" });
    }

    res.json(user);
  } catch (err) {
    console.error("GRESKA GET /profil:", err);
    res.status(500).json({ error: "DB error" });
  }
});

/**
 * PUT /profil
 * body: { firebase_uid, polje, vrijednost }
 */
router.put("/", async (req, res) => {
  const { firebase_uid, polje, vrijednost } = req.body;

  if (!firebase_uid || !polje || !vrijednost) {
    return res.status(400).json({ error: "Nedostaju podaci" });
  }

  // dozvoljavamo samo ova polja
  if (!["ime", "citat"].includes(polje)) {
    return res.status(400).json({ error: "Nedozvoljeno polje" });
  }

  const column =
    polje === "ime" ? "ime_korisnika" : "citat";

  try {
    const [result] = await db.query(
      `UPDATE korisnik
       SET ${column} = ?
       WHERE firebase_uid = ?`,
      [vrijednost, firebase_uid]
    );

    res.json({ success: true });
  } catch (err) {
    console.error("GRESKA PUT /profil:", err);
    res.status(500).json({ error: "DB error" });
  }
});

export default router;
