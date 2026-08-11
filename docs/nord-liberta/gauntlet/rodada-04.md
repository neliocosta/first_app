# Gauntlet — Rodada 04 (crítica do DEMO v1.0 → produz v1.1)

**Objeto criticado:** o produto navegável (`demo/`), não mais o documento.
**Placar:** ❌ **0/5 SATISFEITO**

> Mudança de objeto: as rodadas 1–3 criticaram a especificação (que convergiu 5/5 na v3).
> A rodada 4 critica a **implementação**. Um veredito negativo aqui não é regressão da spec —
> é a spec sendo confrontada com a realidade. A CFP resumiu: *"a especificação estava certa;
> ver a coisa navegável mostrou o que o documento escondia."*

| Especialista | Veredito | Frase-chave |
|---|---|---|
| Cliente (Ricardo) | ❌ | "o número certo na tela fácil e o número frouxo na tela cara" |
| Psicólogo | ❌ | "não posso declarar satisfeito um produto que parabeniza o cliente por um clique" |
| Redator | ❌ | "os rótulos humanos existem e são bons — só estão do lado errado da parede" |
| CFP (Monique) | ❌ | "ausência de pergunta virou declaração do cliente" |
| Engenheiro | ❌ | "a segurança está afirmada em comentários e não em estrutura" |

## Convergências (achado independente = prioridade máxima)

| # | Achado | Quem achou |
|---|---|---|
| C1 | **Denominador do exame oscila** (24→28→24→26) | **todos os 5** |
| C2 | **"Tarefas deste mês 0/7"** lista só 4 — ciclo impossível de fechar | Cliente, CFP, Psi, Eng |
| C3 | **R$ 1.400 vs R$ 1.400/mês×12** — mesmo remédio, dois valores (*drip framing*) | Cliente, CFP, Psi |
| C4 | **Consequência hardcoded** — idêntica para R$ 0 e R$ 9.900 | CFP, Psi, Redator |
| C5 | **Celebração não-contingente** — "adicionou 4 meses" com 0 tarefas e "Não guardei" | CFP, Psi |
| C6 | **R$ 190/mês sem "como chegamos"** — o número que tira dinheiro é o menos auditável | Cliente, CFP, Psi |
| C7 | **Botão único "Combinado"** — decisão sem opt-out | Cliente, CFP, Psi |
| C8 | **Patrimônio consolidado exclui a ótica** (R$ 2,4 mi) | Cliente, CFP |
| C9 | **"R$ 8" / "R$ 69"** — moeda em campo não-monetário | CFP, Redator |
| C10 | **Selo de proveniência errado** — "8 anos" é derivação marcada `declarado` | CFP, Redator |

## Bloqueantes exclusivos de cada especialista

**CFP — integridade metodológica (o mais grave da rodada)**
- **Sucessório e Tributário: 0 de 33 perguntas**, mas a devolutiva publica *"você nos contou que
  não possui testamento"*. Ausência de pergunta convertida em declaração negativa assinada pelo cliente.
- **`perfilSuitability: null`** e mesmo assim a tarefa "Abrir um PGBL" é publicada.
- **Comitê atesta "ativos coerentes com seu horizonte"** enquanto Ativos está "aguardando metodologia".
- **Nome + CFP® do consultor em conteúdo que ele não pôde editar** (toggle liga/desliga só).
- `demo.js` "R$ 4.000 de folga" com "como chegamos" que **produz R$ 22.000**.

**Psicólogo — promessa na copy, ausência no código**
- `Inicio.jsx:74` barra do herói `width:'50%'` hardcoded — não reage a tarefa concluída.
- `store.js:31` `quandoPorTarefa` **morto**; o rodapé do WhatsApp promete uma escolha inexistente.
- `estado.cascata` escrito e **nunca lido** — "voz sem eco é decoração".
- "Quero falar com Nélio" é **no-op**.
- Peak-end invertido: o capítulo termina em logística, não no impacto humano.

**Redator — jargão que a spec não tinha**
- **"Consciência · Atitude"** no rodapé do score = julgamento de caráter (fere §9.9).
- **"Ver minha devolutiva"** — jargão de consultoria no CTA principal do cliente.
- **"autonomia"** usada 6× e nunca definida.
- **Taxonomia CFP como cabeçalho do cliente**; a tela do consultor já tem a hierarquia certa.
- **Segunda metáfora não declarada** (construção: "fundamentos em pé", "bases a montar") no diagnóstico.
- Faixa 20–40 é a única com "**Você**" como sujeito.

**Engenheiro — dívida arquitetural**
- **Matriz de permissões só em comentário**: um `set(patch)` genérico compartilhado por cliente e consultor.
- **Liga/desliga do consultor não chega ao cliente** — `ligados` é `useState` local; a modularidade é encenada.
- **`capituloAtual` é índice posicional** — inserir módulo quebra o estado persistido.
- **Merge raso sem versão de schema** — quem já usou nunca vê o 8º módulo.
- **Beco sem saída**: o link "por que estou fazendo isto" leva ao capítulo e não volta ao plano.
- **NaN** no `InputMoedaChips` ao voltar numa pergunta com "Varia muito".
- **Contraste AA reprovado no CTA primário** (branco sobre `#FA7A35` ≈ 2,66:1).
- **Alvos < 44px**: checkbox de tarefa (24px), toggle do consultor (28px), setas da cascata (36px).
- Sem `ErrorBoundary`; `respostas` é write-only e o score é fixo.

## O que foi elogiado (preservar)

Tela "Os seus números" com proveniência + "como chegamos" (*"nesse momento eu confiei no produto"*
— Ricardo) · "Minhas informações" com sugerir-correção · *"Isto mede o seu comportamento — o
mercado não entra nesta conta"* · *"Este quiz não te pontua"* · a cascata com "sem cobrança" ·
o radar com SLA e handoff · o selo honesto "aguardando metodologia" · "Não guardei" · o motor de
condicionais e a correção do bug da q14 · `prefers-reduced-motion` honrado em dois níveis.

→ Correções aplicadas na **v1.1** (ver `rodada-04-correcoes.md`).
