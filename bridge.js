import express from 'express';
import fs from 'fs';
import path from 'path';
import cors from 'cors';
import { fileURLToPath } from 'url';

// Configuración para que funcione en Node moderno
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' })); // Para que aguante muchas fotos pesadas

// --- 1. SUBIR FOTOS DE NOTICIAS EN LOTE ---
app.post('/upload-news-bulk', (req, res) => {
    const { images } = req.body;
    // Las fotos se guardarán en: psc-alertas/public/noticias
    const newsFolder = path.join(__dirname, 'public', 'noticias');
    
    if (!fs.existsSync(newsFolder)) fs.mkdirSync(newsFolder, { recursive: true });

    const savedPaths = images.map(img => {
        const filePath = path.join(newsFolder, img.fileName);
        const buffer = Buffer.from(img.base64Data, 'base64');
        fs.writeFileSync(filePath, buffer);
        return `/noticias/${img.fileName}`;
    });

    console.log(`📰 PSC ALERTAS: Se guardaron ${savedPaths.length} fotos nuevas.`);
    res.send({ paths: savedPaths });
});

// --- 2. GUARDAR LOS DATOS (TÍTULOS Y RUTAS) ---
app.post('/save-news-data', (req, res) => {
    // Se guardará en: psc-alertas/src/data/noticias_finales.js
    const dataFolder = path.join(__dirname, 'src', 'data');
    if (!fs.existsSync(dataFolder)) fs.mkdirSync(dataFolder, { recursive: true });
    
    const filePath = path.join(dataFolder, 'noticias_finales.js');
    const content = `export const noticiasPSC = ${JSON.stringify(req.body, null, 4)};`;
    
    fs.writeFile(filePath, content, (err) => {
        if (err) {
            console.error("Error al escribir el archivo:", err);
            return res.status(500).send("Error");
        }
        console.log("✅ Archivo noticias_finales.js actualizado físicamente.");
        res.send("Guardado correctamente");
    });
});

app.listen(3001, () => {
    console.log("----------------------------------------------");
    console.log("🚀 PUENTE PSC ALERTAS ACTIVO EN PUERTO 3001");
    console.log("----------------------------------------------");
});