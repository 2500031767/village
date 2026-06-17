import fs from 'fs';

const loginRes = await fetch('http://localhost:5000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ username: 'admin', password: 'admin123' })
});
const { token } = await loginRes.json();

const tinyPng = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
  'base64'
);

const formData = new FormData();
formData.append('title', 'Test');
formData.append('category', 'village');
formData.append('description', 'test');
formData.append('image', new Blob([tinyPng], { type: 'image/png' }), 'test.png');

// Log what the FormData looks like
for (const [key, val] of formData.entries()) {
  console.log(key, '->', val instanceof Blob ? `Blob(${val.size} bytes, ${val.type})` : val);
}

const res = await fetch('http://localhost:5000/api/gallery', {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${token}` },
  body: formData
});
console.log('status:', res.status);
console.log('body:', await res.text());
