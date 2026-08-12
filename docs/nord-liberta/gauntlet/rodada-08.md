# Rodada 08 — a Projeção de Vida v3

**Objeto:** `especificacao/projecao-de-vida-v3.md` — uma **especificação**, não código.
**Painel:** 6 agentes. Vetos: Cliente e UX/UI.
**Entrada da v3:** os seis pareceres da rodada 07 e as dezesseis decisões do lote B.

## Veredito: **0 / 6**

| Agente | Veredito | O achado mais caro |
|---|---|---|
| **Cliente** *(veto)* | NÃO SATISFEITO | Depois de tudo, ele ainda não sabe quanto precisa ter para parar — e são dois números com R$ 949 mil de diferença |
| **UX/UI** *(veto)* | NÃO SATISFEITO | A densidade não se dissolveu: mudou de eixo. 24px por pista viraram **6,9px** na caixa que dá nome ao bloqueante |
| **Planejador CFP** | NÃO SATISFEITO | A mesma meta admite **2,04×** de amplitude conforme uma convenção que a spec não declara |
| **Engenheiro** | NÃO SATISFEITO | O invariante da continuidade agora está no lugar certo e é **verdadeiro por construção** — não pode falhar |
| **Redator** | NÃO SATISFEITO | O §14 promete que `caixinha` nunca vai à tela; a spec inventa "caixa", com dois sentidos, e o vazamento está vivo em produção |
| **Psicólogo** | NÃO SATISFEITO | A entrada da casa em B8 renderiza o sonho realizado como **−R$ 230.000 · −18%** |

Mesmo placar da rodada 07, dívida muito menor. A v3 fechou estruturalmente o binário
ativa/passiva, o encerramento por alienação, a continuidade sobre o estado, o `indeterminado`
unificado, as premissas versionadas com trava, o passivo como camada e a poda de vocabulário.
O que impede o selo não é falta de ambição — é que **a v3 erra dentro de si mesma** em pontos
verificáveis, e que três dos piores defeitos estão numa tabela de deltas que eu escrevi de
passagem.

---

## As sete convergências independentes

Nenhum agente leu o parecer do outro. Onde dois ou mais chegaram ao mesmo defeito por caminhos
diferentes, o defeito é real.

### 1. O §16 apaga "Minha jornada" numa linha de tabela — **4 agentes**

Cliente · CFP · Engenheiro · Psicólogo. Bloqueante nos quatro. É a convergência mais forte que
este loop já produziu.

A linha era: *"§10.3 Minha jornada — a linha do tempo dos objetivos **é** esta ferramenta; para
de ser tela própria."* O que ela derruba, e que está numa spec **5/5**:

- os objetivos que custam **tarefa e não dinheiro** — "Proteção da família, mês 2", "Tranquilidade
  sucessória, mês 3" — que foram refino do próprio Cliente aceito na rodada 3;
- o consolidado *"3 de 5 objetivos no rumo ou concluídos; 1 pede atenção"*, que responde a
  pergunta mais frequente de um cliente 50+;
- a escalada como *skin* separável, que o contexto §2.4 prende àquela tela;
- uma **aba da bottom nav** — 5 viram 4 — e, com o §9.10 tirando o shell, a tela mais valiosa
  do produto fica **sem ponto de entrada especificado**.

O CFP acrescenta a consequência que ninguém tinha visto: **não existe chave entre `Objetivo`
(selada) e `Caixinha` (v3)**. "Compra da casa" é as duas coisas e nada as liga. Sem essa chave
não há `prioridadeCascata`, logo não há como alocar o aporte real quando ele vem menor que o
projetado — o que mata o *prazo-que-reage*, justamente a promessa que a linha do §16 transfere
para esta ferramenta.

> **Arquitetura de informação não se altera em linha de tabela.** — Engenheiro

### 2. A meta da liberdade financeira não fecha em um número — **3 agentes**

Cliente e CFP calcularam, sozinhos, com métodos diferentes. Conferido:

| Convenção que o meu §7 permite | Meta |
|---|---|
| anuidade 180m à taxa de **acumulação** (7,5%) | R$ 1.752.305 |
| anuidade 180m à taxa de **desacumulação** (5,5%) | R$ 1.975.328 |
| anuidade 360m a 5,5% | R$ 2.860.142 |
| perpetuidade a 5,5% | R$ 3.578.058 |

