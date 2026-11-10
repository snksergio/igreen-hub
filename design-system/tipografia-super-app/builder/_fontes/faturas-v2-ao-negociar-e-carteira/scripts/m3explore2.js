const fs=require('fs');const s=JSON.parse(fs.readFileSync(process.argv[2],'utf8')).system;
console.log('tokens',s.tokens.length, JSON.stringify(s.tokens.find(t=>/body-medium/.test(JSON.stringify(t)))).slice(0,800));
console.log('values',s.values.length, JSON.stringify(s.values[0]).slice(0,800));
console.log(JSON.stringify(s.contextualReferenceTrees).slice(0,1500));
