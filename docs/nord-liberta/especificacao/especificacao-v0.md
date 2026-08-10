# Nord Liberta — Especificação do Produto · v0 (rascunho inicial para o Gauntlet)

> Estado: **RASCUNHO PARA CRÍTICA**. Este documento é o ponto de partida do Gauntlet Loop.
> Espera-se que seja reescrito várias vezes. Governado pelo contexto em `../00-contexto-v5.md`
> e pelos princípios invioláveis (contexto §9). Onde falta conteúdo financeiro oficial: `⚠ LACUNA`.

## 1. Visão geral

Plataforma de **planejamento e hábitos financeiros** de cadência **mensal**, que acompanha o
cliente ao longo da vida. Integra exame de triagem, coleta, devolutiva modular, execução mensal
e revisão semestral. Duas audiências (cliente pagante e self-service) sobre uma superfície;
o cliente pagante dirige o design. Tom: **conselheiro financeiro de confiança**.

Métrica-norte do produto: o cliente **enxerga melhor as próprias finanças**, sabe os **próximos
passos**, entende **como o plano se desenrola nos próximos anos** e **como atinge cada objetivo**.

## 2. Atores e superfícies

- **Cliente pagante** — mobile-first. Executa tarefas, informa aporte mensal, consome educação.
- **Self-service** — mesma superfície; coluna de Ação vazia (convite implícito à contratação).
- **Consultor** — desktop; fonte da verdade da coleta, monta devolutiva, conduz reuniões. Nome é variável.
- **Admin** — desktop; visão gerencial sobre consultores.
- **WhatsApp** — canal de tração e cadência.

## 3. Modelo de dados (núcleo)

O mesmo "ponto de melhoria" é visto de três ângulos. Modelagem central:

```
Vertical (6 fixas)
  └─ Projeto (ponto de melhoria)  ── é linha do inventário
        ├─ é assunto de um Capítulo da devolutiva
        └─ Tarefa (1..n)          ── unidade de progresso
```

Entidades principais (rascunho):
- **Vertical**: {id, nome} — as 6 fixas.
- **Projeto**: {id, verticalId, titulo, statusInventario: aberto|resolvido, impactoHumano, capituloId}.
- **Tarefa**: {id, projetoId, titulo, mesDeadline, status: pendente|feita, capituloOrigemId}.
- **ValorColetado**: {chave, valor, proveniencia: declarado|estimado|validado, sugestaoPendente?}.
- **Objetivo**: {id, nome, prazoProjetado, prioridadeNaCascata}.
- **AporteMensal**: {mesRef, valorCombinado, valorReal|null ("não guardei"/aproximado)}.
- **Conceito** (educação): {id, titulo, videoUrl, quiz, statusDominio: nao|dominado, fonteDominio: quiz|consultor}.
- **ModuloDevolutiva**: {id, verticalId, videoPadraoUrl, videoConsultorUrl?, ativo}.

Regras: progresso conta **tarefas**, não projetos. Tarefa nasce de vertical. "Não informado" é
lacuna cinza, nunca zero.

## 4. Jornada — Fase 1 · Exame

- 33 perguntas, caminho único, **uma pergunta por tela**, vídeo mudo + texto destilado.
- 6 condicionais de ramificação; barra de progresso **adaptativa** (recalcula com condicionais).
- Input de moeda com chips de atalho + opção "varia muito" (prioridade máxima de componente).
- Resultado **0–100** por faixa de cor (tokens: 0–20…80–100). Smart-animate no número, com
  `prefers-reduced-motion`. A faixa **descreve a situação, nunca a pessoa**.
- Resultado **diagnostica, nunca prescreve**. Bifurcação de destino:
  - cliente → "é um dos temas que {consultor} vai aprofundar";
  - self-service → convite comercial + educação.
- Corrigir bug de produção: opções de "bens cobertos por seguro" espelham a lista completa de bens.
- ⚠ LACUNA: fórmula oficial de pontuação (placeholder em `scoring.js`; mapeamento pergunta→pilar proposto).

## 5. Jornada — Fase 2 · Coleta

- Preenchida na plataforma. Três camadas de permissão:
  1. Consultor preenche/edita (fonte da verdade);
  2. Cliente consulta "Minhas informações" e **sugere correção** (nunca sobrescreve);
  3. Sugestões relevantes viram pauta automática da semestral.
