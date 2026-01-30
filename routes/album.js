import express from "express";
import db from "../db.js";

const router = express.Router();

/**
 * GET /album/user/:firebase_uid
 * Dohvati sve objave albuma za korisnika
 */
router.get("/user/:firebase_uid", async (req, res) => {
  const { firebase_uid } = req.params;

  try {
  
    const [[user]] = await db.query(
      "SELECT id_korisnika FROM korisnik WHERE firebase_uid = ?",
      [firebase_uid]
    );

    if (!user) {
      return res.status(404).json({ error: "Korisnik ne postoji" });
    }

    const [album] = await db.query(
      `
      SELECT 
        id_objave,
        naziv,
        slika1,
        slika2,
        slika3
      FROM album
      WHERE id_korisnika = ?
      ORDER BY id_objave DESC
      `,
      [user.id_korisnika]
    );

    res.json(album);
  } catch (err) {
    console.error("GRESKA GET /album:", err);
    res.status(500).json({ error: "Database error" });
  }
});

/**
 * DELETE /album/:id_objave
 * Briše objavu iz baze
 */
router.delete("/:id_objave", async (req, res) => {
  const { id_objave } = req.params;

  try {
    await db.query(
      "DELETE FROM album WHERE id_objave = ?",
      [id_objave]
    );

    res.json({ success: true });
  } catch (err) {
    console.error("GRESKA DELETE /album:", err);
    res.status(500).json({ error: "Database error" });
  }
});

export default router;
