import express from "express";
import db from "../db.js";

const router = express.Router();

// GET /korisnici/uid/:firebase_uid
router.get("/uid/:firebase_uid", async (req, res) => {
  const { firebase_uid } = req.params;

  const [rows] = await db.query(
    "SELECT id_korisnika FROM korisnik WHERE firebase_uid = ?",
    [firebase_uid]
  );

  res.json(rows[0]);
});

export default router;
