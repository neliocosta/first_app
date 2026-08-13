# Projeção de Vida — especificação v4

> **Status:** proposta reescrita. Substitui `projecao-de-vida-v3.md`, que fechou **0/6** na
> rodada 08. Entra com os **28 bloqueantes** daquela rodada endereçados e com as **três decisões
> do lote C** — expectativa de vida, taxa de referência e abertura ao self-service.
>
> **Governança:** subordinada a `../00-contexto-v5.md` (§9, princípios invioláveis) e à
> especificação selada `especificacao-v3.md`. Onde esta ferramenta muda a selada, a mudança está
> no §17 — e **delta que remove requisito convergido vem com parecer, nunca com linha de tabela**
> (aprendizado da rodada 08).
>
> **Conteúdo financeiro pendente está no §18. Nada é inventado.** Todo número `ILUSTRATIVO` sai
> do motor, com a premissa que o produziu ao lado (regra nova — §0.3).

---

## 0. O que mudou desde a v3

### 0.1 As três decisões do lote C, e o que elas destravam

| | Decisão | Fecha |
|---|---|---|
| **C1** | Expectativa de vida = **95 anos**, parâmetro da casa | a amplitude de 2,04× na meta (§7) |
| **C2** | Taxa de referência = **4,91% a.a. (~0,40% a.m.)**, real líquida, configurável no Admin | o glide path que o motor praticava sem declarar (§7, §11) |
| **C3** | **Self-service faz a projeção**; a fronteira é relatório, tarefas e reunião | a contradição A12/A13 × selada §3.1 (§3.4) |

O número-título passa a ser calculável:

> **Você precisa ter R$ 2.847.982 guardados para viver sem trabalhar.**
> *R$ 16.000 por mês, dos 69 aos 95 anos, a 4,91% a.a. (~0,40% a.m.).*

### 0.2 As sete convergências da rodada 08

| Convergência | Achada por | Onde fecha |
|---|---|---|
| O §16 apagava "Minha jornada" numa linha | Cliente · CFP · Eng · Psi | §17.1 — a aba fica, com parecer; e §13.5 cria a chave `Objetivo` ↔ `Caixinha` |
| A meta não fechava em um número | Cliente · CFP · Eng | §7, com C1 e C2 |
| Aderência ÷ projetados degenerava | Cliente · CFP · Eng · Psi | §12.4 — janela móvel de 12 meses, com as quatro bordas tratadas |
| O rascunho não produzia curva | Cliente · UX · Eng · Psi | §3.1 e §5.5 — o "por alto" **é** o mês-base |
| 4×2 = 8 glifos para 9 tipos | UX · Eng · Redator | §9.8 — três cadências, ∞ e calendário preservados |
| A anatomia media o aparelho, não a viewport | Cliente · UX · Eng | §9.1 — 390 × 664, com folha inferior |
| "Caixa" ganhou dois sentidos | Cliente · CFP · Redator | §15 — uma palavra por objeto |

### 0.3 Os erros de aritmética da v3, corrigidos

| Erro | Correção |
|---|---|
| Card ilustrativo implicava **12,30% a.a.**, acima do teto de 9% | §6.4 — número do motor, premissa ao lado, e agora sob `tetoPorPrazo` |
| Invariante da continuidade era **tautologia** | §5.4 — teste diferencial que pode falhar |
| `faixaRetorno.min: 3%` invalidava o cenário-âncora (imóveis e ótica a 0%) | §11.1 — mínimo 0%, e a faixa vale só para caixas financeiras |
| §9.8 dizia "oito tipos"; o registro lista **nove** | §9.8 e §13.4 |
| §9.1 omitia `participações` — 49,9% do cenário | §9.1 |
| Quatro referências cruzadas quebradas | conferidas nesta versão |
| Omissão de `componentes[].prov` reabria bloqueante da rodada 06 | §5.7 — contrato de saída de `resolve()` |

**Regra nova, que nasce do card errado:** todo número marcado `ILUSTRATIVO` **sai do motor**,
com a premissa que o produziu impressa ao lado. Número ilustrativo escrito à mão é como se
entrega uma projeção impossível dentro das próprias regras da casa.

---

## 1. O que a ferramenta é

Uma tela onde a pessoa vê o que acontece com o patrimônio dela ao longo da vida e mexe nisso.
Horizonte de 80–90 anos. Projeção pura: não tem realizado, não classifica transação, erra por
premissa e não por classificação.

O que ela responde, em ordem de importância:

1. *"O que vai acontecer com o meu dinheiro?"* — a curva.
2. *"O que acontece nos próximos meses?"* — a janela curta, onde a vida acontece.
3. *"Cada coisa que eu separei dá conta do que ela tem que pagar?"* — o veredito por objetivo (§6.4).
4. *"Quanto eu preciso ter para parar?"* — a meta (§7).
5. *"Se eu mudar isso, o que muda?"* — a simulação (§9.9).

**Não é app de acompanhamento.** Nenhuma notificação nasce desta ferramenta (única exceção: o
convite humano do §11.3). Nenhuma mecânica diária, em nenhuma superfície.

---

## 2. A fronteira com o Orçamento Familiar

Duas ferramentas que convergem aqui (B5). Horizonte de 24 meses × 90 anos; uma tem realizado, a
outra é projeção pura.

**O elo tem sentido único e agora carrega marcação item a item** (correção do Engenheiro — sem
ela o aporte projetado nasce inflado, e ele virou denominador de indicador):

```
Orçamento Familiar                             Projeção de Vida
──────────────────                             ────────────────
Renda consolidada
  ├─ Fixos           (≈50%)
  ├─ Ajustáveis      (≈30%)
  └─ Futuro e Sonhos (≥20%)
        ├─ dentro do aporte  ──────────────►   aportes nas caixas, meses 1–24
        │   (reserva, objetivos, liberdade)
        └─ fora do aporte     ─────────────►   despesa, não poupança
            (seguro de vida R$ 190/mês,
             provisão de Natal)
```

*"Futuro e Sonhos"* é mais larga que "poupança": a provisão de Natal e o prêmio do seguro moram
ali e **não** são acumulação. A selada §10.3 já exige essa marcação item a item; ela atravessa a
fronteira junto com o número.

**Conversão de unidade na fronteira** (defeito achado pelo Engenheiro): o Orçamento converte
tudo para base mensal (diário útil × 22, semanal × 4,3, anual ÷ 12); a Projeção **proíbe**
achatar. A regra na fronteira é: os meses 1–24 chegam **já achatados**, e isso é declarado na
textura (§9.4); do mês 25 em diante a periodicidade volta a valer como estado (§5.2).

**Sem Orçamento**, a Projeção funciona sozinha com o mês-base do rascunho (§3.1), e os meses 1–24
têm a mesma textura dos meses 25+ — nada finge precisão que não tem.

---

## 3. Como isto é construído

### 3.1 Passo zero · O rascunho, em 3 minutos

**A correção da rodada 08:** a v3 prometia curva em quatro perguntas e entregava 97% de cinza,
porque o §5.5 exigia um mês-base que o rascunho não tinha, e o §4.6 exigia um `fim` de renda que
ninguém declarava. Quatro agentes acharam isso por caminhos diferentes.

**Quando existe coleta, o rascunho vem preenchido dela** (arbitragem B da rodada 08). Renda,
despesa, patrimônio e idade são campos-âncora da selada §5 — a Monique já os preencheu, e o
§16.1 explicitamente permite derivar do dado do próprio cliente. As perguntas só aparecem para
quem não tem coleta: o self-service (C3) e o cliente antes da coleta.

**As perguntas, quando é preciso perguntar:**

| # | Pergunta | Vira | Nota |
|---|---|---|---|
| 1 | "Quanto entra na sua casa por mês, somando todo mundo?" | renda consolidada | aceita *"só a minha, completo depois"* |
| 2 | "Quanto sai, por alto?" *(ou "quanto sobra no fim do mês?")* | **o mês-base** (§5.5) | duas portas; uma deriva a outra |
| 3 | "Quanto você já tem guardado, por alto?" | saldo do financeiro | escopo dito: *"bancos e investimentos, sem contar imóveis"* |
| 4 | "Com o que você contou, dá para parar por volta dos **67**." | idade de parada | **derivada e arrastável** |

**Três coisas que mudaram, e cada uma fecha um achado:**

1. **A pergunta 2 é o mês-base.** Declarada pelo cliente, proveniência `declarado`. Isto é o que
   faz a curva existir — sem ela, o §5.5 a pinta de cinza inteira.
2. **A pergunta 4 virou reação, não construção** (Psicólogo). "Com que idade você quer parar?"
   é a única das quatro que a pessoa não tem guardada na memória — ela fabrica na hora, e para
   um homem de 54 anos carrega ameaça de identidade. O motor deriva a resposta das três
   primeiras e **ele arrasta**. Reagir é barato; produzir do zero é caro.
3. **"Por alto" e faixa valem em todas**, não só na segunda.

**O `fim` das rendas no rascunho** (o veto do Cliente, reaberto pela porta da frente na v3):
a idade de parada vira **proposta visível** de fim para as rendas que dependem de trabalho, com
proveniência `estimado` e uma frase editável na primeira tela da curva:

> *"Estou supondo que a renda do seu trabalho vai até os 67 — toque para mudar."*

Proposta com critério à vista e reversível é trabalho; número de fábrica é invenção (§16.1).

**A repartição inicial declara o critério ou não existe** (Psicólogo). Se a proposta usa regra da
casa — reserva = N meses de custo de vida —, o critério aparece na tela e `N` entra em
`ParametrosDaCasa`. Do contrário, pergunta. ⚠ O valor de `N` é do §18.

**A curva anuncia o que ainda não considera.** Sem isso, cada refinamento posterior piora o
desenho e o produto ensina, por condicionamento, que engajar-se com a ferramenta faz a vida
parecer pior. Expectativa cumprida não é perda; surpresa desagradável é.

### 3.2 O roteiro completo — as sete etapas (B8)

Trabalho de reunião, densidade de planilha (§10.1).

| Etapa | O quê | Onde |
|---|---|---|
| 1 | Orçamento detalhado, 24 meses, com pontuais | §5.1, §5.2 |
| 2 | Mudanças de longo prazo | §5.3 |
| 3 | Patrimônio: listar bens, participações, financeiro; repartir | §6.1, §6.2 |
| 4 | Eventos financeiros da vida | §6.4, §13.4 |
| 5 | Rentabilidade-alvo por caixa | §6.5, §11.1 |
| 6 | Perpetuidade | §6.6 |
| 7 | A tela | §9 |

`ILUSTRATIVO` — a repartição da etapa 3 na voz do Nélio: R$ 500.000 → Reserva R$ 100.000 ·
Compromissos R$ 30.000 · Compra da casa R$ 170.000 · Liberdade R$ 200.000. A soma **tem** de
bater, e a tela mostra o que falta repartir enquanto não bate.

### 3.3 A sessão de autoria termina em algo (Psicólogo)

O trabalho mais pesado do produto — planilha, 24 meses, reunião — terminava em nada. Pela regra
do pico-fim, a memória da sessão inteira é a memória do último minuto dela.

O fecho **não mede completude** (nada de barra de progresso, §5.2) — ele narra o que o trabalho
comprou:

> *"Seu plano agora enxerga 24 meses em detalhe. A sua data de liberdade financeira saiu de
> 'ainda não sabemos' para 2041."*

### 3.4 Quem usa o quê (C3)

