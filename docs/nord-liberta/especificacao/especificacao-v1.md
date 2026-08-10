# Nord Liberta — Especificação do Produto · v1 (pós-Rodada 1 do Gauntlet)

> Estado: **EM ITERAÇÃO**. Reescrita a partir da v0 para endereçar os 19 bloqueantes da Rodada 1.
> Governada por `../00-contexto-v5.md` e pelos princípios invioláveis (§9). Onde falta conteúdo
> financeiro oficial: `⚠ LACUNA` (não inventar). Exemplos numéricos marcados `ILUSTRATIVO` são de
> persona fictícia e **não** constituem metodologia oficial.

---

## 1. Visão geral e métrica-norte

Plataforma de **planejamento financeiro de rotina mensal** (não hábito diário) que acompanha o
cliente pela vida: exame → coleta → devolutiva modular → ciclo mensal → semestral → renovação.
Duas audiências (cliente pagante e self-service) numa superfície; o pagante dirige o design.
Tom: **conselheiro financeiro de confiança**.

**Métrica-norte (dupla — sentida + comportamental):**
- *Sentida (cliente):* "enxergo minhas finanças com clareza e sei o próximo passo; entendo como
  meu plano se desenrola nos próximos anos e como atinjo cada objetivo."
- *Comportamental (líder):* aportes feitos ÷ combinados e tarefas concluídas por ciclo — porque
  saber o próximo passo não fecha o **intention–action gap** (Sheeran); só a execução fecha.

> Nota comportamental (Rodada 1): a cadência mensal é longa demais para formar **automaticidade**
> (Wood). Portanto o produto **não** promete "criar hábito"; ele opera como **rotina disparada por
> cue externo** — o WhatsApp é esse cue (o "Prompt" do modelo B=MAP de Fogg: Comportamento =
> Motivação × Habilidade × **Prompt**). Ver §9.

---

## 2. Atores, superfícies e mapa de navegação

| Ator | Superfície | Papel |
|---|---|---|
| Cliente pagante | Mobile-first | Executa tarefas, informa aporte, consome educação |
| Self-service | Mesma superfície | Exame + educação; coluna de Ação vazia (estado honesto) |
| Consultor | Desktop | Fonte da verdade da coleta, monta devolutiva, conduz reuniões; nome é variável |
| Admin | Desktop | Visão gerencial agregada; **nunca** patrimônio bruto de cliente de outro consultor |
| WhatsApp | Canal | Cue/Prompt e cadência (§9) |

### 2.1 Bottom nav (área logada do cliente) — 5 abas
`Home` · `Plano` · `Educação` · `Minhas informações` · `Minha jornada`
**Sem bottom nav dentro do exame** (foco de tarefa única — contexto §10). A metáfora da escalada
vive só em `Minha jornada` (skin separável).

### 2.2 Máquina de estados de fase (por cliente)
```
faseCliente: exame → coleta → devolutivaMontada → cicloMensal ⇄ semestral → renovacao
```
Gates de transição:
- `exame → coleta`: exame concluído **e** contrato assinado (self-service para aqui).
- `coleta → devolutivaMontada`: consultor marca a coleta como suficiente e publica a playlist.
- `devolutivaMontada → cicloMensal`: cliente conclui o capítulo "compilado" ([Começar minha primeira tarefa]).
- `cicloMensal → semestral`: a cada 6 ciclos; volta a `cicloMensal` ao fim.
Cada fase declara sua **tela de entrada** e sua **condição de retomada** (§13).

---

## 3. Modelo de dados (núcleo) — template × instância

Defeito da v0 corrigido: **biblioteca (definição) e instância (estado do cliente) são níveis
distintos**. Isso é o que permite "plugar o 101º módulo sem refatorar" e evita mudança retroativa
nos números já mostrados.

