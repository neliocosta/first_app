# Projeção de Vida — especificação v2

> **Status:** proposta, ainda não construída. Escrita a partir do item 3 do
> feedback do Nélio. Vai ao Gauntlet Loop antes de virar código.
>
> **⚠ LACUNA:** o Nélio compartilhou uma especificação anterior de ferramenta de
> orçamento (`chatgpt.com/share/6a7cd2c1-…`) que o proxy de egresso desta sessão
> bloqueia. O conteúdo dela **não** está incorporado aqui. Se houver conflito
> entre este documento e aquele, aquele ganha.

---

## 0. O que muda em relação ao que foi construído

A ferramenta entregue na rodada 06 estava certa no motor e errada na porta de
entrada: ela **chegou pronta**. Todos os campos preenchidos, sem uma sequência
pela qual o cliente — ou o consultor com o cliente — construísse aquilo.

E o modelo de dados era pobre demais para uma família real:

| Construído (v1) | Necessário (v2) |
|---|---|
| Uma receita, um número por janela | **Várias rendas**, por pessoa, cada uma com periodicidade própria |
| Orçamento declarado por janelas fixas | Orçamento definido por **eventos de mudança**; o resto se repete |
| Indivíduo | **Família** |
| Sem classificação de renda | **Ativa / passiva**, e natureza da ativa |
| Precisão uniforme em 46 anos | **Precisão decai com a distância, e isso é declarado** |
| Tela dentro do shell, com bottom nav | **Tela cheia**, navegação de editor de vídeo |

Duas frases do Nélio que governam o resto do documento:

> *"Existe uma sequência lógica para que o cliente preencha isso, ou o consultor
> junto com o cliente."*

> *"Se um determinado período não foi especificado uma mudança, ele simplesmente
> vai repetindo a última proposta de receitas e despesas e sobra de caixa ou
> déficit de caixa."*

A segunda é a mais estruturante do documento inteiro. Ela inverte o modelo: o
orçamento **não** é uma lista de janelas que alguém precisa preencher até o fim
da vida. É uma lista de **mudanças**. O silêncio entre duas mudanças não é
lacuna — é continuidade declarada. Isso é o que torna "desenhar 90 anos"
uma tarefa de minutos em vez de uma planilha impossível.

---

## 1. A sequência de preenchimento

Quatro fases, nesta ordem. A ordem não é arbitrária: cada fase usa o que a
anterior estabeleceu, e a **fidelidade do dado cai a cada fase** — o que é
honesto e precisa aparecer na tela.

### Fase 1 · Os próximos 12 meses, com precisão

Fonte: extrato de cartão de crédito, contas a vencer, faturas conhecidas.
É o único trecho da projeção que pode ser **quase exato**.

- Entradas: cada renda da família, mês a mês (§2).
- Saídas: as despesas conhecidas, mês a mês, incluindo as não-mensais que já
  têm data (IPVA, IPTU, matrícula escolar, seguro).
- Proveniência do trecho: `validado` quando vier de importação;
  `declarado` quando o cliente digitar.

> **⚠ LACUNA:** a importação de cartão de crédito e contas (Open Finance? CSV?
> agregador?) não está definida. Fonte, escopo do consentimento LGPD e
> periodicidade de atualização são decisão do Nélio + jurídico.

### Fase 2 · O orçamento macro

Aqui se chuta, e tudo bem — desde que fique dito que se chutou.

Uma linha de receita agregada e uma de despesa agregada por mês típico, que
valem **a partir do 13º mês** e se estendem até o fim da vida, salvo mudança.
Proveniência: `estimado`.

### Fase 3 · Eventos de mudança do orçamento

O que faz o macro deixar de ser uma reta. Exemplos dados pelo Nélio:

- um novo emprego;
- um aumento de custo pelo nascimento de um filho;
- uma redução de custo porque terminou a parcela do carro.

Cada evento tem mês, sinal e valor. Entre um evento e o seguinte, **repete**.

### Fase 4 · Eventos de mudança de patrimônio

- comprar a casa daqui a dois anos;
- sacar R$ 50.000 daqui a três anos para uma viagem;
- sacar R$ 150.000 daqui a dez anos.

São os oito tipos de evento que o motor v1 já implementa e conferiu
(`docs/…/gauntlet/rodada-06.md`).

### O que a tela precisa mostrar sobre isso

