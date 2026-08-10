# Nord Liberta — Documento de Contextualização
## Para abrir a conversa no Claude Code · v5.0

> **Como usar este arquivo:** é o **contexto**, não a especificação de build. A ordem de leitura pretendida é: metodologia → formato → arquitetura → detalhe. Não comece a escrever código a partir dele; comece a **conversar** a partir dele.

---

## 0. Instrução de abertura

Você vai me ajudar a especificar e construir a nova plataforma da **Nord Liberta**, a consultoria de planejamento financeiro da Nord Investimentos.

**Nesta primeira fase, não escreva código.** O objetivo é alinhar, nesta ordem:

1. **Metodologia** — o modelo de planejamento financeiro que o produto materializa (seção 2);
2. **Formato** — que tipo de produto isso é, e o que ele explicitamente não é (seção 3);
3. **Arquitetura principal** — atores, fases da jornada, entidades e mapa de telas (seções 4 a 6).

Quando encontrar ambiguidade, **pergunte antes de assumir**. Se discordar de uma decisão, diga por quê, mas não a reverta silenciosamente.

---

## 1. Ponto de partida (o que já existe em produção)

- **`liberta.nordinvestimentos.com.br`** — exame de saúde financeira que devolve uma nota de **0 a 100**, mais **11 calculadoras/assistentes** e um **formulário de coleta em 10 seções**.
- **`liberta.nordinvestimentos.com.br/arealogada`** — área logada do cliente.
- O exame tem **33 perguntas** com **6 regras de ramificação condicional**, organizadas em **5 pilares**: Patrimônio, Poupança, Proteção, Consciência, Atitude. A apresentadora dos vídeos é a **Marília**.
- **Bug conhecido em produção:** na pergunta sobre bens cobertos por seguro, as opções exibem apenas veículos, em vez de espelhar a lista completa de bens declarados. Corrigir na reconstrução.
- **A identidade visual da nova ferramenta deve ser harmônica com a plataforma atual** — não é um redesign de marca.

**O que estamos construindo:** a evolução disso em uma plataforma de **planejamento e hábitos financeiros** que acompanha o cliente ao longo da vida, integrando exame, coleta, plano, execução mensal e revisão semestral.

---

## 2. Metodologia (a camada que define tudo o resto)

### 2.1 Dois vocabulários distintos — não os confunda

| | **5 pilares do exame** | **6 verticais do planejamento** |
|---|---|---|
| Para quê | Triagem / porta de entrada | O trabalho real da consultoria |
| Quando aparece | Dia 0, com força | Do plano em diante, para sempre |
| Quem usa | O lead, o self-service | O consultor e o cliente contratante |
| Mede | Uma nota 0–100 | Um **inventário** de pontos resolvidos |

**As 6 verticais:** Gestão Financeira · Gestão de Ativos · Planejamento de Aposentadoria · Gestão de Riscos · Planejamento Tributário · Planejamento Sucessório.

**Regra estrutural:** *tarefa nasce de vertical, nunca de pilar.*

### 2.2 A hierarquia do trabalho

```
Vertical  →  Projeto (ponto de melhoria)  →  Tarefas
```

O progresso é contado **em tarefas**, não em projetos. Cada ponto de melhoria identificado na coleta é simultaneamente: (a) uma linha do inventário, (b) o assunto de um capítulo da devolutiva, (c) a origem de uma ou mais tarefas. **É o mesmo objeto visto de três ângulos.**

### 2.3 Progresso é inventário, não nota inventada

Depois da contratação, o exame é **rebaixado a figurante**. O protagonista passa a ser o inventário por vertical: o que foi resolvido no semestre e o que segue aberto, cada item traduzido em **impacto humano** ("família: de 11 meses para 8 anos de autonomia"; "R$ 24 mil/ano que deixaram de vazar").

### 2.4 A escalada (metáfora) é um *skin separável*

O conceito de "escalada financeira" com mapa/equipamentos vive em **tela própria** ("minha jornada"), **nunca na home e nunca sobre as tarefas**. O produto tem que funcionar inteiro com a metáfora desligada.

---

## 3. Formato (o que este produto é e o que não é)

### 3.1 Cadência mensal, não uso diário

**Isto não é um app de hábito diário.** É uma ferramenta de suporte de **cadência mensal ao longo da vida**. Qualquer mecânica que pressuponha abertura diária (streak diário, notificação diária) está fora. O **WhatsApp é o mecanismo de tração**; a plataforma é o lugar da profundidade.

### 3.2 Duas audiências, uma plataforma

| | **Cliente pagante** | **Self-service** |
|---|---|---|
| **Ação** | Plano de tarefas do consultor | *(vazio — é o que ele ganha ao contratar)* |
| **Educação** | ~100 conceitos + quizzes | ~100 conceitos + quizzes |
| **Conteúdo** | Comitê + Nord Research + cenário macro | Cenário macro + parte do Research |

O **cliente pagante dirige as decisões de design**.

### 3.3 Tom de voz

**Conselheiro financeiro de confiança.** Não terapeuta, não app gamificado, não banco.

