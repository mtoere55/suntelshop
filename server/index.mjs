import express from "express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const app = express();
const PORT = process.env.PORT || 3015;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const distDir = path.join(rootDir, "dist");
const uploadsDir = path.join(rootDir, "public", "uploads");
fs.mkdirSync(uploadsDir, { recursive: true });

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(uploadsDir));

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, app: "suntelshop", time: new Date().toISOString() });
});

app.use(express.static(distDir));
app.get("*", (_req, res) => {
  const indexFile = path.join(distDir, "index.html");
  if (fs.existsSync(indexFile)) res.sendFile(indexFile);
  else res.status(200).send("SuntelShop build fehlt. Bitte npm run build ausführen.");
});

app.listen(PORT, () => console.log(`SuntelShop läuft auf http://127.0.0.1:${PORT}`));
