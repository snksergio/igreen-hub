(function(root){
  'use strict';
  function calculate({clients=2,months=12,energy=true,insurance=true,phone=true}={}){
    if(!Number.isInteger(clients)||clients<0||clients>20)throw new RangeError('Clientes por dia deve ser um inteiro de 0 a 20.');
    if(![1,12,60,120].includes(months))throw new RangeError('Período inválido.');
    if([energy,insurance,phone].some(v=>typeof v!=='boolean'))throw new TypeError('As conexões devem ser booleanas.');
    const perClient=(energy?20:0)+(insurance?25:0)+(phone?7:0),monthlyClients=clients*30;
    return {clients,months,perClient,monthlyClients,portfolio:monthlyClients*months,revenue:monthlyClients*months*perClient,accumulated:monthlyClients*perClient*months*(months+1)/2};
  }
  function network(clients,spend){if(!Number.isInteger(clients)||clients<0||clients>1000000||!Number.isFinite(spend)||spend<0||spend>1000000)throw new RangeError('Informe valores válidos e não negativos.');return Math.round(clients*spend*.02*100)/100;}
  if(typeof module!=='undefined'&&module.exports)module.exports={calculate,network};else root.IgreenCalculator={calculate,network};
})(typeof window!=='undefined'?window:this);
