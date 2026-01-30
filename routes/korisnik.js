router.get("/:firebase_uid", async (req, res) => {
  const { firebase_uid } = req.params;

  try {
    const [[user]] = await db.query(
      `
      SELECT 
        id_korisnika,
        ime_korisnika
      FROM korisnik
      WHERE firebase_uid = ?
      `,
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
