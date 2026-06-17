import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, 'uploads')),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

app.post('/test', upload.single('image'), (req, res) => {
  console.log('req.file:', req.file);
  console.log('req.body:', req.body);
  res.json({ file: req.file, body: req.body });
});

const server = app.listen(5999, async () => {
  console.log('test server on 5999');

  const tinyPng = Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
    'base64'
  );

  const formData = new FormData();
  formData.append('title', 'Test');
  formData.append('image', new Blob([tinyPng], { type: 'image/png' }), 'test.png');

  const res = await fetch('http://localhost:5999/test', {
    method: 'POST',
    body: formData
  });
  const data = await res.json();
  console.log('response:', JSON.stringify(data, null, 2));
  server.close();
});