| | Self-service | Contratante |
|---|---|---|
| Rascunho, roteiro, tela, simulação | ✅ | ✅ |
| Relatório entregue (§9.11) | ❌ | ✅ |
| Tarefas em aberto preenchidas | ❌ | ✅ |
| Agendamento de reunião | ❌ | ✅ |

**A fronteira é o trabalho humano, não a ferramenta.** A ferramenta mostra; ela não conclui.

Quatro consequências, todas obrigatórias:

1. **Nenhuma tarefa nasce aqui.** Tarefa nasce de vertical, na devolutiva, com o consultor. Para
   o self-service a coluna de ação continua vazia — estado honesto (selada §10.4).
2. **Suitability autodeclarado é permanente** para o self-service: a taxa é travada do mesmo
   jeito (proteção), e os capítulos que prescrevem produto seguem bloqueados (§11.2).
3. **Rascunho de self-service não gera item de radar.** A conversão acontece no produto, pelo
   convite; o consultor entra quando o lead pede.
4. **O `mesDeRuina` do self-service termina no convite**, nunca num alerta sem saída (§9.9). Ele
   não tem reunião para marcar — a tela tem de terminar em algum lugar digno.

⚠ **LGPD com prioridade alta:** o volume de titulares sem contrato passa a ser maior que o de
clientes. Base legal, finalidade e retenção próprias (§18).

---

## 4. Renda

### 4.1 O cadastro, em uma pergunta por vez

**A pergunta binária da v3 morreu** (Redator): o §4.1 antigo perguntava *"você precisa trabalhar
para receber isso?"* e três parágrafos adiante o §4.3 perguntava a mesma coisa com três
respostas — o cliente respondia duas vezes, e a primeira resposta era a que o CFP havia
declarado errada.

O modal, na ordem do B3:

> **Nova fonte de renda**
>
> **1. De quem é essa renda?** → Ricardo · Marta · outra pessoa
> **2. Como você chama essa renda?** → *"Pró-labore da ótica"*
> **3. Se você parar de trabalhar, essa renda…** → **( ) Acaba ( ) Diminui ( ) Continua igual**
>   — se **Diminui**: *"Quanto continuaria entrando por mês?"*
> **4. De onde vem essa renda?** → *Do meu trabalho, só · De um imóvel · De uma empresa minha · De outro bem meu*
> **5. Que tipo de trabalho é?** *(só quando Acaba ou Diminui)*
> **6. Quando ela cai?** + *"Em que meses?"*
> **7. Quanto entra?** → valor **ou** *"Varia — de R$ ___ a R$ ___"*
> **8. Até quando?** *(obrigatório quando Acaba ou Diminui — §4.6)*
> **9. Essa renda continua se a pessoa faltar?** *(§4.8)*

A pergunta 4 substitui *"essa renda vem de algum bem seu?"*, que **falhava exatamente no caso que
a justificou**: o dono da ótica responde "não", porque empresa é participação, não bem — e o §4.3
inteiro deixava de servir.

### 4.2 Na régua, a renda é UMA variável (B6)

Doze rendas cadastradas continuam sendo **uma linha**. "Detalhar rendas" abre a lista; cada fonte
é clicável. A faixa-por-renda não existe nesta especificação.

### 4.3 Três dimensões independentes

O binário ativa/passiva quebra no caso mais comum da carteira. Três eixos, cada um com uma
pergunta em português:

| Dimensão | Pergunta | Valores |
|---|---|---|
| `dependenciaDoTrabalho` | *"Se você parar de trabalhar…"* | `acaba` · `diminui` (+ quanto persiste) · `continua` |
| `ativoLastroId` | *"De onde vem essa renda?"* | id do ativo, ou nenhum |
| **`terminaComAMorteDoTitular`** | *"Continua se a pessoa faltar?"* | sim · não · vira pensão (% + duração) |

**A terceira é nova, e fecha o veto do Cliente pelo lado que a v3 tinha deixado aberto** (CFP):
a v3 dizia *"renda com `continua` pode não ter fim, porque aí é verdade"*. **Não é verdade.**
É verdade para aluguel e royalties; é mentira de décadas para INSS, previdência vitalícia e
pensão alimentícia — que morrem com o titular. O veto foi cumprido na letra e reaberto no campo
ao lado.

| Renda | Depende do trabalho | Lastro | Morre com o titular |
|---|---|---|---|
| Salário CLT | acaba | — | sim |
| Aluguel | continua | imóvel | não (vai ao espólio) |
| Pró-labore da ótica | acaba | ótica | sim |
| Distribuição de lucros com gestor | diminui | ótica | não |
| INSS | continua | — | **sim — vira pensão** |

"Renda ativa" segue existindo como rótulo **derivado**, uso interno. Não vai à tela (§15).

**`Renda.valor` é declarado como bruto ou líquido** — campo obrigatório, com a mesma unidade
valendo na fronteira com o Orçamento (§2). Num pró-labore de R$ 30 mil isso é ~30% de diferença
atravessando a fronteira (CFP).

### 4.4 Periodicidade e clipes

Renda trimestral **não** vira valor ÷ 3: cai no mês em que cai, e o fluxo mostra o soluço.
Achatar esconde o problema que a ferramenta existe para revelar.

**Regra que faltava** (Engenheiro): periodicidade **submensal agrega** dentro do mês (semanal,
quinzenal — é soma dos eventos do mês, não média); **supramensal aterrissa** no mês da âncora.
Lista fechada: `semanal · quinzenal · mensal · bimestral · trimestral · semestral · anual`.

**A natureza semeia clipes:** CLT cria, sem digitação, os clipes de **13º** e **férias**. Só CLT
— o campo aberto marcado `estimado` **não** semeia por analogia (§16.1).

Na tela: **"13º salário (dezembro)"** e **"Férias (mês que você escolher)"**. Nunca "clipe".

### 4.5 Faixa mínimo–máximo

Renda que varia aceita **de quanto até quanto**. Na tela vira **banda**:

- a linha é desenhada pelo **piso** — padrão fiduciário;
- a banda até o teto aparece em tom leve: *"projetado pelo menor valor que você informou
  (R$ 8.000)"*;
- **a banda chega ao §9**: o palco desenha a área do piso sólida e a faixa até o teto em
  contorno; a leitura da janela devolve **intervalo** quando há faixa, não um número só.

**Assimetria declarada na tela:** a renda é projetada pelo piso e a despesa pelo valor único.
É escolha defensável, mas o cliente não pode supor que a prudência vale dos dois lados.

### 4.6 `fim` deixa de ter padrão

Renda com `acaba` ou `diminui` **exige** fim declarado — por idade, data ou evento. Sem ele, a
projeção daquela renda é `indeterminado` (§5.6): nunca "para sempre", nunca zero.

Resolvida a contradição interna da v3: **no modal o cadastro não fecha sem `fim`; no rascunho o
`fim` vem proposto da idade de parada, visível e editável** (§3.1). São dois momentos, duas
regras, ambas escritas.

### 4.7 Alienar o ativo encerra a renda — dois ramos (B4)

```
alienação TOTAL do ativo A no mês m:
    para toda renda R com ativoLastroId = A →  R.fim = m
alienação PARCIAL de p% no mês m:
    para toda renda R com ativoLastroId = A →  R.valor ×= (1 − p),  proveniência = estimado
```

**A correção da rodada 08:** o invariante único da v3 zerava 100% de uma renda que o §4.3 diz que
apenas *diminui*. E para `diminui`, `fim` carregava dois significados — fim da renda × data em
que ela cai para o percentual que persiste. **`mesTransicao` passa a ser campo separado de
`fim`**, que é a mesma classe de bug que o §4.6 foi escrito para matar.

Bancada (§19): *nenhuma renda sobrevive ao ativo que a lastreia; nenhuma alienação parcial zera
uma renda.*

### 4.8 O que acontece quando a pessoa falta

`terminaComAMorteDoTitular` alimenta o §8 diretamente. Quando o valor é **"vira pensão"**, o
cadastro pede percentual e duração — ⚠ as regras legais de pensão por morte são do §18; a
**estrutura** está aqui, o **conteúdo** não.

---

## 5. Despesa, orçamento e continuidade

### 5.1 Três categorias (B1, B7)

**Despesas fixas · Ajustáveis · Futuro e Sonhos.**

Referências de saúde (fixos ≤50%, ajustáveis ≤30%, Futuro e Sonhos ≥20%) são **parâmetro da
casa** (§11.1). No macro, alerta educativo sem bloquear; no micro, a soma das subcategorias não
pode estourar o teto da própria categoria.

**O alerta é física, não virtude** (Psicólogo). Disparar julgamento sobre uma escolha de vida é a
mesma família que o §16.4 proíbe — só troca "outras famílias" pelo "ideal da casa":

> ~~"seus gastos fixos estão acima do ideal"~~
> **"Com 62% em fixas, sobram R$ 3.800 para Futuro e Sonhos, e 2041 vira 2046."** + caminho de volta

Sem adjetivo, sem "ideal", sem semáforo moral.

### 5.2 Duas dimensões de granularidade (B1)

Ambas de primeira classe. **O nível simples não é versão incompleta do detalhado.**

| | Macro | Detalhado |
|---|---|---|
| **Categoria** | três números | quebra em condomínio, IPTU, parcela, plano de saúde… |
| **Tempo** | "ganho 15, gasto 12" | mês a mês; mudanças pontuais; provisões |

Fica derrubado: **nenhuma barra de progresso** tratando o macro como 30% preenchido; **nenhum
wizard obrigatório**; **nenhum badge** por "completar o orçamento" — premiaria volume de
digitação, que não é comportamento financeiro. Detalhar é oferta, não dívida.

### 5.3 Mudanças, não janelas

```
MudancaDeOrcamento {
  id, mes, rotulo,
  alvo: 'renda' | 'despesa',
  rendaId?, categoria?, subcategoria?,     // subcategoria: "a parcela do tablet" (B1)
  tipo: 'inicia' | 'encerra' | 'altera',
  modo: 'delta' | 'absoluto',              // desambiguado — a fala do Nélio é delta
  valor, motivo, proveniencia
}
```

Duas mudanças no mesmo mês sobre o mesmo alvo aplicam-se **na ordem de `id`**, e a tela mostra as
duas — nunca resolve silenciosamente.

Na tela: *"o que muda em {mês}"*. E a alavanca de ability, com o sujeito explícito (Redator):
**"A projeção segue igual até você dizer o contrário."** A palavra "preguiça" é do Nélio e nunca
chega à tela — o atalho se atribui ao desenho, jamais ao caráter do cliente.

### 5.4 A continuidade, com invariante que pode falhar

```
estado(m)    = estado(m−1) com as mudanças de mês m aplicadas
resultado(m) = resolve( estado(m), calendario(m) )
```

**A correção da rodada 08:** o invariante da v3 — `estado(m) === estado(m−1)` quando não há
mudança — é **verdadeiro por construção**. É a definição reescrita como asserção, e um teste que
afirma uma definição não pode falhar. Mesma família que a bancada já corrigiu uma vez.

**Os invariantes que podem falhar:**

1. **`resolve()` é pura:** chamá-la duas vezes com o mesmo estado dá o mesmo resultado.
2. **Realizar não muta:** a realização de um clipe (13º em dezembro, trimestre em junho) **não**
   escreve no estado.
3. **Diferencial:** no mês do clipe, `estado(m) === estado(m−1)` **e** `resultado(m) ≠
   resultado(m−1)`.

O terceiro é o que pega o defeito original: quem gravar o valor realizado de volta no estado
propaga o 13º por 89 anos e passaria no invariante antigo.

