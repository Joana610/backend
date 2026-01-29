const express = require("express");
const app = express();

app.use(express.json());

// 👇 OVDJE DODAJEŠ
app.get("/test", (req, res) => {
  res.json({ ok: true });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
