# Feedback do Nélio — lote B (respostas à rodada 07)

Vem em resposta aos seis pareceres. Corrige três decisões que eu já tinha
tomado e confirma uma.

---

## B1 · Complexidade progressiva é a proposta, não uma concessão

> *"Ela tem graus de complexidade diferentes, mas também entregas cada vez mais
> valiosas. É gentil da nossa parte oferecer a possibilidade de um orçamento
> simples e poder quebrar esse orçamento em mais detalhes."*

**Duas dimensões de granularidade, independentes uma da outra**, e ambas de
primeira classe — o nível simples **não** é uma versão incompleta do detalhado.

### Dimensão 1 — granularidade de categoria

Três categorias de despesa:

| Categoria |
|---|
| Despesas fixas |
| Ajustáveis |
| **Investimentos** |

- **Nível macro:** basta um norte. *"R$ 8.000 de fixas, R$ 6.000 de ajustáveis,
  R$ 2.000 de investimentos."* Cliente pronto.
- **Nível micro:** o cliente quebra as fixas em condomínio, IPTU, parcela do
  financiamento do carro, parcela do financiamento da casa, plano de saúde, e
  assim por diante.

> ⚠ **Divergência de nome a resolver:** a especificação escrita
> (`fontes/especificacao-orcamento-familiar.txt` §3) chama a terceira categoria
> de **"Futuro e Sonhos"**; aqui o Nélio chamou de **"Investimentos"**.
> São a mesma fatia. Falta decidir qual nome vai para a tela.

### Dimensão 2 — granularidade temporal

- **Nível macro:** *"todo mês eu ganho 15 mil e gasto 12."*
- **Nível mês a mês:** *"em agosto de 2026 eu vou gastar 12.350."*
- **Mudanças pontuais:** *"mês que vem eu deixo de pagar a parcela do tablet,
  minha despesa fica R$ 200 a menos."*
- **Provisões:** *"quero provisionar o Natal — vou gastar R$ 500 de presente."*

## B2 · A mecânica mensal que eu propus está errada — e a certa é outra

> *"Perguntar em um toque se algo mudou no seu orçamento em março também não faz
> sentido. Dificilmente essa é uma tela que a pessoa vai acessar todo mês."*

**O que é trabalho de reunião semestral:** projetar e olhar em detalhe. Um
ambiente onde se projetam os próximos 12 ou 24 meses de uma vez, **como uma
estrutura de planilha, com trabalho mais intenso**. Depois disso, os meses
seguintes são só repetição — podendo alterar expectativa de receita, de despesa,
ou inserir novas fontes de uma ou de outra.

**O que é trabalho mensal:** conferência **orçado × realizado**, sobre a
**variável-chave do planejamento daquela família — o valor necessário a poupar**.

> *"Projetei que pouparia 2.800 naquele mês, e ao concluir o mês eu pergunto se
> de fato esse valor de poupança foi realizado."*

Isso já existe no produto: é a pergunta do ciclo mensal. O que muda é que ela
passa a ser confrontada com um **valor projetado**, não com um combinado fixo.

## B3 · Cadastro de renda — a ordem das perguntas

Rendas com periodicidade diferente têm cadastro diferente. Todo cadastro segue:

1. **Passiva ou ativa**
2. Se ativa → **natureza** (tipo de trabalho)
3. **Periodicidade**
4. **Valor esperado**

> *"É possível que uma família tenha um cadastro de 12 rendas diferentes."*

## B4 · Encerramento de renda ao encerrar o ativo — CONFIRMADO

> *"Você tem razão sobre o encerramento das rendas referentes a ativos que são
> encerrados. De fato, a renda passiva referente àquele ativo também cessa."*

Vira invariante do motor, não aviso: alienar o ativo **encerra** a renda
lastreada nele.

## B5 · Duas ferramentas que convergem

> *"Sobre serem duas ferramentas diferentes e não duas portas, até consigo
> enxergar isso, mas a ideia é que essas duas ferramentas se combinem na versão
> final da projeção futura de evolução patrimonial."*

Duas ferramentas, **uma convergência**: o Orçamento e a Projeção se combinam na
versão final da evolução patrimonial. Não são telas irmãs nem a mesma tela — são
dois trabalhos que desembocam num terceiro.

---

## O que isso corrige no que eu já tinha decidido

