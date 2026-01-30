import express from "express";
import homeRoutes from "./routes/home.js";
import komentariRoutes from "./routes/komentari.js";
import korisnikRoutes from "./routes/korisnik.js";
import opisMjestaRoutes from "./routes/opisMjesta.js";
import posjecenoRoutes from "./routes/posjeceno.js";


const app = express();
app.use(express.json());

app.use("/", homeRoutes);       
app.use("/posjeceno", posjecenoRoutes);
app.use("/korisnik", korisnikRoutes);
app.use("/", opisMjestaRoutes);
app.use("/komentari", komentariRoutes);

app.get("/test", (req, res) => {
  res.json({ ok: true });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
