const fs=require('fs');const s=JSON.parse(fs.readFileSync(process.argv[2],'utf8')).system;
const tagName={}; for(const t of s.tags||[]) tagName[t.name]=(t.displayName||t.tagName);
const tg={}; for(const g of s.contextTagGroups||[]) tg[g.name]=g.displayName;
const tokById={}; for(const t of s.tokens) tokById[t.name]=t;
const re=new RegExp(process.argv[3]);
const rows=[];
for(const [id,tree] of Object.entries(s.contextualReferenceTrees)){
  const tok=tokById[id]; if(!tok||!re.test(tok.tokenName)) continue;
  for(const c of tree.contextualReferenceTree){
    const ctx=(c.contextTags||[]).map(x=>tagName[x]||x.split('/').pop()).join(',')||'default';
    const v=c.resolvedValue; const vv=JSON.stringify(v);
    rows.push(tok.tokenName+' ['+ctx+'] '+vv);
  }
}
rows.sort(); console.log(rows.join('\n'));
