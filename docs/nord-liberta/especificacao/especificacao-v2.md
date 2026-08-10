# Nord Liberta — Especificação do Produto · v2 (pós-Rodada 2 do Gauntlet)

> Estado: **EM ITERAÇÃO**. Reescrita a partir da v1 para endereçar os bloqueantes da Rodada 2.
> Governada por `../00-contexto-v5.md` e pelos princípios invioláveis (§9). Conteúdo financeiro
> oficial pendente está consolidado no **Anexo A (Lacunas)** — nada é inventado. Exemplos marcados
> `ILUSTRATIVO` usam persona fictícia (Ricardo) e **não** são metodologia oficial.

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

> A cadência mensal é longa demais para formar **automaticidade** (Wood): o produto **não** promete
> "criar hábito"; opera como **rotina disparada por cue externo** — o WhatsApp é esse cue (o
> "Prompt" do B=MAP de Fogg: Comportamento = Motivação × Habilidade × **Prompt**). Ver §9.

---

## 2. Atores, superfícies e navegação

| Ator | Superfície | Papel |
|---|---|---|
| Cliente pagante | Mobile-first | Executa tarefas, informa aporte, consome educação |
| Self-service | Mesma superfície | Exame + educação; coluna de Ação vazia (estado honesto) |
| Consultor | Desktop | Fonte da verdade da coleta, monta devolutiva, conduz reuniões; nome é variável |
| Admin | Desktop | Visão gerencial agregada; **nunca** patrimônio bruto cross-consultor |
| WhatsApp | Canal | Cue/Prompt e cadência (§9) |

### 2.1 Bottom nav do cliente — 5 abas, com fronteira declarada
`Início` · `Plano` · `Educação` · `Minhas informações` · `Minha jornada`
- **Início** responde *"qual é o meu próximo passo agora?"* (próximo objetivo + tarefa do ciclo).
- **Minha jornada** responde *"como chego lá ao longo dos anos?"* (linha do tempo de **todos** os
  objetivos + visão consolidada "estou no rumo no todo?"). É onde vive a metáfora da escalada (skin separável).
Sem bottom nav dentro do exame (foco de tarefa única). `Início` em pt-BR (não "Home").

### 2.2 Máquina de estados de fase (por cliente) — com estados de limbo/erro
```
faseCliente ∈ { exame, exameConcluido, coletaEmAndamento, coletaSuficiente,
                devolutivaEmMontagem, devolutivaMontada, cicloMensal,
                semestral, renovacao, suspenso }
```
Gates (com invariante, não confiança):
- `exame → exameConcluido`: 33 respondidas. **Self-service termina aqui** (não avança sem contrato).
- `exameConcluido → coletaEmAndamento`: contrato assinado.
- `coletaEmAndamento → coletaSuficiente`: **completude mínima por vertical validada** (§5.1) — não é
  o consultor "confiar", é o sistema checar campos-âncora presentes.
- `coletaSuficiente → devolutivaEmMontagem → devolutivaMontada`: consultor revisa a playlist e publica.
- `devolutivaMontada → cicloMensal`: cliente conclui o capítulo "Seu plano de ação".
- `cicloMensal → semestral`: a cada 6 ciclos; retorna a `cicloMensal`.
- **Rollback:** consultor pode reabrir `coletaEmAndamento` a partir de `devolutivaMontada`/`cicloMensal`
  (recomputa capítulos `naoIniciado`, congela os `visto` — §3.2). `suspenso` = conta pausada; retomável.

---

## 3. Modelo de dados (núcleo) — template × instância

**Biblioteca (definição, versionada, liga/desliga)** e **instância (estado do cliente)** são níveis
distintos — é o que permite plugar o 101º módulo sem refatorar e não mudar retroativamente números já mostrados.

