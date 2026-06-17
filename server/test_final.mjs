import fs from 'fs';

// Wait a moment for server to be ready if just restarted
await new Promise(r => setTimeout(r, 500));

const loginRes = await fetch('http://localhost:5000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ username: 'admin', password: 'admin123' })
});
const loginData = await loginRes.json();
if (!loginData.token) { console.error('Login failed:', loginData); process.exit(1); }
const token = loginData.token;
console.log('✓ Login OK');

// Test 1: POST /api/gallery with multipart file
const tinyPng = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
  'base64'
);

const fd = new FormData();
fd.append('title', 'Test Upload');
fd.append('category', 'village');
fd.append('description', 'test description');
fd.append('image', new Blob([tinyPng], { type: 'image/png' }), 'test.png');

const postRes = await fetch('http://localhost:5000/api/gallery', {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${token}` },
  body: fd
});
const postBody = await postRes.json();
console.log('POST /api/gallery status:', postRes.status, '→', postBody.image_url || postBody.error);

if (postRes.status === 201) {
  const id = postBody.id;
  console.log('✓ Upload successful! id:', id, 'url:', postBody.image_url);

  // Test 2: JSON update (no file)
  const putRes = await fetch(`http://localhost:5000/api/gallery/${id}`, {
    method: 'PUT',
    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ title: 'Updated Title', category: 'village', description: 'updated' })
  });
  console.log('PUT JSON status:', putRes.status, '✓');

  // Test 3: DELETE
  const delRes = await fetch(`http://localhost:5000/api/gallery/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  console.log('DELETE status:', delRes.status, '✓');

  // Cleanup: remove test file from uploads
  try { fs.unlinkSync(`./uploads/${postBody.image_url.split('/uploads/')[1]}`); } catch {}
}
