// Demonstration contract. The portal may set window.IGREEN_STATION_CONTEXT before this file.
// Each physical charger belongs to exactly one station; this editor cannot change assignments.
window.IGREEN_STATION_CONTEXT ??= {
  mode: 'demo',
  stations: [
    {id:'avenida-jonas',name:'Eletroposto Avenida Jonas',address:'Avenida Jonas · endereço de demonstração',chargers:[{id:'charger-001',type:'fast',label:'Fast 01'},{id:'charger-002',type:'ultra',label:'Ultra 02'}]},
    {id:'brasil',name:'Eletroposto Brasil',address:'Avenida Brasil · endereço de demonstração',chargers:[{id:'charger-003',type:'mobi',label:'Mobi 03'}]},
    {id:'dois-irmaos',name:'Eletroposto Dois Irmãos',address:'Rua Dois Irmãos · endereço de demonstração',chargers:[{id:'charger-004',type:'fast',label:'Fast 04'},{id:'charger-005',type:'fast',label:'Fast 05'},{id:'charger-006',type:'ultra',label:'Ultra 06'}]}
  ]
};