### 3.1 Biblioteca
```
Vertical            { id, nome }                       // as 6 fixas
ModuloDevolutiva    { id, verticalId, versao, ativo,
                      elegibilidade: Regra,            // DSL — §6.4
                      camposLidos: [chaveColeta],      // dependência declarativa
                      videoPadraoUrl, decisaoTemplate,
                      cardsTemplate: [CardTemplate], tarefasTemplate: [TarefaTemplate] }
CardTemplate        { id, titulo, formulaRef, comoChegamosTemplate }   // formulaRef → Anexo A
TarefaTemplate      { id, titulo, offsetDeadlineMeses, conceitoLigadoId? }
Conceito            { id, verticalId, titulo, videoUrl, quiz }
CampoColeta         { chave, verticalId, tipo, rotuloHumano, sensivel, ancora:boolean }  // §5
```

### 3.2 Instância (por cliente; snapshot imutável)
```
Cliente             { id, consultorId, faseCliente }
ValorColetado       { id, clienteId, chave, valor, proveniencia: declarado|estimado|validado,
                      sensivel, atualizadoPor:AtorRef, atualizadoEm, versao }
SugestaoCorrecao    { id, clienteId, chave, valorAtualNoMomento, versaoValorColetado,
                      valorSugerido, autor:cliente, criadoEm,
                      status: pendente|aceita|rejeitada|virouPauta|dadoMudou, reuniaoPautaId? }
Projeto             { id, clienteId, verticalId, titulo, statusInventario: aberto|resolvido, impactoHumano }
CapituloDevolutiva  { id, clienteId, moduloId, moduloVersao, projetoId, ordem, videoConsultorUrl?,
                      numerosSnapshot:[{card, valor, comoChegamos, proveniencia}], status: naoIniciado|visto }
Tarefa              { id, clienteId, projetoId, capituloOrigemId, templateId?, titulo,
                      mesDeadline, quando?:string, status: pendente|feita }  // quando = implementation intention (§9)
Objetivo            { id, clienteId, verticalId, projetoId?, nome, anoAlvo,
                      prazoProjetadoMeses, prioridadeCascata:int }
AporteMensal        { clienteId, mesRef, valorCombinado, valorReal|null, viaWhatsApp }  // única {clienteId, mesRef}
DominioConceito     { clienteId, conceitoId, status: nao|dominado, fonte: quiz|consultor, em }
AuditLog            { id, entidade, entidadeId, campo, valorAntes, valorDepois, ator, acao, em }  // append-only
```

### 3.3 Regra canônica de proveniência (reconcilia Rodada 2 — CFP+Eng)
**Uma regra determinística, conservadora (fiduciário: nunca apresentar estimativa como fato):**
1. Proveniência de um valor derivado = **a pior das entradas** (elo mais fraco): `validado` > `declarado` > `estimado`.
2. **Toda derivação que envolva projeção, divisão, taxa ou horizonte rebaixa no mínimo um degrau** —
   nunca sobe. Um cálculo sobre entradas `declarado` resulta, no máximo, `estimado`.
3. Nenhum número derivado por projeção pode ser exibido como `declarado`/"confirmado" (§11.6).

> Isso corrige a contradição da v1: no exemplo do Ricardo (§6.3), R$180k ÷ R$16k/mês (ambos
> `declarado`) → resultado **`estimado`** (regra 2), coerente com o rótulo mostrado.

### 3.4 Matriz de permissões
| Entidade | Cliente | Consultor (seu cliente) | Admin |
|---|---|---|---|
| `ValorColetado` | READ | CRUD | READ agregado (sem valor bruto cross-consultor) |
| `SugestaoCorrecao` | CREATE, READ próprio | READ, resolver | — |
| `Tarefa`/`Projeto` | READ, concluir | CRUD | READ agregado |
| Prévia do reexame (§8) | **sem acesso** | READ | — |
| `AporteMensal` | CRUD próprio | READ | READ agregado |
| `AuditLog` | — | READ próprio escopo | READ |