A precisão cai da fase 1 para a fase 4, e a projeção não pode fingir o
contrário. Proposta: **a régua do tempo muda de textura** — os 12 primeiros
meses sólidos, o macro em tom mais leve, o pós-último-evento hachurado, com a
legenda *"daqui em diante, repetindo o último cenário"*.

Isso resolve de uma vez a exigência de proveniência que o CFP e o engenheiro
levantaram na rodada 06 e que a v1 não cumpria.

---

## 2. Renda — o modelo que a v1 não tinha

> *"Como a gente está falando de orçamento familiar, eu posso ter várias
> composições de renda. E mesmo uma só pessoa também pode ter várias rendas."*

Exemplo do Nélio, que vira o caso de teste:

| Pessoa | Renda | Classe | Natureza | Periodicidade |
|---|---|---|---|---|
| Marido | Salário | ativa | Registrado (CLT) | mensal |
| Marido | Aluguéis | passiva | — | mensal |
| Marido | Aulas | ativa | Profissional liberal | **trimestral** |
| Esposa | Empresa | ativa | Empresária | mensal |
| Esposa | Eventos | ativa | Profissional liberal | **semestral** |

### Entidade

```
Pessoa { id, nome, papel: titular|conjuge|dependente, dataNascimento }

Renda {
  id, pessoaId, nome,
  classe: 'ativa' | 'passiva',
  natureza,              // obrigatória quando classe = 'ativa'
  valor,
  periodicidade: 'mensal' | 'bimestral' | 'trimestral' | 'semestral' | 'anual',
  mesAncora,             // em qual mês do ciclo cai (ex.: trimestral a partir de março)
  inicio, fim,           // fim = null → segue até mudar
  proveniencia, reajusteReal   // ⚠ LACUNA: política de reajuste real é da consultoria
}
```

### Por que ativa × passiva não é enfeite

É a distinção que sustenta o plano de aposentadoria inteiro: **renda ativa é a
que acaba quando a pessoa para de trabalhar.** É exatamente ela que o patrimônio
precisa substituir. Renda passiva atravessa.

Consequência direta na tela: a soma das rendas **ativas** é a meta que a
liberdade financeira tem de cobrir. Isso dá, de graça, a leitura que o
psicólogo exigiu na rodada 06 (*"traduzir estoque em fluxo"*) com um número que
significa alguma coisa na vida do cliente.

### Por que a natureza da renda ativa importa

Não é taxonomia burocrática — cada natureza muda o plano:

- **CLT** → FGTS, INSS, 13º, férias, estabilidade maior, seguro-desemprego.
- **Empresário** → pró-labore × distribuição de lucros, tributação diferente,
  renda mais volátil, e a empresa é um ativo (a ótica do Ricardo).
- **Profissional liberal** → sem FGTS, INSS por conta própria, sazonalidade.
- **Estagiário** → temporária por definição; tem data para acabar.

**⚠ LACUNA:** a lista fechada de naturezas e o que cada uma dispara no plano
(FGTS? 13º? INSS?) precisa vir do Nélio/CFP. O que está aqui é a estrutura, não
o conteúdo financeiro.

### Periodicidade não-mensal

Uma renda trimestral **não** vira "valor ÷ 3 por mês". Ela cai no mês em que
cai, e o fluxo de caixa tem de mostrar o soluço — é justamente nos meses sem
ela que o orçamento aperta. Achatar em média mensal esconde o problema que a
ferramenta existe para revelar.

---

## 3. Orçamento por mudanças, não por janelas

```
EventoDeOrcamento {
  id, mes, rotulo,
  alvo: 'renda' | 'despesa',
  rendaId?,                    // quando altera uma renda específica
  tipo: 'inicia' | 'encerra' | 'altera',
  valor, valorNovo?,
  motivo,                      // "nasceu a filha", "quitou o carro", "novo emprego"
  proveniencia
}
```

**Regra de continuidade (a frase do Nélio, virada em invariante):**
para qualquer mês `m` sem evento, receitas, despesas e o resultado do mês são
**idênticos** ao mês `m−1`. O motor não interpola, não suaviza, não zera.

Isso precisa de um teste na bancada, porque é a regra que o cliente vai
verificar primeiro.

---

## 4. Navegação: editor de vídeo, em tela cheia

> *"Quero uma ferramenta que ocupe a tela cheia e que eu consiga navegar por ela
> como é feita a navegação de um editor de vídeo."*