### 5.5 O mês-base

Não parte do mês 24 — parte de um **mês-base declarado**. Na tela: *"Como é um mês normal na sua
casa?"*.

**Duas origens** (correção da colisão §3.1 × §5.5):

- **Declarada:** *"quanto sai, por alto"* do rascunho **é** o mês-base, proveniência `declarado`.
- **Proposta:** dos 24 meses do Orçamento, usando **só o Orçamento Micro recorrente**.

**"Recorrente" deixa de ser heurística e passa a ser tipo de registro** (Engenheiro). A fonte do
Nélio já separa três entidades: *Orçamento Micro* (recorrente, com periodicidade), *Despesa
Pontual* e *Despesa Parcelada*. As duas últimas **nunca** entram no mês-base — por definição
acontecem no mês delas.

A proposta mostra o que excluiu, **sem exigir expandir**:

> **"Não incluímos:** IPVA (janeiro), presentes (dezembro), 5 parcelas da viagem (março a julho)."

Sem mês-base confirmado, o mês 25 em diante é `indeterminado` — **nunca a repetição de dezembro,
nunca zero.** É o que absolve a proposta de ser default disfarçado: **não confirmar não equivale
a aceitar.**

**A despesa ganha periodicidade de primeira classe** (bloqueante do Engenheiro). Sem isso, o IPVA
sobrevivia 90 anos ou sumia no mês 25 conforme a porta por onde o cliente digitou — e o viés era
**otimista**, que é a direção fiduciariamente pior. Com `periodicidade` e `mesAncora` na despesa,
"anual" é **estado** e não exclusão.

### 5.6 `indeterminado` nunca é zero

Palavra única em todo o produto (a selada já a usa em §6.4). **Representação: sentinela tipada
com funções totais.** `NaN` não serve — comparação com `NaN` devolve `false`, não
`indeterminado`, e o `switch` de natureza cairia em `descoberto` por acidente, pintando laranja
onde não se sabe nada.

| Operação | Resultado |
|---|---|
| soma, subtração, multiplicação | `indeterminado` |
| **divisão** (inclui aderência, §12.4) | `indeterminado`; divisor ≤ 0 → `indeterminado`, nunca ∞ |
| comparação | `indeterminado` (lógica de três valores) |
| **PMT, valor presente** | `indeterminado` — contamina a meta, e tem de contaminar |
| **agregação na pilha do gráfico** | a incerteza **sobe pela pilha**: a faixa e todas acima dela vão a hachurado |
| **veredito da caixa** | terceiro estado, além de "sobra" e "faltam" |
| conciliação | mês indeterminado sai da identidade de fluxo, nomeado |
| **exportação** | `—` **com nota**; nunca um traço solto, que o leitor lê como zero |
| propagação por continuidade | `indeterminado` |

**Reconciliação com `lacuna`, que já existe e é outra coisa:**

| | Significa | Comportamento |
|---|---|---|
| `lacuna` | *o evento existe, o valor não foi apurado* | movimenta zero **deliberadamente**, aparece na linha do tempo, alerta |
| `indeterminado` | *não há estado* | não vira número nenhum |

Na tela, `indeterminado` sempre com saída (§9.9):

> *"Ainda não sabemos — falta definir um mês normal."* **[ Definir ]**
> *"Ainda não sabemos — este número depende de uma premissa que a Nord ainda não publicou."*

### 5.7 O contrato de saída de `resolve()`

**Bloqueante reaberto por silêncio na v3.** A alavanca de aporte só é segura porque
`despesaIrredutivel()` filtra `componentes[].prov !== 'derivado'` — é isso que impede o slider de
comer o custo de vida declarado (rodada 06, bloqueante 5). A v3 declarava herdar o motor e nunca
nomeava o contrato.

```
resolve(estado, calendario) → {
  receita, despesa,
  componentes: [ { rotulo, valor, prov } ],     // OBRIGATÓRIO — sem isto a alavanca regride
  rotulo, premissa
}
```

**Seis decisões que faltavam, resolvidas** (Engenheiro):

| # | Decisão |
|---|---|
| 1 | `mesAncora` é **mês de calendário (1–12)**, convertido para índice via `Cenario.inicio` |
| 2 | Âncora fora de `[inicio, fim]`: **a vigência manda** — a primeira realização é a primeira âncora ≥ `inicio` |
| 3 | Módulo **normalizado para não-negativo** — `((m − a) % p + p) % p`, senão o 13º nunca realiza em cenário que começa em julho |
| 4 | Período truncado por `fim`: **default = não paga** o período incompleto (⚠ a regra dos avos do 13º é do §18) |
| 5 | Submensal **agrega** no mês; supramensal **aterrissa** na âncora |
| 6 | Janelas emitidas **cobrem o horizonte inteiro, sem sobreposição** — sobreposição é erro de compilação, não "vale a primeira" |

---

## 6. Patrimônio

### 6.1 Três camadas

`financeiro` · `bens` · `participacoes`. Bens e participações **item a item**, nunca bloco só.

### 6.2 Repartir o financeiro

Quatro naturezas: `reserva` · `compromisso` · `objetivo` · `liberdade`. A soma tem de bater com o
financeiro total; enquanto não bate, a tela mostra o que falta — e não completa sozinha.

### 6.3 Meta e prazo — para as quatro naturezas, não só compromisso

**Correção da rodada 08:** a v3 dava `custoEsperado`/`dataEsperada` só a `compromisso`. Mas o
roteiro do próprio Nélio (B8 etapa 4) resgata R$ 230 mil da caixa "compra da casa", que é
`objetivo`; a reserva não tinha meta nenhuma; e a liberdade — a que justifica a ferramenta — tinha
meta calculada no §7 e **não gravada em campo nenhum**.

| Natureza | Meta | Prazo |
|---|---|---|
| `reserva` | N meses de fixas + ajustáveis (⚠ N no §18) | sem prazo — é permanente |
| `compromisso` | `custoEsperado` | `dataEsperada` |
| `objetivo` | `custoEsperado` | `dataEsperada` |
| `liberdade` | **`metaDePatrimonio`** (§7) | a idade de parada |

Critério de aceite: **toda caixa com meta e prazo mostra veredito** (§19.13).

### 6.4 O saque como diagnóstico (B9)

O evento não só gasta — **testa se a caixa foi dimensionada certo.**

```
reparte  →  marca o evento  →  o motor projeta o saldo naquele mês
   ↑                                        ↓
   └──── "faltam R$ 2.900" ←──── compara com a meta
```

Duas formas, o padrão é a primeira:

> **Como você vai usar esse dinheiro?**
> **( • ) Usar tudo o que estiver guardado aqui** — *é assim que a gente descobre se o que você separou dá conta*
> **( ) Usar um valor definido:** R$ ______

`ILUSTRATIVO` — o card, com número do motor e premissa ao lado (§0.3):

> **A faculdade da Laura · março de 2027**
> Você separou R$ 30.000. Até lá, vira **R$ 30.694**. *(4,00% a.a. — teto para 7 meses)*
> Você calcula que vai custar **R$ 35.000**.
> **Faltam R$ 4.306.**
> **[ Separar mais ] [ Rever quanto vai custar ] [ Adiar a data ] [ Aceitar e seguir ]**

**Quatro botões, não dois** (Psicólogo): dois botões que ambos exigem ação omitem os dois
desfechos legítimos — adiar e aceitar. Escolha forçada sem opção nula é manipulação por omissão.

**"Separar mais" mostra de onde sai o dinheiro** — bloqueante do Psicólogo. O financeiro é soma
fechada: aumentar Compromissos em R$ 4.306 tira R$ 4.306 de outra caixa. Sem mostrar a origem, o
cliente sai achando que resolveu um problema **renomeando dinheiro** — contabilidade mental usada
contra ele, e a pior espécie de dark pattern porque não pressiona: tranquiliza. Ao pressionar,
a caixa doadora aparece **com o veredito dela recalculado na mesma tela**.

**Um veredito por vez**, ordenado pela data mais próxima. Cinco vereditos negativos de uma vez
produzem evitação, não ação.

Os outros dois casos, que a v3 não escrevia:

> **Sobra:** *"…Você calcula R$ 28.000. **Sobram R$ 2.694.**"* **[ Ver o que fazer com a sobra ]**
> **Sem meta:** *"Ainda não sabemos — falta dizer quanto isso vai custar."* **[ Informar ]**

### 6.5 Taxas (B10, C2)

Formato oficial em toda a plataforma: **4,91% a.a. *(~0,40% a.m.)*** — parêntese em corpo menor e
itálico. **Entrada sempre anual**; a equivalência mensal é derivada, nunca digitada.

Todas as taxas são **reais e líquidas**. Nota permanente na tela, completa (Redator):

> *"Os valores estão em dinheiro de hoje — já descontamos inflação e imposto."*

**Dois eixos de trava, e o segundo é novo:**

| Eixo | Trava | Fonte |
|---|---|---|
| Perfil | teto da taxa-alvo: 6% · 7,5% · 9% | B14 |
| **Prazo** | **teto por horizonte da caixa** | **rodada 08** |

O eixo do prazo fecha a válvula de escape que o CFP achou: sem ele, o cliente diante de *"faltam
R$ 4.306"* sobe a taxa da caixa de 4% para 6% e o card fica verde — **o plano fecha por
premissa**. Uma caixa a ser usada em 7 meses não pode ser projetada a 9%, seja qual for o perfil
do dono; isso é casamento de ativo e passivo feito ao contrário. ⚠ A tabela prazo → teto é do §18.

### 6.6 Perpetuidade

Na tela: **"vive do rendimento"**. Saca o que a vida custa, **limitado ao rendimento**; se a vida
custa mais, o alerta diz que manter aquilo significa consumir o principal — na tela, *"o dinheiro
guardado"* — e diz **quanto tempo dura**.

### 6.7 Passivo

```
Passivo { id, nome, ativoVinculadoId?, saldoDevedor,
          taxaJurosAnual, unidadeDaTaxa: 'nominal'|'real',   // obrigatório
          indexador?: 'TR'|'IPCA'|'prefixado',
          valorParcela, parcelasRestantes, sistema: 'price'|'sac'|'declarado' }
```

**Quatro correções da rodada 08:**

1. **Real × nominal declarado.** Contrato é nominal (Price, TR, IPCA); o motor é real e líquido.
   Sem a regra de conversão, um financiamento de 30 anos **superestima o peso da dívida por
   décadas**. ⚠ A premissa de inflação que traduz uma na outra é do §18 — e enquanto ela não
   vier, **a comparação "quitar antes × investir a diferença" fica suspensa**, porque comparar
   taxa nominal com real líquida erra por 4 a 6 pontos ao ano, sempre no mesmo sentido. Marcar a
   conclusão como lacuna não protege ninguém se a tela já mostra os dois caminhos.
2. **A parcela declarada prevalece** sobre a recalculada (ela inclui seguro e taxa de
   administração), e a divergência aparece nomeada.
3. **O passivo entra na definição de `estado`** (§5.4) — senão o SAC, cuja parcela cai todo mês,
   quebra o invariante ou some do fluxo.
4. **A amortização entra na conciliação.** A parcela é parte despesa (juros) e parte
   transferência para o patrimônio (amortização). Se a parcela inteira for despesa, o patrimônio
   líquido cresce por um caminho que a conciliação não enxerga.

**Fonte única da parcela nos meses 1–24:** ela está no Orçamento (micro das fixas, B1) **e** no
`Passivo`. Manda o `Passivo`; o Orçamento a exibe e não a soma de novo. Teste na bancada.

