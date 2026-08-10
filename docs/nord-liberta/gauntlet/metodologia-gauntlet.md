# Gauntlet Loop — Metodologia de crítica iterativa da especificação

> Objetivo: submeter a especificação da plataforma Nord Liberta a uma bateria (*gauntlet*)
> de especialistas adversariais que criticam o trabalho em rodadas sucessivas, até que
> **todos** declarem satisfação com base em uma métrica de sucesso própria e explícita.
> Enquanto qualquer especialista estiver **NÃO SATISFEITO**, a especificação é revisada e
> uma nova rodada começa. Não há "aprovar para seguir" — há convergência.

## Os 5 especialistas (painel do gauntlet)

Cada especialista é um subagente Claude Code definido em `.claude/agents/`. Cada um roda,
internamente, um **painel de sub-críticos** nomeados (os "sub-agentes que criticam"): o
especialista primeiro produz um parecer, depois deixa cada sub-crítico atacar esse parecer,
e só então entrega um veredito endurecido. Isso é o que torna o loop um *gauntlet* e não
uma revisão superficial.

| # | Agente | Arquivo | Métrica de sucesso (resumo) |
|---|--------|---------|------------------------------|
| 1 | **Cliente** (persona) | `cliente-nord-liberta.md` | Sente que a ferramenta o ajudou a **enxergar melhor as finanças**: próximos passos claros, como o planejamento se desenrola nos próximos anos, e como vai atingir cada objetivo. **É a métrica-norte.** |
| 2 | **Psicólogo — finanças comportamentais** | `psicologo-comportamental.md` | Cada sugestão da ferramenta e cada orientação do planejador usa os **melhores gatilhos** para mudança de comportamento, transformação de hábito e engajamento. |
| 3 | **Redator / conteúdo** | `redator-conteudo.md` | Metáforas, linguagem e conteúdo são **aderentes ao tom e de fácil compreensão** para o público adulto 50+. |
| 4 | **Planejador CFP** | `planejador-cfp.md` | A plataforma **cobre os principais aspectos da vida financeira**, agiliza o atendimento (sem repetir conceitos), mostra as informações mais importantes e permite **atender volume alto** de clientes. |
| 5 | **Engenheiro de software** | `engenheiro-software.md` | Navegação simples, **segurança da informação** sólida, e **modularidade** que permite plugar novos módulos com facilidade ao receber feedback. |

## O ciclo de uma rodada

1. **Entrada:** contexto (`00-contexto-v5.md`) + versão atual da especificação (`especificacao/`).
2. **Crítica paralela:** os 5 especialistas leem a mesma versão e produzem, cada um:
   - Parecer do especialista;
   - Rodada do painel de sub-críticos (ataques ao próprio parecer);
   - **VEREDITO:** `SATISFEITO` ou `NÃO SATISFEITO`;
   - Lista de mudanças exigidas, ranqueadas por severidade (Bloqueante / Importante / Menor).
3. **Síntese (orquestrador):** consolida as exigências, resolve conflitos entre especialistas
   (documentando o racional), e reescreve a especificação.
4. **Log:** a rodada é registrada em `gauntlet/rodada-NN.md` com os vereditos e o diff conceitual.
5. **Convergência:** repete até **5/5 SATISFEITO**. A satisfação do **Cliente** é condição
   necessária — se o Cliente não sente que enxerga melhor as finanças, a rodada falha
   independentemente dos demais.

## Regras de arbitragem entre especialistas

- **Princípios invioláveis (contexto §9) vencem** qualquer sugestão de especialista.
- **Conflito Psicólogo × Redator × Sóbrio:** na dúvida estética, sóbrio/premium vence (contexto §3.3).
- **Conflito Engenheiro × riqueza de UX:** segurança e simplicidade de navegação não podem
  ser sacrificadas por enfeite; podem ser negociadas contra profundidade real de valor.
- **Lacuna de conteúdo financeiro:** nunca inventar (contexto §9.10). Marcar como `⚠ LACUNA`.
- Toda decisão que contraria um especialista precisa de **uma linha de racional** no log da rodada.

## Critério de parada

O gauntlet para quando, na mesma rodada, os 5 vereditos são `SATISFEITO` **sem** novas
exigências Bloqueantes ou Importantes — apenas Menores toleráveis remanescentes, listadas
como backlog. O estado final fica em `especificacao/README.md` (versão + selo dos 5 vereditos).
