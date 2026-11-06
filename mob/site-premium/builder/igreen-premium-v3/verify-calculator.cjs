const assert=require('node:assert/strict');
const {calculate,network}=require('./dist/calculator.js');
for(const [months,revenue,accumulated] of [[1,3120,3120],[12,37440,243360],[60,187200,5709600],[120,374400,22651200]]){const r=calculate({months});assert.equal(r.revenue,revenue);assert.equal(r.accumulated,accumulated);}
assert.equal(calculate({clients:0}).revenue,0);
assert.equal(calculate({energy:false,insurance:false,phone:false}).accumulated,0);
assert.equal(calculate({energy:true,insurance:false,phone:false}).revenue,14400);
assert.equal(calculate({clients:20,months:120}).revenue,3744000);
assert.equal(network(100,300),600);assert.equal(network(0,300),0);assert.equal(network(1,12.34),.25);
assert.throws(()=>calculate({clients:-1}));assert.throws(()=>calculate({clients:2.5}));assert.throws(()=>calculate({months:13}));assert.throws(()=>network(-1,300));
console.log('PASS: original scenarios, zero states, individual connections, maximum, network and invalid inputs');
