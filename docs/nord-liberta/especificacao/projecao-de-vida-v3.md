# Projeção de Vida — especificação v3

> **Status:** proposta reescrita. Substitui `projecao-de-vida-v2.md`, que fechou **0/6** na
> rodada 07. Vai à **rodada 08** do Gauntlet Loop antes de virar código.
>
> **Governança:** subordinada a `../00-contexto-v5.md` (princípios invioláveis §9) e à
> especificação selada `especificacao-v3.md` (5/5 na rodada 3). Onde esta ferramenta muda a
> selada, a mudança está listada no §16 — nunca em silêncio.
>
> **Entradas desta versão:** os seis pareceres da rodada 07 (`../gauntlet/rodada-07.md`), as
> dezesseis decisões do lote B (`../feedback-nelio-rodada-B.md`), a especificação de orçamento
> do Nélio (`../fontes/especificacao-orcamento-familiar.txt`) e a separação de ferramentas
> (`duas-ferramentas.md`).
>
> **Conteúdo financeiro pendente está no §17 (Lacunas). Nada é inventado.**
> Exemplos marcados `ILUSTRATIVO` usam a persona fictícia Ricardo e **não** são metodologia oficial.

---

## 0. Rastreabilidade — onde cada exigência foi parar

Duas tabelas. Servem para o painel da rodada 08 conferir sem procurar, e para impedir que um
achado caro se perca numa reescrita.

### 0.1 Os seis pareceres da rodada 07

| # | Agente | Achado | Onde fecha |
|---|---|---|---|
| 1 | **Cliente** *(veto)* | `fim: null` numa renda ativa é mentira de décadas — e é o padrão | §4.6 — `fim` deixa de ter padrão; renda ativa exige evento de encerramento declarado |
| 2 | **Cliente** | Caixinha sem meta e sem veredito: "R$ 111.308, isso é suficiente? Não faço ideia" | §6.3 e §6.4 — `custoEsperado`/`dataEsperada` + o saque como diagnóstico (B9) |
| 3 | **Cliente** | Renda precisa aceitar faixa mínimo–máximo | §4.5 — faixa declarada vira **banda**, projetada pelo piso |
| 4 | **Cliente** | O outro galho da árvore: "e se eu morrer" | §8 — o ramo **"E se eu faltar"**, sempre iniciado pelo cliente e enquadrado em ganho |
| 5 | **Cliente** | Saída em papel para o contador | §9.11 — exportação com premissas, versão e selo de projeção |
| 6 | **Cliente** | Editar as próprias caixinhas | §6.6 — no rascunho o cliente edita; no plano publicado a edição vira simulação/sugestão |
| 7 | **UX/UI** *(veto)* | A spec não especifica **uma única tela** | §9 inteiro — anatomia, orçamento de pixels, estados, gestos, iconografia |
| 8 | **UX/UI** *(veto)* | Apaga a visão de 7 meses, que era a prova do diferencial | §9.3 — os três botões são atalhos, **não** os estados do zoom; zoom contínuo de 6 meses ao horizonte |
| 9 | **UX/UI** | "Âncoras a partir de hoje" quebra a continuidade espacial | §9.3 — as âncoras mudam **largura**, mantendo o mês em foco parado; `hoje` é botão separado |
| 10 | **UX/UI** | Não cabe em 390px: 5 rendas × 24px por pista | §9.1 e §4.2 — a faixa-por-renda **some** (B6); a régua tem 2 palcos e 1 trilho, com orçamento de pixels declarado |
| 11 | **UX/UI** | Falta regra de colapso, overflow e scroll vertical vs. pan horizontal | §9.5 e §9.6 |
| 12 | **UX/UI** | Tooltip na crosshair, rótulo dentro da banda, ícones por forma e preenchimento | §9.7 e §9.8 |
| 13 | **UX/UI** | O verbo de editor que ficou na mesa: **mutar** uma faixa de renda | §10.3 — "e se a esposa parar de trabalhar" é um toque, não um formulário |
| 14 | **CFP** | Ativa × passiva como binário está errado; falta `ativoLastroId` | §4.3 — duas dimensões independentes: dependência do trabalho e ativo de lastro |
| 15 | **CFP** | A meta da liberdade financeira **não** é a soma das rendas ativas | §7 — meta = necessidade projetada da fase futura; a soma das ativas vira outro indicador |
| 16 | **CFP** | Natureza CLT gera automaticamente 13º e férias | §4.4 — a natureza semeia clipes; valores em ⚠ LACUNA |
| 17 | **CFP** | Premissas versionadas, travadas por suitability, nunca digitadas no cadastro do cliente | §11 — `ParametrosDaCasa` (B13), teto por perfil (B14), `PerfilDeRisco` (B11) |
| 18 | **CFP** *(aberto desde a rodada 06)* | Passivo como camada de primeira classe, com cronograma de amortização | §6.7 — `Passivo` com parcela no fluxo e amortização no patrimônio |
| 19 | **Engenheiro** | A regra de continuidade, como escrita, é **falsa** | §5.4 — o invariante passa a ser sobre o **estado**, não sobre o resultado |
| 20 | **Engenheiro** | A continuidade replicaria dezembro por 89 anos | §5.5 — o mês-base é **declarado**, e o que é pontual/parcelado nunca propaga |
| 21 | **Engenheiro** | `indefinido` não pode virar zero | §5.6 — unificado em `indeterminado` (mesma palavra da selada §6.4) e propagado como tal |
| 22 | **Engenheiro** | Modelar `Cenario`/`Caixinha`/`EventoPatrimonial`/`Simulacao` na spec selada | §13 e §16 — entidades e delta de §3.2/§3.4 |
| 23 | **Engenheiro** | Registro de tipos de evento em um lugar só | §13.4 — registro único + o que "adicionar um tipo" obriga |
| 24 | **Engenheiro** | Superfície de autoria para o consultor | §10 e §12 |
| 25 | **Engenheiro** | Cobertura de teste para `simulacao.js` e `viewport.js` | §15 — a bancada cresce antes do código novo |
| 26 | **Redator** | Dez conceitos novos e nenhum sobrevive ao leitor de 54 anos | §14 — tabela de poda: nome interno → o que aparece na tela |
| 27 | **Psicólogo** | A cura para "chegou pronta" não é tela em branco | §3.1 — o **rascunho em 3 minutos**; as etapas do roteiro viram refinamento |
| 28 | **Psicólogo** | A continuidade é a melhor mecânica de hábito do produto — mas o objeto estava errado | §12 — a cadência mensal se pendura na poupança realizada (B2), não no orçamento |
| 29 | **Psicólogo** | Saída para o humano no pico de motivação | §12.3 |
| 30 | **Psicólogo** | Caminho de volta ao lado de todo alerta negativo | §9.9 — invariante de tela, herdado da selada §10.3 |
| 31 | **Painel** | Cinco riscos éticos a travar por escrito | §15 |

### 0.2 As dezesseis decisões do lote B

| Decisão | Onde |
|---|---|
| **B1** Complexidade progressiva: duas dimensões de granularidade, ambas de primeira classe | §5.1 e §5.2 |
| **B2** A cadência mensal é orçado × realizado sobre a **poupança**; projetar é trabalho de reunião | §12 |
| **B3** Ordem do cadastro de renda: classe → natureza → periodicidade → valor | §4.1 |
| **B4** Alienar o ativo **encerra** a renda lastreada nele — invariante, não aviso | §4.7 |
| **B5** Duas ferramentas, uma convergência na evolução patrimonial | §2 |
| **B6** Cadastro de renda é modal; na régua a renda é **uma** variável | §4.2 |
| **B7** A terceira categoria chama-se **Futuro e Sonhos** | §5.1 |
| **B8** O roteiro canônico em sete etapas | §3.2 |
| **B9** Esvaziar a caixinha é o padrão; o saque vira diagnóstico | §6.3 e §6.4 |
| **B10** Taxa anual é canônica, mensal é apoio: `4,91% a.a. (~0,40% a.m.)` | §6.5 |
| **B11** A taxa é travada por suitability; autodeclarado ≠ suitability | §11.2 |
| **B12** O questionário de suitability é outra ferramenta a incorporar | §11.2 e §17 |
| **B13** Área de admin: as taxas são parâmetro da casa, versionado | §11.1 |
| **B14** Tetos: conservador 6% · moderado 7,5% · arrojado 9% | §11.1 |
| **B15** Mudança de parâmetro → cliente notificado e convidado; plano congelado por versão | §11.3 |
| **B16** `{consultor}`; perfil mais agressivo é **Arrojado**; texto canônico da notificação | §11.3 e §14 |

---

## 1. O que esta ferramenta é

Uma tela onde o cliente vê **o que acontece com o patrimônio dele ao longo da vida** e mexe
nisso. Horizonte de 80–90 anos. Projeção pura — não tem realizado, não tem extrato, não
classifica transação. Erra por premissa, não por classificação.