Cliente nunca faz UPDATE de `ValorColetado` — só cria `SugestaoCorrecao`. Visibilidade a nível de
campo: `sensivel` e a prévia do reexame são consumidas sistematicamente pela policy, não anedóticas.

### 3.5 Isolamento e LGPD
- Protótipo: `localStorage` **namespaced por cliente**: `nl:v1:cliente:{clienteId}:{coleta|jornada|...}`
  + `SessaoDemo { atorAtivo, clienteAtivoId }`. **Invariante:** leitura de cliente nunca cruza
  `clienteAtivoId` (exceto consultor/admin no próprio escopo). O `localStorage` compartilhado é
  fronteira que **não** sobrevive à produção.
- `AuditLog` append-only para `ValorColetado.sensivel=true`, `SugestaoCorrecao` e mudança de `consultorId`.
- Produção (nota, não implementar agora): auth real, criptografia at-rest para `sensivel`, isolamento
  multi-consultor, `ConsentimentoLGPD { clienteId, finalidade, baseLegal, versaoTermo, aceitoEm }`.
- Versionamento de schema do `localStorage`: bump `nl:v1 → nl:v2` reseta a demo (política explícita).

---

## 4. Fase 1 · Exame

33 perguntas, caminho único, uma pergunta por tela, vídeo mudo + texto destilado. 6 condicionais;
barra adaptativa com micro-vitórias (avança a cada resposta, **nunca retrocede** — *goal-gradient*).
Input de moeda com chips + "varia muito". Corrige o bug: "bens cobertos por seguro" espelha a lista
completa de bens.

Resultado **0–100** por faixa, smart-animate (peak; `prefers-reduced-motion`). **Diagnostica, nunca
prescreve.** Bifurcação: cliente → "é um dos temas que {consultor} vai aprofundar"; self-service →
convite (§11.4) + educação.

**§4.1 Score honesto:** a fórmula é lacuna (Anexo A). A tela **não** apresenta o número como
precisão científica: faixa + frase-situação (§11.1) + rótulo honesto, sem casas decimais nem ranking.

---

## 5. Fase 2 · Coleta — schema por vertical

`ValorColetado` liga-se a `CampoColeta.verticalId`; há schema nas **6 verticais** — sem campo numa
vertical, ela não gera Projeto nem Tarefa. Lista canônica deriva do "Mapeamento de 130 variáveis"
(Anexo A).

| Vertical | Campos-âncora (`ancora:true` = exigidos para completude) |
|---|---|
| Gestão Financeira | renda, despesas, dívidas, reserva de emergência, aporte potencial |
| Gestão de Ativos | carteira atual, **perfil de suitability** (dirige o comitê — §9.1.2); política de investimento → Anexo A |
| Aposentadoria | idade, regime, previdência, renda-alvo, horizonte |
| Gestão de Riscos | dependentes, cobertura vida/invalidez, patrimônio a segurar, necessidade de proteção |
| Tributário | regime, tipos de rendimento, come-cotas, ganho de capital, dedução (PGBL), PF×PJ, ineficiências |
| Sucessório | herdeiros/beneficiários, testamento/holding, seguro sucessório, regime de bens |

> Tributário e Sucessório aprofundados na tabela (pedido CFP); completude final = validação da
> consultora na lista canônica (Anexo A). **Gestão de Ativos fica funcionalmente inerte** até a
> política de investimento ser entregue (dependência rastreada, Anexo A) — a vertical existe na
> estrutura mas não produz Projeto/decisão sem ela.

**§5.1 Completude mínima:** o gate `coletaEmAndamento → coletaSuficiente` exige os campos `ancora`
de cada vertical presentes (ou marcados "não se aplica" pelo consultor). Campos ausentes = lacuna
cinza, nunca zero.

