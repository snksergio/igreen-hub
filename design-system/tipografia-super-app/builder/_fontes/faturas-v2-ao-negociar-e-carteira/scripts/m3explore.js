const fs=require('fs');const d=JSON.parse(fs.readFileSync(process.argv[2],'utf8'));
console.log(Object.keys(d)); console.log(Object.keys(d.system));
for(const k of Object.keys(d)){ if(Array.isArray(d[k])) console.log(k, d[k].length, JSON.stringify(d[k][0]).slice(0,600)); }
console.log(d.system.tokenSets.map(t=>t.tokenSetName).join('\n'));
