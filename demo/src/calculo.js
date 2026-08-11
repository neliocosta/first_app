/**
 * Cálculo da consequência do aporte — FONTE ÚNICA.
 *
 * Rodada 4 (C3/C4): antes, "recua 2 meses" e "R$ 1.400" eram strings fixas no Início,
 * e a Jornada dizia "R$ 1.400/mês por 12 meses" — o mesmo remédio com dois valores,
 * e o mesmo texto para R$ 0 e para R$ 9.900. Agora ambas as telas chamam esta função.
 *
 * ⚠ PREMISSA ILUSTRATIVA, declarada na tela: cada mês cheio de aporte que deixa de entrar
 * adia o objetivo de longo prazo em cerca de 3 meses; a recuperação é feita diluindo o que
 * faltou ao longo de 12 meses. A fórmula oficial é LACUNA da consultoria (Anexo A).
 */
export const PREMISSA = {
  mesesPorAporteCheio: 3,
  mesesDeRecuperacao: 12,
  texto: 'cada mês cheio que deixa de entrar adia o objetivo em cerca de 3 meses; para recuperar, diluímos o que faltou ao longo de 12 meses',
};

/** Banda de tolerância (psicólogo R5): 1% de desvio não pode disparar a mesma
 *  gramática de um mês zerado — falso positivo destrói a credibilidade do sinal. */
export const TOLERANCIA = { fracao: 0.10, pisoAbsoluto: 200 };

export function consequenciaDoAporte(real, combinado) {
  if (real === null || real === undefined || combinado <= 0) return null;
  const deficit = Math.max(0, combinado - real);
  if (deficit === 0) {
    return { emDia: true, deficit: 0, mesesAtraso: 0, extraMensal: 0, mesesExtra: 0 };
  }
  if (deficit < TOLERANCIA.pisoAbsoluto || deficit / combinado < TOLERANCIA.fracao) {
    return { emDia: true, quaseEmDia: true, deficit, mesesAtraso: 0, extraMensal: 0, mesesExtra: 0 };
  }
  const mesesAtraso = Math.max(1, Math.round((deficit / combinado) * PREMISSA.mesesPorAporteCheio));
  const extraMensal = Math.round(deficit / PREMISSA.mesesDeRecuperacao / 10) * 10;
  return {
    emDia: false, deficit, mesesAtraso, extraMensal,
    mesesExtra: PREMISSA.mesesDeRecuperacao,
    comoChegamos: `Faltaram ${brl(deficit)} para o combinado de ${brl(combinado)}. Pela premissa desta demonstração (${PREMISSA.texto}), isso adia ${mesesAtraso} ${mesesAtraso === 1 ? 'mês' : 'meses'}, e ${brl(extraMensal)} a mais por mês durante ${PREMISSA.mesesDeRecuperacao} meses repõem o que faltou.`,
  };
}

/** O remédio SEMPRE com a recorrência explícita — nunca "R$ X" solto (anti drip framing). */
export function fraseDoCaminhoDeVolta(c) {
  if (!c || c.emDia) return null;
  return `${brl(c.extraMensal)} a mais por mês, pelos próximos ${c.mesesExtra} meses, recolocam você na data combinada.`;
}

export const brl = (n) =>
  Number(n || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });
