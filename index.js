import express from "express";
import homeRoutes from "./routes/home.js";
import komentariRoutes from "./routes/komentari.js";
import korisniciRoutes from "./routes/korisnici.js";
import mjestaRoutes from "./routes/mjesta.js";
import posjecenoRoutes from "./routes/posjeceno.js";

const app = express();
app.use(express.json());

app.use("/", homeRoutes);
app.use("/", posjecenoRoutes);
app.use("/", mjestaRoutes);
app.use("/", komentariRoutes);
app.use("/korisnici", korisniciRoutes);

app.get("/test", (req, res) => {
  res.json({ ok: true });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
