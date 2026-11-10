// node dump-gz.js <file.html> <out.json>: unpacks DADOS_GZ to look at the packed screens
const fs = require('fs'), zlib = require('zlib');
const s = fs.readFileSync(process.argv[2], 'utf8');
const d = JSON.parse(zlib.gunzipSync(Buffer.from(s.match(/const DADOS_GZ = "([^"]+)"/)[1], 'base64')).toString('utf8'));
fs.writeFileSync(process.argv[3], JSON.stringify(d));
console.log(Object.keys(d), d.cont.length, Array.isArray(d.boards) ? d.boards.length : Object.keys(d.boards).length);