### 3.1 Biblioteca (definição, versionada, liga/desliga)
```
Vertical            { id, nome }                       // as 6 fixas
ModuloDevolutiva    { id, verticalId, versao, ativo,
                      elegibilidade: Regra,            // ex.: {campo:"protecao.coberturaVida", op:"<", ref:"necessidadeVida"}
                      camposLidos: [chaveColeta],      // dependência declarativa p/ "os números do cliente"
                      videoPadraoUrl,
                      decisaoTemplate: string,         // copy da "decisão", com placeholders
                      cardsTemplate: [CardTemplate],   // como derivar cada "número do cliente"
                      tarefasTemplate: [TarefaTemplate] }
CardTemplate        { id, titulo, formulaRef, comoChegamosTemplate }   // formulaRef ⚠ LACUNA (consultoria)
TarefaTemplate      { id, titulo, offsetDeadlineMeses, conceitoLigadoId? }
Conceito            { id, verticalId, titulo, videoUrl, quiz }         // definição pura, sem estado
CampoColeta         { chave, verticalId, tipo, rotuloHumano, sensivel:boolean }  // schema por vertical (§5)
```

### 3.2 Instância (por cliente; snapshot imutável do que foi mostrado)
```
Cliente             { id, consultorId, faseCliente, ... }
ValorColetado       { id, clienteId, chave, valor,
                      proveniencia: declarado|estimado|validado,
                      sensivel, atualizadoPor:AtorRef, atualizadoEm, versao }
SugestaoCorrecao    { id, clienteId, chave, valorAtual, valorSugerido, autor:cliente,
                      criadoEm, status: pendente|aceita|rejeitada|virouPauta, reuniaoPautaId? }
Projeto             { id, clienteId, verticalId, titulo,
                      statusInventario: aberto|resolvido, impactoHumano }   // = linha do inventário
CapituloDevolutiva  { id, clienteId, moduloId, moduloVersao, projetoId, ordem,
                      videoConsultorUrl?, numerosSnapshot:[{card, valor, comoChegamos, proveniencia}],
                      status: naoIniciado|visto }
Tarefa              { id, clienteId, projetoId, capituloOrigemId, templateId?,
                      titulo, mesDeadline, quando?:string,   // implementation intention (§9)
                      status: pendente|feita }
Objetivo            { id, clienteId, verticalId, projetoId?, nome,
                      anoAlvo, prazoProjetadoMeses, prioridadeCascata:int }
AporteMensal        { clienteId, mesRef, valorCombinado, valorReal|null, viaWhatsApp:boolean }
DominioConceito     { clienteId, conceitoId, status: nao|dominado, fonte: quiz|consultor, em }
```

**Regras de dados**
- Progresso conta **Tarefas**, não Projetos. Tarefa nasce de Vertical → Projeto.
- **Proveniência propaga a números derivados:** um número derivado de input `estimado` é, no
  máximo, `estimado`. `CapituloDevolutiva.numerosSnapshot[].proveniencia` carrega a pior
  proveniência das entradas (regra "elo mais fraco"). Premissas de projeção (retorno, inflação,
  horizonte) são declaradas e versionadas — valores oficiais `⚠ LACUNA` (consultoria).
- **Retroatividade resolvida:** capítulo `visto` **congela** `numerosSnapshot`; capítulo
  `naoIniciado` recomputa se a coleta mudar. Editar um módulo cria nova `versao` na biblioteca; o
  capítulo instanciado guarda `moduloVersao`.
- **Tarefa órfã:** desligar `ModuloDevolutiva.ativo=false` **não** remove tarefas já nascidas.
- **"Não informado" = lacuna cinza**, nunca zero (silêncio ≠ zero).

### 3.3 Matriz de permissões (ator × operação)
| Entidade | Cliente | Consultor (seu cliente) | Admin |
|---|---|---|---|
| `ValorColetado` | READ | CRUD | READ agregado (sem valor bruto cross-consultor) |
| `SugestaoCorrecao` | CREATE, READ próprio | READ, resolver | — |
| `Tarefa` / `Projeto` | READ, concluir | CRUD | READ agregado |
| Prévia do reexame (§8) | **sem acesso** | READ | — |
| `AporteMensal` | CREATE/UPDATE próprio | READ | READ agregado |