⚠ **Dívida rotativa** (cartão, cheque especial, consignado, consórcio) não cabe em
`price|sac|declarado` — e é o passivo mais caro da carteira, aquele cuja pergunta "quitar antes?"
tem resposta óbvia. §18.

---

## 7. A meta: quanto é preciso ter para viver sem trabalhar

**Com C1 e C2, a fórmula fecha em um número.**

```
necessidadeMensal(m) =  despesaProjetada(m)        // já inclui as que nascem
                                                    // e exclui as que morrem com o trabalho
                      − rendasQuePersistem(m)       // dependenciaDoTrabalho = continua, §4.3

metaDePatrimonio     =  Σ  necessidadeMensal(m) × (1 + i)^−(m−m₀)
                       m = idadeDeParada … expectativaDeVida
```

**Desconto mês a mês, não PMT nivelado** (CFP): `necessidadeMensal(m)` é um **vetor** — a parcela
do financiamento acaba no meio do caminho, despesas nascem e morrem. Um vetor não entra numa
fórmula de anuidade constante.

| Parâmetro | Valor | Fonte |
|---|---|---|
| `expectativaDeVida` | **95 anos** | C1 |
| `i` (taxa de referência) | **4,91% a.a. (~0,40% a.m.)** | C2 |
| Convenção | **horizonte finito** — o dinheiro pode acabar, e isso vira `mesDeRuina` | C1 |

`ILUSTRATIVO` — Ricardo, para aos 69, R$ 16.000/mês, dos 69 aos 95 (312 meses), a 4,91% a.a.:

> **R$ 2.847.982**

**A meta é gravada** em `Caixinha.metaDePatrimonio` da caixa `liberdade`, que ganha veredito como
qualquer outra (§6.3). Na v3 ela era calculada e não morava em lugar nenhum.

**Falta a linha do imposto, e ela é obrigatória.** "Real líquido" resolve o imposto sobre o
*rendimento*; não resolve o resgate de PGBL (IR sobre o valor **integral**, 10% a 27,5%),
come-cotas nem ganho de capital. Mesma honestidade do IR da venda da ótica:

> **IR sobre o resgate — não apurado.** *Este número não desconta o imposto do resgate.*

**A meta é rotulada PISO** enquanto a inflação real de saúde for lacuna (CFP), e o veredito da
caixa `liberdade` fica **proibido de dizer "está suficiente"** enquanto ela estiver aberta.

**O outro número, que tem outro nome e outra função:**

> **"Quanto da sua renda depende de você trabalhar"** — R$ 36.000 de R$ 38.000 (**95%**)

Indicador de dependência do capital humano, insumo da vertical de **Riscos**, não da de
Aposentadoria. Ele **entra no invariante do §9.9** (Psicólogo): ~95% é permanente, não se move em
meses, e negativo crônico e inacionável treina desamparo. Nunca aparece sozinho — vem com o que o
move (proteção agora, renda passiva ao longo do plano) e com a trajetória sob o plano
(*"cai para 40% em 2041"*).

---

## 8. E se eu faltar

**O nome fica** — o Redator o aprovou e explicou por quê: *"faltar"* é o que as famílias
brasileiras dizem, fica entre a brutalidade de "morrer" e a fuga corporativa de *"se algo
acontecer com você"*, e a primeira pessoa o põe na mesma família de *"e se essa renda acabar"*.

**Duas portas**, que são os dois cenários que o CFP separou:

> **E se eu faltar**
> **[ Se eu morrer ] [ Se eu não puder mais trabalhar ]**

**Não são o mesmo pedido.** A invalidez é pior: a renda para, a despesa **sobe**, e **não entra
capital segurado**.

| | Se eu morrer | Se eu não puder mais trabalhar |
|---|---|---|
| Rendas que dependem de trabalho | encerram | encerram |
| Rendas com `terminaComAMorteDoTitular` | encerram ou viram pensão | **continuam** |
| Capital segurado | entra como aporte pontual | só se houver cobertura de invalidez |
| Despesas | mudam (custos sucessórios entram) | **sobem** (cuidado, adaptação) |
| Patrimônio | **bloqueado no inventário** por um período | disponível |

**A resposta é em tempo de vida:**

> *"Sua família mantém o padrão de vida por **{N} anos**."*
> *padrão de vida = o mesmo custo de hoje, R$ 16.000 por mês*

Caso curto, com o caminho de volta na mesma tela:

> *"Sua família mantém o padrão de vida por **11 meses**. Um seguro de R$ 190 por mês leva esses
> 11 meses para **8 anos**."*

**A janela de liquidez bloqueada** (CFP): o "N anos" é calculado sobre patrimônio que estará
juridicamente indisponível por meses. *"A viúva não vive de projeção."* A linha existe com
duração ⚠ não apurada (§18), colada à resposta — não num rodapé.

**Guardas, e elas são de aceite, não de copy:**

- **Sempre iniciado pelo cliente.** Nunca push, nunca home, nunca alerta, e — instância explícita
  do §16.2 — **nunca depois de um evento nomeado** ("nasceu a filha" seguido do galho da morte é
  a chantagem que o painel proibiu, montada por composição).
- **Endereço declarado:** link discreto dentro de *"quanto da sua renda depende de você
  trabalhar"* e na lista do plano. Texto, sem número ao lado, nunca card. Entrada sem endereço
  vira atalho de alguém em seis meses.
- **Proibido *mortality salience*.** O impacto é sempre gain-frame; a perda só no custo, dosada.
- **Nenhum CTA de produto no resultado**, e o ramo **não faz nascer tarefa**.
- **Nunca persistido, nunca no radar, nunca gatilho** (§16.6).
- **É por pessoa**, e o cônjuge é informado de que existe projeção sobre a ausência dele.

⚠ ITCMD por estado, custos e prazos de inventário: §18. **Nunca um número líquido silencioso.**

---

## 9. A tela

### 9.1 Anatomia — 390 × 664

**A correção da rodada 08:** a v3 orçava contra **844**, que é a altura do **aparelho**. O Safari
iOS com barras visíveis entrega ~**664px**. E faltavam seis linhas que o próprio documento exigia.

**Alvo de projeto: viewport visual de 390 × 664** (745 com as barras recolhidas). 844 é o
aparelho e não é usável.

```
┌──────────────────────────────────────────────────────┐
│ mai/2035 · 63 anos                              [✕]  │  76  identidade
│ R$ 6.847.200                                         │      saldo em 28px
├──────────────────────────────────────────────────────┤
│  PALCO 1 · patrimônio                                │ 264  elástico
│  reserva → compromisso → objetivo → liberdade        │      (mín 220, teto 345)
│  → bens → participações                              │
├──────────────────────────────────────────────────────┤
│  trilho de eventos     ▲   ▽      ◆        ○         │  44
├──────────────────────────────────────────────────────┤
│  ENTRA E SAI NO MÊS         entra · sai · sobra      │ 148  elástico (mín 120)
├──────────────────────────────────────────────────────┤
│  eixo do tempo · 2035        2036        2037        │  24
├──────────────────────────────────────────────────────┤
│  minimapa + leitura da janela sobreposta             │  44
├──────────────────────────────────────────────────────┤
│  [ 2 anos ][ 10 anos ][ vida toda ][ hoje ]          │  48  terço inferior
└──────────────────────────────────────────────────────┘
                                              soma      648   folga 16
                              (+) FAB "Simular" 56×56, canto inferior direito
```

**Três mudanças estruturais:**

1. **A navegação desceu.** Controles vivem abaixo de 400px do topo — alcance do polegar. A v3 os
   mandava para a faixa superior de um aparelho de 844px, que é a pior zona de alcance de uma mão
   só, e é regressão contra o que já está construído.
2. **`participações` entra na ordem de empilhamento** — no cenário de referência é a maior banda
   da tela (49,9%), e a v3 a omitia.
3. **Folha inferior com três detentes**, que é onde mora tudo o que não cabia:
   - **peek 88px** — entra/sai/sobra do mês em foco + chip do veredito da caixa em foco;
   - **meia 50%** — palco 1 comprime para 168, palco 2 para 96;
   - **cheia 88%**.
   Vivem nela: legenda clicável, rótulos que não couberam na banda, cards de veredito (§6.4),
   detalhar rendas (§4.2), premissas (§9.12), exportar (§9.11), a porta do §8. A folha **nunca
   cobre mais de 50% do palco**.

**Desktop:** duas colunas, painel de detalhe à direita, sem sobrepor o gráfico. Botões `+ / −`
de zoom (§9.3), que existem no código e faltavam na spec.

### 9.2 O eixo de valor participa do zoom

Abaixo de 36 meses o eixo **corta a base**, com o corte **declarado**. Sem isso, aproximar produz
"uma laje": a variação de 7 meses some dentro de uma escala de 46 anos.

### 9.3 Navegação — implementável sem perguntar

| Controle | O que faz |
|---|---|
| `2 anos` · `10 anos` · `vida toda` | mudam **largura**, mantendo o mês em foco parado |
| `hoje` | **só move `ini`; preserva a largura** |
| pinça / roda / `+ −` | zoom contínuo, **de 6 meses ao horizonte** |
| **duplo-toque** | zoom para 6 meses centrado no ponto tocado; de novo, volta |

**A fórmula, porque "parado" é a palavra inteira da exigência:**

```
ini' = mesFocado − larguraNova × fracaoDoFoco
```

O código hoje faz `mesFocado − largura/2`, que **centraliza** — com o foco padrão em 4%, tocar em
"10 anos" empurra o mês debaixo do dedo de 4% para 50% da tela. Não é parado.

- **`mesFocado` sem toque:** ao abrir, mês 1 em `fracaoDoFoco = 0,04`; depois de pan/zoom a
  fração é preservada e o mês recalculado; um toque redefine a fração.
- **Borda:** quando o *clamp* em `[1, horizonte]` impedir manter a fração, **preserva o mês e move
  a fração**, com transição animada — nunca um corte.
- **`hoje` preserva a largura.** Hoje ele reseta para 11 anos, e quem está nos 7 meses perde a
  janela curta. É o mesmo teletransporte, por outra porta.

**Forma dos três atalhos: chips de ação, não *segmented control*.** Um seletor sempre afirma uma
seleção; depois de uma pinça para 7 meses nenhum segmento acende, e um seletor sem seleção lê
como defeito. O estado do zoom é dito **em um só lugar**: `janela: 7 meses`, na faixa do minimapa.

**A visão de 7 meses volta a custar um gesto** (duplo-toque) sem mexer no A20: os três estados do
Nélio ficam; o que o A20 fixou foi *quantos* atalhos, não que a rota curta pudesse desaparecer.

Herdado: `touch-action: pan-y`, roda que só toma a página no gesto de zoom, inércia, pinça pela
hipotenusa.

### 9.4 Leitura da janela e textura

**A leitura responde a pergunta, em vez de nomear o componente** (Redator):

> ~~"nesta janela: +R$ 102.359"~~ → **"nestes 7 meses: +R$ 102.359 · +2,0%"**
> Em vãos longos: **"de 2026 a 2036: …"**. Com faixa de renda (§4.5): **intervalo**, não número só.
> Uma linha em português ao lado: *"a reserva fica pronta e o carro vira dinheiro"*.

**A textura da fidelidade sai das bandas e vira fita própria** (bloqueante do UX): a hachura **já
significa camada** no gráfico (imóveis, participações), e dar-lhe um segundo significado destrói
a redundância que protege o daltônico.

Fita de 6px logo abaixo do eixo do tempo, quatro estados rotulados:

