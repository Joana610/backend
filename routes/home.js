const express = require("express");
const db = require("../db");

const router = express.Router();

// GET /gradovi
router.get("/gradovi", async (req, res) => {
  const [rows] = await db.query(
    "SELECT id_grada, naziv_grada FROM grad"
  );
  res.json(rows);
});

// GET /kategorije
router.get("/kategorije", async (req, res) => {
  const [rows] = await db.query(
    "SELECT id_kategorije, naziv_kategorije FROM kategorija"
  );
  res.json(rows);
});

// GET /mjesta
router.get("/mjesta", async (req, res) => {
  const [rows] = await db.query(`
    SELECT id_mjesta, naziv_mjesta AS naziv, slika1 AS slika
    FROM mjesto
  `);
  res.json(rows);
});

// GET /mjesta/grad/:id
router.get("/mjesta/grad/:id", async (req, res) => {
  const [rows] = await db.query(
    `
    SELECT id_mjesta, naziv_mjesta AS naziv, slika1 AS slika
    FROM mjesto
    WHERE id_grada = ?
    `,
    [req.params.id]
  );
  res.json(rows);
});

// GET /mjesta/kategorija/:id
router.get("/mjesta/kategorija/:id", async (req, res) => {
  const [rows] = await db.query(
    `
    SELECT m.id_mjesta, m.naziv_mjesta AS naziv, m.slika1 AS slika
    FROM mjesto m
    JOIN kategorija_u_mjestu km ON m.id_mjesta = km.id_mjesta
    WHERE km.id_kategorije = ?
    `,
    [req.params.id]
  );
  res.json(rows);
});

module.exports = router;