**1. A mecânica mensal do psicólogo estava errada em espécie.**
A rodada 07 propôs *"algo mudou no seu orçamento em março?"* com "nada mudou"
como padrão. O Nélio derrubou: ninguém abre a tela de orçamento todo mês. O
instinto do psicólogo estava certo (usar a regra de continuidade como mecânica
de hábito) e o objeto estava errado. **A cadência mensal se pendura na
poupança realizada, não no orçamento inteiro** — uma variável, uma pergunta,
que o produto já faz.

**2. Autoria é planilha; navegação é editor de vídeo.**
São dois modos sobre o mesmo dado, e eu tinha misturado os dois. O Nélio pediu
explicitamente "estrutura de planilha, trabalho mais intenso" para projetar 12 a
24 meses — que é o oposto de arrastar clipes numa régua. E pediu navegação de
editor de vídeo para **ver** os 90 anos.

| | Autorar | Navegar |
|---|---|---|
| Metáfora | planilha | editor de vídeo |
| Horizonte | 12–24 meses | vida inteira |
| Quando | reunião semestral | qualquer hora |
| Densidade | alta, tabular | espacial, gestual |

**3. "Simples" e "detalhado" são o mesmo nível, não etapas.**
O cliente que fica no macro não está com o cadastro incompleto — está com o
cadastro **dele**. Isso derruba qualquer barra de progresso que trate o macro
como 30% preenchido, e derruba o wizard de quatro passos como estrutura
obrigatória.

**4. Doze rendas pioram muito o problema de layout que o UX levantou.**
Ele fez a conta com cinco rendas e achou 24px por pista em 390px — abaixo do
mínimo de toque. Com doze, faixa-por-renda é inviável no celular sem colapso
obrigatório e agrupamento por pessoa.

---

## Ainda em aberto

- Nome da terceira categoria: **Investimentos** × **Futuro e Sonhos**.
- A lista fechada de naturezas de renda (⚠ LACUNA desde o lote A).
- Como exatamente as duas ferramentas "se combinam na versão final" (B5) — é
  uma terceira tela, é a Projeção consumindo o Orçamento, ou é um relatório?

---

# Lote B · parte 2 — o roteiro canônico

## B6 · Cadastro de renda é modal; na régua, a renda é UMA variável

O problema de layout que o UX levantou **não existe**, porque o momento de
cadastrar é outro:

1. "Adicionar nova fonte de renda" → abre **janela modal**
2. Preenche todos os dados → **Salvar**
3. Aquele valor passa a compor a **renda da família — uma única variável**
4. "Detalhar rendas" lista o nome de cada fonte, e cada uma é clicável para ver
   o detalhe

Doze rendas cadastradas continuam sendo **uma linha** na linha do tempo. A
faixa-por-renda que eu tinha proposto some.

## B7 · A terceira categoria chama-se **Futuro e Sonhos**

Decidido. "Investimentos" sai.

## B8 · O roteiro, passo a passo, na voz do Nélio

### Etapa 1 · Orçamento detalhado — 24 meses, estrutura de planilha

Projetar receitas e despesas em detalhe nos próximos 24 meses, com valores
detalhados de gastos pontuais (presentes de Natal, seguro de carro, etc.).

As **micro-categorias expandem e colapsam** dentro das três macro:
**despesas fixas · ajustáveis · Futuro e Sonhos**.

### Etapa 2 · Mudanças de longo prazo, além dos 24 meses

> *"No terceiro ano eu vou passar a ter mais uma despesa de R$ 2.000 com a escola
> do meu filho, e a minha receita vai aumentar mais R$ 5.000."*
>
> *"No sexto ano, a minha receita aumenta mais R$ 10 mil e eu acrescento a
> despesa de R$ 4 mil do financiamento da minha casa."*
>
> *"E aí, por conveniência e preguiça, eu simplesmente digo que a partir do
> sétimo ano as minhas receitas e despesas vão ficar iguais e o meu valor de
> poupança vai ficar igual."*

A regra de continuidade **invocada pelo próprio usuário**, e nas palavras dele:
*por conveniência e preguiça*. Confirma o diagnóstico do psicólogo — ela é uma
alavanca de *ability*, e é assim que deve ser vendida na tela.

### Etapa 3 · Patrimônio — listar e repartir

Lista **bens · participações acionárias · patrimônio financeiro**.

O financeiro de **R$ 500 mil** é repartido:

| Caixinha | Valor |
|---|---|
| Reserva | R$ 100.000 |
| Compromissos | R$ 30.000 |
| Objetivo: compra da casa | R$ 170.000 |
| Liberdade financeira | R$ 200.000 |
| **Total** | **R$ 500.000** ✓ |