Três camadas: consultor preenche/edita (fonte da verdade); cliente vê e **sugere** (§7); sugestões
viram pauta da semestral. Rótulos humanos de proveniência na tela (§11.6). Divulgação progressiva + inputs visuais.

---

## 6. Fase 3 · Devolutiva modular

### 6.1 Montagem assistida
O **motor de elegibilidade** (§6.4) avalia cada `ModuloDevolutiva.elegibilidade` contra a coleta **e**
o desempenho no quiz e devolve ao consultor uma playlist **pré-sugerida** que ele só revisa
(liga/desliga, reordena, grava vídeo próprio). Mitiga a carga da fase 3.

### 6.2 Anatomia do módulo (uma coisa por tela)
1. **O conceito** — vídeo da Marília (60–120s), slot substituível pelo do consultor (*messenger effect*).
2. **Os seus números** — 2–3 cards via `CardTemplate.formulaRef`, cada um com "como chegamos nesse
   número" e proveniência herdada pela regra §3.3.
3. **A decisão** — uma frase via `decisaoTemplate`, custo e impacto (*loss framing* dosado — guarda §6.5).
4. **As tarefas nascem** — "N tarefas entraram no seu plano de ação" + frame de agência ("já
   organizamos isso pra você"). Este é o **peak projetado** do capítulo (§9.1).

### 6.3 Devolutiva de exemplo — módulo (`ILUSTRATIVO`; persona fictícia Ricardo, 54)
**Módulo: Proteção da família (Gestão de Riscos)**
1. *Conceito:* "um seguro de vida é sobre quem fica" (90s).
2. *Os seus números:*
   - Card A — "Hoje, se algo acontecer com você, sua família mantém o padrão por **11 meses**."
     *Como chegamos:* reserva R$180k (declarado) ÷ custo de vida R$16k/mês (declarado). Proveniência:
     **estimado** (regra §3.3: divisão/projeção rebaixa um degrau).
   - Card B — "Sua família precisa de **8 anos** de autonomia até o filho mais novo se formar."
     *Como chegamos:* horizonte declarado. Proveniência: **declarado**.
3. *A decisão:* "Contratar um seguro de vida que cubra a diferença — custo estimado **R$190/mês**,
   impacto: de **11 meses** para **8 anos** de autonomia para a sua família."
4. *2 tarefas nascem:* "Solicitar 3 cotações" (mês 1, *quando?* "no dia do salário") · "Escolher e
   contratar a apólice" (mês 2). Projeto "Proteção da família" vai a `resolvido` ao contratar.

### 6.4 DSL da `Regra` de elegibilidade (bloqueante Eng)
```
Regra     = Predicado | { op:"and"|"or", termos:[Regra] } | { op:"not", termo:Regra }
Predicado = { campo:chaveColeta,
              op:"<"|"<="|"=="|">="|">"|"between"|"in"|"exists"|"missing",
              ref: {const:number}|{campoRef:chaveColeta}|literal, ref2? }        // ref2 p/ between
PredQuiz  = { conceitoId, status:"dominado"|"nao" }
```
Semântica de **campo ausente** (liga com "silêncio ≠ zero"): comparação numérica sobre campo sem
`ValorColetado` retorna **`indeterminado`** (lógica de três valores), nunca zero. Saída tipada:
```
AvaliacaoElegibilidade { moduloId, resultado: elegivel|naoElegivel|indeterminado,
                         camposFaltantes:[chave], regraVersao }
```
`indeterminado` **não** entra na playlist automática — sobe ao consultor com `camposFaltantes`
(fecha o loop de completude da coleta). A `Regra` é versionada junto do módulo; limiares → Anexo A.

**Contrato de migração de versão de módulo:** quando `camposLidos`/`formulaRef` da nova `versao`
for incompatível com um capítulo `naoIniciado`, o capítulo degrada para `indeterminado` e volta ao
consultor (não recomputa silenciosamente). Capítulo `visto` está congelado e imune (§3.2).

### 6.5 Guarda de loss framing no módulo de Riscos (bloqueante menor Psi → regra de copy)
O custo pode ser apresentado como perda **dosada**, mas o impacto é **sempre** ancorado no
gain-frame de autonomia ("de 11 meses para 8 anos"). **Proibido** usar *mortality salience* (apelo
ao medo da morte) como alavanca de conversão. Regra de copy, não recomendação.

### 6.6 "Seu plano de ação" — o capítulo final, INSTANCIADO ponta a ponta (bloqueante Cliente)
Substitui o jargão "compilado" (Redator). É o plano inteiro do cliente, todas as verticais, por mês,
cada tarefa com ↩ link ao capítulo de origem. Aqui o cliente **co-decide a cascata de prioridade**
(voice) e pode declarar o `quando` de cada tarefa. Termina em **[ Começar minha primeira tarefa ]**.

`ILUSTRATIVO` — **Plano de ação do Ricardo** (números fictícios; método real = Anexo A):
| Mês | Tarefa | Vertical | Objetivo servido | ↩ Capítulo |
|---|---|---|---|---|
| 1 | Solicitar 3 cotações de seguro de vida (*no dia do salário*) | Riscos | Proteger a família | Proteção da família |
| 1 | Abrir previdência PGBL p/ deduzir IR | Tributário | Aposentadoria | Eficiência tributária |
| 2 | Contratar a apólice de vida escolhida | Riscos | Proteger a família | Proteção da família |
| 2 | Rever alocação da carteira ao perfil | Ativos | Aposentadoria | Carteira e perfil |
| 3 | Fazer/atualizar testamento | Sucessório | Tranquilidade sucessória | Sucessão |
| 4 | Estruturar reserva de emergência (6 meses) | G. Financeira | Todos (base) | Base financeira |

Inventário resultante (aba `Plano`, visível entre reuniões): 6 tarefas em 4 verticais; progresso
conta **tarefas** (6 avanços visíveis), não projetos.

---

## 7. "Minhas informações" (cliente)
Patrimônio consolidado, cada dado com proveniência humana (§11.6) e **lacunas cinza** ("ainda não
informado", nunca R$0). Botão **"Sugerir correção"** por campo → `SugestaoCorrecao` (carrega
`valorAtualNoMomento` + `versaoValorColetado`; se a versão mudou na resolução, status `dadoMudou` e
avisa "o dado mudou desde a sua sugestão"). O cliente nunca vê a prévia do reexame.

---

## 8. Fase 5 · Reunião semestral — com montagem assistida (bloqueante CFP)
Pauta fixa; **prévia do reexame só ao consultor**; inventário por vertical como protagonista, exame
no rodapé. **Montagem assistida da semestral** (análoga à §6.1): o sistema pré-monta a pauta com
(a) **auto-diff do inventário** por vertical (resolvido no semestre × aberto), (b) `SugestaoCorrecao`
acumuladas, (c) divergências da prévia do reexame **em campos-âncora** (não no número 0–100 — ver
§16). Melhoria de dado: "você declarou X; hoje sabemos que é Y" (reframing; melhora de dado nunca
parece piora de vida). Marco temporal de recomeço (*fresh start*).

---

## 9. Fase 4 · Ciclo mensal + WhatsApp (o Prompt do B=MAP)

### 9.1 Conteúdo do ciclo (na plataforma)
1. Tarefas que vencem (↩ ao capítulo, com o "porquê").
2. **Comitê** (fiduciário): a avaliação de aderência da carteira é **do consultor**, apresentada; o
   cliente **[ Ok, entendi ]** ou **[ Quero falar com {consultor} ]** — não decide suitability.
   Broadcast único, personalizado só pela **flag de suitability derivada do `perfil de suitability`
   da coleta** (§5) — sem redação 1×150.
3. **Aporte do mês** — "quanto você guardou em {mês}?" (aceita "não guardei"/aproximado; via WhatsApp).
4. **Reciclagem educacional** — 1–2 perguntas, priorizadas pela tarefa ativa. Fica **no meio**.
5. **Fecho do ciclo (end da peak-end):** momento de progresso/impacto ("este mês você adicionou 4
   meses de autonomia à sua família"), não um quiz. Par com o **peak** (§6.2.4).

### 9.2 WhatsApp — Prompt com *timing* (bloqueante Psi)
Remetente **humano** (o consultor), nunca robô, nos momentos de valor. **O disparo é um *hot
trigger*: cai quando M e A estão altas.**
- **Tarefa:** o lembrete é agendado pelo `Tarefa.quando` do cliente (ex.: "no dia do salário"),
  **não** por data genérica — fecha a implementation intention (Gollwitzer) e ancora o Prompt no
  contexto existente (Tiny Habits). Copy: "{nome}, sua tarefa '{tarefa}' — lembra por quê:
  {impactoHumano}." (Motivation anexada; 1 toque abre a tarefa).
- **Aporte:** ancorado ao dia do salário/data escolhida pelo cliente. "Oi {nome}, quanto você
  guardou em {mês}? Pode responder aqui — e pode ser aproximado."
- **Comitê:** broadcast com resumo de 2 linhas + assinatura do consultor.
- **Cadência e dignidade do canal (bloqueante importante Psi):** teto de **N mensagens/mês** (Anexo
  A), regra de **não empilhar** (aporte + tarefa + comitê no mesmo dia), **opt-out por tipo**. Para
  50+ premium, dignidade do canal = retenção.

### 9.3 Escada de recaída / win-back (*fresh start*) (bloqueante Psi resolvido + escada nova)
- **1º ciclo silencioso:** WhatsApp em **frame de ganho** ("um aporte agora traz {N} meses de volta"),
  nunca culpa; moldura de recomeço na virada de mês.
- **2º ciclo:** tom mais humano, ainda automação; reforço do "silêncio nunca é zero".
- **≥3º ciclo:** **handoff explícito ao consultor via Radar** — a automação recua, a pessoa entra.
- Marcos de *fresh start* mais salientes que a virada de mês: **ano novo, aniversário do cliente,
  aniversário do plano**. Reconhecimento caloroso do retorno (badge, não streak).

---

## 10. Progresso, aderência e visão de futuro

### 10.1 Aderência = comportamento, nunca mercado
`aportes feitos ÷ combinados (+ tarefas em dia)`. Mercado negativo com aportes em dia = **verde**
(protege *locus de controle*; evita *learned helplessness*). Termo **interno**; na tela do cliente,
"no rumo do seu plano".

### 10.2 Cascata de prioridade — escolha ativa co-decidida
Definida **com** o cliente em "Seu plano de ação" (§6.6). Aporte < combinado → aloca pela cascata,
consequência **sem moralizar** (§11.2). Fallback sem cascata: pró-rata (Anexo A).

### 10.3 Minha jornada — linha do tempo + prazo-que-reage, com objetivo longo INSTANCIADO
Cada `Objetivo` numa linha do tempo: `anoAlvo`, prazo em **unidade vivível** (meses quando curto;
**data + idade** quando longo — nunca "284 meses"), estado (no rumo/atrasou), e **sempre o caminho
de volta na mesma tela e com igual peso visual** (gain-frame; a projeção negativa nunca aparece
sozinha). Inclui a **visão consolidada "estou no rumo no todo?"** (pedido Cliente) — um só olhar
sobre o plano inteiro.

`ILUSTRATIVO` — **objetivo longo do Ricardo, prazo-que-reage (aposentadoria):**
- Objetivo: "Aposentadoria" — anoAlvo **2041** (aos 69), aporte combinado R$10.000/mês.
- No ritmo atual (aportes em dia): **no rumo para 2041**.
- Cenário de aperto: dois meses a R$6.000 → projeção recua para **2043**. Na mesma tela, com igual
  peso: **"Um aporte extra de R$1.400/mês pelos próximos 12 meses recoloca 2041."** (gain-frame).
- Fio explícito aporte → data: o número informado no ciclo (§9.1.3) **move a barra** desta tela; o
  "adicionou 4 meses de autonomia" (§9.1.5) é a versão sentida do mesmo cálculo. Método = Anexo A.

### 10.4 Início (home)
Herói = **próximo objetivo** (prazo curto — *goal-gradient*); liberdade financeira embaixo, sem
competir. Objetivo planejado atingido = **sucesso**; nenhum indicador cai. Self-service: estado
vazio **honesto** ("isto é o que você ganha ao contratar"), nunca FOMO fabricado.

### 10.5 Inventário por vertical — entre reuniões, com endowed progress
Aba `Plano`: por vertical, itens resolvidos e abertos, cada um com impacto humano. **Nunca começa em
zero** — semeado com o que o exame/consultor já revelou (silêncio ≠ zero).

---

## 11. Copy (estrutura definida; texto final → Anexo A onde marcado)

### 11.1 Rótulos das faixas 0–100 — descrevem a **situação geral e o próximo passo**, nunca a pessoa nem um pilar
> O score é composto; a faixa **não isola pilar** (senão prescreve — fere §9.1). Fala da saúde geral.
- 0–20 (coral): "Sua saúde financeira está no começo da construção — há bases a montar, e é por aqui que se começa."
- 20–40 (âmbar): "Você já começou; ainda há fundamentos importantes a montar."
- 40–60 (amarelo): "Fundamentos em pé — dá para avançar com passos regulares."
- 60–80 (turquesa): "Boa estrutura — agora é refinar e proteger o que você construiu."
- 80–100 (esmeralda): "Sua saúde financeira está sólida — foco em manter o que construiu e cuidar de quem vem depois."

### 11.2 Consequência "sem moralizar" — verbo direcional inequívoco
Fórmula: **fato + física + caminho de volta**, zero julgamento.
"Com R$ {real} guardados neste mês, a data de '{objetivo}' **recua** {N} meses. Um aporte de R$ {X}
recoloca você na data combinada." (Antes era "anda", ambíguo — corrigido.)

### 11.3 "A decisão" (template): "{ação} — custo {R$/mês}, impacto: de {estado atual} para {estado desejado}."

### 11.4 Convite self-service (enxuto): "Você já enxergou onde está. Um consultor da Nord Liberta
transforma isso num plano — quando quiser, a porta está aberta."

### 11.5 Badges — marcos adultos fixos, sem fogo/troféu/mascote: "Proteção da família concluída" ·
"Primeiro semestre 100% em dia" · "50 conceitos dominados". (Marco fixo, não recompensa variável.)

### 11.6 Rótulos humanos de proveniência: `declarado` → "você nos contou" · `estimado` → "nossa
estimativa" · `validado` → "confirmado".

### 11.7 Higiene de jargão — remover da tela do cliente: aderência/aderente, proveniência,
estimado/validado, **compilado** (→ "Seu plano de ação"), cascata, reciclagem, consistência,
otimizar, transmitir. Manter internos. "Devolutiva", "comitê", "inventário" permanecem (termos Nord adultos).

---

## 12. Educação (~100 conceitos)
Dominado só com acerto no quiz; pode pular pro quiz (*testing effect*); consultor pode marcar. Reciclagem
espaçada 1–2/mês, priorizada pela tarefa ativa. O quiz **configura o produto** (§6.4), não pontua o
cliente. Coleção dos 100 (aba `Educação`), **endowed progress** (nunca 0/100). Quatro entradas:
devolutiva, tarefa, comitê, coleção.

---

## 13. Estados de borda e retomada
Congelamento de snapshot (`visto`) × recomputo (`naoIniciado`); sugestão vs. edição (`versaoValorColetado`
+ status `dadoMudou`); módulo desligado não órfãna tarefas; `back` no exame recomputa ramo sem apagar
respostas; aporte via WhatsApp reconcilia (último vence, carimbado); aporte < combinado sem cascata =
pró-rata (Anexo A); **meses pulados** = lacuna cinza por mês, nunca zero (`AporteMensal` único por
`{clienteId,mesRef}`); prazo com dado faltante degrada para "nossa estimativa", nunca zero; **coleta
insuficiente** barrada no gate §5.1; **troca de `consultorId`** registrada em `AuditLog` com
reatribuição de escopo; **objetivo cujo projeto foi resolvido** congela `prazoProjetadoMeses`.
Persistência: namespace por cliente (§3.5), reset limpa e recarrega seed, switch troca perfil sem
apagar, ponteiro de retomada por fase.

---

## 14. Componentes reutilizáveis (contratos de UI)
`InputMoedaChips` · `FaixaCor(token)` (5 faixas → cor/rótulo; situação, nunca a pessoa) ·
`ScoreSmartAnimate` (`prefers-reduced-motion`) · `BarraProgressoAdaptativa` (6 condicionais, nunca
retrocede) · `CardImpactoHumano` · `LinhaDoTempoObjetivos` (com caminho-de-volta embutido).
Identidade: laranja Nord como ação (nunca texto pequeno sobre branco); cards brancos, cantos 12–16px,
sombra sutil; AA, alvos ≥44px, alternativa a canvas/assinatura; sem emoji/ornamento decorativo. Stack:
React + Tailwind, mobile-first, mock + `localStorage`, pt-BR.

---

## 15. Radar do consultor — motor de escala, com modelo de capacidade (bloqueante + importante CFP)
Aba desktop com **fila de triagem** ordenada por severidade × tempo. Gatilhos: aporte não informado,
tarefa vencida, `SugestaoCorrecao` pendente, "quero falar" do comitê, **divergência de reexame em
campos-âncora** (não no score 0–100, que é lacuna — resolve a dependência circular apontada pela
Eng), ≥3º ciclo silencioso (handoff de recaída — §9.3).
**Modelo de capacidade:** parâmetro `clientesPorConsultor` e `tetoFilaDiaria` (Anexo A); quando a
fila excede o teto, itens de menor severidade aguardam e o excedente **escala ao admin** (visão
agregada, nunca patrimônio bruto). Ordenar não é caber — a política de capacidade é o que garante volume.

---

## 16. Anexo A — Lacunas conhecidas (`⚠ não inventar`; consolidadas p/ manter o corpo "produto pronto")
- **Fórmula de scoring** e mapa pergunta→pilar (consultoria). Enquanto lacuna, score honesto (§4.1);
  radar usa divergência de campos-âncora, não do número (§15).
- **`formulaRef` dos cards** e **premissas de projeção** (retorno, inflação, horizonte) — versionadas,
  valores da consultoria. Método do prazo-que-reage (§10.3) idem.
- **Limiares das `Regra` de elegibilidade** (§6.4) e **política de investimento/suitability** (§5).
- **Lista canônica das 130 variáveis** (Tributário/Sucessório com validação da CFP).
- **Copy final:** rótulos das faixas, consequência, decisão, convite, badges, roteiros de WhatsApp.
- **Parâmetros operacionais:** teto de mensagens/mês (§9.2), `clientesPorConsultor`/`tetoFilaDiaria`
  e SLAs (§15), regra de pró-rata sem cascata (§10.2).
- **Base legal/retenção LGPD** (jurídico).
- **Metodologia da escalada** (skin); **Fase 6 (renovação)** — confirmar contra v3.0; **streak** —
  fora da v1; se voltar, contar "plano atualizado no mês" com mecânica de perdão/freeze.