O que ela responde, nesta ordem de importância:

1. *"O que vai acontecer com o meu dinheiro?"* — a curva.
2. *"O que acontece nos próximos meses?"* — a janela curta, que é onde a vida acontece.
3. *"Cada coisa que eu separei dá conta do que ela tem que pagar?"* — o veredito por caixa (§6.4).
4. *"Se eu mudar isso, o que muda?"* — a simulação (§9.8).

Não é um app de acompanhamento. É consultada em reunião, em revisão e quando o cliente
quiser olhar — não todo mês por obrigação (B2).

---

## 2. A fronteira com o Orçamento Familiar (B5)

São **duas ferramentas**, confirmado por `duas-ferramentas.md`, e elas **convergem** na
evolução patrimonial — que é esta tela.

| | Meu Orçamento | Projeção de Vida |
|---|---|---|
| Horizonte | 24 meses | 80–90 anos |
| Tem realizado? | Sim (manual ou Open Finance) | Não |
| Unidade | categoria e subcategoria | evento e caixa |
| Erra por | classificação | premissa |

**O elo é um só, e tem sentido único:**

```
Orçamento Familiar                          Projeção de Vida
──────────────────                          ────────────────
Renda consolidada
  ├─ Fixos            (≈50%)
  ├─ Ajustáveis       (≈30%)
  └─ Futuro e Sonhos  (≥20%)  ───────────►  aporte mensal dos meses 1–24
                                              ├─ Reserva de emergência
                                              ├─ Compromissos
                                              ├─ Objetivos
                                              └─ Liberdade financeira
```

- **Até o mês 24:** o aporte vem do Orçamento, com proveniência alta (veio de detalhe, e
  possivelmente de realizado).
- **Do mês 25 em diante:** projeção pura, regida pela regra de continuidade (§5.4).

Esse é o degrau de fidelidade que a v2 queria desenhar na régua — agora com uma fronteira
**real** em vez de arbitrária. Na tela, a fronteira é visível (§9.4).

**Quando o Orçamento não existe:** a Projeção funciona sozinha, com o aporte declarado no
rascunho (§3.1). O que ela **não** faz é fingir precisão de orçamento: os meses 1–24 sem
Orçamento têm a mesma textura dos meses 25+ (§9.4).

---

## 3. Como isto é construído — rascunho primeiro, roteiro depois

### 3.1 Passo zero · O rascunho em 3 minutos

> Correção do psicólogo na rodada 07: o defeito da v1 não era **estar preenchida**. Era estar
> preenchida com números de outra pessoa, sem autoria e sem proveniência visível. A cura não é
> a tela em branco — tela em branco é pior.

Antes de qualquer etapa do roteiro, quatro perguntas. Só quatro, e todas são coisas que **só o
cliente sabe**:

| Pergunta | Vira |
|---|---|
| "Quanto entra na sua casa por mês, somando todo mundo?" | renda consolidada inicial |
| "Quanto sai, por alto?" | despesa do mês-base |
| "Quanto você já tem guardado?" | saldo inicial do financeiro |
| "Com que idade você quer poder parar?" | horizonte da fase de acumulação |

E a curva dele aparece. Da quarta resposta até o gráfico não há mais nenhuma pergunta.

**O que o sistema faz com isso, e o que ele não faz:**

- **Faz:** desenha a curva, propõe uma repartição inicial do que está guardado, e **marca cada
  proposta como proposta** ("esta divisão é uma sugestão — arraste para mudar").
- **Não faz:** não preenche número que o cliente não deu. Um dado que falta é uma **pergunta**,
  nunca um valor de fábrica (§15.1).

A diferença é a que o painel travou: derivar da declaração do cliente, com proveniência visível
e reversível, é trabalho. Preencher com a média de outra família é invenção.

Depois disso, **tudo o que o roteiro chama de etapa é refinamento de algo que já é dele.**
Refinar é editar, e editar tem o efeito dotação a favor; autorar do zero tem a tela em branco
contra.

**Quem faz:** o cliente sozinho, em qualquer hora, no celular. Sem consultor, sem reunião.

### 3.2 O roteiro completo — as sete etapas do Nélio (B8)

Trabalho de reunião, densidade de planilha, feito pelo consultor com o cliente (§10).

| Etapa | O quê | Onde está especificado |
|---|---|---|
| 1 | **Orçamento detalhado**, 24 meses, estrutura de planilha, com pontuais (Natal, seguro do carro) | §5.1, §5.2 e a ferramenta de Orçamento |
| 2 | **Mudanças de longo prazo**, além dos 24 meses ("no terceiro ano, mais R$ 2.000 de escola") | §5.3 |
| 3 | **Patrimônio** — listar bens, participações e financeiro; repartir o financeiro em caixas | §6.1 e §6.2 |
| 4 | **Eventos financeiros da vida** — usar os compromissos, converter bem em dinheiro, resgatar | §6.3 e §13.4 |
| 5 | **Rentabilidade por caixa** — alvo configurável, 3% a 9% real líquido | §6.5 e §11 |
| 6 | **Perpetuidade** — a partir de uma data, saca só o rendimento | §6.6 |
| 7 | **A tela** — navegar, enxergar, clicar, alterar | §9 |

`ILUSTRATIVO` — a repartição da etapa 3 na voz do Nélio: R$ 500.000 de financeiro →
Reserva R$ 100.000 · Compromissos R$ 30.000 · Compra da casa R$ 170.000 · Liberdade
financeira R$ 200.000. Soma R$ 500.000 ✓. A soma **tem** de bater, e a tela mostra o que
falta repartir enquanto não bate.

### 3.3 A fidelidade cai, e isso aparece

A precisão decresce da etapa 1 para a etapa 2, e da 2 para o resto. Isso não é defeito —
é a natureza da coisa, e a tela declara (§9.4). O que seria defeito é a projeção fingir
precisão uniforme por 90 anos.

---

## 4. Renda

### 4.1 A ordem do cadastro (B3)

Toda renda, sem exceção, é cadastrada nesta ordem:

1. **Passiva ou ativa** — na tela: *"você precisa trabalhar para receber isso?"*
2. Se ativa → **natureza** (tipo de trabalho)
3. **Periodicidade**
4. **Valor esperado** (ou faixa — §4.5)

Uma família pode ter **doze rendas** cadastradas. O cadastro aguenta doze; a tela não muda de
forma por causa disso (§4.2).

### 4.2 Cadastro é modal; na régua, a renda é UMA variável (B6)

Isto **dissolve** o problema de layout que o UX levantou com a conta de 390px, em vez de
mitigá-lo:

1. "Adicionar renda" → abre **modal**, preenche tudo, salva.
2. Aquele valor passa a compor a **renda da família — uma linha só** na régua do tempo.
3. "Detalhar rendas" abre a lista com o nome de cada fonte; cada uma é clicável.

Doze rendas cadastradas continuam sendo **uma** linha. A faixa-por-renda proposta na v2 **sai
da especificação** — era ela que produzia os 24px por pista.

> **Racional da mudança de opinião:** a v2 tratou "editor de vídeo" como *faixas paralelas*.
> O que o Nélio pediu de editor de vídeo foi a **navegação** (zoom, pan, arrastar), não a
> pilha de trilhas. O verbo de trilha que sobrevive é **mutar** (§10.3), e ele opera sobre a
> lista de rendas, não sobre pistas empilhadas no gráfico.

### 4.3 Ativa × passiva não é binário (CFP)

O binário quebra no caso mais comum da carteira da Nord: o pró-labore de uma empresa que o
cliente é dono e opera. Ele depende do trabalho **e** do ativo. Marcá-lo "ativo" perde o
lastro; marcá-lo "passivo" perde que ele acaba quando o dono para.

Duas dimensões **independentes**, cada uma com uma pergunta em português na tela:

| Dimensão | Pergunta na tela | Valores |
|---|---|---|
| `dependenciaDoTrabalho` | *"Se você parar de trabalhar, o que acontece com essa renda?"* | `acaba` · `diminui` (+ quanto continua) · `continua` |
| `ativoLastroId` | *"Essa renda vem de algum bem seu?"* | id do ativo, ou nenhum |

Casos que passam a caber:

| Renda | Dependência | Lastro |
|---|---|---|
| Salário CLT | `acaba` | — |
| Aluguel | `continua` | imóvel |
| Pró-labore da ótica | `acaba` | ótica |
| Distribuição de lucros de empresa com gestor | `diminui` | ótica |
| Aposentadoria do INSS | `continua` | — |

"Renda ativa" continua existindo como **rótulo derivado** (`dependenciaDoTrabalho ≠ continua`)
para uso interno. Na tela do cliente ele não aparece (§14).

### 4.4 Periodicidade — o clipe, e o que a natureza semeia

Uma renda trimestral **não** vira valor ÷ 3. Ela cai no mês em que cai, e o fluxo de caixa
mostra o soluço — é justamente nos meses sem ela que o orçamento aperta. Achatar em média
esconde o problema que a ferramenta existe para revelar.