Cliente **nunca** faz UPDATE de `ValorColetado` — só cria `SugestaoCorrecao` (o cliente sugere,
não sobrescreve). Visibilidade a nível de campo existe (ex.: prévia do reexame só ao consultor).

### 3.4 LGPD e segurança
- Protótipo: estado em memória + `localStorage` **namespaced** (`nl:v1:*`), limpável pelo reset.
- Campos `sensivel:true` (patrimônio, beneficiários, sucessório) nunca fora do namespace.
- Caminho para produção (nota arquitetural, não implementar agora): auth real, criptografia
  at-rest para `sensivel`, isolamento multi-consultor, e entidade
  `ConsentimentoLGPD { clienteId, finalidade, baseLegal, versaoTermo, aceitoEm }`.
  Base legal / retenção = `⚠ LACUNA` (jurídico/negócio).

---

## 4. Fase 1 · Exame

33 perguntas, caminho único, **uma pergunta por tela**, vídeo mudo + texto destilado. 6
condicionais; barra de progresso **adaptativa com micro-vitórias** (avança visivelmente a cada
resposta e **nunca retrocede** nas condicionais — preserva o *goal-gradient*). Input de moeda com
chips + "varia muito" (componente prioritário). Corrige o bug: "bens cobertos por seguro" espelha
a lista completa de bens.

Resultado **0–100** por faixa, com smart-animate do número (peak-end; `prefers-reduced-motion`).
**Diagnostica, nunca prescreve.** Bifurcação: cliente → "é um dos temas que {consultor} vai
aprofundar"; self-service → convite (§11.4) + educação.

### 4.1 Score — honestidade sobre a LACUNA
A **fórmula oficial não existe** (`scoring.js` = placeholder). Enquanto for LACUNA, a tela **não**
apresenta o número como precisão científica: exibe a faixa + a frase-situação (§11.1) e um
rótulo honesto ("uma leitura inicial da sua saúde financeira, que {consultor} vai aprofundar"),
sem casas decimais nem ranking. `⚠ LACUNA`: fórmula e mapeamento pergunta→pilar (consultoria).

### 4.2 Rótulos das faixas — ver §11.1 (copy).

---

## 5. Fase 2 · Coleta — schema por vertical

Corrige o bloqueante da CFP: **`ValorColetado` tem `verticalId` (via `CampoColeta`) e há schema de
coleta nas 6 verticais** — não só investimento. Sem campos numa vertical, ela não gera Projeto nem
Tarefa, e o inventário nasce torto. O schema abaixo é a **estrutura**; a lista canônica deriva do
"Mapeamento de 130 variáveis / 15 domínios" (contexto §14) — `⚠ LACUNA` de completude.

| Vertical | Campos-âncora (estrutura; lista final = mapeamento 130 vars) |
|---|---|
| Gestão Financeira | renda, despesas, dívidas, reserva de emergência, aporte potencial |
| Gestão de Ativos | carteira atual, **perfil de suitability**, política de investimento `⚠ LACUNA` |
| Aposentadoria | idade, regime, previdência, renda-alvo, horizonte |
| Gestão de Riscos | dependentes, cobertura de vida/invalidez, patrimônio a segurar, **necessidade de proteção** |
| Tributário | regime, tipos de rendimento, ineficiências conhecidas |
| Sucessório | herdeiros/beneficiários, testamento/holding, seguro sucessório |

Três camadas: (1) consultor preenche/edita (fonte da verdade); (2) cliente vê "Minhas informações"
e **sugere** (§7); (3) sugestões relevantes viram pauta da semestral. Cada valor:
`declarado|estimado|validado` (rótulos humanos na tela — §11.6). Divulgação progressiva + inputs
visuais.

