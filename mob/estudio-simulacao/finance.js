(function (root) {
  'use strict';
  const models = {
    slow: { name: 'Essencial', subtitle: 'Carga lenta', power: '7', connectors: [7], share: 1, suggestion: 1 },
    duo: { name: 'Duo', subtitle: 'Carga rápida', power: '7 + 40', connectors: [7, 40], share: .8, suggestion: 2 },
    ultra: { name: 'Ultra', subtitle: 'Carga ultrarrápida', power: '80', connectors: [80], share: .8, suggestion: 3 }
  };
  const defaults = { model:'duo', units:1, cars:7, days:30, kwh:25, cost:.8, price:2.2, point:0, daily:2, energy:true, insurance:true, phone:true, investment:null, hours:24, efficiency:80, interval:10, expenses:0, pis:1.65, cofins:7.6, credits:0, exclusions:0, additions:0, localRate:null, commissionTax:null, month:12, includeWallet:true };
  function capacity(s) { return models[s.model].connectors.reduce((sum, p) => sum + Math.floor(s.hours*60 / (s.kwh/(p*s.efficiency/100)*60+s.interval)),0)*s.units; }
  function calculate(s, month=s.month) {
    const cars = Math.min(s.cars, capacity(s));
    const sessions = cars*s.days, energy = sessions*s.kwh, gross=energy*s.price;
    const admin=gross*.14, energyCost=energy*s.cost;
    const pc=Math.max(0,Math.max(0,gross-s.exclusions)*(s.pis+s.cofins)/100-s.credits);
    const local=gross*(s.localRate||0)/100;
    const before=gross-admin-energyCost-pc-local-s.expenses;
    const base=Math.max(0,before+s.additions);
    const ir=base*.15+Math.max(0,base-20000)*.10, csll=base*.09;
    const net=before-ir-csll, point=Math.max(0,net)*s.point/100;
    const charging=(net-point)*models[s.model].share;
    const perClient=(s.energy?20:0)+(s.insurance?25:0)+(s.phone?7:0);
    const newClients=s.daily*s.days, clients=newClients*month;
    const walletGross=clients*perClient;
    const wallet=walletGross*(1-(s.commissionTax||0)/100);
    const walletFirst=newClients*perClient*(1-(s.commissionTax||0)/100);
    const total=charging+(s.includeWallet?wallet:0);
    const accumulated=charging*month+(s.includeWallet?walletFirst*month*(month+1)/2:0);
    let payback=null;
    if(s.investment>0) { for(let m=1;m<=120;m++) { if(charging*m+(s.includeWallet?walletFirst*m*(m+1)/2:0)>=s.investment) {payback=m;break;} } }
    return {capacity:capacity(s),cars,sessions,energy,gross,admin,energyCost,pc,local,before,ir,csll,net,point,charging,perClient,newClients,clients,walletGross,wallet,total,accumulated,payback};
  }
  const api={models,defaults,capacity,calculate};
  if(typeof module!=='undefined') module.exports=api; else root.Finance=api;
})(typeof window!=='undefined'?window:this);
