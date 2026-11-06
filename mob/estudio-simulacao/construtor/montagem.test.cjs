const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const source=fs.readFileSync(__dirname+'/montagem.js','utf8');
const prefixes=['const models=','const equipment=','function available(','function moduleFor(','function validBayIds(','function valid(','function parseImport(','function layout(','function current(','function update(','function reorder(','function moveModule(','function add(','function remove(','function presetState('];
const ctx=vm.createContext({structuredClone});
vm.runInContext(`let stationId='a',state,selected,tool=null,draft; const GAP=.2; const stations=[{id:'a',name:'A',chargers:[{id:'one',type:'fast'},{id:'two',type:'ultra'}]},{id:'b',name:'B',chargers:[{id:'three',type:'mobi'}]}];const station=()=>stations.find(s=>s.id===stationId);function say(){}function render(){}function resetMode(){selected=null;tool=null}function commit(next){if(!valid(next))throw Error('Invalid');state=next;return true}`,ctx);
for(const prefix of prefixes){const line=source.split(/\r?\n/).find(l=>l.startsWith(prefix));assert.ok(line,prefix);vm.runInContext(line,ctx)}
const run=s=>vm.runInContext(s,ctx);
run(`state=presetState('empty');draft={equipmentId:'one',bays:2,row:1};add();add()`);
assert.equal(run('state.rows.flat().length'),1);
run(`update({type:'ultra'})`);assert.equal(run('current().type'),'fast');
run(`update({bays:1});update({bays:2});moveModule('one',{row:1,index:0})`);
assert.equal(run('current().bayIds[1]'),'one-bay-2');
run(`remove()`);assert.equal(run('available().length'),2);
run(`add();const file={schema:'igreen.station-layout',version:3,stationId:'a',oppositeEnabled:false,rows:structuredClone(state.rows)}`);
assert.equal(run('valid(parseImport(file))'),true);
for(const mutation of ["bad.stationId='b'","bad.rows[1].push(structuredClone(bad.rows[1][0]))","bad.rows[1][0].type='ultra'","bad.rows[1][0].equipmentId='three'","bad.rows[1][0].bays=3","bad.rows[1][0].bayIds[0]='wrong'"]){assert.throws(()=>run(`{const bad=structuredClone(file);${mutation};parseImport(bad)}`))}
for(const k of ['single','double','reference','empty']) assert.equal(run(`valid(presetState('${k}'))`),true);
run(`stationId='b';state=presetState('empty');draft={equipmentId:'one',bays:2,row:1};add()`);assert.equal(run('state.rows.flat().length'),0);
assert.throws(()=>run('parseImport(file)'));
assert.equal(run("presetState('single').rows[1][0].id"),'three');
console.log('PASS: assigned inventory, duplicate prevention, fixed models, stable bay IDs, remove/reuse, templates, import validation and station isolation.');
