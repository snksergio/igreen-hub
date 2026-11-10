const fs = require('fs'), zlib = require('zlib');
const src = fs.readFileSync(process.argv[2], 'utf8');
const m = src.match(/const DADOS_GZ = "([^"]+)"/);
const json = zlib.gunzipSync(Buffer.from(m[1], 'base64')).toString('utf8');
fs.writeFileSync(process.argv[3], json);
const d = JSON.parse(json);
console.log('top keys:', Object.keys(d));
for (const k of Object.keys(d)) { const v = d[k]; console.log(k, typeof v, Array.isArray(v) ? 'array '+v.length : (typeof v === 'object' ? Object.keys(v).length+' keys: '+Object.keys(v).slice(0,40).join(', ') : String(v).length)); }
console.log('json length', json.length);