- **Liven** ensina a fazer a pessoa *querer* mudar (onboarding emocional).
- **Fabulous** ensina a fazer a pessoa *conseguir* mudar (arquitetura de hábito).
- **Duolingo** entra apenas como referência de **reciclagem espaçada e coleção completável**.

**Regra de desempate estética:** entre "lúdico/gamificado" e "sóbrio/premium", vá para o segundo. O público é adulto, com patrimônio real, frequentemente 50+.

---

## 4. Arquitetura principal — atores

| Ator | Superfície | Papel |
|---|---|---|
| **Cliente pagante** | Mobile-first, web responsivo | Executa tarefas, informa aporte, consome educação |
| **Self-service** | Mesma superfície | Exame + educação + conteúdo; plano vazio |
| **Consultor** | Desktop | Fonte da verdade da coleta, monta devolutiva, conduz reuniões. **É uma variável** — nunca fixe um nome |
| **Admin** | Desktop | Visão gerencial acima dos consultores |
| **WhatsApp** | Canal | Tração e cadência; roteiros fazem parte da spec |

---

## 5. Arquitetura principal — a jornada em fases

**FASE 1 · Exame de saúde financeira** — 33 perguntas, caminho único, uma pergunta por tela, vídeo mudo embutido + texto destilado, barra de progresso adaptativa às condicionais. Termina em resultado 0–100 por faixa. **O resultado diagnostica; nunca prescreve ação.**

**FASE 2 · Coleta** — feita na plataforma, com três camadas de permissão:
1. Consultor preenche e edita (fonte da verdade);
2. Cliente consulta ("Minhas informações") e **sugere correção** — nunca sobrescreve;
3. Sugestões relevantes viram pauta automática da próxima reunião semestral.
Cada valor carrega **proveniência e status**: `declarado` / `estimado` / `validado`.

**FASE 3 · Devolutiva modular** — substitui o vídeo único de 40–70 min por uma **playlist de capítulos**, montada pelo consultor a partir de uma biblioteca de ~100 módulos. Anatomia de cada módulo, uma coisa por tela:
1. **O conceito** — vídeo padrão da Marília (60–120s), com slot substituível pelo vídeo do consultor;
2. **Os números do cliente** — 2–3 cards gerados da coleta, cada um com "como chegamos nesse número";
3. **A decisão** — uma frase, com custo e impacto;
4. **As tarefas nascem** — "✦ 2 tarefas entraram no seu plano de ação".

Capítulo final é o **compilado**: tarefas agrupadas por mês de deadline, cada uma com **↩ link de volta ao capítulo de origem**. Termina em **[ Começar minha primeira tarefa ]**.

**FASE 4 · Ciclo mensal** (o coração da cadência) — todo mês contém:
1. Tarefas que vencem;
2. **Comitê de investimentos** — gera a tarefa "avaliar se a carteira segue aderente": resumo de 2 linhas → **[ ✓ Avaliei — nada a fazer ]** ou **[ Quero falar com {consultor} ]**;
3. **Aporte do mês** — a única pergunta de dado ("quanto você guardou em {mês}?"), aceita "não guardei" e aproximado;
4. **Reciclagem educacional** em dose mínima (1–2 perguntas).

**FASE 5 · Reunião semestral** — pauta fixa, prévia do reexame só para o consultor, inventário por vertical como protagonista e exame no rodapé. Melhoria de dado apresentada como *"você declarou X; hoje sabemos que é Y"* — **melhora de dado não pode parecer piora de vida**.

**FASE 6 · Renovação/continuidade** — confirmar contra a v3.0 antes de detalhar.

---

## 6. Modelo de progresso e aderência

- **Um único aporte mensal combinado** (ex.: R$ 10.000), definido na devolutiva. O cliente informa **um número por mês**, self-reported, inclusive via WhatsApp.
- **Cascata de prioridade:** consultor e cliente definem qual objetivo é priorizado se o mês apertar. Quando aporte real < combinado, o sistema aloca conforme a cascata e mostra a consequência **sem moralizar**.
- **Aderência = comportamento, nunca mercado.** Aderência é `aportes feitos ÷ aportes combinados` (+ tarefas em dia). Mercado negativo com aportes em dia → aderência intacta e verde.
- **Prazos que reagem (física, não culpa):** todo objetivo exibe prazo projetado que se move com o comportamento, sempre com o caminho de volta.
- **Home:** herói é o **próximo objetivo**; a liberdade financeira fica embaixo. Prazo em unidade vivível — **nunca "284 meses"**.
- **"Não informado" é lacuna cinza**, nunca zero.

---

## 7. Educação (~100 conceitos)

- Um conceito só é **dominado** quando o cliente acerta o quiz. Assistir não basta.
- O cliente **pode pular direto para o quiz** sem ver o vídeo.
- O **consultor pode marcar** um conceito como dominado.
- **Reciclagem espaçada:** dose máxima de 1–2 perguntas por ciclo mensal.
- **O quiz não pontua o cliente — configura o produto.** O desempenho informa quais módulos entram na devolutiva.
- Quatro entradas: na devolutiva, colada na tarefa, no comitê e na **coleção** (tela dos 100).

