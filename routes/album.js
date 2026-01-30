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


// POST /album
router.post("", async (req, res) => {
  const {
    firebase_uid,
    naziv,
    opis,
    slika1,
    slika2,
    slika3,
  } = req.body;

  if (!firebase_uid || !naziv) {
    return res.status(400).json({ error: "Nedostaju podaci" });
  }

  try {
   
    const [users] = await db.execute(
      "SELECT id_korisnika FROM korisnik WHERE firebase_uid = ?",
      [firebase_uid]
    );

    if (users.length === 0) {
      return res.status(404).json({ error: "Korisnik ne postoji" });
    }

    const id_korisnika = users[0].id_korisnika;


    await db.execute(
      `
      INSERT INTO album
        (id_korisnika, naziv, opis, slika1, slika2, slika3)
      VALUES (?, ?, ?, ?, ?, ?)
      `,
      [
        id_korisnika,
        naziv,
        opis ?? null,
        slika1 ?? null,
        slika2 ?? null,
        slika3 ?? null,
      ]
    );

    res.json({ success: true });
  } catch (err) {
    console.error("ADD ALBUM ERROR:", err);
    res.status(500).json({ error: "Greška servera" });
  }
});

/**
 * GET /album/:id_objave
 * Dohvati jedan album + firebase_uid
 */
router.get("/:id_objave", async (req, res) => {
  const { id_objave } = req.params;

  try {
    const [rows] = await db.query(
      `
      SELECT
        a.id_objave,
        a.naziv,
        a.opis,
        a.slika1,
        a.slika2,
        a.slika3,
        k.firebase_uid
      FROM album a
      JOIN korisnik k ON a.id_korisnika = k.id_korisnika
      WHERE a.id_objave = ?
      LIMIT 1
      `,
      [id_objave]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Album ne postoji" });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error("GRESKA GET /album/:id_objave", err);
    res.status(500).json({ error: "Greška servera" });
  }
});

/**
 * PATCH /album/:id_objave
 * Update naziv i/ili opis albuma
 */
router.patch("/:id_objave", async (req, res) => {
  const { id_objave } = req.params;
  const { naziv, opis } = req.body;

  if (!naziv && !opis) {
    return res.status(400).json({ error: "Nema podataka za update" });
  }

  try {
    const fields = [];
    const values = [];

    if (naziv !== undefined) {
      fields.push("naziv = ?");
      values.push(naziv);
    }

    if (opis !== undefined) {
      fields.push("opis = ?");
      values.push(opis);
    }

    values.push(id_objave);

    await db.query(
      `UPDATE album SET ${fields.join(", ")} WHERE id_objave = ?`,
      values
    );

    res.json({ success: true });
  } catch (err) {
    console.error("GRESKA PATCH /album:", err);
    res.status(500).json({ error: "Greška servera" });
  }
});

export default router;