### Etapa 4 · Eventos financeiros da vida

| Quando | O quê | Observação |
|---|---|---|
| 7 meses | utilização do **valor atualizado** dos R$ 30 mil de compromissos | saque do **saldo** da caixinha, não de um número cravado |
| 24 meses | recebimento de **R$ 150 mil de um carro** | conversão de bem → financeiro |
| 4 anos | resgatar **R$ 230 mil** para dar entrada na casa | sai da caixinha "compra da casa" |
| ano 10 ao 15 | resgates mensais de **R$ 5.000** da liberdade financeira | custeio do intercâmbio do filho |

### Etapa 5 · Rentabilidade por caixinha

Alvo configurável por caixinha, flutuando de **3% a 9% de retorno real líquido**.

### Etapa 6 · Perpetuidade

Em **2050**, começar retiradas de perpetuidade — saque da rentabilidade
mantendo o principal — considerando retorno real líquido de **0,40% ao mês**.

### Etapa 7 · A tela da evolução patrimonial

Com tudo pronto, **uma única tela** onde dá para:

- navegar pelos próximos eventos
- enxergar tudo o que vai acontecer
- clicar em algum desses eventos ou detalhamento
- fazer alguma alteração

**Em cima:** a evolução do patrimônio.
**Embaixo:** os valores de aportes ou saques realizados, levando em conta o
orçamento projetado.

---

## O que o roteiro decide, e que estava em aberto

**1. "Real líquido" responde a pergunta do CFP.** Ele cobrou que a spec não
dizia se as taxas eram brutas ou líquidas de IR. O Nélio disse **"retorno real
líquido"** duas vezes, para as caixinhas e para a perpetuidade. Decidido: as
taxas configuradas já são líquidas de imposto e de inflação.

**2. Um evento novo que o motor ainda não tem: saque do SALDO.**
*"a utilização do valor atualizado daqueles 30 mil"* não é um saque de R$ 30.000
— é um saque **do que a caixinha valer naquele mês**. O motor tem `esvazia: true`
no `saquePontual`, que é exatamente isso, mas a semântica precisa ficar explícita
na interface: *"usar o que estiver na caixinha"* × *"usar R$ X"*.

**3. Duas unidades para a mesma coisa.** As caixinhas são configuradas em
**% ao ano** (3% a 9%); a perpetuidade, em **% ao mês** (0,40%). Convertendo,
0,40% a.m. = **4,91% a.a.**, que cai dentro da faixa — não há contradição, mas a
tela precisa de uma unidade só, ou de conversão visível ao lado.

**4. A faixa de 3% a 9% é uma trava, e resolve meio conflito com o CFP.**
Ele exigiu que a rentabilidade viesse de política de investimento versionada e
travada por suitability. O Nélio deu a faixa mas não a amarração ao perfil.
⚠ Continua em aberto: **um cliente conservador pode configurar 9%?**

**5. O carro entra como bem que vira dinheiro.** Mesma mecânica da ótica do
Ricardo — uma `transferencia` de `bens` para `financeiro`. Confirma que a camada
de bens precisa ser item a item, não um bloco só.

---

## B9 · Esvaziar a caixinha é o padrão — e o saque vira diagnóstico

> *"O ideal é esvaziar a caixinha e o cliente vê o quanto ele teria naquele
> momento. Inclusive, ele pode, com isso, descobrir que o valor separado por
> compromisso está abaixo. Vamos supor que, com a rentabilidade projetada, 30 mil
> virariam 32, e meu compromisso custa 35. Então tenho que voltar no patrimônio
> inicial e aumentar o valor que está destinado para aquele compromisso."*

O evento não só gasta — ele **testa se a caixinha foi dimensionada certo**. E o
resultado do teste devolve o cliente ao começo, para corrigir a repartição
inicial. É um laço fechado:

```
reparte o patrimônio  →  marca o evento  →  o motor projeta o saldo naquele mês
        ↑                                              ↓
        └──────── "faltam R$ 3.000" ←──── compara com o custo do compromisso
```

**Isto fecha o bloqueante que o Cliente levantou na rodada 07** — *"toda caixinha
precisa de meta e veredito; Formação dos filhos: R$ 111.308, isso é suficiente?
Não faço ideia"* — e fecha sem inventar mecanismo nenhum:

| Peça | De onde vem |
|---|---|
| **Prazo** | a data do evento |
| **Meta** | o valor do compromisso |
| **Veredito** | saldo projetado − meta |
| **Correção** | volta à repartição inicial |