---

## 8. Gamificação sóbria

- **Badges: sim**, por marcos reais e adultos. Estética sóbria. **Sem fogo, troféu, mascote ou confete.**
- **Regra de ouro:** a tarefa é adulta e literal; a celebração pode ser calorosa.
- **Streak: fora da v1.** Se voltar, deve contar **"plano atualizado no mês"**, nunca "acesso ao app".

---

## 9. Princípios invioláveis

1. O exame **diagnostica, não prescreve**.
2. **Objetivo planejado realizado é sucesso** — nenhum indicador cai quando uma meta planejada é atingida.
3. **Remetente humano nos momentos de valor.**
4. **Silêncio nunca é zero.**
5. **Linguagem literal no trabalho**; metáfora só na celebração.
6. **Aderência mede comportamento, não mercado.**
7. **O cliente sugere, não sobrescreve** a coleta.
8. **Não infantilizar a tarefa adulta.**
9. **Cor nunca é texto pequeno sobre branco**; a faixa de resultado **descreve a situação, nunca a pessoa**.
10. **Nunca inventar conteúdo financeiro.** Onde faltar copy ou fórmula, sinalize a lacuna.

---

## 10. Diretrizes de UX adotadas — e os conflitos já resolvidos

**Adotado com prioridade:**
- **Divulgação progressiva** — perguntas fragmentadas em blocos temáticos.
- **Inputs inteligentes** — seletores visuais; o componente de moeda com chips de atalho e opção "varia muito" é **prioridade máxima do build**.
- **Barra de progresso adaptativa com micro-vitórias.**
- **Smart animate no score**, com salvaguarda de `prefers-reduced-motion`.
- **Faixas de cor como tokens:** 0–20 vermelho/coral · 20–40 laranja/âmbar · 40–60 neutro/amarelo · 60–80 verde claro/turquesa · 80–100 verde esmeralda/azul.

**Quatro conflitos resolvidos (não reabrir sem discutir):**

| Orientação original | Decisão |
|---|---|
| "2 ou 3 ações pontuais abaixo do score" | **Substituído.** cliente → "é um dos temas que {consultor} vai aprofundar"; self-service → convite comercial + educação |
| "Menos telas, porém mais funcionais" | Reinterpretado como **menos conceitos por tela** |
| "Criar hábito de uso diário" | **Rejeitado** como premissa |
| "Bottom nav" | **Fora do exame**; reservada para a área logada |

---

## 11. Restrições técnicas e visuais do protótipo

- **Front-end mobile-first, dados mockados**, sem backend e sem auth real. Estado em memória + `localStorage`. **Português do Brasil.**
- **Stack sugerida:** React + Tailwind. `recharts` se houver gráfico. Animações em CSS/`requestAnimationFrame`.
- **Switch cliente/consultor** e **botão de reiniciar demo**.
- **Consultor em desktop**, com radar/fila de triagem de clientes.
- **Identidade visual:** laranja Nord como cor de ação — **nunca como texto pequeno sobre branco**. Fundo branco/cinza claro. Cards brancos, cantos 12–16px, sombra sutil.
- **Acessibilidade:** contraste AA, alvos ≥44px, legendas marcadas, alternativa a canvas/assinatura.
- **Anti-genérico:** sem emoji decorativo, sem gradiente por default. Se parece output de IA, refaça.

---

## 12. Ordem de construção (por risco de hipótese)

1. **Exame** (33 perguntas + condicionais + resultado + bifurcação de destino) — já existe spec de build v4.0
2. **Devolutiva modular**
3. **Home + fechamento mensal**
4. **Radar do consultor**
5. **Educação (coleção + quiz + reciclagem)**

---

## 13. Lacunas conhecidas — pergunte, não invente

- **A fórmula oficial de pontuação do exame não está disponível.** Isolada em `scoring.js` com placeholder.
- **A metodologia da escalada** segue em refinamento.
- **Fase 6 (renovação)** precisa ser confirmada contra a v3.0.
- **Streak** — decisão em aberto.
- **Carga de trabalho do consultor** nas fases 3 e 5 é um risco registrado; validar com a Monique e mais um consultor.

---

## 14. Documentos que acompanham este contexto

| Documento | Conteúdo |
|---|---|
| `nord-liberta-especificacao-v3.md` | Spec de produto completa, 12 seções |
| `nord-liberta-v4-exame-spec-claude-code.md` | Build-ready do exame: 33 perguntas, biblioteca de inputs, 4 personas, 10 critérios de aceite |
| Briefing v4.1 (Claude Design) | Storyboard de 14 frames, roteiro narrado, tokens visuais |
| Mapeamento de 130 variáveis | 15 domínios, derivado de transcrições reais de onboarding |
| Levantamento do sistema atual | 11 calculadoras, formulário de 10 seções, área logada |

---

*Fim do documento de contextualização · v5.0*
