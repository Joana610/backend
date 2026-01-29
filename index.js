import express from "express";
import homeRoutes from "./routes/home.js";

const app = express();
app.use(express.json());

app.use("/", homeRoutes);

app.get("/test", (req, res) => {
  res.json({ ok: true });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
