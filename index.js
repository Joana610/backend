import express from "express";
import albumRoutes from "./routes/album.js";
import homeRoutes from "./routes/home.js";
import komentariRoutes from "./routes/komentari.js";
import korisnikRoutes from "./routes/korisnik.js";
import naljepniceRoutes from "./routes/naljepnice.js";
import opisMjestaRoutes from "./routes/opisMjesta.js";
import posjecenoRoutes from "./routes/posjeceno.js";
import profilRoutes from "./routes/profil.js";



const app = express();
app.use(express.json());

app.use("/", homeRoutes);       
app.use("/posjeceno", posjecenoRoutes);
app.use("/korisnik", korisnikRoutes);
app.use("/", opisMjestaRoutes);
app.use("/komentari", komentariRoutes);
app.use("/profil", profilRoutes);
app.use("/naljepnice", naljepniceRoutes);
app.use("/album", albumRoutes);

app.get("/test", (req, res) => {
  res.json({ ok: true });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
