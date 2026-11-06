// Dados simulados da sessão de recarga. No app, TUDO isto vem do backend (OCPP → API):
//   status do conector (StatusNotification), energia, potência e SoC (MeterValues), tarifa,
//   saldo reservado e limite da sessão. Só a formatação e as estimativas marcadas (*) ficam no app.
// O contrato completo está em IMPLEMENTACAO.md, seção "Dados".

export const SESSION_EXAMPLE = {
  station: 'Shell Paulista',
  connector: { id: 'C-01', type: 'CCS2', current: 'DC', maxPowerKw: 150 },
  acConnector: { type: 'Tipo 2', current: 'AC', powerKw: 7.2 },
  startSoc: 23,                  // % informado pelo carro ao conectar (só DC)
  batteryKwh: 60,                // simulação: capacidade para converter % em kWh
  tariffDc: 1.30,                // R$/kWh
  tariffAc: 1.10,
  reservedBalance: 60,           // R$ reservados; a sessão encerra sozinha ao atingir
  reservationSeconds: 120,       // tempo para conectar o cabo (tela 1)
  kmPerKwh: 6.3,                 // (*) estimativa de autonomia; só se o carro estiver cadastrado
};

// curva de potência DC simulada: cai depois de 50%
const powerAt = soc => soc < 50 ? 78 : Math.max(16, 78 - (soc - 50) * 2.2);

/**
 * Métricas da tela 2 para um instante da simulação.
 * mode 'dc': soc em % (o carro informa). mode 'ac': sem SoC; progress 0–100 vira kWh entregues.
 */
export function computeMetrics({ mode, soc, progress, limit }, s = SESSION_EXAMPLE) {
  if (mode === 'dc') {
    const complete = soc >= limit - 0.01;
    const kwh = Math.max(0, soc - s.startSoc) / 100 * s.batteryKwh;
    const remainingKwh = Math.max(0, limit - soc) / 100 * s.batteryKwh;
    return {
      complete,
      kwh,
      powerKw: complete ? 0 : powerAt(soc),
      tariff: s.tariffDc,
      elapsedMin: kwh / 62 * 60,
      minutesToLimit: remainingKwh / ((powerAt(soc) + powerAt(limit)) / 2) * 60, // (*) estimativa
      cost: kwh * s.tariffDc,
      km: kwh * s.kmPerKwh,
    };
  }
  const kwh = progress / 100 * 30;
  return {
    complete: false,
    kwh,
    powerKw: s.acConnector.powerKw,
    tariff: s.tariffAc,
    elapsedMin: kwh / s.acConnector.powerKw * 60,
    minutesToLimit: null,
    cost: kwh * s.tariffAc,
    km: kwh * s.kmPerKwh,
  };
}

/* ---------- formatação (pt-BR) ---------- */
export const fmt1 = n => n.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
export const brl = n => n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
/** "16 min" ou "2h50" */
export const duration = m => m < 60 ? `${Math.max(1, Math.round(m))} min` : `${Math.floor(m / 60)}h${String(Math.round(m % 60)).padStart(2, '0')}`;
/** "1:36" */
export const clock = sec => `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, '0')}`;