> **Atenção, e isto precisa estar escrito para ninguém "consertar":** no **Orçamento**, o micro
> converte para base mensal (diário útil × 22, semanal × 4,3, anual ÷ 12). Aqui, **não**. Duas
> regras opostas, cada uma certa no seu lugar. A do Orçamento é sobre estimar um gasto difícil;
> a daqui é sobre quando o dinheiro entra na conta.

**A natureza semeia clipes automaticamente** (ganho apontado pelo CFP): escolher **CLT** cria,
sem digitação, os clipes de **13º** e de **férias** — a periodicidade não-mensal mais comum do
país, caindo de graça. O cliente vê os clipes aparecerem e pode apagá-los.

⚠ **LACUNA:** a lista fechada de naturezas e o que cada uma dispara (FGTS, INSS, 13º, férias,
regime tributário) é conteúdo da consultoria. A estrutura está aqui; o conteúdo, não (§17).
Enquanto a lista não vier, o campo aceita as quatro naturezas já citadas pelo Nélio (Registrado
CLT · Profissional liberal · Empresário · Estagiário) e um campo aberto marcado `estimado`.

### 4.5 Faixa mínimo–máximo (Cliente)

Renda que varia aceita **de quanto até quanto**, em vez de um número. Coerente com A4/A5 do
lote A, que tirou os chips de valor do exame pelo mesmo motivo: atalho de valor induz resposta
irreal.

Na tela, a faixa vira **banda**:

- A linha da projeção é desenhada pelo **piso** da faixa. É o padrão fiduciário — prudência é o
  default, otimismo é escolha explícita.
- A banda até o teto aparece em tom mais leve, rotulada *"projetado pelo menor valor da sua
  faixa"*.