- Cada valor: proveniência `declarado|estimado|validado`.
- Divulgação progressiva: blocos temáticos; inputs visuais em vez de digitação.

## 6. Jornada — Fase 3 · Devolutiva modular

- Playlist de capítulos, montada pelo consultor a partir de ~100 módulos (liga/desliga por perfil).
- Anatomia do módulo (uma coisa por tela):
  1. **O conceito** — vídeo da Marília (60–120s), slot substituível pelo vídeo do consultor;
  2. **Os números do cliente** — 2–3 cards da coleta, cada um com "como chegamos nesse número";
  3. **A decisão** — uma frase, com custo e impacto;
  4. **As tarefas nascem** — "✦ N tarefas entraram no seu plano de ação" + "não precisa anotar nada".
- Capítulo final = **compilado**: tarefas por mês de deadline, cada uma com ↩ link ao capítulo de
  origem. Termina em **[ Começar minha primeira tarefa ]**.

## 7. Jornada — Fase 4 · Ciclo mensal

Todo mês:
1. Tarefas que vencem.
2. **Comitê de investimentos** → tarefa automática "avaliar se a carteira segue aderente":
   resumo de 2 linhas → **[ ✓ Avaliei — nada a fazer ]** ou **[ Quero falar com {consultor} ]**.
3. **Aporte do mês** — única pergunta de dado: "quanto você guardou em {mês}?" (aceita "não
   guardei" e aproximado; também via WhatsApp).
4. **Reciclagem educacional** — 1–2 perguntas, nunca bateria.

## 8. Jornada — Fase 5 · Reunião semestral

- Pauta fixa; prévia do reexame **só para o consultor**; inventário por vertical como protagonista;
  exame no rodapé. Melhoria de dado: "você declarou X; hoje sabemos que é Y" — **melhora de dado
  não pode parecer piora de vida**.

## 9. Fase 6 · Renovação — ⚠ LACUNA (confirmar contra v3.0).

## 10. Progresso e aderência

- **Um aporte mensal combinado** (self-reported). Sem carimbo por objetivo.
- **Cascata de prioridade** definida na devolutiva; aporte real < combinado → aloca pela cascata,
  mostra consequência **sem moralizar**.
- **Aderência = aportes feitos ÷ combinados (+ tarefas em dia).** Mercado negativo com aportes em
  dia = verde. Aderência mede **comportamento, nunca mercado**.
- **Prazos que reagem** (física, não culpa): sempre com o caminho de volta.
- **Home**: herói é o **próximo objetivo**; liberdade financeira embaixo. Unidade vivível (nunca "284 meses").
- Objetivo planejado atingido = sucesso; nenhum indicador cai.

## 11. Educação (~100 conceitos)

- Dominado só com acerto no quiz; cliente pode pular direto para o quiz; consultor pode marcar
  como dominado. Reciclagem espaçada (1–2/mês). O quiz **configura o produto**, não pontua o
  cliente. Quatro entradas: devolutiva, tarefa, comitê, coleção (tela dos 100 com progresso/busca/filtro).

## 12. Consultor (desktop)

- **Radar / fila de triagem** de clientes; monta devolutiva (liga/desliga módulos); conduz semestral.
- ⚠ Risco registrado: carga do consultor nas fases 3 e 5 (validar com CFP).

## 13. Gamificação sóbria

- Badges por marcos adultos reais. Sem fogo/troféu/mascote/confete. Streak fora da v1.
- Celebração calorosa, tarefa literal. Metáfora da escalada em tela própria ("minha jornada"), skin separável.

## 14. Notas técnicas / segurança / modularidade

- Protótipo: React + Tailwind, mobile-first, dados mockados, estado em memória + localStorage, pt-BR.
- Switch cliente/consultor + reiniciar demo.
- Identidade: laranja Nord como cor de ação (nunca texto pequeno sobre branco); cards brancos,
  cantos 12–16px, sombra sutil. Acessibilidade AA, alvos ≥44px, alternativa a canvas/assinatura.
- Modularidade pretendida: módulos de devolutiva e conceitos como dados (liga/desliga) sem refatorar núcleo.

## 15. Lacunas conhecidas (não inventar)

Fórmula de scoring · metodologia da escalada · Fase 6 · decisão de streak · carga do consultor (3 e 5).
