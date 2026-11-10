const fs=require('fs');
const d=JSON.parse(fs.readFileSync(process.argv[2],'utf8'));
const refs=d.references||{};
function inl(items){let o='';for(const it of items||[]){const t=it.type;
 if(t==='text')o+=it.text; else if(t==='codeVoice')o+=it.code||''; else if(t==='reference'){const r=refs[it.identifier]||{};o+=r.title||it.identifier;} else if(t==='image')o+='[img]'; else o+=inl(it.inlineContent);}return o;}
const out=[];
function blk(b,ind=''){const t=b.type;
 if(t==='heading')out.push('\n'+'#'.repeat(b.level||2)+' '+b.text);
 else if(t==='paragraph')out.push(ind+inl(b.inlineContent));
 else if(t==='unorderedList'||t==='orderedList'){for(const i of b.items||[])for(const c of i.content||[])blk(c,ind+'  - ');}
 else if(t==='table'){for(const row of b.rows||[]){out.push(ind+row.map(cell=>cell.map(x=>x.type==='paragraph'?inl(x.inlineContent):'').join(' ')).join(' | '));}}
 else if(t==='aside'){for(const c of b.content||[])blk(c,ind+'> ');}
 else if(t==='tabNavigator'){for(const tab of b.tabs||[]){out.push(ind+'[TAB '+tab.title+']');for(const c of tab.content||[])blk(c,ind);}}
 else if(t==='row'){for(const col of b.columns||[])for(const c of col.content||[])blk(c,ind);}
 else {for(const c of b.content||[])blk(c,ind); if(b.inlineContent)out.push(ind+inl(b.inlineContent));}
}
for(const s of d.primaryContentSections||[])for(const c of s.content||[])blk(c);
console.log(out.join('\n'));