---

## 6. Fase 3 · Devolutiva modular — com montagem assistida

### 6.1 Montagem assistida (bloqueante CFP + Eng)
O consultor **não** monta os ~100 módulos na mão. Um **motor de elegibilidade** pré-seleciona a
playlist: para cada `ModuloDevolutiva`, avalia `elegibilidade: Regra` contra a coleta **e** o
desempenho no quiz (contexto §7: "o quiz configura o produto"). O consultor recebe uma playlist
**pré-sugerida** que apenas revisa (liga/desliga, reordena, grava vídeo próprio). Isso mitiga o
risco de carga da fase 3 (contexto §13), em vez de só registrá-lo.

### 6.2 Anatomia do módulo (uma coisa por tela)
1. **O conceito** — vídeo da Marília (60–120s), slot substituível pelo vídeo do consultor (*messenger effect*).
2. **Os números do cliente** — 2–3 cards derivados via `CardTemplate.formulaRef`, cada um com
   "como chegamos nesse número" (combate *algorithm aversion*/reactância) e a proveniência herdada.
3. **A decisão** — uma frase via `decisaoTemplate`, com custo e impacto (*loss framing* dosado).
4. **As tarefas nascem** — "N tarefas entraram no seu plano de ação" + frame de agência ("já
   organizamos isso pra você" — não "não precisa anotar nada", que beira infantilização, §8).

Capítulo final = **compilado**: tarefas por mês de deadline, cada uma com ↩ link ao capítulo de
origem. Aqui entra a **cascata de prioridade como escolha ativa co-decidida** (voice; §10.2) e a
oferta opcional de **implementation intention** por tarefa ("quando você pretende fazer isto?").
Termina em **[ Começar minha primeira tarefa ]**.

### 6.3 Devolutiva de exemplo — INSTANCIADA (bloqueante Cliente) · `ILUSTRATIVO`
> Persona fictícia **Ricardo, 54**, casado, 2 filhos, dono de rede de óticas. Números fictícios
> para mostrar a forma do produto — **não** metodologia oficial.

**Módulo: Proteção da família (Vertical Gestão de Riscos)**
1. *Conceito:* vídeo "por que um seguro de vida é sobre quem fica, não sobre você" (90s).
2. *Os seus números:*
   - Card A — "Hoje, se algo acontecer com você, sua família mantém o padrão por **11 meses**."
     *Como chegamos:* reserva declarada R$ 180k ÷ custo de vida familiar R$ 16k/mês. Proveniência: `estimado`.
   - Card B — "A necessidade de proteção da sua família é de **8 anos** de autonomia até o filho
     mais novo se formar." *Como chegamos:* horizonte declarado. Proveniência: `declarado`.
3. *A decisão:* "Contratar um seguro de vida que cubra a diferença — custo estimado **R$ 190/mês**,
   impacto: de **11 meses** para **8 anos** de autonomia para a sua família."
4. *As tarefas nascem (2):*
   - "Solicitar 3 cotações de seguro de vida" — deadline mês 1 — *quando?* "no dia do salário".
   - "Escolher e contratar a apólice" — deadline mês 2.
   *Impacto humano no inventário:* Projeto "Proteção da família" — de `aberto` para `resolvido`
   quando contratado; inventário mostra "família: de 11 meses → 8 anos de autonomia".

---

## 7. "Minhas informações" (cliente) — detalhada (bloqueante Cliente)
O cliente vê: patrimônio consolidado, **cada dado com proveniência humana** ("você nos contou" /
"estimativa nossa" / "confirmado" — §11.6), e as **lacunas cinza** do que falta ("ainda não
informado", nunca R$ 0). Em cada campo: botão **"Sugerir correção"** → cria `SugestaoCorrecao`
(nunca sobrescreve). O cliente nunca vê a prévia do reexame.

---

## 8. Fase 5 · Reunião semestral
Pauta fixa; **prévia do reexame só ao consultor** (visibilidade de campo — §3.3); **inventário por
vertical como protagonista**, exame no rodapé. Melhoria de dado: "você declarou X; hoje sabemos
que é Y" (reframing contra aversão à perda mal-aplicada — melhora de dado nunca parece piora de
vida). Marco temporal de recomeço (*fresh start*).

---

## 9. Fase 4 · Ciclo mensal + WhatsApp (o Prompt do B=MAP)

Convergência #1 da Rodada 1 (CFP+Redator+Psicólogo+Cliente). O ciclo mensal **não dispara sozinho**
— quem dispara é o WhatsApp (o cue externo). Sem esta seção, nada acontece.

### 9.1 Conteúdo do ciclo (na plataforma)
1. Tarefas que vencem (com ↩ ao capítulo de origem e o "porquê").
2. **Comitê de investimentos** — reenquadrado (bloqueante fiduciário CFP): a avaliação de
   aderência da carteira é **do consultor**, apresentada ao cliente. O cliente **confirma ciência**
   ou **pede conversa** — não decide suitability. Botões: **[ Ok, entendi ]** / **[ Quero falar com
   {consultor} ]** (nunca "avaliei — nada a fazer"). O resumo é um **broadcast único** do comitê,
   personalizado só na flag de suitability (não redigido por cliente × 150).
3. **Aporte do mês** — única pergunta de dado: "quanto você guardou em {mês}?" (aceita "não
   guardei" e aproximado; respondível no WhatsApp). Resolve o *Ability* (comportamento minúsculo).
4. **Reciclagem educacional** — 1–2 perguntas, **priorizadas por relevância à tarefa ativa** (não
   varrer os 100). Fica **no meio** do ciclo, não no fim.
5. **Fecho do ciclo (peak-end):** termina num **momento de progresso/impacto** ("este mês você
   adicionou 4 meses de autonomia à sua família"), não num quiz avaliativo.

### 9.2 Roteiros de WhatsApp (o Prompt) — `⚠ LACUNA` de copy final (fonte humana), estrutura definida
Remetente **humano** (o consultor), nunca robô, nos momentos de valor.
- **Aporte:** "Oi {nome}, quanto você guardou em {mês}? Pode responder aqui mesmo — e pode ser
  aproximado." (respondível na conversa; alimenta `AporteMensal.viaWhatsApp`).
- **Tarefa que vence:** "{nome}, sua tarefa '{tarefa}' vence esse mês. Lembra por quê: {impactoHumano}."
  (Motivation anexada; ação de 1 toque → abre a tarefa).
- **Comitê:** "{nome}, o comitê revisou os investimentos. Resumo: {2 linhas}. {consultor}."
- **Win-back (§9.3).**

### 9.3 Recaída / win-back (bloqueante Psicólogo) — *fresh start effect*
Após 1 ciclo sem aporte/tarefa: mensagem de retorno em **frame de ganho**, nunca de culpa ("um
aporte agora traz {N} meses de volta"). Na virada de mês e na semestral, moldura de recomeço
("novo mês, novo capítulo" — Milkman/Dai). **Reconhecer o retorno** com mensagem calorosa/badge
(não streak). Silêncio nunca é zero; sem vermelho moral.

---

## 10. Progresso, aderência e a visão de futuro

### 10.1 Aderência = comportamento, nunca mercado
`aderência = aportes feitos ÷ aportes combinados (+ tarefas em dia)`. Mercado negativo com aportes
em dia = **verde** (protege o *locus de controle* interno; evita *learned helplessness*). **Termo
interno**: na tela do cliente diz-se "no rumo do seu plano", nunca "aderência" (jargão órfão).

### 10.2 Cascata de prioridade — escolha ativa co-decidida
Definida **com** o cliente na devolutiva (ele ordena/confirma "se o mês apertar, o que vem
primeiro?"). Aporte real < combinado → aloca pela cascata e mostra a consequência **sem moralizar**
(§11.2). Fallback sem cascata definida: pró-rata + `⚠ LACUNA` de produto.

### 10.3 Minha jornada — a linha do tempo dos objetivos (bloqueante Cliente)
Tela dedicada que responde "como chego lá". Cada `Objetivo` numa **linha do tempo** com:
`anoAlvo`, prazo em **unidade vivível** (meses quando curto; **data + idade** quando longo — nunca
"284 meses"), estado (no rumo / atrasou), e **sempre o caminho de volta na mesma tela e com igual
peso visual** ("um aporte extra de R$ X traz N meses de volta" — gain-frame; a projeção negativa
nunca aparece sozinha). É aqui, e só aqui, que vive a metáfora da escalada (skin separável).

`ILUSTRATIVO` — Ricardo: "Proteger a família" (este ano) · "Vender a ótica com tranquilidade"
(~2036, aos 64) · "Aposentadoria" (2041, aos 69). Cada um com barra de "no rumo" e o caminho de volta.

### 10.4 Home
Herói = **próximo objetivo** (prazo curto, tração emocional — *goal-gradient*); liberdade
financeira embaixo, sem competir. Objetivo planejado atingido = **sucesso**; nenhum indicador cai.
Self-service: estado vazio **honesto** ("isto é o que você ganha ao contratar"), nunca FOMO fabricado.

### 10.5 Inventário por vertical — visível entre reuniões (Importante CFP)
O protagonista pós-contratação aparece na aba `Plano`, não só na semestral: por vertical, itens
resolvidos e abertos, cada um com impacto humano. **Endowed progress:** nunca começa em zero —
semeado com o que o exame/consultor já revelou (silêncio ≠ zero).

---

## 11. Copy (bloqueantes do Redator) — estrutura escrita; texto final = fonte humana onde `⚠ LACUNA`

### 11.1 Rótulos das faixas 0–100 (descrevem a situação e o próximo passo, nunca a pessoa)
Estrutura (texto final `⚠ LACUNA`): foco em situação + próximo passo.
- 0–20 (coral): "Sua base de proteção ainda está exposta — é o primeiro tema a cuidar."
- 20–40 (âmbar): "Você já começou, mas há bases importantes a montar."
- 40–60 (amarelo): "Fundamentos em pé; dá para avançar em consistência."
- 60–80 (turquesa): "Boa estrutura — agora é otimizar e proteger o que construiu."
- 80–100 (esmeralda): "Sua saúde financeira está sólida; foco em manter e transmitir."
Nunca rotular o sujeito ("você está mal").

### 11.2 Consequência "sem moralizar" (aporte real < combinado)
Fórmula: **fato + física + caminho de volta**, zero adjetivo de julgamento. `⚠ LACUNA` texto final.
Ex.: "Guardando R$ {real} neste mês, '{objetivo}' anda {N} meses. Para voltar ao ritmo combinado,
um aporte de R$ {X} recoloca você na data."

### 11.3 "A decisão" (template) — `⚠ LACUNA`
"{ação} — custo {R$/mês}, impacto: de {estado atual} para {estado desejado}." (Ver §6.3.)

### 11.4 Convite self-service — porta que se abre, não paywall `⚠ LACUNA`
Ex.: "Você já enxergou onde está. Um consultor da Nord Liberta transforma isso num plano com
próximos passos — quando quiser, a porta está aberta."

### 11.5 Badges — marcos adultos, sem fogo/troféu/mascote `⚠ LACUNA` nomes finais
Ex.: "Proteção da família concluída" · "Primeiro semestre 100% em dia" · "50 conceitos dominados".

### 11.6 Rótulos humanos de proveniência
`declarado` → "você nos contou" · `estimado` → "estimativa nossa" · `validado` → "confirmado".

### 11.7 Higiene de jargão
Remover da tela do cliente: **aderência/aderente, proveniência, estimado/validado, compilado,
cascata, reciclagem**. Manter internos. "Devolutiva" e "comitê" são termos Nord adultos — permanecem.

---

## 12. Educação (~100 conceitos)
Dominado só com acerto no quiz; pode pular pro quiz (*testing effect*); consultor pode marcar como
dominado. Reciclagem espaçada (*spaced repetition*), 1–2/mês, **priorizada pela tarefa ativa**. O
quiz **configura o produto** (elegibilidade da devolutiva, §6.1), não pontua o cliente. Coleção dos
100 (aba `Educação`): progresso/busca/filtro, **endowed progress** (nunca 0/100 — semeia com
dominados já revelados). Quatro entradas: devolutiva, tarefa, comitê, coleção.

---

## 13. Estados de borda e retomada (bloqueante Eng)
- Consultor edita coleta após devolutiva: capítulo `visto` congela `numerosSnapshot`; `naoIniciado` recomputa.
- Sugestão do cliente colide com edição do consultor: `SugestaoCorrecao` fica `pendente` → resolvida pelo consultor / vira pauta.
- Módulo desligado após tarefas nascerem: tarefas permanecem (não órfanam o cliente).
- `back` no exame revertendo condicional: recomputar ramo sem apagar respostas já dadas; barra não retrocede visualmente além do necessário.
- Aporte via WhatsApp: reconcilia com o número da plataforma (`viaWhatsApp=true`, último vence com carimbo).
- Aporte < combinado sem cascata: pró-rata + `⚠ LACUNA`.
- Prazo projetado com dado faltante: degrada para faixa/estimativa com rótulo "estimativa nossa", nunca zero.
- **Persistência:** `localStorage` namespaced `nl:v1:{cliente|coleta|jornada|...}`; **reiniciar demo**
  limpa o namespace e recarrega o seed mock; **switch cliente/consultor** troca o perfil ativo sem
  apagar dados; **retomada** guarda ponteiro da última pergunta/capítulo.

---

## 14. Componentes reutilizáveis (contratos de UI) — bloqueante menor Eng
`InputMoedaChips` (chips + "varia muito") · `FaixaCor(token)` (5 faixas → cor/rótulo; "situação,
nunca a pessoa") · `ScoreSmartAnimate` (`prefers-reduced-motion`) · `BarraProgressoAdaptativa`
(reage às 6 condicionais, nunca retrocede) · `CardImpactoHumano` · `LinhaDoTempoObjetivos`.

Identidade: laranja Nord como cor de ação (nunca texto pequeno sobre branco); cards brancos, cantos
12–16px, sombra sutil; AA, alvos ≥44px, alternativa a canvas/assinatura; sem emoji/ornamento
decorativo. Stack: React + Tailwind, mobile-first, mock + `localStorage`, pt-BR.

---

## 15. Lacunas conhecidas (`⚠ LACUNA` — não inventar)
Fórmula de scoring e mapa pergunta→pilar · fórmulas dos cards/`formulaRef` e premissas de projeção ·
política de investimento/suitability · lista canônica das 130 variáveis · copy final (faixas,
consequência, decisão, convite, badges, roteiros de WhatsApp) · base legal/retenção LGPD ·
metodologia da escalada · Fase 6 (renovação, confirmar contra v3.0) · decisão de streak (com
mecânica de perdão/freeze se voltar).

---

## 16. Radar do consultor (bloqueante CFP — motor de escala)
Aba desktop com **fila de triagem** ordenada por urgência. Gatilhos de entrada: aporte não
informado no ciclo, tarefa vencida, `SugestaoCorrecao` pendente, pedido "quero falar" do comitê,
prévia de reexame divergente. Cada item: cliente, motivo, idade do sinal, **SLA** sugerido. Ordena
por severidade × tempo. Admin vê o agregado (nunca patrimônio bruto cross-consultor). É o que
permite um consultor atender volume alto sem cair na qualidade.