**Amplitude de 2,04× no mesmo cliente**, todas compatíveis com o texto. Pela conta do Cliente,
com a taxa do meu próprio exemplo (4,91% a.a. sobre R$ 16 mil/mês), perpetuidade e horizonte
finito diferem em **R$ 949.064**.

Três parâmetros ficaram sem dono: **qual taxa** (o motor já pratica um glide path de 7,5% → 5,5%
no mês 181 que a spec nunca declarou), **qual convenção**, e **qual horizonte** — a palavra
"expectativa de vida" não aparece uma vez em 1.306 linhas, e `Cenario.horizonte` não está nem
listado como lacuna. O Engenheiro fecha: *"o número-título da ferramenta repousa numa constante
que ninguém escolheu"*.

O CFP acrescenta que `necessidadeMensal(m)` é escrita como **função do mês** e entregue a
`pvNecessario(pmt, i, n)`, que só aceita **PMT nivelado** — um vetor não entra numa fórmula de
anuidade constante. E que falta a linha **"IR sobre o resgate — não apurado"**, no mesmo padrão
honesto do IR da venda da ótica: "real líquido" resolve imposto sobre o rendimento, não sobre o
resgate de PGBL, que incide sobre o valor integral.

### 3. A aderência ÷ projetados degenera — **4 agentes**

Quatro modos de falha distintos, achados separadamente:

| Quem | Como quebra |
|---|---|
| Cliente | a renda é projetada pelo **piso** da faixa (§4.5) → ele bate a meta por construção → verde de graça |
| CFP | o cliente recebe um **aumento**, poupa o mesmo, e a aderência **cai** — dado melhor virando vida pior |
| Engenheiro | denominador **≤ 0** durante ~35 anos de vida sustentada pelo patrimônio; `indeterminado`; e em **dezembro**, com 13º, o projetado salta e o melhor mês do ano marca abaixo de 100% |
| Psicólogo | meta atribuída não é meta autoimposta — a aderência deixa de medir compromisso e passa a medir obediência a um parâmetro |

Os dois primeiros violam o inviolável nº 2 do contexto e o **§15.5 da própria v3**.

Ninguém pediu para reverter o **B2** — ele está certo e é decisão do Nélio. O que o B2 mudou foi
**a pergunta mensal**; foi o meu §16 que estendeu isso à **métrica**, e essa extensão é minha,
não dele. Falta ainda o *fallback* para quem não tem `Cenario` publicado: hoje o §16 troca o
denominador globalmente e quebra o ciclo mensal de todo cliente pré-devolutiva e de todo
self-service.

### 4. O rascunho de 3 minutos não produz curva — **4 agentes**

Quatro mecanismos diferentes, todos matando a promessa *"e a curva dele aparece"*:

- **Cliente:** §4.6 exige `fim` declarado para renda que depende de trabalho. No rascunho ninguém
  pergunta isso. Ou o sistema infere um `fim` que ninguém declarou — o veto da rodada 07 com
  outra roupa —, ou a curva sai cinza.
- **UX e Engenheiro, independentemente:** §5.5 passo 4 diz que sem mês-base confirmado o mês 25
  em diante é `indeterminado`. No rascunho não há 24 meses de onde propor o mês-base. Logo
  **97–98% da curva nasce em lacuna cinza**, na tela de abertura do produto, e o critério de
  aceite nº 9 é falso na entrega.
- **Psicólogo:** a quarta pergunta ("com que idade você quer poder parar?") não é recuperação de
  memória como as outras três — é **construção de preferência**, e está no degrau de maior custo,
  logo antes da recompensa.

Os dois parágrafos — §3.1 e §5.5 — foram escritos sem se olharem. A saída é a mesma nos quatro
pareceres: *"quanto sai, por alto"* **é** o mês-base declarado, com proveniência.

### 5. A iconografia volta quebrada na aritmética — **3 agentes**

UX, Engenheiro e Redator acharam a mesma frase falsa no §9.8:

> *"Quatro formas × dois preenchimentos = os **oito** tipos de evento do registro (§13.4), sem
> ambiguidade"* — e o §13.4, catorze parágrafos abaixo, lista **nove**.