| Trecho | Legenda |
|---|---|
| 1–24 com Orçamento | "do seu orçamento detalhado" |
| 1–24 sem Orçamento | **"do que você nos contou"** *(rótulo canônico da selada §11.6)* |
| depois da última mudança | "daqui em diante, segue igual" |
| `indeterminado` | "ainda não sabemos" |

Na tela, uma frase e a chave sob toque: **"A projeção fica menos precisa com a distância."**
**[ o que isso quer dizer ]**

### 9.5 Colapso — por proporção, não por contagem

**O achado que mudou o desenho:** a densidade não se dissolveu com o B6, ela **mudou de eixo**.
Saiu das pistas horizontais e foi para as bandas verticais, onde a altura não é escolha de design
— é o dinheiro do cliente. No cenário de referência, num palco de 330px: "Formação dos filhos"
renderiza a **6,9px**. É exatamente a caixa do bloqueante do Cliente, para a qual os §6.3 e §6.4
foram escritos.

E a regra da v3 estava escrita sobre a variável errada — "até 6 faixas" é *contagem*, o dano é
*proporção*: a família do Ricardo tem 5 caixas, nunca dispara o colapso, e tem duas bandas
ilegíveis.

1. **Piso de banda: 14px.** Bandas menores são promovidas a 14px e o excedente sai
   proporcionalmente da maior, com a distorção **declarada**: *"as caixas menores estão ampliadas
   para caber — os valores ao lado são os reais"*.
2. Quando a soma dos pisos passar de 30% do palco, entra o modo **"só o dinheiro guardado"**.
3. **Ordem de colapso invertida:** bens e participações colapsam **primeiro**; o financeiro por
   último e só por natureza. A v3 fundia o financeiro, que é a única camada que o cliente
   reparte, decide e olha.
4. Gatilho: `menorBanda / palco < 4%`.
5. Legenda **clicável**, responde *"quando este objetivo termina"*.

### 9.6 Scroll vertical × pan horizontal

- Dentro do palco: horizontal é pan, vertical **não rola** (`touch-action: pan-y`).
- Na alça da folha: troca de detente. Dentro do conteúdo da folha: rola o conteúdo.
- O que não cabe **colapsa** (§9.5); nada some.

### 9.7 Crosshair, tooltip, rótulo

Toque mostra crosshair e **o valor de cada faixa** naquele mês. O rótulo vive **dentro da banda**
quando há altura; senão vai para a folha. Tooltip fixo no topo do palco, **máximo 4 linhas +
"outras n"**, sem repetir mês e saldo, que já estão no cabeçalho.

### 9.8 Iconografia — nove tipos, três cadências

**A v3 afirmava "quatro formas × dois preenchimentos = os oito tipos, sem ambiguidade"; o
registro lista nove**, e três recebiam ▽ vazado — idênticos em forma, preenchimento e cor quando
incidem na mesma caixa. E era **regressão**: os ícones já implementados distinguem os três.

| Canal | Codifica |
|---|---|
| **Forma** | direção — ▲ entra · ▽ sai · ◆ converte · ○ premissa |
| **Preenchimento** | cadência — sólido = pontual · vazado = janela com fim · haste dupla = contínuo sem fim |
| **Marca inscrita** | mecanismo — ∞ (perpetuidade) · calendário (renda por prazo) |
| **Cor** | **direção**, não caixa — verde entra · terracota sai · azul-tinta converte |

**A cor sai da caixa e vai para a direção.** Herdada da caixa, ela discordava da forma dentro do
mesmo glifo, e uma caixa laranja pintaria de laranja eventos saudáveis — laranja está reservado
desde a rodada 06 ao que não fecha. A caixa é identificada pelo **rótulo dentro do clipe**.

⚠ O roxo `#7B5EA7` é hoje três coisas — evento `perpetuidade`, caixa `objetivo` e "achado" da
simulação. Desempatar e registrar os três como tokens nomeados (§18).

### 9.9 Simulação, e o invariante do caminho de volta

**A regra que concilia CFP e Psicólogo** (arbitragem A da rodada 08):

> **Premissa de mercado só piora. Comportamento do cliente pode melhorar.**

| Alavanca | Direção |
|---|---|
| Rentabilidade | **só desce** — prudência é simulável, otimismo não é |
| Aporte | sobe e desce, com alcance (morre no fim da fase); só sobre a folga sem destino — no orçamento **macro**, só sobre Futuro e Sonhos |
| **Trabalhar um ano a mais** | melhora |
| **Adiar um objetivo** | melhora |
| **Reduzir o custo de vida da fase futura** | melhora |

As três últimas são novas e não são otimismo de mercado — são comportamento declarado. Sem elas o
simulador é caixa de punição, e morre o *locus* de controle que a selada §10.1 protege.

**Mutar uma renda** — *"E se essa renda acabar?"* — é um toque na linha da renda, não um
formulário. Estado: *"fora da conta — só nesta simulação"*. Desfazer: **[ Voltar a contar ]**.