Isto também atende o Cliente na rodada 06 (*"não assino uma projeção de 46 anos com uma linha
só, sem faixa"*) sem reabrir a alavanca de rentabilidade que o CFP proibiu: **faixa declarada é
dado do cliente; taxa é premissa da casa** (§11). Coisas diferentes.

### 4.6 `fim: null` deixa de ser o padrão (Cliente — veto)

Na v2, uma renda ativa sem data de fim seguia até o fim da projeção. Um salário CLT rodando até
os 100 anos é uma mentira de décadas, e era o **comportamento padrão** — o pior lugar para uma
mentira estar.

**Regra nova:**

- Renda com `dependenciaDoTrabalho = acaba` ou `diminui` **exige** um fim declarado. O cadastro
  não fecha sem ele.
- O fim é declarado de uma das três formas: **idade** ("até eu fazer 65"), **data**, ou **evento**
  ("quando eu vender a ótica" — §4.7).
- Renda com `dependenciaDoTrabalho = continua` pode não ter fim, porque aí é verdade.
- Enquanto o fim não for declarado, a projeção daquela renda é `indeterminado` (§5.6) — nunca
  "para sempre", nunca zero.

A idade em que o cliente quer parar já foi perguntada no rascunho (§3.1), então na maior parte
dos casos o campo vem **pré-proposto com o número que ele mesmo deu** — proposta visível e
editável, não default oculto.

### 4.7 Alienar o ativo encerra a renda (B4 — invariante)

> *"Você tem razão sobre o encerramento das rendas referentes a ativos que são encerrados. De
> fato, a renda passiva referente àquele ativo também cessa."*

**Invariante do motor, não aviso de tela:**

```
para todo evento que aliena o ativo A no mês m:
    para toda renda R com ativoLastroId = A:  R.fim = m
```

Vender a ótica e continuar recebendo pró-labore dela; vender o imóvel e seguir recebendo
aluguel até 2106 — é a mesma família do defeito que o Engenheiro pegou na rodada 06
(`dividirJanelas` inventando R$ 119.818 do nada). A diferença é que aqui era o **padrão**.

Vai para a bancada como teste de invariante (§15): *nenhuma renda sobrevive ao ativo que a
lastreia.*

**Alienação parcial:** vender 40% da empresa reduz a renda lastreada em 40% por padrão, com o
percentual editável e marcado `estimado` — porque a relação entre participação e distribuição
raramente é linear, e fingir que é seria inventar.

---

## 5. Despesa, orçamento e a regra de continuidade

### 5.1 As três categorias (B1, B7)

**Despesas fixas · Ajustáveis · Futuro e Sonhos.** Nome decidido em B7 — "Investimentos" sai.
As mesmas três da especificação de orçamento do Nélio, e a terceira é a fronteira entre as duas
ferramentas (§2).

Referências de saúde — fixos ≤50%, ajustáveis ≤30%, Futuro e Sonhos ≥20% — são **parâmetro da
casa** (§11.1), não número digitado na tela. Ultrapassar dispara alerta educativo **sem
bloquear** no macro; no micro, a soma das subcategorias não pode estourar o teto da própria
categoria (assimetria deliberada, herdada da spec de orçamento: o macro é escolha de vida, o
micro é aritmética).

### 5.2 Duas dimensões de granularidade, independentes (B1)

Ambas de primeira classe. **O nível simples não é uma versão incompleta do detalhado.**

| | Macro | Detalhado |
|---|---|---|
| **Categoria** | "R$ 8.000 de fixas, R$ 6.000 de ajustáveis, R$ 2.000 de Futuro e Sonhos" | quebra as fixas em condomínio, IPTU, parcela do carro, plano de saúde… |
| **Tempo** | "todo mês eu ganho 15 e gasto 12" | "em agosto de 2026 eu vou gastar 12.350"; mudanças pontuais; provisões (Natal, R$ 500 de presente) |

Consequências que isto **derruba**, e que precisam ficar derrubadas:

- **Nenhuma barra de progresso** trata o macro como "30% preenchido". O cliente que ficou no
  macro está com o cadastro **dele**.
- **Nenhum wizard obrigatório de quatro passos.** As etapas do §3.2 são um roteiro de reunião,
  não um portão.
- **Nenhum badge, selo ou nudge** por "completar o orçamento". Detalhar é oferta, não dívida.

### 5.3 Mudanças, não janelas

O orçamento de longo prazo é uma **lista de mudanças**. Entre duas mudanças, repete.

Foi o achado mais elogiado da v2 — o Redator chamou de "o melhor achado do documento" e o CFP
reconheceu que "transforma 1.080 células numa lista de mudanças". Fica, com o invariante
reescrito (§5.4).

```
MudancaDeOrcamento {
  id, mes, rotulo,
  alvo: 'renda' | 'despesa',
  rendaId?, categoria?,           // fixas | ajustaveis | futuroESonhos
  tipo: 'inicia' | 'encerra' | 'altera',
  valor, valorNovo?,
  motivo,                          // "nasceu a filha", "quitou o carro", "novo emprego"
  proveniencia
}
```

`ILUSTRATIVO` — a etapa 2 na voz do Nélio: *"no terceiro ano eu vou passar a ter mais uma
despesa de R$ 2.000 com a escola do meu filho, e a minha receita vai aumentar mais R$ 5.000"* →
duas mudanças no mês 25. *"A partir do sétimo ano fica tudo igual"* → nenhuma mudança dali em
diante, e a continuidade cobre o resto da vida.

> O Nélio nomeou o motivo disso funcionar: *"por conveniência e preguiça"*. É exatamente o
> diagnóstico do psicólogo — a continuidade é uma alavanca de **ability**, e é assim que ela
> deve ser vendida na tela: *"o resto segue igual — mude só o que muda"*.

### 5.4 A regra de continuidade, reescrita sobre o ESTADO (Engenheiro — bloqueante)

A v2 escreveu o invariante sobre o **resultado**, e por isso ele era falso dentro do próprio
documento:

- §3 da v2: *"para qualquer mês `m` sem evento, receitas, despesas e o resultado do mês são
  **idênticos** ao mês `m−1`"*
- §2 da v2: *"uma renda trimestral não vira valor ÷ 3. Ela cai no mês em que cai"*

As duas não podem ser verdade juntas: abril não é idêntico a março quando as aulas são
trimestrais.

**O invariante correto é sobre o estado. As regras vigentes é que se repetem; os valores
realizados derivam delas aplicadas ao calendário.**

```
estado(m)   =  estado(m−1)  com as mudanças de mês m aplicadas
resultado(m) =  resolve( estado(m), calendario(m) )
```

- `estado` = o conjunto de rendas vigentes (valor, periodicidade, mês-âncora, fim), despesas
  vigentes por categoria, e taxas vigentes por caixa.
- `resolve` = aplica o calendário: uma renda trimestral com âncora em março **integra o estado
  todos os meses** e **realiza** em março, junho, setembro e dezembro.

**Invariante da bancada (§15):**
`estado(m) === estado(m−1)` sempre que não há mudança em `m`.
**Nunca** `resultado(m) === resultado(m−1)`.

Isto reconcilia as duas frases: o estado de abril é idêntico ao de março; o resultado, não.

### 5.5 O mês-base é declarado — dezembro não se replica por 89 anos (Engenheiro)

Se o cliente preenche 24 meses precisos — com 13º, presentes de Natal, IPVA em janeiro — e
para, "repete o mês anterior" propaga a anomalia do mês 24 pela vida inteira.

**Regra:**

1. A continuidade não parte do mês 24. Parte de um **mês-base declarado** (`mesBase`) —
   na tela, *"o seu mês comum"*.
2. O sistema **propõe** o mês-base a partir dos 24 meses, usando **só o componente recorrente**:
   despesas fixas e ajustáveis que se repetem. **Pontuais e parceladas nunca entram na
   proposta** — por definição elas acontecem no mês delas e não alteram os demais.
3. A proposta aparece com o que ficou de fora listado: *"não incluí: IPVA (janeiro), presentes
   (dezembro), 5 parcelas da viagem (março a julho)"*. O cliente confirma ou edita.
4. **Sem mês-base confirmado, o mês 25 em diante é `indeterminado`** — nunca a repetição de
   dezembro, nunca zero.

> Por que isto não fere "pergunta sim, número não" (§15.1): a proposta é derivada **do dado do
> próprio cliente**, mostra o que excluiu, e não grava sem confirmação. O que a regra ética
> proíbe é preencher com número que ninguém declarou — a média de outra família, o gasto típico
> de uma faixa de renda. Derivar da declaração dele, com o critério visível e reversível, é
> trabalho; importar de uma média é invenção.

### 5.6 `indeterminado` não vira zero (Engenheiro)

Unificado com a especificação selada, que já usa **`indeterminado`** no motor de elegibilidade
(§6.4 da selada). O motor de projeção hoje devolve `achou: false → natureza: 'semOrcamento'`;
passa a devolver `indeterminado`, uma palavra só para a mesma coisa em todo o produto.

**Regras de propagação:**

| Situação | Resultado |
|---|---|
| Mês sem estado conhecido | `indeterminado` |
| `indeterminado` propagado por continuidade | `indeterminado` — nunca zero |
| Soma que contém `indeterminado` | `indeterminado` |
| Comparação numérica com `indeterminado` | `indeterminado` (lógica de três valores) |
| Exibição de `indeterminado` | lacuna cinza + *"ainda não sabemos quanto entra e quanto sai neste mês"* |

Sem isto, o estado vazio se propagaria por continuidade como se fosse zero declarado —
regressão direta do inviolável *"silêncio nunca é zero"* (contexto §9.4). É também a mesma
família de `brl(NaN) → —` fechada na rodada 06.

---

## 6. Patrimônio

### 6.1 Três camadas (herdadas da rodada 06)

`financeiro` · `bens` · `participacoes`. Bens e participações são **item a item**, nunca um
bloco só — confirmado por B8, em que o carro de R$ 150 mil vira dinheiro no mês 24 (é uma
`transferencia` de `bens` para `financeiro`, a mesma mecânica da ótica do Ricardo).

### 6.2 Repartir o financeiro em caixas

O financeiro se reparte em caixas com quatro naturezas: `reserva` · `compromisso` ·
`objetivo` · `liberdade`. Cada caixa tem a sua própria rentabilidade-alvo (§6.5).

A soma das caixas **tem** de bater com o financeiro total. Enquanto não bate, a tela mostra o
que falta repartir — não deixa gravar um total inconsistente e não completa sozinha.

### 6.3 Caixa de compromisso ganha meta e prazo (B9)

Dois campos novos, e eles são o que faltava para a caixa deixar de ser um número solto:

```
custoEsperado    // quanto o compromisso vai custar
dataEsperada     // quando
```

Isto fecha o bloqueante que o Cliente levantou na rodada 07 — *"Formação dos filhos:
R$ 111.308. Isso é suficiente? Não faço ideia"* — sem inventar mecanismo nenhum:

| Peça | De onde vem |
|---|---|
| **Prazo** | a data do evento |
| **Meta** | `custoEsperado` |
| **Veredito** | saldo projetado na data − meta |
| **Correção** | volta à repartição inicial |

### 6.4 O saque como diagnóstico — o laço que se fecha (B9)

> *"O ideal é esvaziar a caixinha e o cliente vê o quanto ele teria naquele momento. Inclusive,
> ele pode descobrir que o valor separado por compromisso está abaixo. 30 mil virariam 32, e meu
> compromisso custa 35. Então tenho que voltar no patrimônio inicial e aumentar o valor
> destinado para aquele compromisso."*

O evento não só gasta — ele **testa se a caixa foi dimensionada certo**.

```
reparte o patrimônio  →  marca o evento  →  o motor projeta o saldo naquele mês
        ↑                                              ↓
        └──── "faltam R$ 3.000" ←──── compara com o custo do compromisso
```

**Duas formas declaradas de saque, e o padrão é a primeira:**

| Na tela | Interno | Quando |
|---|---|---|
| **"usar o que estiver na caixa"** | `esvazia: true` | padrão |
| "usar R$ X" | valor fixo | quando o cliente sabe o valor exato |

O motor já tem `esvazia: true` no `saquePontual`. O que falta é a **interface mostrar o
confronto** e **oferecer o caminho de volta** — que é literalmente o *"caminho de volta na
mesma tela, com igual peso visual"* que a especificação selada já exige (§10.3).

`ILUSTRATIVO` — o card do veredito:

> **Compromissos · usar em 7 meses**
> Você separou R$ 30.000. Projetado para lá: **R$ 32.100**.
> O compromisso custa **R$ 35.000**. → **Faltam R$ 2.900.**
> [ Aumentar o que está separado ] [ Rever o custo do compromisso ]

Os dois botões existem porque a correção pode ser dos dois lados. O alerta nunca aparece sem
eles (§9.9).

### 6.5 Taxas — anual é a canônica, mensal é o apoio (B10)

**Formato oficial, em toda a plataforma** — caixa, perpetuidade, teste de estresse, legenda do
gráfico:

> 4,91% a.a. *(~0,40% a.m.)*

O parêntese em corpo menor e itálico. **Entrada de dado é sempre anual**; a equivalência mensal
é derivada, nunca digitada — senão viram duas fontes da verdade para o mesmo número.

Todas as taxas são **reais e líquidas**: já descontadas de inflação e de imposto. Decidido em
B8, onde o Nélio disse "retorno real líquido" duas vezes. Fecha a cobrança do CFP sobre bruto ×
líquido, e implica uma nota permanente na tela: *"os valores estão em dinheiro de hoje"*.

Faixa configurável: **3% a 9%**, cortada no topo pelo perfil (§11.1).

### 6.6 Perpetuidade

A partir de uma data, saca só o rendimento e não toca no principal. Na tela: **"vive do
rendimento"** (vocabulário fechado na rodada 06).

Herdado da rodada 06 e continua valendo: a perpetuidade saca o que a vida custa, **limitado ao
que a carteira rendeu**; se a vida custa mais que o rendimento, o alerta diz que manter aquilo
significa consumir o principal — e diz quanto tempo dura.

`ILUSTRATIVO` — B8 etapa 6: perpetuidade a partir de 2050, a 0,40% a.m. → na tela,
**4,91% a.a. *(~0,40% a.m.)***, dentro da faixa e abaixo do teto de todos os perfis.

### 6.7 Passivo como camada de primeira classe (CFP — aberto desde a rodada 06)

Hoje o imóvel do Ricardo entra líquido (R$ 1.750.000 − R$ 320.000 de saldo devedor) com uma
nota admitindo que *"a prestação ainda não está no fluxo de caixa e a amortização não está na
projeção"*. Duas coisas erradas ao mesmo tempo: uma despesa real fora do fluxo, e um
patrimônio que cresce sem que nada explique.

```
Passivo {
  id, nome, ativoVinculadoId?,
  saldoDevedor, taxaJurosAnual,
  valorParcela, parcelasRestantes,
  sistema: 'price' | 'sac' | 'declarado'
}
```

Três consequências, todas boas:

1. A **parcela entra no fluxo de caixa** como despesa fixa, e **termina sozinha** na última
   parcela. É exatamente o *"mês que vem eu deixo de pagar a parcela do tablet"* de B1 — cai
   de graça, sem o cliente cadastrar uma mudança.
2. A **amortização reduz o saldo devedor** mês a mês, e o patrimônio líquido cresce por um
   motivo visível.
3. O **quadro de amortização** vira uma resposta que o cliente faz e ninguém responde hoje:
   *"vale a pena quitar antes?"* — a tela mostra os dois caminhos lado a lado.

⚠ **LACUNA:** a política da consultoria sobre quitação antecipada × investir a diferença é
recomendação financeira e não é inventada aqui (§17). A **mecânica** está especificada; a
**recomendação**, não.

---

## 7. A meta da liberdade financeira — corrigida (CFP)

A v2 escreveu que a soma das rendas **ativas** é a meta que a liberdade financeira tem de
cobrir. **Está errado**, e erra nos dois sentidos: superestima para quem poupa muito (parte da
renda ativa nunca virou consumo) e subestima para quem tem despesa crescente na velhice.

**A meta é o custo de vida projetado na fase futura**, líquido de imposto:

```
necessidadeMensal(m) =  despesaProjetada(m)          // já inclui as que nascem
                                                      // e exclui as que morrem com o trabalho
                      − rendasQuePersistem(m)         // líquidas de imposto

metaDePatrimonio     =  valorPresente( necessidadeMensal, taxaDaCaixa, horizonte )
```

O motor já tem `pvNecessario(pmt, i, n)` desde a rodada 06 — a pergunta inversa que derivou a
ponte de R$ 873.159 em vez de cravá-la. É a mesma função; muda o que se pergunta a ela.

**A soma das rendas ativas continua na tela, com outro nome e outra função:**

> **"Quanto da sua renda depende de você trabalhar"** — R$ X de R$ Y (Z%).

É indicador de dependência do capital humano, **insumo da vertical de Riscos**, não da de
Aposentadoria. E é o número que dá sentido ao ramo do §8: quanto maior essa fatia, mais a
família depende da pessoa continuar de pé.

⚠ **LACUNA:** as despesas que nascem e morrem com a aposentadoria (saúde sobe, transporte
para o trabalho some, alimentação muda) e a **inflação real específica de saúde** são premissas
da consultoria (§11.1 e §17). Enquanto não vierem, a despesa da fase futura é a declarada pelo
cliente, marcada `estimado`, e a tela diz que não aplicou inflação diferenciada.

---

## 8. O outro galho — "E se eu faltar" (Cliente)

O Cliente pediu na rodada 06 e repetiu: *"e se eu morrer?"*. O CFP pediu gestão de riscos
(morte/invalidez) dentro do motor. É o mesmo pedido.

**É um ramo da mesma projeção, não outra ferramenta.** Recalcula o mesmo cenário com três
mudanças:

1. As rendas com `dependenciaDoTrabalho = acaba` ou `diminui` da pessoa que falta **encerram**
   no mês do evento (§4.6 e §4.7 já dão isso de graça).
2. O capital segurado entra como **aporte pontual** na data.
3. As despesas mudam: as que morrem com a pessoa saem; as que nascem (inventário, ITCMD)
   entram.

**A resposta é uma só, e é em tempo de vida:**

> Sua família mantém o padrão de vida por **{N} anos**.

**Guardas obrigatórias, herdadas da §6.5 da especificação selada:**

- O ramo é **sempre iniciado pelo cliente**. Nunca é notificação, nunca é push, nunca abre
  sozinho, nunca aparece como alerta na home.
- **Proibido usar medo da morte como alavanca** (*mortality salience*). O resultado é enquadrado
  em autonomia ganha — *"de 11 meses para 8 anos"* — nunca no evento.
- O custo do seguro pode ser apresentado como perda **dosada**; o impacto é **sempre**
  gain-frame.

⚠ **LACUNA:** ITCMD (alíquota por estado), custos de inventário e prazos são conteúdo
tributário/jurídico. A linha existe na projeção com **valor não apurado** e diz isso — mesma
mecânica do IR sobre a venda da ótica na rodada 06. **Nunca** um número líquido silencioso.

---

## 9. A tela — uma só, especificada

> O UX vetou a v2 por não especificar **uma única tela**. Esta seção existe para ser
> implementável sem inventar nada, e para poder ser atacada linha a linha.

### 9.1 Anatomia e orçamento de pixels (390 × 844)

```
┌────────────────────────────────────────────────────────┐
│ mês em foco · idade · saldo          [2a][10a][vida][⌂]│  56px
├────────────────────────────────────────────────────────┤
│                                                        │
│  PALCO 1 · Patrimônio                                  │  330px
│  área empilhada por caixa, camadas na ordem            │
│  reserva → compromisso → objetivo → liberdade → bens   │
│                                                        │
├────────────────────────────────────────────────────────┤
│  trilho de eventos  ▲   ▽      ◆         ○             │  44px
├────────────────────────────────────────────────────────┤
│  PALCO 2 · Caixa do mês                                │  190px
│  entra · sai · sobra                                   │
├────────────────────────────────────────────────────────┤
│  nesta janela: +R$ 102.359 · +2,0%                     │  56px
├────────────────────────────────────────────────────────┤
│  minimapa da vida inteira                              │  40px
└────────────────────────────────────────────────────────┘
   + barra de sistema e safe area                          ~128px
                                                    total  844px
```

Dois palcos e um trilho — **exatamente o que B8 etapa 7 pediu**: *"em cima a evolução do
patrimônio, embaixo os valores de aportes ou saques, levando em conta o orçamento projetado"*.

O trilho de eventos é **um só**, colado ao eixo do tempo compartilhado, com 44px de altura —
o mínimo de alvo de toque. Não há pista por renda (§4.2), não há pista por caixinha: é a
supressão da fonte do problema de densidade, não uma acomodação dele.

**Desktop:** duas colunas — palco e leitura da janela à esquerda, painel de detalhe/edição à
direita, sem sobrepor o gráfico. Herdado da rodada 06.

### 9.2 O eixo de valor participa do zoom

Bloqueante do UX na rodada 06, fechado, e que **continua valendo**: abaixo de 36 meses o eixo
de valor **corta a base**, com o corte **declarado na tela**. Sem isso, aproximar produz "uma
laje" — a variação de 7 meses some dentro de uma escala de 46 anos.

### 9.3 Navegação — as âncoras mudam largura, não lugar

**O erro da v2:** as três âncoras eram "a partir de hoje". Estou em 2041 examinando a
travessia, toco em "próximos 10 anos" e sou teletransportado para 2026. Perdi o lugar.

**Regra:**

| Controle | O que faz |
|---|---|
| `2 anos` · `10 anos` · `vida toda` | mudam a **largura** da janela, **mantendo o mês em foco parado** |
| `⌂ hoje` | botão separado, o único que recentra em hoje |
| pinça / roda | zoom contínuo, **de 6 meses ao horizonte inteiro** |
| arrastar | pan horizontal, com inércia por velocidade |

**Os três botões são atalhos, não os estados do zoom.** É assim que a visão de 7 meses — que o
UX chamou de prova do diferencial e disse que a v2 apagou — continua alcançável: por gesto, a
qualquer momento, com o eixo de valor cortando a base (§9.2) e a leitura da janela respondendo
o que acontece nela (§9.4).

> **Arbitragem registrada:** o Nélio pediu três estados (A20); o UX exigiu a visão curta. Os
> três botões ficam como o Nélio pediu, e o zoom contínuo fica como o UX exigiu. Não há
> conflito real — um é atalho, o outro é capacidade.

Herdado e mantido da rodada 06: `touch-action: pan-y`, roda que só toma a página quando o gesto
é de zoom, transições animadas, pinça pela hipotenusa, toque para inspecionar.

### 9.4 A leitura da janela, e a textura do tempo

**A leitura da janela** responde *"o que acontece nos próximos 7 meses?"* com uma frase:

> nesta janela: **+R$ 102.359 · +2,0%**

Sem ela, aproximar não informa. É o que transforma zoom em resposta.

**A textura declara a fidelidade** (§3.3), e agora com fronteiras reais em vez de arbitrárias:

| Trecho | Textura | Legenda |
|---|---|---|
| Meses 1–24 **com Orçamento** | sólido | "do seu orçamento detalhado" |
| Meses 1–24 **sem Orçamento** | médio | "do que você declarou" |
| Depois da última mudança declarada | hachurado | "daqui em diante, segue igual" |
| Qualquer trecho `indeterminado` | cinza vazado | "ainda não sabemos" |

### 9.5 O que colapsa, e a regra de overflow

O gráfico empilha caixas. Uma família pode ter muitas.

1. Até **6 faixas** visíveis no celular, **10** no desktop.
2. Acima disso, colapsa **por camada primeiro** (financeiro / bens / participações), depois por
   natureza (reserva, compromisso, objetivo, liberdade).
3. O excedente vira **"Outras (n)"**, com a mesma cor da camada e um toque para expandir.
4. A **legenda é clicável** e responde *"quando este objetivo termina"*, destacando a faixa no
   gráfico. Herdado da rodada 06.

### 9.6 Scroll vertical × pan horizontal

Conflito real que a v2 não resolveu.

- Dentro do palco: **o gesto horizontal é pan, o vertical é da página** (`touch-action: pan-y`,
  já implementado).
- **O palco não rola verticalmente.** O que não cabe colapsa (§9.5); nunca some.
- Quando o cliente simula, o **palco fica fixo no topo** no celular e os controles rolam por
  baixo — herdado da rodada 06, e é o que impede simular sem ver o efeito.

### 9.7 Crosshair, tooltip e rótulo dentro da banda

- **Toque/hover** mostra a crosshair com o mês, e o **tooltip traz o valor de cada faixa
  naquele mês**, não só o total.
- O **rótulo da faixa vive dentro da banda** quando ela tem altura para isso; quando não tem,
  vai para a legenda. Nunca uma legenda solta obrigando o olho a fazer o pareamento por cor.
- No celular o tooltip é **fixo no topo do palco**, não flutuante sob o dedo.

### 9.8 Iconografia — forma e preenchimento, cor redundante

Pedido do UX na rodada 06, agora especificado. **A cor nunca é o único portador de
significado** (AA, e daltonismo).

| Dimensão | Codifica | Vocabulário |
|---|---|---|
| **Forma** | direção | ▲ entra · ▽ sai · ◆ converte/transfere · ○ muda premissa |
| **Preenchimento** | cadência | sólido = pontual · vazado = contínuo ou janela |
| **Cor** | reforço redundante | herdada da camada/caixa |

Quatro formas × dois preenchimentos = os oito tipos de evento do registro (§13.4), sem
ambiguidade e sem depender de cor.

### 9.9 Simulação — e o invariante do caminho de volta

- **Alavanca de mão única:** a rentabilidade **só desce**. Dá para testar se o plano aguenta
  render menos; não dá para fazê-lo fechar rendendo mais. *Prudência é simulável; otimismo não
  é.* (Arbitragem Cliente × CFP da rodada 06, mantida — e agora com o teto por perfil por cima,
  §11.1.)
- **Alavanca de aporte** tem alcance: morre no fim da fase, e só mexe na folga sem destino —
  nunca no custo de vida declarado.
- **Achado não é erro:** quando a simulação revela algo, ele tem **cor própria** (nem verde nem
  laranja) e a consequência aparece **ao lado do controle**, não escondida no gráfico.
- **Desfazer** sempre disponível. Simular nunca grava.

**Invariante de tela, herdado da especificação selada §10.3 e sem exceção:**

> **Todo alerta negativo aparece com o caminho de volta na mesma tela e com igual peso visual.**

Vale para o veredito da caixa (§6.4), para o mês descoberto, para a perpetuidade que consome
principal, para a premissa acima do teto (§11.3) e para o ramo do §8. Um alerta sem caminho de
volta é um bug de especificação, não uma escolha de copy.

### 9.10 Tela cheia, e a porta de saída

Sai do shell com bottom nav (A20). Entra e sai com transição. **A saída fica visível o tempo
todo** — tela cheia sem porta de saída visível é a reclamação nº 1 de qualquer modo imersivo.

### 9.11 A saída em papel (Cliente)

> *"Preciso levar isso para o meu contador."*

Exportação em PDF/impressão, uma seção por bloco: patrimônio hoje, repartição, eventos, fluxo
projetado, premissas.

Obrigatório no documento, sem exceção:
- **as premissas usadas**, com as taxas no formato canônico (§6.5);
- **`premissasVersao` e a data** da publicação (§11.1);
- **o selo:** *"Projeção baseada nas premissas acima. Não é promessa de rentabilidade."*;
- **as lacunas** que afetam os números daquele documento, nomeadas.

Serve ao contador, à reunião e ao compliance ao mesmo tempo.

---

## 10. Autorar × navegar — dois modos sobre o mesmo dado (B2)

A v2 misturou os dois. São separados, e a metáfora de cada um é diferente:

| | **Autorar** | **Navegar** |
|---|---|---|
| Metáfora | planilha | editor de vídeo |
| Horizonte | 12–24 meses | vida inteira |
| Quando | reunião semestral | qualquer hora |
| Densidade | alta, tabular | espacial, gestual |
| Quem | consultor com o cliente | o cliente sozinho |

### 10.1 O modo de autoria (planilha)

Pedido explícito do Nélio: *"como uma estrutura de planilha, com trabalho mais intenso"*.
Grade de meses × categorias, entrada por teclado, colar de planilha, navegação por Tab.
É a superfície de autoria que o Engenheiro cobrou.

### 10.2 O modo de navegação (editor de vídeo)

A tela do §9. Zoom, pan, inspeção, simulação.

### 10.3 O verbo que atravessa os dois: **mutar**

Achado do UX que valia recuperar, e é o mais vendável da ferramenta:

> *"E se a esposa parar de trabalhar?"*

Vira **um toque no ícone da renda**, não um formulário. Mutar uma renda a desliga da projeção
sem apagá-la, com o efeito imediato na curva e desfazer disponível. É simulação (§9.9): não
grava.

Mutar opera sobre a **lista de rendas** (§4.2), não sobre pistas no gráfico — a lista é onde as
doze rendas de uma família cabem.

---

## 11. Premissas — os parâmetros da casa

### 11.1 A área de admin (B13, B14)

> *"O ideal é que tenha uma área de admin onde estas taxas são configuradas."*

Fecha um bloqueante que o CFP levantou duas vezes: *"nunca digitada no cadastro do cliente,
senão são 150 clientes com 150 inflações implícitas"*.

```
ParametrosDaCasa {
  versao, vigenteDesde, publicadoPor, motivo,
  tetoPorPerfil:    { conservador: 0.060, moderado: 0.075, arrojado: 0.090 },
  faixaRetorno:     { min: 0.030, max: 0.090 },
  saudeOrcamento:   { fixosMax: 0.50, ajustaveisMax: 0.30, futuroESonhosMin: 0.20 },
  valorizacaoImoveis, inflacaoPorCategoria, aliquotas, ...
}
```

**Tetos definitivos (B14):**

| Perfil | Teto de retorno real líquido |
|---|---|
| Conservador | **6% a.a.** |
| Moderado | **7,5% a.a.** |
| **Arrojado** | **9% a.a.** |

Nome do perfil mais agressivo: **Arrojado** (B16) — mantém o que o demo já usa. A faixa
configurável (3% a 9%) fica exatamente delimitada pelo perfil que pode mais; o perfil **corta o
topo dela**.

Nenhum desses números volta a ser digitado na tela do cliente nem na do consultor. Eles
**descem** da casa. E como o Admin passa a **escrever** algo que afeta todos os clientes de uma
vez, **toda mudança de parâmetro entra no `AuditLog`** com quem, quando, valor anterior e
`motivo` (§16).

### 11.2 A trava de suitability — e quem não preencheu (B11, B12)

A trava passa a ter **duas** superfícies:

| Superfície | O que trava | Desde |
|---|---|---|
| Publicação de capítulo da devolutiva | módulo que prescreve produto (PGBL) | rodada 05 |
| **Configuração da taxa da caixa** | **teto de retorno real** | **agora** |

Muitos clientes usarão a plataforma sem suitability. No momento em que a taxa é configurada,
dois caminhos são oferecidos: **assumir o perfil** ou **responder ao questionário**.

**Os dois não são a mesma coisa, e o dado precisa saber disso:**

```
PerfilDeRisco {
  perfil: conservador | moderado | arrojado,
  origem: 'questionario' | 'autodeclarado',
  respondidoEm, versaoQuestionario,
  valeParaSuitability: boolean    // true SÓ quando origem = 'questionario'
}
```

Perfil autodeclarado é **premissa de planejamento**, não suitability no sentido da Res. CVM 30.
Se os dois gravassem no mesmo campo, a plataforma passaria a afirmar que tem suitability de
clientes que chutaram o próprio perfil — em auditoria, pior do que não ter nada.

**Consequência na tela:** com perfil autodeclarado, a taxa é travada do mesmo jeito (proteção
do cliente), mas os **capítulos que prescrevem produto continuam bloqueados**.

⚠ **LACUNA (B12):** o questionário de suitability é outra ferramenta a incorporar — perguntas,
pontuação e mapeamento para os três perfis (§17).

### 11.3 Mudou a premissa: congela, notifica, convida (B15, B16)

**O plano publicado não se refaz sozinho.** Cada plano guarda `premissasVersao` e continua
sendo lido com os parâmetros vigentes na publicação. É a mesma classe de decisão que o
`numerosSnapshot` da especificação selada (§3.2): o que o cliente viu na reunião de junho
continua sendo o que ele viu.

Recalcular em silêncio seria o pior caminho — a projeção mudaria sozinha e o consultor não
conseguiria defender o que mostrou. E seria contraditório com notificar: se o convite é para
*refazer*, então não se refez sozinho.

**Texto canônico da notificação (B16), palavra por palavra:**

> O comitê de alocação e planejamento da Nord realinhou as variáveis financeiras devido ao
> cenário atual e à nossa estratégia. É importante reajustar as premissas do seu planejamento.
> Entre em contato com o seu consultor: **{consultor}**

Duas coisas que este texto resolve: *"cenário atual **e** nossa estratégia"* cobre tanto a
mudança econômica quanto a decisão metodológica interna, sem afirmar uma causa que pode ser
falsa; e nomeia um responsável institucional — **o comitê de alocação e planejamento da Nord** —
em vez de a mudança parecer que veio do sistema. Consistente com o inviolável do **remetente
humano**. A variável é `{consultor}`; "banker" sai do vocabulário (B16).

**O caso prático que vai acontecer primeiro (B15):** cliente conservador com a caixa
configurada a 7% quando o teto cai para 6%.

1. O plano publicado **continua mostrando 7%** — é o que ele viu e assinou.
2. Com uma marca: *"esta premissa está acima do teto que vale hoje"*.
3. Mais o convite para a reunião.
4. Na revisão, a taxa é travada em 6% e a diferença aparece no **diff, lado a lado**.

Na semestral, o consultor vê: *"os parâmetros da casa mudaram desde o seu último plano — quer
reprojetar?"*, com o antes e o depois.

---

## 12. A cadência mensal — o que ela é, e o que ela não é (B2)

### 12.1 O que foi derrubado

A rodada 07 propôs *"algo mudou no seu orçamento em março?"* com "nada mudou" como resposta
padrão. O Nélio derrubou:

> *"Perguntar em um toque se algo mudou no seu orçamento em março também não faz sentido.
> Dificilmente essa é uma tela que a pessoa vai acessar todo mês."*

O instinto do psicólogo estava certo — usar a regra de continuidade como mecânica de hábito —
e o **objeto** estava errado.

### 12.2 O que é

**A cadência mensal se pendura na poupança realizada, não no orçamento inteiro.** Uma variável,
uma pergunta, que o produto **já faz**:

> *"Projetei que pouparia 2.800 naquele mês, e ao concluir o mês eu pergunto se de fato esse
> valor de poupança foi realizado."*

O que muda em relação à especificação selada: a pergunta do ciclo mensal passa a ser
confrontada com um **valor projetado** — que vem desta ferramenta — em vez de um **combinado
fixo**. É delta na selada §9.1.3 e §10.1 (§16).

E o que era trabalho de reunião continua sendo: projetar 12 ou 24 meses em detalhe é modo de
autoria (§10.1), na semestral.

### 12.3 A ponte de volta para a ferramenta, no pico de motivação

Pedido do psicólogo, e é o único gancho da Projeção na cadência mensal:

> Cliente informa que poupou R$ 3.200 (projetado: R$ 2.800).
> → *"Você poupou R$ 400 a mais do que o previsto. **Quer ver onde isso cai na sua linha do
> tempo?**"*

O convite aparece **no momento em que a motivação está alta** — logo depois de informar, não
num lembrete solto. E existe a saída para o humano no mesmo ponto: **[ Falar com {consultor} ]**.

Quando poupou menos, a mesma ponte, com a regra de consequência sem moralizar da selada §11.2:
fato + física + caminho de volta. Nunca julgamento.

---

## 13. Modelo de dados

### 13.1 Entidades novas (o que o Engenheiro pediu para §3.2 da selada)

```
Cenario { id, clienteId, inicio:{ano,mes}, idadeInicial, horizonte,
          premissasVersao,                 // congelado na publicação — §11.3
          pessoas:[Pessoa], rendas:[Renda], passivos:[Passivo],
          caixinhas:[Caixinha], eventos:[EventoPatrimonial],
          mudancasDeOrcamento:[MudancaDeOrcamento], mesBase }

Pessoa   { id, nome, papel: titular|conjuge|dependente, dataNascimento }

Renda    { id, pessoaId, nome,
           dependenciaDoTrabalho: 'acaba'|'diminui'|'continua',
           percentualQuePersiste?,          // quando 'diminui'
           ativoLastroId?,                  // §4.7 — invariante de encerramento
           natureza?,                       // obrigatória quando depende do trabalho
           valor | faixa:{min,max},         // §4.5
           periodicidade, mesAncora,
           inicio, fim,                     // fim obrigatório quando depende do trabalho — §4.6
           proveniencia, reajusteReal }     // ⚠ reajuste = LACUNA

Passivo  { id, nome, ativoVinculadoId?, saldoDevedor, taxaJurosAnual,
           valorParcela, parcelasRestantes, sistema: 'price'|'sac'|'declarado' }

Caixinha { id, nome, curto, camada: financeiro|bens|participacoes,
           natureza: reserva|compromisso|objetivo|liberdade,
           saldoInicial, taxaAnual, cor, prov, nota, lacuna?,
           custoEsperado?, dataEsperada? }  // §6.3 — compromissos

EventoPatrimonial { id, tipo:EVENTO, mes, mesFim?, caixinha, valor?,
                    esvazia?, taxaAnual?, rotulo, motivo, prov, lacuna? }

Simulacao { id, cenarioId, alteracoes:[...], criadoEm, autor,
            persistida:false }              // simular nunca grava — §9.9

PerfilDeRisco   { perfil, origem, respondidoEm, versaoQuestionario, valeParaSuitability }
ParametrosDaCasa{ versao, vigenteDesde, publicadoPor, motivo, tetoPorPerfil, faixaRetorno, ... }
```

### 13.2 Permissões (delta da §3.4 da selada)

| Entidade | Cliente | Consultor | Admin |
|---|---|---|---|
| `Cenario` rascunho (§3.1) | CRUD próprio | READ | — |
| `Cenario` publicado | READ + simular | CRUD | READ agregado |
| Repartição das caixas | edita no rascunho; **sugere** no publicado | CRUD | — |
| `Simulacao` | CRUD própria | READ, promover a plano | — |
| `ParametrosDaCasa` | — | READ | **CRUD** (primeira escrita do Admin) |
| `PerfilDeRisco` | CREATE autodeclarado | CRUD via questionário | READ agregado |

A regra da selada continua: **o cliente sugere, não sobrescreve** o que está publicado. No
rascunho dele, antes de qualquer publicação, ele é o autor e edita à vontade — é o que o §3.1
exige para o efeito dotação funcionar.

### 13.3 Isolamento e LGPD

Mesmas regras da selada §3.5: `localStorage` namespaced por cliente, `AuditLog` append-only,
nunca cruzar `clienteAtivoId`. **Novo:** `ParametrosDaCasa` é global (não por cliente) e toda
publicação de versão entra no `AuditLog` com autor e motivo.

### 13.4 Registro único de tipos de evento (Engenheiro)

Um lugar só. Adicionar um tipo obriga, no mesmo commit, **as cinco coisas**:

1. entrada no registro `EVENTO`;
2. ícone (forma + preenchimento, §9.8);
3. copy da legenda e do "porquê";
4. `case` no motor;
5. teste na bancada.

| Tipo | Ícone | Cadência |
|---|---|---|
| `aportePontual` | ▲ sólido | pontual |
| `aporteContinuo` | ▲ vazado | contínuo |
| `saquePontual` | ▽ sólido | pontual |
| `saqueContinuo` | ▽ vazado | contínuo |
| `consumo` | ▽ vazado | janela (PMT calculado) |
| `perpetuidade` | ▽ vazado | contínuo sem fim |
| `transferencia` | ◆ sólido | pontual |
| `rentabilidade` | ○ vazado | janela |
| `mudancaTaxa` | ○ sólido | pontual |

Nove tipos, todos já implementados e conferidos na rodada 06. **A v3 não adiciona nenhum tipo
novo de evento** — o "saque do saldo" de B8 é o `esvazia: true` que já existe, e o que muda é a
**interface** declarar as duas formas (§6.4).

---

## 14. Vocabulário — a poda do Redator

> *"A spec nomeia dez conceitos novos e nenhum sobrevive ao leitor de 54 anos."*

Regra: **o nome interno nunca vaza para a tela.** Onde a coluna da direita estiver vazia, o
conceito não aparece na tela do cliente — existe só no código.

| Interno | Na tela do cliente |
|---|---|
| `caixinha` | o nome próprio de cada uma ("Reserva de emergência"); no coletivo, **"o dinheiro guardado"** |
| `MudancaDeOrcamento` | **"o que muda em {mês}"** |
| regra de continuidade | **"o resto segue igual — mude só o que muda"** |
| `mesBase` | **"o seu mês comum"** |
| `dependenciaDoTrabalho` | *"se você parar de trabalhar, o que acontece com essa renda?"* |
| `ativoLastroId` | *"essa renda vem de algum bem seu?"* |
| classe ativa / passiva | — (só interno) |
| `natureza` da renda | **"tipo de trabalho"** |
| `proveniencia` | "você nos contou" · "nossa estimativa" · "confirmado" (selada §11.6) |
| `indeterminado` | **"ainda não sabemos"** |
| `perpetuidade` | **"vive do rendimento"** |
| `pvNecessario` | **"quanto precisa estar guardado"** |
| `metaDePatrimonio` | **"quanto você precisa ter para viver sem trabalhar"** |
| soma das rendas ativas | **"quanto da sua renda depende de você trabalhar"** |
| `esvazia: true` | **"usar o que estiver na caixa"** |
| `premissasVersao` | **"as premissas do seu plano, de {data}"** |
| `PerfilDeRisco` autodeclarado | **"o perfil que você mesmo indicou"** |
| `ParametrosDaCasa` | **"as premissas da Nord"** |
| `Simulacao` | **"e se…"** |
| `mutar` | **"desligar esta renda"** |

Vocabulário unificado herdado da rodada 06 e mantido inteiro: *Reserva de emergência · Renda de
2036 a 2041 · Visão geral · Aporte mensal / extra · Vive do rendimento · Renda por prazo · o
dinheiro guardado.*

Da higiene de jargão da selada (§11.7), o que vale aqui: fora **aderência**, **proveniência**,
**estimado/validado**, **cascata**, **otimizar**. `{consultor}` é a variável; "banker" não
existe (B16).

---

## 15. Ética travada por escrito

Cinco travas que o painel mandou registrar. Não são recomendações — são **regras de aceite**.

### 15.1 Pergunta sim, número não

Marcador que **pré-preenche valor** em vez de perguntar é default financeiro não declarado, e
fere o inviolável *"nunca inventar conteúdo financeiro"*. Um dado que falta vira **pergunta**
ou **lacuna cinza**, jamais um valor de fábrica.

Distinção que o §5.5 depende: **derivar do dado do próprio cliente**, mostrando o critério e
permitindo editar, é trabalho. **Importar de uma média** (de outra família, de uma faixa de
renda, de um benchmark) é invenção. A primeira é permitida e sempre visível; a segunda é
proibida.

### 15.2 Evento nomeado nunca vira urgência comercial

*"Sua filha nasce em 8 meses e você não tem reserva"* é chantagem com material que o cliente
confiou à ferramenta para planejar. Eventos nomeados existem para **planejar**, nunca para
pressionar. Nenhuma notificação, nenhum banner, nenhum CTA usa um evento pessoal como alavanca.

### 15.3 Categorias funcionais, nunca morais

Agregadores financeiros vêm de fábrica com taxonomia moralizante ("supérfluo", "desperdício") e
ela entra pela importação sem ninguém decidir. **Fixo, ajustável, Futuro e Sonhos** — funcional.
Nenhuma categoria, rótulo ou alerta julga o gasto.

### 15.4 Nenhuma comparação social sobre gasto

Norma descritiva tem efeito bumerangue documentado: quem gasta menos que a média ganha licença
para gastar mais. **Nenhum "famílias como a sua gastam X".** A régua é o plano do próprio
cliente, sempre.

### 15.5 A importação vai contradizer o exame — e essa é a hora mais perigosa

Quando o Orçamento trouxer o gasto real e ele bater diferente do que o cliente declarou no
exame, a regra já existe no contexto e vale aqui sem exceção:

> *"Você declarou X; hoje sabemos que é Y."*

**Melhora de dado não pode parecer piora de vida. Nenhum pilar, nenhum indicador e nenhum prazo
pode piorar no mês em que o cliente entrega dado melhor.** Se a matemática piora, a tela explica
que a projeção ficou **mais verdadeira**, e o caminho de volta aparece junto (§9.9).

---

## 16. O que isto muda na especificação selada

A selada está em 5/5 e não se altera em silêncio. Os deltas que esta ferramenta obriga:

| § da selada | Delta |
|---|---|
| §3.2 Modelo de dados | entram `Cenario`, `Pessoa`, `Renda`, `Passivo`, `Caixinha`, `EventoPatrimonial`, `Simulacao`, `MudancaDeOrcamento`, `PerfilDeRisco`, `ParametrosDaCasa` |
| §3.4 Permissões | Admin deixa de ser só `READ agregado` — passa a **escrever** `ParametrosDaCasa` |
| §3.5 LGPD | `ParametrosDaCasa` é global; publicação de versão vai ao `AuditLog` |
| §5 Coleta | `perfil de suitability` ganha `origem` e `valeParaSuitability` (B11) |
| §9.1.3 Aporte do mês | confrontado com **projetado**, não com combinado fixo (B2) |
| §10.1 Aderência | `aportes feitos ÷ **projetados**` |
| §10.3 Minha jornada | a linha do tempo dos objetivos **é** esta ferramenta; para de ser tela própria |
| §11.7 Jargão | entram os termos do §14 |
| §14 Componentes | entram `PalcoPatrimonio`, `TrilhoDeEventos`, `LeituraDaJanela`, `CardVeredito`, `AlavancaDeMaoUnica` |
| §16 Anexo A | entram as lacunas do §17 |

---

## 17. Anexo — Lacunas (`⚠ não inventar`)

**Conteúdo da consultoria / CFP**
- Lista fechada das **naturezas de renda** e o que cada uma dispara (FGTS, INSS, 13º, férias,
  regime tributário) — §4.4.
- **Reajuste real das rendas** ao longo dos anos: 0% real por padrão? por natureza? — §13.1.
- **Despesas que nascem e morrem** com a aposentadoria, e **inflação real por categoria**
  (saúde na velhice) — §7 e §11.1.
- **Valorização real de imóveis** — hoje projetada a 0% real, que é o único default defensável,
  com a lacuna declarada na tela.
- Política sobre **quitação antecipada × investir a diferença** — §6.7.
- **Previdência privada e INSS**: estrutura especificada, valores e regime tributário não.

**Compliance / jurídico**
- **Questionário de suitability**: perguntas, pontuação, mapeamento para os três perfis (B12).
- **Prazo regulatório de revalidação** de suitability (já aberto na selada §8).
- **ITCMD por estado**, custos de inventário e prazos — §8.
- **Alíquotas e tabelas legais** (IR sobre resgate, come-cotas, ganho de capital) — §11.1.
- **Tela de consentimento do Open Finance**: quem vê o quê, como se desliga, o que apaga,
  retenção, e o consentimento **separado do cônjuge** num produto que é familiar por definição.

**Parâmetros da casa ainda sem valor**
- Tetos: os três estão definidos (B14). Faltam `valorizacaoImoveis` e `inflacaoPorCategoria`.

**Produto**
- Como exatamente as duas ferramentas "se combinam na versão final" (B5) além do elo de
  "Futuro e Sonhos → aporte": é relatório, é terceira tela, ou é só esta tela consumindo o
  Orçamento? Esta v3 assume a **terceira**, por ser a que não cria superfície nova.

---

## 18. Critérios de aceite

O que precisa ser verdade para a ferramenta ser considerada pronta. Escrito para poder ser
verificado, não para soar bem.

**Motor**
1. `estado(m) === estado(m−1)` quando não há mudança em `m`; `resultado(m)` pode diferir (§5.4).
2. Nenhuma renda sobrevive ao ativo que a lastreia (§4.7).
3. Nenhuma renda que depende de trabalho roda sem `fim` declarado (§4.6).
4. `indeterminado` nunca é renderizado nem somado como zero (§5.6).
5. Nenhum real aparece ou some sem nome: a conciliação da rodada 06 continua passando.
6. A parcela do passivo entra no fluxo e termina sozinha; o saldo devedor amortiza (§6.7).
7. Nenhuma taxa configurada excede o teto do perfil vigente (§11.1).
8. Plano publicado lê pelos parâmetros da sua `premissasVersao`, não pelos vigentes (§11.3).

**Tela**
9. Do rascunho (§3.1) até a curva na tela: **quatro perguntas**, nenhuma a mais.
10. O zoom alcança 6 meses por gesto, com o eixo de valor cortando a base e a leitura da
    janela respondendo (§9.2, §9.3, §9.4).
11. As três âncoras mudam largura sem mover o mês em foco; `hoje` é o único que recentra (§9.3).
12. Nenhum alerta negativo aparece sem caminho de volta na mesma tela, com igual peso (§9.9).
13. Toda caixa de compromisso mostra meta, prazo e veredito (§6.4).
14. Nenhum evento se distingue **só** por cor (§9.8).
15. Nada rola verticalmente dentro do palco; o excedente colapsa e nada some (§9.5, §9.6).
16. A tela cabe em 390 × 844 com a porta de saída visível (§9.1, §9.10).

**Ética**
17. Nenhum campo financeiro nasce preenchido com número que o cliente não deu (§15.1).
18. Nenhum evento pessoal aparece em mensagem de urgência comercial (§15.2).
19. Nenhuma categoria julga; nenhuma comparação social existe (§15.3, §15.4).
20. Nenhum indicador piora no mês em que o cliente entrega dado melhor (§15.5).

**Bancada**
21. Os 31 testes da rodada 06 continuam passando.
22. Testes novos: continuidade sobre estado, encerramento por alienação, propagação de
    `indeterminado`, mês-base × dezembro, amortização de passivo, teto por perfil,
    congelamento por `premissasVersao`.
23. `simulacao.js` e `viewport.js` ganham cobertura — hoje têm zero (Engenheiro, rodada 06).

---

*Fim da especificação · Projeção de Vida v3 · vai à rodada 08 do Gauntlet Loop*
