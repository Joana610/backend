const express = require("express");
const homeRoutes = require("./routes/home");

const app = express();

app.use(express.json());

// rute
app.use("/", homeRoutes);

// test ruta (može ostati)
app.get("/test", (req, res) => {
  res.json({ ok: true });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