Três tipos recebem ▽ vazado (`saqueContinuo`, `consumo`, `perpetuidade`) e, como a cor é
"herdada da camada/caixa" e não do tipo, ficam **idênticos em forma, preenchimento e cor** quando
incidem na mesma caixa — o que acontece no cenário do Ricardo (`sq2` e `pp1`, ambos em
`liberdade`). O critério de aceite nº 14 é falsificado pelo §9.8.

O UX diagnosticou a causa: o §13.4 declara **quatro** cadências (`pontual`, `contínuo`, `janela`,
`contínuo sem fim`) e o §9.8 dá **dois** preenchimentos para carregá-las. O canal está
subdimensionado na origem.

E é **regressão**: hoje `perpetuidade` é **∞** e `consumo` é um **calendário** — dois ícones que
se leem sozinhos. Aplicar o pedido do UX ao pé da letra piorou a tela que já existe.

### 6. A anatomia do §9.1 não acomoda o que a spec promete — **3 agentes**

O orçamento fecha em **844 exatos** (56+330+44+190+56+40+128). Dois problemas:

- **844 é a altura do aparelho, não da viewport.** No Safari iOS com as barras visíveis são
  ~**664px**. O orçamento estoura em 52px no estado padrão do navegador, antes de somar qualquer
  coisa.
- **Faltam seis linhas obrigatórias que o próprio documento exige:** eixo do tempo com rótulos de
  ano (existe hoje), controles de simulação (§9.9), legenda clicável (§9.5), card de veredito
  (§6.4, critério 13), tooltip fixo (§9.7), porta de saída (§9.10, critério 16). Mais, pelo
  Cliente: a entrada do §8 e o botão de exportar do §9.11. E o "Visão geral × Por destino",
  fechado na rodada 06, sumiu sem o §16 declarar.

> *"Um orçamento que fecha em 844,00 exatamente e esquece seis linhas não é um orçamento — é uma
> justificativa."* — UX

### 7. "Caixa" tem dois sentidos a 200 pixels de distância — **3 agentes**

O §14 promete que `caixinha` nunca vai à tela: o coletivo é "o dinheiro guardado", o singular é o
nome próprio. **A v3 então inventa uma terceira palavra — "caixa" — e a põe em string de tela**
(§6.4, §11.2, critério 13), enquanto batiza o palco de baixo de **"PALCO 2 · Caixa do mês"**.
Duas acepções no mesmo campo de visão: o pote e o fluxo.

---

## A densidade não se dissolveu — ela mudou de eixo

O achado do UX que mais muda o desenho, e que eu tinha declarado resolvido.

O **B6** está certo e ninguém o contesta: doze rendas numa lista modal é melhor que doze pistas.
Mas o problema saiu das **pistas horizontais** e foi para as **bandas verticais** do palco
empilhado — onde a altura não é escolha de design, é o dinheiro do cliente. Conferido no cenário
de referência, num palco de 330px:

| Banda | % do patrimônio | Altura |
|---|---|---|
| Rede de óticas | 49,9% | 164,7px |
| Imóveis | 29,7% | 98,1px |
| Liberdade financeira | 14,6% | 48,0px |
| Reserva de emergência | 3,7% | 12,3px |
| **Formação dos filhos** | **2,1%** | **6,9px** |

**"Formação dos filhos" é exatamente a caixa do bloqueante do Cliente** — *"R$ 111.308, isso é
suficiente? Não faço ideia"* —, a caixa para a qual os §6.3 e §6.4 foram escritos. A melhor
mecânica nova da v3 renderiza a 6,9 pixels: não cabe rótulo, não cabe toque, não sobrevive a um
antialias.

E o §9.5 erra na mesma classe que o §5.4 acabou de consertar: **a regra está escrita sobre a
variável errada.** "Até 6 faixas no celular" é regra de *contagem*; o dano é *proporcional* — a
família do Ricardo tem 5 caixas, nunca dispara o colapso, e tem duas bandas ilegíveis. Pior, a
ordem está invertida: colapsar "por camada primeiro" funde o **financeiro**, que é a única camada
que o cliente reparte, decide e olha, e preserva bens e participações, que são blocos estáticos.

---

## Correções que eu escrevi errado — conferidas com a calculadora

