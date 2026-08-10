# Gauntlet — Rodada 03 (crítica da v2 → CONVERGÊNCIA; consolida v3)

**Versão criticada:** `especificacao-v2.md`
**Placar:** ✅ **5/5 SATISFEITO** — o gauntlet convergiu.

| Especialista | Veredito | Bloqueantes R2 |
|---|---|---|
| Cliente (Ricardo) | ✅ **SATISFEITO** | 2/2 resolvidos ("saí do escuro") |
| Psicólogo comportamental | ✅ **SATISFEITO** | bloqueante + 3 importantes resolvidos |
| Redator / conteúdo | ✅ **SATISFEITO** | selo mantido, 6 afinações aplicadas, sem regressão |
| Planejador CFP (Monique) | ✅ **SATISFEITO** | 2/2 resolvidos |
| Engenheiro de software | ✅ **SATISFEITO** | 2/2 resolvidos + 4 checks OK |

## Como cada bloqueante da Rodada 2 caiu

- **Cliente:** "Seu plano de ação" instanciado ponta a ponta (§6.6) + objetivo longo de aposentadoria
  com prazo-que-reage (§10.3). Métrica-norte atingida: enxerga finanças, próximos passos e como chega lá.
- **Psicólogo:** hot trigger do WhatsApp ligado a `Tarefa.quando` (§9.2); teto/opt-out; escada de
  recaída + handoff (§9.3); guarda de loss framing em Riscos como regra de copy (§6.5).
- **CFP:** regra canônica de proveniência (derivação rebaixa ≥1 degrau, §3.3) + montagem assistida da
  semestral (§8); flag de suitability derivada; modelo de capacidade no radar.
- **Engenheiro:** DSL da `Regra` + campo ausente = `indeterminado` (§6.4); isolamento por cliente +
  `SessaoDemo` (§3.5); AuditLog; máquina de estados com limbo/erro; migração de módulo; radar×scoring
  desacoplado por campos-âncora.

## Refinamentos não-bloqueantes (dobrados na v3, sem reabrir veredito)

- **Cliente:** venda da ótica na linha do tempo; todos os objetivos na régua; conta do aporte R$10k;
  lógica do consolidado (compensação atrasado × adiantado).
- **Psicólogo:** fallback de cue quando `Tarefa.quando` é null; win-back respeita opt-out/teto; peak
  no card de impacto humano; teto N/mês conservador com não-empilhar tendo precedência.
- **Redator:** "pra"→"para" na plataforma; corte do eco na faixa 0–20.
- **CFP:** SLA-teto de espera por item no radar; revalidação de suitability por prazo; selo "Ativos:
  aguardando metodologia"; mapa perfil→broadcast (Anexo A); monitorar `indeterminado` no piloto.
- **Engenheiro:** degradação generalizada de `formulaRef` não resolvido → `indeterminado`; portas de
  entrada de `suspenso`; incremento de `ValorColetado.versao`; AuditLog à prova de adulteração (produção).

## Decisão de parada

Critério atingido: **5/5 SATISFEITO na mesma rodada**, sem bloqueantes abertos. Os Importantes
remanescentes eram todos **aditivos e pré-aprovados** pelos especialistas satisfeitos — foram
consolidados na **`especificacao-v3.md`** para não deixar backlog em aberto, sem necessidade de nova
rodada de crítica. O que resta são **itens de consultoria/compliance** (não de engenharia de produto),
centralizados no **Anexo A** e por natureza fora do alcance do gauntlet (não inventar conteúdo financeiro).

**Especificação selada em v3.** Próximo passo natural (quando o usuário quiser): iniciar o build pela
ordem de construção do contexto (§12), começando pelo Exame — ou rodar um gauntlet novo sobre o
protótipo em código.
