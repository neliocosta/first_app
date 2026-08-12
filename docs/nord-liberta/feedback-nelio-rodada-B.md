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