**O card ilustrativo do §6.4 é impossível dentro das minhas próprias regras.**
R$ 30.000 → R$ 32.100 em 7 meses implica **12,30% a.a.** real líquido. O teto do perfil Arrojado
(B14) é 9%. A 9% dariam R$ 31.547; a 6%, R$ 31.037. Achado do Cliente, que fez a conta porque *"é
o que eu faço"*. Vira regra: **todo número `ILUSTRATIVO` sai do motor, com a premissa que o
produziu ao lado.**

**O invariante da continuidade é uma tautologia.**
`estado(m) === estado(m−1)` quando não há mudança em `m` é **verdadeiro por construção** — é a
definição de `estado(m)` reescrita como asserção. Um teste que afirma uma definição não pode
falhar, e o critério de aceite nº 1 herda isso. É a mesma família que a bancada da rodada 06 já
corrigiu uma vez (`verificar.mjs:117`: *"as duas asserções anteriores eram tautologias — verdadeiras
por construção do Math.min, incapazes de falhar"*).

O teste que **pode** falhar é o diferencial: `estado(m) === estado(m−1) ∧ resultado(m) ≠
resultado(m−1)` no mês do 13º. Sem ele, um desenvolvedor que grave o valor realizado de volta no
estado passa no critério nº 1 e propaga o 13º por 89 anos — o defeito original, pela porta dos
fundos.

**Eu reabri um bloqueante da rodada 06 por omissão de contrato.**
A alavanca de aporte só é segura porque `despesaIrredutivel()` e `aporteMaximo()` leem
`componentes[].prov !== 'derivado'` — é isso que impede o slider de comer o custo de vida
declarado (bloqueante 5 da rodada 06). **A v3 declara herdar o motor e nunca menciona
`componentes` nem `prov: 'derivado'`.** Quem construir `resolve()` a partir do §5.4 emite janelas
sem `componentes`; `despesaIrredutivel()` devolve 0; `aporteMaximo()` devolve a receita inteira;
e a alavanca volta a apagar o custo de vida. Não por decisão — por silêncio.

**A conquista planejada volta a ser renderizada como queda.**
Na etapa 4 do B8 o cliente resgata R$ 230 mil para a entrada da casa. Como especifiquei, é saque
de caixa: o palco despenca e a leitura da janela anuncia **"−R$ 230.000 · −18%"** no mês em que
ele realizou o sonho. É o defeito da rodada 06 — *"35 anos de aposentadoria planejada pintados
como déficit laranja"* — voltando por outra porta, e viola o inviolável nº 2. A correção também é
a matematicamente certa: entrada de casa é **`transferencia` de `financeiro` para `bens`** somada
a um `Passivo`; o patrimônio líquido não cai.

**`faixaRetorno.min: 3%` invalida o cenário-âncora.** `imoveis` e `otica` estão a `taxaAnual:
0.000` e ambos são `Caixinha`. O piso de 3% contradiz o único default defensável que o próprio
§17 declara para imóveis. Além disso, **um piso é piso de otimismo**: a casa deve travar o teto;
travar o chão impede modelar conservadorismo.

**O §6.7 não é calculável como está escrito.** Contrato de financiamento é **nominal** (Price,
TR, IPCA); o motor é **real e líquido**. As palavras "nominal", "IPCA" e "TR" não aparecem na
spec. Consequência: a única pergunta que o §6.7 promete responder — *"vale a pena quitar antes?"*
— compara uma taxa nominal com uma real líquida e erra por 4 a 6 pontos ao ano, **sempre no mesmo
sentido**. Marcar a conclusão como ⚠ LACUNA não protege ninguém se a tela já mostra os dois
caminhos. E o Cliente achou o outro lado: a parcela está no Orçamento (B1, micro das fixas) **e**
no `Passivo` — ou conta duas vezes nos meses 1–24, ou alguém precisa declarar qual manda.

**Quatro referências cruzadas quebradas**, num documento cujo §0 existe para provar que nada se
perdeu: §0.1 linha 6 aponta para §6.6 (que é Perpetuidade; o conteúdo está no §13.2); §0.1 linha
25, §4.7 e §5.4 apontam para §15 (que é Ética; a bancada é o §18).

**O §9.1 omite `participações`** da ordem de empilhamento — no cenário de referência é a maior
banda da tela, 49,9%.

**A poda do §14 foi escrita e não foi aplicada.** Três vazamentos vivos em produção, achados pelo
Redator e conferidos literalmente:

| Onde | Hoje | Deveria ser |
|---|---|---|
| `projecao.js:300` | *"e **a caixinha tem** R$ 32.100"* | a palavra que o §14 promete que nunca vai à tela |
| `projecao.js:398` | *"O plano **manda** guardar R$ X"* | único lugar do produto onde o plano dá ordem — fere "sem moralizar" |
| `projecao.js:292` | *"valor ainda não calculado"* | terceira forma de `indeterminado`, que o §5.6 unificou |

---

## As arbitragens

### A · A alavanca de mão única: proteção fiduciária ou treino de desamparo?

- **CFP:** mantém a proibição da taxa como alavanca de simulador — e mostra que **a porta da
  frente ficou aberta**. O §6.5 deixa a taxa-alvo subir livremente até o teto do perfil **no modo
  de autoria**, e o §6.4 fecha o laço: *"faltam R$ 2.900"* → o cliente sobe a taxa de 4% para 6%
  e o card fica verde. O plano fecha por premissa. *"Trancaram a janela e deixaram a porta da
  frente aberta."*
- **Psicólogo:** a assimetria está certa sobre o que ela governa, e **errada generalizada à
  experiência inteira**. Se todo controle que o cliente toca só piora o desenho, o simulador é
  caixa de punição, e morre o objetivo declarado na rodada 06 ("o cliente deve querer passar
  tempo simulando") junto com o *locus* de controle que a selada §10.1 protege.

**Decisão: os dois estão certos sobre coisas diferentes, e a regra que os concilia é uma linha.**

> **Premissa de mercado só piora. Comportamento do cliente pode melhorar.**

A rentabilidade é premissa da casa: só desce, e agora também no modo de autoria, porque ganha um
**segundo eixo de trava — `tetoPorPrazo`** (uma caixa a ser usada em 7 meses não pode ser
projetada a 9%, seja qual for o perfil). Casamento de ativo e passivo deixa de poder ser feito ao
contrário, e a válvula de escape do §6.4 fecha.

Em troca, entram as alavancas que são legitimamente do cliente e apontam para cima — **trabalhar
um ano a mais, adiar um objetivo, reduzir o custo de vida da fase futura**. Nenhuma delas é
otimismo de mercado; todas são comportamento declarado. É a mesma forma da arbitragem da rodada
06: a assimetria atende os dois sem diluir nenhum.

### B · O rascunho: perguntar ao cliente ou derivar da coleta?

- **Psicólogo:** as quatro perguntas destravam *ability*; mas a quarta é construção de preferência
  e deve virar reação — o motor deriva *"dá para parar por volta dos 67"* e o cliente arrasta.
- **CFP:** o rascunho pergunta ao cliente quatro números que **eu já tenho na coleta** (renda,
  despesa, patrimônio e idade são campos-âncora da selada §5). E o §15.1 **explicitamente permite**
  derivar do dado do próprio cliente. *"A v3 proíbe a si mesma de fazer a coisa certa por engano."*
- **Cliente:** quer autoria, e é o que faz o efeito dotação funcionar.

**Decisão: derivar quando há coleta, perguntar quando não há** — e, nos dois casos, tudo aparece
como proposta editável com proveniência visível. Não há conflito real: a autoria que o Cliente
quer é preservada porque ele edita tudo; o pedágio que o Psicólogo mandou tirar continua fora; e
a Monique para de redigitar o que ela mesma preencheu.

O que **é** conflito, e o CFP tem razão: hoje o §13.2 dá ao cliente `CRUD` sobre o rascunho e ao
consultor apenas `READ`. Isso cria uma **segunda fonte da verdade** contra a selada §3.4,
multiplicada por 150. O rascunho, quando existe coleta, entra pela máquina de `SugestaoCorrecao`
— não como cenário paralelo que o consultor só lê.

### C · Quem publica o plano?

- **Psicólogo:** dar posse no rascunho e retirar controle na publicação é *reactance* + aversão à
  perda sobre controle — o caminho mais curto de volta ao *"a ferramenta chegou pronta"* que
  originou tudo isto (A15).
- **CFP:** o consultor é a fonte da verdade; cliente autorando em paralelo é reconciliação manual
  toda semana.
- **Engenheiro:** não existe entidade para "sugerir repartição" — a `SugestaoCorrecao` da selada é
  chaveada por `ValorColetado` e não expressa "mover R$ 20 mil de Reserva para Compromissos".
  Consequência: **o laço do B9 só é implementável no rascunho**; no plano publicado o cliente bate
  numa parede de permissão sem mecanismo.

**Decisão:** a regra da selada — *"o cliente sugere, não sobrescreve"* — é sobre a **coleta**,
cuja fonte da verdade é o consultor. Ela não se aplica ao cenário que o próprio cliente autorou.
Portanto: o rascunho é dele, editável à vontade; a **publicação é ato conjunto** (o consultor
publica, o cliente aceita — precedente na selada §6.6, onde ele já co-decide a cascata); e entra
a entidade que faltava, **`SugestaoDeReparticao`**, sem a qual o B9 — que é a resposta ao veto do
Cliente — não existe depois de publicado.

### D · "E se eu faltar" — o nome fica, o escopo dobra

Não houve conflito; os quatro pareceres compõem uma resposta só.

- **Redator** aprovou o nome e explicou por quê: *"faltar"* é o que as famílias brasileiras dizem,
  fica entre a brutalidade de "morrer" e a fuga corporativa de "se algo acontecer com você", e a
  primeira pessoa o coloca na mesma família de *"e se a esposa parar de trabalhar"*. **Mantido.**
- Mas exigiu **duas portas** — `[ Se eu morrer ] [ Se eu não puder mais trabalhar ]` — que são
  exatamente os **dois cenários que o CFP separou**: invalidez não é "o mesmo pedido" que morte;
  é pior, porque a renda para, a despesa **sobe** e não entra capital segurado.
- **Psicólogo e Engenheiro** convergiram na mesma trava, por motivos diferentes (dark pattern e
  privacidade): **o vazamento não é pela tela, é pelo Radar.** Rodar o ramo não pode gerar
  notificação, item de fila, marcação de lead nem pauta automática. E o ramo é **por pessoa** —
  simular a ausência do cônjuge é projetar sobre alguém que o §17 já reconhece como titular de
  consentimento separado.

---

## O que o painel elogiou, e que fica

- **O §0 de rastreabilidade** é a melhor coisa do documento como processo (Engenheiro) — mas o
  Cético do Cliente registrou o limite: *"tabela de rastreabilidade não é prova de fechamento; é
  promessa de fechamento"*. Dos seis achados dele declarados fechados, dois fecharam de verdade,
  um fechou só para um dos quatro tipos de caixa, um fechou no cadastro e reabriu no rascunho, um
  aponta para a seção errada e um nunca chega à tela.
- **§5.4 + §5.5 + §5.6** — a continuidade sobre o estado, o mês-base declarado com a lista do que
  ficou de fora, e o `indeterminado` que não vira zero. O Analítico do Cliente: *"é o melhor
  trabalho do documento — é ali que eu consigo auditar de onde saiu cada coisa"*.
- **O laço do veredito da caixa (§6.4)** — quatro pareceres o chamaram da melhor ideia da versão.
  O UX: *"é a única coisa aqui que eu, como comprador, entenderia como algo que não existe em
  planilha"*. Ele só não tem onde morar.
- **§9.3** acerta a formulação da continuidade espacial: as âncoras mudam largura, `hoje` é
  separado. A arbitragem "os três botões são atalhos, não estados" foi aceita pelo UX.
- **A textura que declara fidelidade (§9.4)** — *"raríssimo um produto financeiro declarar onde
  para de saber"* (Psicólogo).
- **O `mesBase` é nudge legítimo, não default disfarçado** — e o Psicólogo nomeou o teste que o
  absolve: **não confirmar não equivale a aceitar** (vira `indeterminado`). Passa.
- **§9.9 inteiro** — o Investidor de VC e o Comprador de R$ 5.000 não acharam o que atacar.
- **Duas frases que o Redator assinaria numa tela de produção hoje:** *"quanto você precisa ter
  para viver sem trabalhar"* e *"quanto da sua renda depende de você trabalhar"*.
- **A ausência total de mecânica diária.** O §1 diz em voz alta que não é app de acompanhamento.

E o registro que o CFP fez questão de fazer, sobre a decisão que ela mesma tinha atacado na
rodada 05: **o B11 acertou em cheio** a separação entre perfil autodeclarado e suitability de
questionário.

---

## O que a rodada me ensinou sobre o próprio método

**Três dos piores defeitos estavam na tabela de deltas do §16** — linhas de uma coluna, escritas
de passagem, que apagam requisitos de uma especificação **5/5**: a aba "Minha jornada", o
denominador da aderência e, por tabela, a cascata de prioridade.

A tabela do §16 nasceu para ser honesta — "a selada não se altera em silêncio". Ela virou o
lugar onde a alteração ficou mais barata de escrever. **Delta que remove requisito convergido
precisa de parecer, não de linha.** Vai para a metodologia.

Segundo aprendizado: o painel achou seis defeitos **lendo o código que a spec declara herdar**.
Uma especificação que diz "herda o motor da rodada 06" e não nomeia os contratos de que depende
(`componentes`, `prov: 'derivado'`, `PRIORIDADE`, `ehJanela`) reabre bloqueantes por silêncio.

---

## Bloqueantes para a v4

Consolidados dos seis pareceres, sem os importantes e menores (que ficam nos pareceres).

**Aritmética e modelo**
1. **§7 fecha em um número:** taxa de desacumulação, horizonte e convenção declarados e
   versionados em `ParametrosDaCasa`; desconto mês a mês em vez de PMT nivelado; linha "IR sobre
   o resgate — não apurado"; meta e veredito também para a caixa da liberdade.
2. **Definir `resolve()` normativamente** — seis decisões em aberto (`mesAncora` calendário ×
   índice, âncora fora da vigência, módulo negativo em JS, período truncado por `fim`,
   periodicidades submensais, contrato de saída **com `componentes[]`**).
3. **Invariante da continuidade em forma falsificável** (teste diferencial), no lugar da tautologia.
4. **Despesa ganha periodicidade de primeira classe**, para que "anual" seja estado e não
   exclusão — hoje o IPVA some do mês 25 ao 1080 conforme a porta por onde foi digitado, e o viés
   é otimista.
5. **`indeterminado`: decidir a representação** (`NaN` não serve — comparação devolve `false`) e
   completar a tabela: divisão, PMT/valor presente, agregação na pilha do gráfico, veredito,
   conciliação, exportação. Reconciliar com `lacuna`, que já existe e é outro estado.
6. **Terceira dimensão da renda — `terminaComAMorteDoTitular`** — e corrigir o §4.6: `continua`
   não implica "pode não ter fim" (INSS, renda vitalícia, pensão). Declarar se `Renda.valor` é
   bruto ou líquido.
7. **§4.7 × §4.3:** separar `mesTransicao` de `fim`; dois ramos no invariante de alienação
   (total → `fim`; parcial → redução).
8. **Passivo:** real × nominal com regra de conversão; parcela declarada prevalece; passivos
   entram na definição de `estado`; amortização entra na conciliação; fonte única da parcela nos
   meses 1–24; suspender a comparação "quitar × investir" até as duas pontas estarem na mesma
   unidade.
9. **Previdência e INSS:** retirar do §17 a afirmação de que "a estrutura está especificada" —
   não está — e especificá-la ou reclassificar como lacuna estrutural.

**Tela**
10. **Reescrever o §9.1 contra 390 × 664**, com linhas elásticas e as seis linhas que faltam;
    folha inferior com detentes nomeados; `Simular` como FAB; navegação de volta ao terço inferior.
11. **Colapso por proporção, não por contagem** — piso de banda de 14px, distorção declarada, e a
    ordem invertida: bens e participações colapsam primeiro, financeiro por último.
12. **Iconografia com três cadências** para os nove tipos, preservando o **∞** e o calendário que
    já existem; remover "cor herdada da caixa"; desempatar o roxo, que hoje é três coisas.
13. **Regra de overflow do trilho** — hoje a 4ª janela simultânea some em silêncio.
14. **§9.3 implementável:** fórmula da âncora (`ini' = mesFocado − larguraNova × fracaoDoFoco`),
    política de borda, `hoje` preservando a largura, rota curta de um gesto, e a forma dos atalhos
    (chips, não segmented control).
15. **Estados que faltam**, com a **ruína** primeiro: `mesDeRuina` como resultado de primeira
    classe — uma afirmação, uma data, um caminho de volta —, não centenas de alertas mensais.
16. **Conquista planejada nunca é queda:** entrada da casa é `transferencia` + `Passivo`, e a
    leitura da janela ganha regra de sinal.

**Governança e segurança**
17. **`tetoPorPrazo`** além do teto por perfil, fechando a válvula de escape do §6.4.
18. **`ParametrosDaCasa` append-only** (nunca UPDATE, nunca DELETE), `vigenteDesde` sempre futuro,
    quatro olhos, prévia de impacto, rollback, namespace global declarado. Congelar `motorVersao`
    junto de `premissasVersao` — senão *"o que o cliente viu em junho"* é falso na primeira
    correção de arredondamento.
19. **`PerfilDeRisco`:** `valeParaSuitability` **derivado**, nunca armazenado; autodeclarado não
    eleva o teto acima do conservador; e **mudar o seletor `modulosPublicaveis()`**, que hoje testa
    `!!estado.perfilSuitability` e destravaria os capítulos de produto com um chute.
20. **`Pessoa` fora do agregado do titular**, com consentimento próprio — antes do Open Finance,
    não depois. Inclui o caminho de separação, que num horizonte de 90 anos não é hipótese.
21. **Sexta trava do §15:** nada que o cliente explora em modo "e se…" vira sinal comercial —
    sem persistir, sem radar, sem lead, sem pauta automática.
22. **Sétima trava do §15:** arredondamento declara incerteza (real nos 24 meses, milhar até 10
    anos, dezena de milhar adiante). Precisão fabricada compra confiança que o modelo não tem.

**Arquitetura de informação e conteúdo**
23. **Resolver o §16:** "Minha jornada" volta a responder em palavras; chave `Objetivo` ↔
    `Caixinha`; ponto de entrada e comportamento de "voltar" especificados.
24. **Tratar a consequência do B2 sem revertê-lo:** aderência em janela móvel de 12 meses, regra
    para denominador ≤ 0 e `indeterminado`, *fallback* para quem não tem `Cenario`.
25. **Uma palavra por objeto:** matar "caixa"; traduzir "premissa" onde a copy é nossa; fundir as
    duas perguntas de classe de renda; consertar *"vem de algum bem seu?"*, que faz o dono da
    ótica responder "não" e desqualifica o caso que justificou o §4.3.
26. **Critério de aceite de vocabulário** — o §18 tem 23 critérios e nenhum é de copy. Uma
    varredura no build teria pego *"a caixinha tem"* antes de virar produção.
27. **§8 ganha duas portas** (`Se eu morrer` / `Se eu não puder mais trabalhar`), endereço
    declarado, pensão por morte e a janela de liquidez bloqueada do inventário.
28. **Escala: cenário-base derivado da coleta + semestral como diff.** Sem os dois, a estimativa
    da Monique é de **2h30 a 4h por cliente na primeira montagem** — 450 horas/ano para 150
    clientes, ~26% do ano útil dela, antes de qualquer revisão.

---

## Lacunas novas a registrar (⚠ não inventar)

- **Quem define `Cenario.horizonte`** e qual o default — o número-título depende inteiramente dele.
- **Taxa de desacumulação** e a política de glide path que o motor já pratica sem declarar.
- **Regra dos avos** do 13º/férias quando o vínculo termina no meio do período (CFP/jurídico).
- **Sensibilidade da data projetada** à variância de um único mês — sem ela a spec escolhe por
  acidente entre dramatizar ruído e ensinar licenciamento (proposta do Psicólogo: fato no mês,
  física no acumulado de 12 meses).
- **A Projeção está disponível ao self-service?** O §3.1 diz "o cliente sozinho, em qualquer
  hora"; a selada trava o self-service em `exameConcluido`. Tem consequência comercial e de
  consentimento.
- **Quem assina a notificação do B15/B16 no WhatsApp** — hoje o texto manda o cliente procurar
  quem está escrevendo para ele. É roteamento, não redação.
- **Texto final do selo do PDF** e se a notificação tem natureza regulatória (compliance).
- **Dose de vereditos por tela**, e a transferência do efeito dotação para curva derivada por
  algoritmo — medir no piloto, não assumir.

---

*Rodada 08 encerrada · 0/6 · próxima entrada: `projecao-de-vida-v4.md`*