A metáfora é boa e vai além do zoom: um editor de vídeo tem **faixas
paralelas sobre uma régua de tempo comum**. É exatamente a estrutura que
múltiplas rendas pedem.

### Layout

```
┌──────────────────────────────────────────────────────────────┐
│ cabeçalho fino: mês em foco · total · [vida toda|10 anos|2 anos] │
├──────────────────────────────────────────────────────────────┤
│ FAIXA 1 · Patrimônio            área empilhada por caixinha  │
├──────────────────────────────────────────────────────────────┤
│ FAIXA 2 · Rendas       ┌ Salário (CLT) ─────────────────────┐│
│                        ┌ Aluguéis ──────────────────────────┐│
│                        ┌ Aulas ─ ┐   ┌ ─ ┐   ┌ ─ ┐  ← trimestral
│                        ┌ Empresa ───────────────────────────┐│
│                        ┌ Eventos ──┐        ┌ ──┐  ← semestral│
├──────────────────────────────────────────────────────────────┤
│ FAIXA 3 · Despesas              barras + eventos de mudança  │
├──────────────────────────────────────────────────────────────┤
│ FAIXA 4 · Eventos do plano      ícones na régua              │
├──────────────────────────────────────────────────────────────┤
│ régua do tempo · minimapa da vida inteira                    │
└──────────────────────────────────────────────────────────────┘
```

A renda trimestral aparece como **clipes espaçados** na faixa dela — o mesmo
vocabulário visual de um editor. Ver os buracos entre os clipes é ver o mês
que aperta.

### Gestos (o que a v1 já tem e continua valendo)

Arrastar para os lados, pinça e roda para o zoom, inércia ao soltar, escala
vertical que corta a base no zoom curto (senão vira uma laje), minimapa da vida
inteira, toque para inspecionar.

### Botão de visão — três estados

`vida toda` · `próximos 10 anos` · `próximos 2 anos`

Substitui os quatro presets da v1 (`7 meses / 2 anos / 10 anos / tudo`).
Os três são **âncoras a partir de hoje**, não recentragens no mês em foco.

### Tela cheia

Sai do shell com bottom nav. Entra e sai com transição, e a saída precisa ser
óbvia — tela cheia sem porta de saída visível é a reclamação nº 1 de qualquer
modo imersivo.

**⚠ Decisão pendente do Nélio:** a Home lista *"Meu Orçamento"* e *"Meu
Planejamento Patrimonial"* como **duas** portas. Este documento assume que são
**duas entradas para a mesma ferramenta em tela cheia**, com foco inicial
diferente (uma abre nas faixas de renda/despesa, a outra na faixa de
patrimônio). O acoplamento entre as duas foi a razão de existir da ferramenta
— *"as duas ferramentas acabam andando juntas"* — e separá-las em dois motores
recriaria a divergência de fonte da verdade que o painel já cobrou.

---

## 5. O que isso obriga a mudar no motor v1

O motor de `projecao.js` continua válido no núcleo (ordem dentro do mês,
prioridade de eventos, PMT antecipado, conciliação, perpetuidade). Muda a
entrada:

1. `orcamento: [janelas]` → derivado de `rendas[] + eventosDeOrcamento[]`.
2. Nova função `orcamentoDoMes(m)` que resolve rendas por periodicidade e
   aplica os eventos acumulados, com a **regra de continuidade**.
3. `fluxo` ganha a decomposição por renda, não só o total — a tela precisa
   desenhar as faixas.
4. A conciliação (`sobra = aportes − saques`) não muda.

---

## 6. Perguntas abertas para o Nélio

1. **A especificação de orçamento que você compartilhou** — o link está
   bloqueado aqui. Cole o conteúdo e eu incorporo antes do Gauntlet.
2. **Lista fechada das naturezas de renda ativa**, e o que cada uma dispara
   (FGTS, 13º, INSS, férias).
3. **Categorias de despesa** — o macro é um número só, ou tem categorias? Se
   tem, quais?
4. **Reajuste real das rendas** ao longo dos anos: 0% real por padrão? Por
   natureza? Premissa da consultoria?
5. **Importação de cartão/contas** na fase 1: fonte, consentimento, frequência.
6. **Uma ferramenta ou duas portas** (§4).
7. **Quem preenche o quê** — o cliente sozinho, o consultor, ou os dois na
   reunião? Muda a densidade e o tom da interface inteira.