O motor já sabe fazer as três primeiras. Falta a interface **mostrar o
confronto** e **oferecer o caminho de volta** — que é literalmente o
"caminho de volta na mesma tela, com igual peso visual" que a especificação
selada já exige (§10.3).

Consequência de modelo: a caixinha de compromisso ganha dois campos —
`custoEsperado` e `dataEsperada` — e o saque pontual passa a ter duas formas
declaradas na tela:

- **"usar o que estiver na caixinha"** (esvazia) — o padrão
- **"usar R$ X"** (valor fixo)

## B10 · Unidade das taxas: anual é a canônica, mensal é o apoio

> *"O ideal é sempre a gente pensar em retorno real líquido anual, mas, quando
> apresentamos esses dados, é valioso para o cliente entender essa equivalência
> mensal, porque muitas vezes ele enxerga a rentabilidade do investimento dele
> mensal."*

**Formato oficial:**

> 4,91% a.a. *(~0,40% a.m.)*

O parêntese em corpo menor e itálico. Vale em toda a plataforma onde uma taxa
aparecer — caixinha, perpetuidade, teste de estresse, legenda do gráfico.

Entrada de dado: **sempre anual**. A equivalência mensal é derivada, nunca
digitada — senão viram duas fontes da verdade para o mesmo número.

---

## B11 · A taxa é travada pelo suitability — e o que fazer com quem não o preencheu

> *"Não. A ideia é que, de fato, o cliente conservador tem uma trava de no máximo
> 7% de retorno real líquido por ano. Mais do que isso, ele é bloqueado pelo
> suitability."*

### Teto por perfil

| Perfil | Teto de retorno real líquido |
|---|---|
| Conservador | **7% a.a.** |
| Moderado | ⚠ LACUNA |
| Arrojado | ⚠ LACUNA |

A faixa configurável segue sendo 3% a 9% (B8, etapa 5); o perfil **corta o topo
dela**.

### O caso real: cliente sem suitability preenchido

> *"A gente sabe que muitos clientes vão usar a plataforma sem terem o
> suitability preenchido. Vale a gente pensar em um alerta na hora da
> configuração da taxa (…) de que essa é uma informação valiosa. Ele pode ou
> assumir o perfil de risco dele ou responder ao nosso questionário."*

Dois caminhos oferecidos **no momento em que a taxa é configurada**:

1. **Assumir o perfil** — o cliente declara qual acha que é o seu.
2. **Responder ao questionário de suitability** — a ferramenta oficial.

### ⚠ Os dois caminhos NÃO são a mesma coisa, e o dado precisa saber disso

Perfil **autodeclarado** não é suitability no sentido da Res. CVM 30 — é uma
premissa de planejamento que o cliente assumiu. Perfil vindo do **questionário**
é o instrumento regulatório.

Se os dois gravarem no mesmo campo, a plataforma passa a afirmar que tem
suitability de clientes que só chutaram o próprio perfil. Em auditoria isso é
pior do que não ter nada — foi exatamente a crítica que o CFP fez na rodada 05
sobre o banner que atestava um controle que não operava.

**Modelo exigido:**

```
PerfilDeRisco {
  perfil: conservador | moderado | arrojado,
  origem: 'questionario' | 'autodeclarado',
  respondidoEm, versaoQuestionario,
  valeParaSuitability: boolean   // true só quando origem = 'questionario'
}
```

E a consequência precisa aparecer na tela: com perfil autodeclarado, a taxa é
travada do mesmo jeito (proteção do cliente), mas os **capítulos que prescrevem
produto de investimento continuam bloqueados** — porque a trava fiduciária que
já existe no demo (rodada 05, `modulosPublicaveis`) exige suitability de verdade,
não um chute.

### O que isso confirma

A trava de suitability deixa de ter **uma** superfície e passa a ter **duas**:

| Superfície | O que trava | Desde |
|---|---|---|
| Publicação de capítulo da devolutiva | módulo que prescreve produto (PGBL) | rodada 05 |
| **Configuração da taxa da caixinha** | **teto de retorno real** | **agora** |

## B12 · O questionário de suitability é outra ferramenta a incorporar

> *"Que eu não vou te enviar agora. A gente também tem. Ele é super extenso, mas
> é uma das outras ferramentas que a gente tem que incorporar na plataforma."*

Entra na fila junto com as 7 calculadoras (A14). **⚠ LACUNA:** perguntas,
pontuação e mapeamento para os três perfis.
