# Gauntlet — Rodada 02 (crítica da v1 → produz v2)

**Versão criticada:** `especificacao-v1.md`
**Placar:** 1/5 SATISFEITO (avanço grande: os bloqueantes da Rodada 1 foram majoritariamente resolvidos)

| Especialista | Veredito | Bloqueantes R1 |
|---|---|---|
| Cliente (Ricardo) | ❌ NÃO SATISFEITO (por pouco) | B1 ✅, B2 parcial, B3 ✅ |
| Psicólogo comportamental | ❌ NÃO SATISFEITO (muito perto) | 3 ✅, 1 parcial |
| Redator / conteúdo | ✅ **SATISFEITO** | 4/4 ✅ |
| Planejador CFP (Monique) | ❌ NÃO SATISFEITO (margem estreita) | 4 ✅, B5 parcial |
| Engenheiro de software | ❌ NÃO SATISFEITO (perto) | B1 ✅, B2 parcial, B3 parcial |

## Bloqueantes remanescentes (endereçados na v2)

**Cliente**
- Instanciar a devolutiva **ponta a ponta**: o capítulo "compilado" do Ricardo (todas as verticais por mês).
- Instanciar **um objetivo longo ILUSTRATIVO** (aposentadoria) com o prazo-que-reage funcionando.

**Psicólogo**
- **Timing dos disparos de WhatsApp (hot trigger)** ligado a `Tarefa.quando`; cadência por tipo de mensagem. (Eleva implementation intentions de parcial → resolvido.)

**CFP**
- **Reconciliar a regra de proveniência** (§3.2 × §6.3): derivação/projeção **rebaixa ≥1 degrau, nunca sobe**.
- **Montagem assistida da fase 5 (semestral)** análoga à §6.1 (auto-diff do inventário, auto-pauta).

**Engenheiro**
- **DSL da `Regra` de elegibilidade** (composição AND/OR/NOT, quiz, `between`, campo ausente = `indeterminado`).
- **Isolamento de dado sensível por cliente** no protótipo (namespace `nl:v1:cliente:{id}:*` + `SessaoDemo`).

## Importantes acolhidos na v2
Redator: faixa 0–20 sem nomear pilar; "anda"→"recua"; rótulo humano do "compilado" = "Seu plano de ação"; jargão (consistência/otimizar/transmitir); `Home`→`Início`; "nossa estimativa".
Psicólogo: teto de frequência/opt-out do WhatsApp; escada de recaída >1 ciclo + handoff ao consultor; guarda de loss framing no módulo de Riscos.
CFP: modelo de capacidade no radar; flag de suitability derivada da coleta.
Engenheiro: `AuditLog` append-only; estados de erro/limbo + gate de completude; contrato de migração de versão de módulo; dependência circular radar × scoring.

## Convergências notáveis (peso máximo)
- **Contradição de proveniência** apontada independentemente por **CFP e Engenheiro** — prioridade 1.
- **Nome do "compilado"** (Redator) + **instanciar o compilado** (Cliente) — casam numa entrega só ("Seu plano de ação" instanciado).
- **Fronteira Home × Minha jornada** (Engenheiro) + **visão consolidada "no rumo no todo?"** (Cliente) — casam numa decisão de IA.

## Conflitos / decisões
- **Excesso de `⚠ LACUNA` na leitura (Cliente, menor)** → mover as lacunas para um **Anexo A** e deixar o corpo mais "produto pronto"; nada é inventado, só reorganizado.
- **Redator já SATISFEITO** → suas 2 Importantes entram como afinação; não bloqueiam, mas foram aplicadas para não regredir seu selo.