**Achado não é erro:** cor própria (nem verde nem laranja), consequência **ao lado do controle**.
**Simular nunca grava.** A `Simulacao` pode ser **salva com nome** ("e se a Cristina parar de
trabalhar") — senão "nunca grava" vira "meu trabalho se perde".

**Invariante de tela, sem exceção:**

> **Todo alerta negativo aparece com o caminho de volta na mesma tela e com igual peso visual.**

Vale para: veredito da caixa (§6.4), mês que não fecha, perpetuidade consumindo o principal,
premissa acima do teto (§11.3), o ramo do §8, o indicador de dependência (§7) e o `mesDeRuina`
(§9.10). Alerta sem caminho de volta é bug de especificação, não escolha de copy.

### 9.10 Os estados que faltavam — a ruína primeiro

**O desfecho mais importante da ferramenta não tinha nome.** Hoje o motor o expressa como alerta
de erro **repetido mês a mês**, o que renderizaria centenas de alertas vermelhos e violaria em
massa o invariante do §9.9.

**`mesDeRuina` vira resultado de primeira classe:** uma afirmação, uma data, um caminho de volta.

> **"O dinheiro guardado acaba em março de 2058, aos 86 anos."**
> *"Guardar R$ 1.900 a mais por mês, dos próximos 10 anos, leva isso até os 95."*

O palco continua desenhando a linha do zero até o horizonte — não corta o gráfico.

Os demais: **cenário inexistente** (entra pelo rascunho); **carregando** (esqueleto do palco,
jamais palco vazio que pareça patrimônio zero); **`indeterminado`** (§5.6); **valores negativos**
no palco 2.

### 9.11 A saída em papel

PDF/impressão, uma seção por bloco, **mais a tabela ano a ano** — saldo, aportes, saques,
eventos, e o que é tributável e não foi apurado. Contador não lê curva, lê linha.

Obrigatório: as premissas com as taxas no formato canônico; `premissasVersao`, `motorVersao` e a
data; a **origem do perfil de risco** (questionário × autodeclarado); as lacunas que afetam
**aquele** cliente; e o selo:

> *"Este documento é uma projeção, feita com os números listados acima, em {data}. Os valores
> estão em dinheiro de hoje. Não é promessa nem garantia de rentabilidade."*

**Rascunho não sai com selo de plano.** Ou não exporta, ou exporta com marca em toda página:
*"rascunho do cliente, não revisado por consultor"*. E o relatório entregue é **do contratante**
(C3).

⚠ Texto final do selo e menção a recomendação de investimento: §18 (compliance).

### 9.12 As premissas na tela, não só no papel

Chip permanente no cabeçalho da folha: **"os números que a Nord usa · {data} · v{n}"**, tocável.
É o diferencial defensável do §11 e na v3 ele era invisível para quem compra.

E o selo, com a mesma persistência da nota de "dinheiro de hoje": *"projeção baseada nestes
números; não é promessa de rentabilidade."*

---

## 10. Autorar × navegar

| | Autorar | Navegar |
|---|---|---|
| Metáfora | planilha | editor de vídeo |
| Horizonte | 12–24 meses | vida inteira |
| Quando | reunião semestral | qualquer hora |
| Quem | consultor com o cliente | o cliente sozinho |

### 10.1 O modo de autoria, especificado

Era um parágrafo, e é onde o consultor passa as horas da semestral.

- **Grade** meses × categorias; entrada por teclado, Tab, colar de planilha.
- **Célula ↔ mudança:** digitar numa célula do mês 14 **cria uma `MudancaDeOrcamento` no mês 14**
  — não reescreve a janela, não edita o mês isolado. A grade é uma *view* sobre a lista de
  mudanças, e o cliente vê a mudança nascer.
- **Colagem com forma errada** é rejeitada com o motivo, nunca truncada em silêncio.
- **Estados:** sujo · salvo · conflito. **Concorrência:** consultor e cliente na mesma reunião —
  último a salvar vence, com aviso e diff, nunca sobrescrita muda.
- **Desfazer** por passo.
- **Uma grade só.** Os meses 1–24 são da ferramenta de Orçamento; esta grade **os exibe em leitura
  e edita do 25 em diante**. Duas grades sobre os mesmos 24 meses seriam duas fontes da verdade —
  exatamente o que o B10 proíbe para taxas.

### 10.2 A semestral é diff, não re-autoria

Sem isto a ferramenta não escala (CFP: 2h30 a 4h por cliente na primeira montagem, ~450h/ano para
150 clientes). A regra de continuidade, apontada para o lugar certo:

> **"O que mudou desde junho?"** — lista de mudanças a confirmar, com "nada mudou" como resposta
> honesta e literalmente correta pelo modelo de dados.

Mais o diff das premissas da casa (§11.3), lado a lado.

---

## 11. Premissas — os parâmetros da casa

### 11.1 `ParametrosDaCasa` (B13, C1, C2)

```
ParametrosDaCasa {
  versao, vigenteDesde, publicadoPor, aprovadoPor, motivo,     // append-only
  expectativaDeVida:   95,                                      // C1
  taxaDeReferencia:    0.0491,                                  // C2 — desconta meta e perpetuidade
  tetoPorPerfil:       { conservador: 0.060, moderado: 0.075, arrojado: 0.090 },   // B14
  tetoPorPrazo:        [ … ],                                   // ⚠ §18 — segundo eixo de trava
  faixaRetorno:        { min: 0.000, max: 0.090 },              // corrigido: mín 0%
  saudeOrcamento:      { fixosMax: 0.50, ajustaveisMax: 0.30, futuroESonhosMin: 0.20 },
  mesesDeReserva, valorizacaoImoveis, inflacaoPorCategoria, aliquotas   // ⚠ §18
}
```

**`faixaRetorno.min` corrigido de 3% para 0%**: o piso de 3% invalidava o cenário-âncora, onde
imóveis e ótica estão a 0% real. E **um piso é piso de otimismo** — a casa deve travar o teto;
travar o chão impede modelar conservadorismo. A faixa vale **só para caixas financeiras**.

**Segurança, porque este é o primeiro poder de escrita global da plataforma:**

| Regra | Por quê |
|---|---|
| **Append-only: CREATE + READ.** Nunca UPDATE, nunca DELETE | a v3 dava `CRUD` ao Admin — apagar uma versão referenciada quebra a resolução de todo plano congelado; editar a versão no lugar esvazia a história do B15 |
| `vigenteDesde` **sempre futuro** | retroatividade anula o congelamento |
| `publicadoPor ≠ aprovadoPor` | quatro olhos num controle que move 150 planos |
| **Prévia de impacto obrigatória** | *"afeta 143 planos; 27 ficam acima do novo teto"* |
| Procedimento de reversão | publicar nova versão restaurando; nunca apagar |
| Namespace `nl:v1:casa:*`, **sem dado de cliente** | o `AuditLog` global não cabe no isolamento por cliente da selada §3.5 |

> A plataforma exigia mais cerimônia do cliente para corrigir um telefone do que do admin para
> mudar a premissa de todo mundo.

### 11.2 A trava de suitability (B11, B12)

| Superfície | O que trava | Desde |
|---|---|---|
| Publicação de capítulo | módulo que prescreve produto | rodada 05 |
| Configuração da taxa da caixa | teto de retorno, por perfil **e por prazo** | rodada 08 |

```
PerfilDeRisco {
  perfil, origem: 'questionario'|'autodeclarado',
  respondidoEm, versaoQuestionario, validoAte,
  valeParaSuitability   // DERIVADO de origem — nunca armazenado
}
```

**Três correções da rodada 08:**

1. **`valeParaSuitability` é derivado, nunca persistido.** Um booleano gravado que pode divergir
   de `origem` é precisamente o problema de auditoria que o B11 foi escrito para evitar.
2. **O autodeclarado não eleva o teto.** A v3 deixava o cliente **destravar a própria trava**:
   autodeclarar "Arrojado" liberava 9%, com um toque, quantas vezes quisesse. Perfil autodeclarado
   trava no teto **conservador**; o questionário é o que abre acima disso. Cada redeclaração é
   versionada e auditada.
3. **`modulosPublicaveis()` muda.** O seletor hoje testa `!!estado.perfilSuitability` — se o
   autodeclarado gravar nesse campo, **os capítulos de produto destravam sozinhos**, o oposto do
   que esta seção exige. Passa a exigir `valeParaSuitability === true`.

**`PerfilDeRisco` é preso ao `Cenario` e vence.** Além do frescor das premissas da casa (§11.3),
o segundo eixo: *"o perfil de investidor que sustenta este teto venceu"*. Vencido **bloqueia nova
publicação**, não o plano existente. ⚠ Prazo regulatório: §18.

Na tela: **"perfil de investidor"**, nunca "suitability". Para o autodeclarado:

> *"Enquanto você não responder o questionário de perfil de investidor, a gente faz planejamento
> com você, mas não recomenda produto."* ⚠ *validar com compliance (§18).*

⚠ **B12:** o questionário é outra ferramenta. **Contrato reutilizável**, extraído do runner do
exame (33 perguntas, 6 ramificações, pontuação isolada) antes de B12 chegar — senão chega como
segunda implementação da mesma coisa:
`Questionario { id, versao, perguntas, ramificacoes, pontuacao, mapeamentoDeResultado }`.

### 11.3 Mudou a premissa: congela, notifica, convida (B15, B16)

O plano publicado guarda **os valores usados** — não um ponteiro para tabela mutável — mais
`premissasVersao` como rótulo e **`motorVersao`**. Sem o `motorVersao`, *"o que o cliente viu em
junho continua sendo o que ele viu"* é falso na primeira correção de arredondamento: a rodada 06
trocou uma função de PMT e moveu R$ 3.315 num número já mostrado.

**Texto canônico (B16), palavra por palavra, não se reescreve:**

> O comitê de alocação e planejamento da Nord realinhou as variáveis financeiras devido ao cenário
> atual e à nossa estratégia. É importante reajustar as premissas do seu planejamento. Entre em
> contato com o seu consultor: **{consultor}**

**O que tem de acompanhá-lo, sem tocar nele** (Redator + Psicólogo):

> **[WhatsApp, vocativo]** *"Oi {nome} —"*
> **[o texto canônico]**
> *"O seu plano continua como está — nada mudou sozinho."*
> *"Não é urgente: dá para ver na sua próxima reunião."*
> **[na plataforma, o diff]** *"Este plano usa 7% ao ano. Hoje, o máximo para o seu perfil é 6% —
> com ele, a data de 2041 iria para 2043."* **[ Ver o que muda ] [ Falar com {consultor} ]**
> **[glosa, uma vez]** *"Premissas são os números que a projeção usa: quanto rende, quanto sobe o
> custo de vida, por quanto tempo."*
> **[título na tela]** *"Revisamos os números usados nos planejamentos"*

**Envio com alvo e dose** (Psicólogo): **não vai para quem a mudança não afeta**; **conta no teto
de N/mês e respeita o opt-out** (selada §9.2); e diz o impacto **no plano dele** antes do convite.
Preocupação inespecífica em cliente 50+ com patrimônio não gera reunião — gera ruminação.

⚠ **Quem assina no WhatsApp:** o texto manda o cliente procurar quem está escrevendo para ele.
É roteamento, não redação — decisão do Nélio (§18).

---

## 12. A cadência mensal (B2)

### 12.1 O que é

**A cadência se pendura na poupança realizada, não no orçamento inteiro.** Uma variável, uma
pergunta, que o produto já faz — agora confrontada com um valor **projetado** em vez de um
combinado fixo.

Na tela o verbo é **guardar**, sempre (selada §9.1.3 + rodada 06). "Poupança" e "projetado" ficam
internos; na tela, *"o que você tinha planejado"*.

### 12.2 A meta mensal é co-autorada

Meta autoimposta supera meta atribuída, e é isso que faz um *commitment device* funcionar
(Psicólogo). **Todo novo "planejado" passa por aceite explícito do cliente** — se ele não aceitou,
não é combinado, e a copy da selada §11.2 não pode dizer "a data combinada".

**O piso da faixa (§4.5) nunca é meta.** O piso serve à prudência da projeção; usado como régua de
comportamento, o cliente de renda variável bate a meta **por construção**, a aderência sobe ao
teto e para de medir qualquer coisa.

A meta traz **"como chegamos nesse número"** — padrão que a selada já usa na devolutiva.

### 12.3 A ponte, com três copies

A v3 tinha uma só, e a usava também no mês de falha. **Convidar alguém a "ver onde isso cai na
linha do tempo" logo depois de falhar é convidá-lo a olhar o estrago** — e sob ameaça ao
autoconceito as pessoas não olham: param de responder, e o WhatsApp é o único Prompt do produto.

| Caso | Copy |
|---|---|
| **Guardou mais** | *"Você guardou R$ 400 a mais do que tinha planejado."* **[ Ver na linha do tempo ]** — é o pico certo |
| **Guardou o previsto** *(o caso modal, que não existia)* | reconhecimento adulto, sem convite |
| **Guardou menos** | *"Você guardou R$ 1.900 em março; o planejado era R$ 2.800. Com isso, a data de 'Compra da casa' recua 2 meses. Um aporte de R$ 900 recoloca a data."* **[ Falar com {consultor} ]** — **sem** convite a olhar a curva |

**A ponte aterrissa na resposta, não na ferramenta.** Um toque no WhatsApp que abre uma tela cheia
com zoom de 90 anos é um precipício de *ability* no exato instante do pico de motivação. O destino
é um cartão — *"seus R$ 400 a mais: a reserva fica pronta um mês antes; 2041 continua de pé"* — com
a ferramenta a um segundo toque.

**A escada que faltava:** duas ou três faltas seguidas na mesma direção quase nunca são falta de
força de vontade — são **premissa velha**.

> *"Faz três meses que a poupança fica abaixo do previsto. Em geral isso quer dizer que a vida
> mudou, não que você falhou. Quer revisar o que mudou?"*

Atribuição externa, reenquadramento, e a saída de vergonha mais barata que existe. Fecha também o
buraco de **deriva** que a derrubada da mecânica mensal abriu: com a autoria confinada à
semestral, uma mudança de vida em março só entraria no plano em agosto.

### 12.4 A aderência — as quatro bordas

**Quatro agentes acharam quatro modos de falha distintos.** O B2 mudou a **pergunta mensal**; foi
o §16 da v3 que estendeu isso à **métrica**, e essa extensão era minha, não do Nélio.

| Borda | Regra |
|---|---|
| Denominador `indeterminado` | reverte à forma **aberta** da selada, sem veredito |
| Denominador **≤ 0** (~35 anos de vida sustentada pelo patrimônio) | aderência **não se aplica** na desacumulação; o indicador é outro |
| **Dezembro com 13º** | aderência em **janela móvel de 12 meses** (acumulado planejado × acumulado guardado), **nunca por mês isolado** — senão o melhor mês do ano marca abaixo de 100% |
| **Aumento de renda** | a janela móvel absorve; e o denominador só muda com aceite do cliente (§12.2) |
| **Sem `Cenario` publicado** | *fallback* para `AporteMensal.valorCombinado` — a v3 trocava o denominador globalmente e quebrava o ciclo de todo cliente pré-devolutiva e de todo self-service |

Os dois primeiros modos violavam o inviolável nº 2 e o §16.5 da própria especificação.

⚠ **A sensibilidade** — quantos meses uma falta de R$ 400 move a data — é do §18. Sem ela a spec
escolhe por acidente entre dramatizar ruído e ensinar licenciamento. Proposta: **o fato no mês, a
física no acumulado de 12 meses.**

---

## 13. Modelo de dados

### 13.1 Entidades

```
Cenario  { id, clienteId, status: 'rascunho'|'publicado', publicadoEm,
           inicio:{ano,mes}, idadeInicial, horizonte,
           premissasVersao, motorVersao,          // congelados na publicação — §11.3
           pessoaIds:[id],                        // REFERENCIA, não contém — §13.3
           rendas, passivos, caixinhas, eventos,
           mudancasDeOrcamento, mesBase,
           orcamento }                            // compilado por resolve() — §5.7

Renda    { id, pessoaId, nome,
           dependenciaDoTrabalho: 'acaba'|'diminui'|'continua', percentualQuePersiste?,
           terminaComAMorteDoTitular: 'sim'|'nao'|'pensao', pensao?:{percentual,duracao},
           ativoLastroId?, natureza?,
           valor | faixa:{min,max}, valorEhBruto: boolean,
           periodicidade, mesAncora, inicio, fim, mesTransicao?,
           proveniencia, reajusteReal }

Caixinha { id, nome, curto, camada, natureza, saldoInicial, taxaAnual, cor, prov, nota, lacuna?,
           custoEsperado?, dataEsperada?, metaDePatrimonio?,   // §6.3 — as quatro naturezas
           objetivoId? }                                        // §13.5

Passivo  { …, unidadeDaTaxa: 'nominal'|'real', indexador? }     // §6.7

EventoPatrimonial { id, tipo, mes, mesFim?, de?, para?,          // de/para: transferência
                    valor?, esvazia?, taxaAnual?, rotulo, motivo, prov, lacuna? }

Simulacao { id, cenarioId, nome?, alteracoes: [ Alteracao ], criadoEm, autor, persistida: false }
Alteracao { alvo: 'renda'|'caixinha'|'evento'|'aporte'|'idadeDeParada', id?, campo, valor }

SugestaoDeReparticao { id, clienteId, cenarioId, de, para, valor, motivo, status }
```

**`SugestaoDeReparticao` é entidade nova e não é detalhe** (Engenheiro): a `SugestaoCorrecao` da
selada é chaveada por `ValorColetado` e não expressa *"mover R$ 20 mil da Reserva para
Compromissos"*. Sem ela, **o laço do B9 — que é a resposta ao veto do Cliente — só funciona no
rascunho**; no plano publicado o cliente batia numa parede de permissão sem mecanismo.

### 13.2 Permissões

| Entidade | Cliente | Consultor | Admin |
|---|---|---|---|
| `Cenario` rascunho | CRUD próprio | READ | — |
| `Cenario` publicado | READ + simular | CRUD | READ agregado |
| Repartição, publicado | **`SugestaoDeReparticao`** | resolver | — |
| Nome, cor e nota das caixas | **CRUD sempre** | CRUD | — |
| `Simulacao` | CRUD própria | — *(§16.6)* | — |
| `ParametrosDaCasa` | — | READ | **CREATE + READ** |
| `PerfilDeRisco` | CREATE autodeclarado | CRUD via questionário | READ agregado |

**A publicação é ato conjunto** (arbitragem C): o consultor publica, **o cliente aceita**.
Precedente na selada §6.6, onde ele já co-decide a cascata. Dar posse no rascunho e retirar
controle na publicação produz *reactance* e reabre o *"a ferramenta chegou pronta"* que originou
tudo isto. No publicado, a autoria dele continua visível número a número pela proveniência.

E a distinção que faltava: **renomear, mudar cor e escrever nota é dele sempre**; mover dinheiro
entre caixas no publicado é sugestão.

### 13.3 `Pessoa` fora do agregado

```
Pessoa { id, nome, papel, dataNascimento,
         consentimentos: [ { finalidade, baseLegal, versaoTermo, aceitoEm, revogadoEm? } ] }
```

**A v3 embutia `pessoas:[Pessoa]` dentro do `Cenario`, no namespace do titular** — o cônjuge como
atributo do plano de outra pessoa, sem identidade, sem consentimento, sem separabilidade. Quando o
Open Finance trouxer transação real dele, a LGPD exige que ele seja titular de direitos próprios:
acesso, revogação, eliminação. Com o modelo da v3, "apagar os dados do cônjuge" era mutar o plano
do titular.

**A lacuna era de tela; a decisão de modelo já estava tomada, e estava errada.** Custa pouco
agora e muito depois. Some com isso o caso de separação, que num horizonte de 90 anos não é
hipótese.

### 13.4 Registro único de tipos de evento

**Fonte única em código**, carregando tudo o que hoje está espalhado em literais:

```
EVENTO[tipo] = { prioridade, sinal, cadencia, movimenta, ehJanela, icone, legenda, porque }
```

Motor e simulação **derivam dele**. Hoje `PRIORIDADE` é um mapa à parte — tipo ausente vira
comparador `NaN` e **ordem arbitrária dos eventos dentro do mês**, que é convenção do motor e
muda os números sem alertar ninguém; a lista de tipos que movimentam é literal; e `ehJanela` é
heurística sobre a **presença de um campo**, que foi o defeito de `dividirJanelas` mitigado em vez
de resolvido.

**Teste de completude:** toda chave de `EVENTO` tem entrada em todo mapa derivado. É o único jeito
de o dever de registro ser verificável.

**Os nove tipos, com a legenda que o §13.4 da v3 exigia e não escrevia:**

| Tipo | Ícone | Legenda | O "porquê" |
|---|---|---|---|
| `aportePontual` | ▲ sólido | **Entrou de uma vez** | "Venda do carro — R$ 150.000 em set/2028" |
| `aporteContinuo` | ▲ haste dupla | **Entra todo mês** | "R$ 10.000 por mês, de hoje até 2036" |
| `saquePontual` | ▽ sólido | **Saiu de uma vez** | "Entrada da casa — R$ 230.000 em mar/2030" |
| `saqueContinuo` | ▽ haste dupla | **Sai todo mês** | "Intercâmbio — R$ 5.000 por mês, 2036 a 2041" |
| `consumo` | ▽ vazado + calendário | **Renda por prazo** | "R$ 8.000 por mês, 2036 a 2041 — planejado para acabar" |
| `perpetuidade` | ▽ haste dupla + ∞ | **Vive do rendimento** | "A partir de 2050, você tira só o que rende" |
| `transferencia` | ◆ sólido | **Mudou de lugar** | "O carro virou dinheiro" |
| `rentabilidade` | ○ vazado | **Rende {x}% neste período** | "A Reserva rende 4% ao ano, 2026 a 2036" |
| `mudancaTaxa` | ○ sólido | **A partir daqui, rende {x}%** | "A Reserva passa a render 4% ao ano" |

**Nenhum tipo novo entra nesta versão.** O "saque do saldo" do B8 é o `esvazia: true` que já
existe; o que muda é a interface declarar as duas formas (§6.4).

### 13.5 A chave `Objetivo` ↔ `Caixinha`

`Caixinha.objetivoId` liga ao `Objetivo` da selada. **Sem ela não há `prioridadeCascata`**, logo
não há como alocar o aporte real quando ele vem menor que o planejado — e morre o
*prazo-que-reage*, que é a promessa que esta ferramenta assume da selada §10.3.

"Compra da casa" é `Objetivo` **e** `Caixinha`. Nem todo objetivo tem caixa: "Proteção da família"
se resolve por tarefa, não por estoque (§17.1).

---

## 14. Riscos e verticais — o que esta ferramenta cobre

| Vertical | Estado | Falta |
|---|---|---|
| Gestão Financeira | coberta | dívida rotativa (§18) |
| **Gestão de Ativos** | **selo obrigatório** | a selada §5 declara a vertical **inerte** até a política de investimento chegar, e esta ferramenta produz o número mais consequente dela. Enquanto inerte, a configuração da taxa mostra **"Ativos: aguardando metodologia"** — o §17 registra o delta |
| Aposentadoria | fecha com C1+C2 | INSS e previdência (§18) |
| Gestão de Riscos | §8, duas portas | pensão por morte e liquidez bloqueada: estrutura aqui, conteúdo no §18 |
| Tributário | linha "não apurado" por caixa | alíquotas (§18) |
| Sucessório | linha "não apurado" | ITCMD, regime de bens da coleta ainda não consumido |

**Exposição fiscal por caixa:** cada `Caixinha` declara `regimeTributario` com valor **"não
apurado"** visível enquanto o tributarista não entregar — para a tela não parecer já ter
descontado o que não descontou.

⚠ **Previdência e INSS:** a v3 afirmava no §17 que *"a estrutura está especificada"*. **Não
estava** — não há entidade de plano, não há PGBL × VGBL (que muda a tributação do resgate de
"sobre o ganho" para "sobre tudo"), e não há evento de conversão saldo → renda vitalícia. **Uma
lacuna que se descreve como estrutura pronta é pior que uma lacuna.** Reclassificada no §18 como
**estrutural**: impede publicar plano de aposentadoria para cliente com previdência ou INSS
relevante.

---

## 15. Vocabulário

**Regra: o nome interno nunca vai à tela.** E, agora, **critério de aceite** (§19.24) — varredura
no build, porque a poda da v3 foi escrita e não aplicada.

**Uma palavra por objeto.** A v3 prometia que `caixinha` não iria à tela e inventou **"caixa"**,
que já significa fluxo do mês a 200 pixels de distância.

| Interno | Na tela |
|---|---|
| `caixinha` (coletivo) | **"o dinheiro guardado"** |
| `caixinha` (uma) | **o nome próprio** — "A faculdade da Laura" |
| ~~"caixa"~~ | **não existe** |
| palco 2 | **"Entra e sai no mês"** |
| `MudancaDeOrcamento` | "o que muda em {mês}" |
| regra de continuidade | **"Daqui em diante, segue igual"** (estado) · **"Só cadastre o que mudar"** (ação) |
| `mesBase` | **"Como é um mês normal na sua casa?"** · campo: "Um mês normal" |
| `dependenciaDoTrabalho` | "Se você parar de trabalhar, essa renda…" |
| `ativoLastroId` | **"De onde vem essa renda?"** |
| `terminaComAMorteDoTitular` | "Essa renda continua se a pessoa faltar?" |
| classe ativa/passiva | — |
| `natureza` | "tipo de trabalho" |
| `proveniencia` | "você nos contou" · "nossa estimativa" · "confirmado" |
| `indeterminado` | **"ainda não sabemos"** + a saída (§5.6) |
| `principal` | **"o dinheiro guardado"** |
| `perpetuidade` | "vive do rendimento" |
| `metaDePatrimonio` | **"quanto você precisa ter para viver sem trabalhar"** |
| soma das rendas que dependem de trabalho | **"quanto da sua renda depende de você trabalhar"** |
| `esvazia: true` | "usar tudo o que estiver guardado aqui" |
| `premissasVersao` | **"os números que este plano usou, de {data}"** |
| `ParametrosDaCasa` | **"os números que a Nord usa nos planejamentos"** |
| `suitability` | **"perfil de investidor"** |
| `tetoPorPerfil` | "o máximo para o seu perfil" |
| `PerfilDeRisco` autodeclarado | "o perfil que você mesmo indicou" |
| `Simulacao` | título "e se…" · botão **[ Testar uma mudança ]** · desfazer **[ Voltar ao meu plano ]** |
| `mutar` | **"E se essa renda acabar?"** · "fora da conta — só nesta simulação" · **[ Voltar a contar ]** |
| "janela" (do zoom) | **"nestes 7 meses"** / "de 2026 a 2036" |
| "faixa" (de renda) | "o menor valor que você informou (R$ 8.000)" |
| `mesDeRuina` | "o dinheiro guardado acaba em {mês}, aos {idade} anos" |
| "mês descoberto" | **"o mês não fecha"** |
| `Passivo` | "financiamento" / "dívida" |
| `mesAncora` | "Em que meses essa renda cai?" |
| clipes de CLT | "13º salário (dezembro)" · "Férias (mês que você escolher)" |
| rascunho × publicado | *"No seu rascunho, você muda o que quiser. No plano que você fez com {consultor}, você sugere — e ele confirma."* |

**"Premissa" é glosada uma vez** e não usada onde a copy é nossa: *"Premissas são os números que a
projeção usa: quanto rende, quanto sobe o custo de vida, por quanto tempo."*

**Internos, que nunca vão à tela e ficam declarados** para não vazarem: palco, trilho, textura,
banda, lastro, clipe, âncora, efeito dotação, gain-frame, peak-end.

**Voz:** toda simulação fala na voz do cliente (*"E se **eu**…"*); todo o resto fala com "você";
o remetente é sempre "nós" (*"Não incluímos…"*, nunca "não incluí").

**A §11.7 da selada vale inteira**, e acrescentam-se os termos acima — a v3 a reeditou com cinco
dos nove itens, que é como listas de proibição morrem.

**"Futuro e Sonhos"** (B7) é decisão do Nélio e fica. Travado: **nunca abrevia para "Sonhos"** e
**nunca ganha ícone** de estrela, nuvem ou foguete — é o único ponto do produto onde o lúdico tem
porta de entrada. E o §16.3 corrige a própria frase: as três categorias não são "funcionais" — a
terceira é aspiracional; o que vale é **"nenhuma dessas categorias julga o gasto"**.

**Dívida de copy já em produção**, que a poda tem de alcançar:

| Onde | Hoje | Passa a ser |
|---|---|---|
| `projecao.js:300` | *"e a caixinha tem R$ 32.100"* | *"e você separou R$ 32.100"* |
| `projecao.js:398` | *"O plano **manda** guardar"* | *"O plano **prevê** guardar"* |
| `projecao.js:292` | *"valor ainda não calculado"* | *"ainda não sabemos"* |

---

## 16. Ética travada por escrito

Sete travas. São **regras de aceite**, não recomendações.

**16.1 · Pergunta sim, número não.** Dado que falta vira pergunta ou lacuna cinza, jamais valor de
fábrica. **Derivar do dado do próprio cliente**, com critério à vista e reversível, é trabalho;
**importar de uma média** (outra família, faixa de renda, benchmark) é invenção. É o que absolve
o mês-base (§5.5) e a idade derivada (§3.1) — e o que obriga a repartição inicial a declarar o
critério dela.

**16.2 · Evento nomeado nunca vira urgência comercial.** *"Sua filha nasce em 8 meses e você não
tem reserva"* é chantagem com material que o cliente confiou à ferramenta. Nenhuma notificação,
banner ou CTA usa evento pessoal como alavanca — inclui a composição (§8).

**16.3 · Categorias funcionais, nunca morais.** Nenhuma categoria, rótulo ou alerta julga o gasto.

**16.4 · Nenhuma comparação social.** Norma descritiva tem efeito bumerangue documentado. A régua
é o plano do próprio cliente, sempre — e o alerta de saúde do orçamento é física, não virtude
(§5.1).

**16.5 · Melhora de dado não pode parecer piora de vida.** Quando a importação contradisser o
exame: *"você declarou X; hoje sabemos que é Y"*. **Nenhum indicador, pilar ou prazo piora no mês
em que o cliente entrega dado melhor.** Generalizado: **toda revelação que piora o número vem
rotulada como ganho de verdade, com a alavanca ao lado, e a omissão é anunciada antes** — senão a
sequência de refinamentos ensina que engajar-se com a ferramenta piora a vida.

**16.6 · Nada que o cliente explora em "e se…" vira sinal comercial.** *(nova)* Cobre o ramo do
§8, as simulações e o mutar: **não persiste, não vai ao radar, não marca lead, não entra em pauta
automática**. O consultor não lê `Simulacao`. É o vazamento real — a venda não acontece na tela,
acontece na fila.

**16.7 · O arredondamento declara a incerteza.** *(nova)* Real nos 24 meses · milhar até 10 anos ·
dezena de milhar depois. "R$ 4.238.117 em 2071" fabrica credibilidade que o modelo não tem, e é a
única forma de dark pattern que uma ferramenta honesta comete sem perceber.

---

## 17. O que isto muda na especificação selada

### 17.1 "Minha jornada" — parecer, não linha de tabela

**Quatro agentes vetaram a linha da v3** que dizia *"a linha do tempo dos objetivos é esta
ferramenta; para de ser tela própria"*. Ela apagava, de uma spec 5/5: os objetivos que custam
tarefa e não dinheiro, o consolidado *"estou no rumo no todo?"*, a escalada como skin, e uma aba
da bottom nav — deixando a tela mais valiosa do produto **sem ponto de entrada**.

**Decisão: a aba fica, e as duas coisas se dividem por natureza de pergunta.**

| | `Minha jornada` (aba) | Projeção de Vida (tela cheia) |
|---|---|---|
| Pergunta | *"estou no rumo no todo?"* | *"o que acontece com o meu dinheiro?"* |
| Forma | **resposta em palavras** | curva navegável |
| Escopo | **todos** os objetivos, inclusive os sem estoque | os que têm dinheiro |
| Custo | zero gestos | exploração |

A aba abre no consolidado — *"3 de 5 objetivos no rumo ou concluídos; 1 pede atenção"* —, lista os
marcos com data prevista (Proteção da família, mês 2; Tranquilidade sucessória, mês 3), hospeda o
skin da escalada, e leva à tela cheia **a um toque**. A profundidade é da ferramenta; a resposta é
da aba.

**Ponto de entrada, transição e volta declarados:** a tela cheia entra por `Minha jornada` e pela
Home (A13, "Meu Planejamento Patrimonial" e "Meu Orçamento"); o `✕` devolve à origem; vindo de um
link do WhatsApp, devolve à aba. A duplicata "Patrimônio" da bottom nav sai.

### 17.2 Os demais deltas

| § da selada | Delta | Parecer |
|---|---|---|
| §3.1 Máquina de estados | `exameConcluido` passa a ser **habitável** — o self-service entra na Projeção | C3 |
| §3.2 Modelo | entram as entidades do §13 | Engenheiro, rodada 06/08 |
| §3.4 Permissões | Admin passa a **escrever** `ParametrosDaCasa` (CREATE+READ) | B13 |
| §3.5 LGPD | `Pessoa` com consentimento próprio; namespace `nl:v1:casa:*` | Engenheiro |
| §5 Coleta | `perfil de suitability` ganha `origem`, `validoAte`, `valeParaSuitability` derivado | B11 |
| §5 Ativos | selo "aguardando metodologia" na configuração da taxa | CFP |
| §9.1.3 | o aporte é confrontado com o **planejado**, aceito pelo cliente | B2 |
| §10.1 Aderência | **janela móvel de 12 meses**, com as quatro bordas do §12.4 | rodada 08 |
| §10.3 | a linha do tempo ganha profundidade nesta ferramenta; **a aba permanece** (§17.1) | rodada 08 |
| §11.7 Jargão | vale inteira, mais os termos do §15 | Redator |
| §14 Componentes | `PalcoPatrimonio`, `TrilhoDeEventos`, `LeituraDaJanela`, `CardVeredito`, `FolhaInferior`, `AlavancaDeMaoUnica` | — |
| §15 Radar | rascunho de self-service **não** gera item; simulação **nunca** gera | C3, §16.6 |

---

## 18. Anexo — Lacunas (`⚠ não inventar`)

**Estrutural — impede publicar plano para o cliente afetado**
- **Previdência (PGBL × VGBL) e INSS:** entidade de plano, evento de conversão saldo → renda,
  regime tributário do resgate. A v3 afirmava que a estrutura existia; não existe.

**Consultoria / CFP**
- `tetoPorPrazo`: a tabela prazo → teto máximo (§6.5, §11.1).
- `mesesDeReserva` — o N que define a meta da reserva (§6.3).
- Lista fechada de **naturezas de renda** e o que cada uma dispara.
- **Regra dos avos** do 13º e férias quando o vínculo termina no meio do período (§5.7, decisão 4).
- **Reajuste real das rendas**; despesas que nascem e morrem com a aposentadoria; **inflação real
  por categoria** (saúde na velhice) — enquanto aberta, a meta do §7 é **piso**.
- **Premissa de inflação** que traduz taxa nominal de contrato em real (§6.7) — sem ela a
  comparação "quitar × investir" fica suspensa.
- **Dívida rotativa** (cartão, cheque especial, consignado, consórcio).
- **Valorização real de imóveis** — hoje 0%, declarado.
- Se a `expectativaDeVida` de 95 anos é ajustável por cliente dentro de faixa, ou fixa (C1).
- Se a `taxaDeReferencia` deve variar por perfil (C2 deu uma taxa única).

**Compliance / jurídico**
- **Questionário de suitability**: perguntas, pontuação, mapeamento (B12), e o prazo de validade.
- **ITCMD por estado**, custos e **duração do bloqueio de liquidez** no inventário (§8).
- **Pensão por morte**: percentuais e duração (§4.8).
- **Alíquotas e tabelas** (IR sobre resgate, come-cotas, ganho de capital).
- **LGPD do self-service** — base legal, finalidade, retenção para titular sem contrato
  (prioridade alta, C3); **tela de consentimento do Open Finance**, com consentimento **separado
  do cônjuge**.
- Texto final do **selo do PDF** e se a notificação do B15/B16 é comunicação regulatória.
- Frase ao cliente autodeclarado sobre por que capítulos de produto ficam bloqueados (§11.2).

**Produto e design**
- **Quem assina a notificação no WhatsApp** (§11.3) — é roteamento, não redação.
- **Sensibilidade** da data projetada à variância de um mês (§12.4).
- Tokens de cor: desempatar o roxo, hoje três coisas (§9.8).
- **A medir no piloto, não assumir:** dose de vereditos por tela; transferência do efeito dotação
  para curva derivada por algoritmo (taxa de edição do rascunho em 48h); ganho da idade derivada
  contra a pergunta direta (§3.1).

---

## 19. Critérios de aceite

**Motor**
1. `resolve()` é **pura**; realizar um clipe **não** muta o estado.
2. Diferencial: no mês do clipe, `estado(m) === estado(m−1)` **e** `resultado(m) ≠ resultado(m−1)`.
3. `resolve()` emite `componentes[]` com `prov`; `despesaIrredutivel()` nunca devolve 0 por
   ausência de contrato.
4. Janelas cobrem o horizonte sem sobreposição; sobreposição é erro de compilação.
5. Nenhuma renda sobrevive ao ativo que a lastreia; nenhuma alienação parcial zera uma renda.
6. Nenhuma renda que depende de trabalho roda sem `fim` declarado.
7. `indeterminado` nunca é renderizado, somado, dividido ou exportado como zero.
8. Nenhum real aparece ou some sem nome — incluindo a amortização do passivo.
9. A parcela do passivo entra no fluxo **uma vez** e termina sozinha.
10. Nenhuma taxa excede o teto de perfil **nem o de prazo**, avaliados contra a `premissasVersao`
    do plano **no momento da configuração**. *(o critério da v3 reprovava o caso canônico do §11.3)*
11. Plano publicado lê pelos **valores** da sua versão, com `motorVersao`.
12. A meta do §7 é descontada mês a mês, com a linha de IR não apurado.

**Tela**
13. Toda caixa com meta e prazo mostra veredito — as quatro naturezas.
14. O zoom alcança 6 meses por gesto **e por atalho** (duplo-toque; `+/−` no desktop).
15. As âncoras mudam largura sem mover o mês em foco; `hoje` preserva a largura.
16. Nenhum alerta negativo aparece sem caminho de volta, com igual peso — inclui `mesDeRuina` e o
    indicador de dependência.
17. Nenhum evento se distingue só por cor; os nove tipos são distinguíveis em escala de cinza.
18. Nenhuma banda visível abaixo de 14px; nenhum evento sai do trilho sem marcador.
19. Nada rola dentro do palco; o excedente colapsa e nada some.
20. A tela cabe em **390 × 664** com a porta de saída visível e a folha em peek.

**Ética**
21. Nenhum campo nasce preenchido com número que o cliente não deu, nem com média de terceiros.
22. Nenhum evento pessoal em mensagem comercial; nenhuma categoria julga; nenhuma comparação social.
23. Nenhum indicador piora no mês em que o cliente entrega dado melhor.
24. **Nenhum termo da coluna esquerda do §15 aparece em string renderizada** — varredura no build.
25. Nenhum registro de `Simulacao` ou do ramo §8 é persistido, auditado ao consultor ou usado
    como gatilho.
26. Todo número exibido obedece à escala de arredondamento do §16.7.

**Bancada**
27. Os 31 testes da rodada 06 continuam passando.
28. Novos: pureza e diferencial da continuidade; módulo negativo com âncora posterior; período
    truncado por `fim`; periodicidade submensal e supramensal; propagação de `indeterminado` nas
    oito operações; mês-base × dezembro; despesa anual sobrevivendo ao mês 25; amortização SAC no
    estado e na conciliação; alienação total × parcial; teto por perfil **e** por prazo;
    congelamento por `premissasVersao` + `motorVersao`; aderência nas cinco bordas do §12.4;
    completude do registro de eventos.
29. **Decisão de bancada:** as funções puras de `viewport.js` — `clamp`, `escalaEstavel`,
    `escalaDaJanela`, `ticksDeValor`, `ticksDoTempo` — vão para `verificar.mjs` **hoje, sem
    framework**. `useViewport`/`useGestos` exigem harness de ponteiros e são escopo declarado à
    parte. *(sem esta frase, o critério é pulado de novo)*

---

*Fim da especificação · Projeção de Vida v4*
