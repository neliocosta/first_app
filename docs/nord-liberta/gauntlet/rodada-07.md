# Rodada 07 — a especificação da Projeção de Vida

**Objeto:** `especificacao/projecao-de-vida-v2.md` — uma **especificação**, não código.
Foi ao painel antes de virar linha nenhuma, a pedido do Nélio (A21).

## Veredito: **0 / 6** — e a rodada valeu justamente por isso

| Agente | Veredito | O achado mais caro |
|---|---|---|
| **Cliente** *(veto)* | NÃO SATISFEITO | `fim: null` numa renda ativa é uma mentira de décadas — e é o padrão |
| **UX/UI** *(veto)* | NÃO SATISFEITO | A spec não especifica **uma única tela**; e apaga a visão de 7 meses, que era a prova do diferencial |
| **Planejador CFP** | NÃO SATISFEITO | Ativa × passiva como binário está errado; falta `ativoLastroId` |
| **Engenheiro** | NÃO SATISFEITO | A regra de continuidade, como escrita, é **falsa** |
| **Redator** | NÃO SATISFEITO | A spec nomeia dez conceitos novos e nenhum sobrevive ao leitor de 54 anos |
| **Psicólogo** | NÃO SATISFEITO | A cura para "chegou pronta" não é tela em branco — tela em branco é pior |

---

## A correção mais importante da rodada

O psicólogo releu o feedback A15 do Nélio (*"a ferramenta já veio com todos os
itens preenchidos"*) e mostrou que eu o interpretei por um grau errado:

> O defeito da v1 não era **estar preenchida**. Era estar preenchida com
> **números de outra pessoa, sem autoria e sem proveniência visível**.
> A cura não é a tela em branco — tela em branco é pior que tela pronta.

Consequência direta: minha spec abre pedindo 12 meses de precisão **antes de o
cliente ver qualquer coisa dele na tela**. Em B=MAP, a variável travada não é
motivação, é *ability* — e motivação alta com ability baixa produz uma coisa
só: abandono com culpa.

A proposta que preserva a sequência do Nélio e remove o pedágio: um **rascunho
autoral em 3 minutos** — quatro números que só o cliente sabe (renda da família,
gasto médio, o que já está guardado, idade em que quer parar) — e a curva dele
aparece. Tudo o que a spec chama de Passo 1 a 4 vira **refinamento de algo que
já é dele**. Refinar é editar; editar tem o efeito dotação a favor. Autorar do
zero tem a tela em branco contra.

E o melhor: a regra de continuidade do Nélio **já é, de graça, a melhor mecânica
de hábito mensal do produto**, e ninguém tinha usado como tal. "Se não mudou,
repete" significa que a manutenção mensal do plano inteiro cabe em uma pergunta
e um toque: *"algo mudou no seu orçamento em {mês}?"*, com "nada mudou" como
resposta padrão — honesta e literalmente correta pelo modelo de dados.

---

## As três convergências independentes

**1. A regra de continuidade se contradiz dentro do próprio documento.**
Achada pelo Engenheiro e pelo UX, por caminhos diferentes.

- §3: *"para qualquer mês `m` sem evento, receitas, despesas e o resultado do mês
  são **idênticos** ao mês `m−1`"*
- §2: *"uma renda trimestral não vira valor ÷ 3. Ela cai no mês em que cai"*

As duas não podem ser verdade juntas: abril não é idêntico a março quando as
aulas são trimestrais. **O invariante estava escrito sobre o resultado; tem de
ser escrito sobre o estado.** As regras vigentes é que se repetem; os valores
realizados derivam delas aplicadas ao calendário.

**2. Vender um ativo tem de encerrar a renda que ele gera.**
Achada pelo Cliente e pelo CFP.

`Renda` não tem `ativoLastroId`. Vender a ótica e continuar recebendo pró-labore
dela — ou vender o imóvel e seguir recebendo aluguel até 2106 — é a mesma
família de defeito que o Engenheiro pegou na rodada 06 (`dividirJanelas`
inventando R$ 119.818). Aqui é pior: é o **comportamento padrão**.

**3. A v2 reabre em silêncio os vinte bloqueantes fechados na rodada 06.**
O layout de §4 tem "cabeçalho fino" e quatro faixas. Não há lugar para a leitura
da janela, a linha de sustentabilidade, os componentes de despesa com
proveniência, a legenda clicável, o painel "E se…", a alavanca de mão única, o
alerta `achado` roxo, o desfazer. Uma spec de substituição precisa declarar o
que herda.

---

## Correções técnicas que eu escrevi errado

**A meta da liberdade financeira não é a soma das rendas ativas** (CFP).
Ela é o **custo de vida projetado na fase futura**, líquido de imposto e das
rendas que persistem, menos as despesas que morrem com o trabalho, mais as que
nascem. Substituir renda bruta ativa superestima para quem poupa muito e
subestima para quem tem despesa crescente. A soma das ativas continua na tela
com **outro nome e outra função**: *"quanto da sua renda depende de você
trabalhar"* — indicador de dependência do capital humano, insumo da vertical de
Riscos, não da de Aposentadoria.

**"Âncoras a partir de hoje" quebra a continuidade espacial** (UX).
Estou em 2041 examinando a travessia, toco em "próximos 10 anos" e sou
teletransportado para 2026. Perdi o lugar. As três âncoras devem alterar a
**largura** da janela mantendo o mês em foco parado; voltar a hoje é o botão
"hoje", separado.

**A continuidade replicaria dezembro por 89 anos** (Engenheiro).
Se o cliente preenche 12 meses precisos — com 13º, presentes, IPVA em janeiro —
e para, "repete o mês anterior" propaga a anomalia de dezembro pela vida
inteira. O mês 13 tem de herdar o mês típico do passo 2, e se ele não existe o
resultado é `indefinido`, nunca a repetição de dezembro.

**`indefinido` não pode virar zero** (Engenheiro).
O motor hoje devolve `achou: false` → `natureza: 'semOrcamento'`. No modelo
derivado, o estado vazio se propagaria por continuidade como se fosse zero
declarado — regressão direta de *"silêncio nunca é zero"*.

**Não cabe em 390px** (UX, com a conta feita).
Cinco rendas em cinco pistas dão ~24px por pista: rótulo de 10px e alvo de toque
de 24px, abaixo do mínimo de 44px. E essa família tem cinco rendas; uma com oito
estoura. Falta regra de colapso, de overflow e de scroll vertical — que ainda
conflita com o pan horizontal.

---

## Riscos éticos que o painel mandou travar por escrito

- **Marcador-fantasma que pré-preenche valor** em vez de perguntar é default
  financeiro não declarado — fere "nunca inventar conteúdo financeiro".
  Pergunta sim, número não.
- **Evento nomeado nunca vira urgência comercial.** *"Sua filha nasce em 8 meses
  e você não tem reserva"* é chantagem com material que o cliente confiou à
  ferramenta para planejar.
- **A taxonomia moralizante que vem de fábrica** em agregador financeiro
  ("supérfluo", "desperdício") entrando pela importação sem ninguém decidir.
  Categorias funcionais — fixo, variável, eventual — nunca morais.
- **Nenhuma comparação social sobre gasto.** Norma descritiva tem efeito
  bumerangue documentado: quem gasta menos que a média ganha licença para gastar
  mais.
- **A importação vai contradizer o exame**, e essa é a hora mais perigosa do
  produto. O contexto já tem a regra pronta — *"você declarou X; hoje sabemos
  que é Y"*, melhora de dado não pode parecer piora de vida. Nenhum pilar pode
  cair no mês em que o cliente entrega dado melhor.

---

## O que o painel elogiou, e vale preservar

- A **inversão de janelas para mudanças** é, nas palavras do Redator, "o melhor
  achado do documento", e o CFP reconhece que ela "transforma 1.080 células numa
  lista de mudanças".
- Os **clipes espaçados** para renda não-mensal: ver o buraco antes de ler o
  número.
- O CFP acrescentou um ganho que eu não tinha visto: **natureza CLT gera
  automaticamente os clipes de 13º e férias** — a periodicidade não-mensal mais
  comum do país, caindo de graça no vocabulário de clipes.
- O UX apontou o verbo de editor que ficou na mesa e que é o mais vendável:
  **mutar uma faixa de renda**. *"E se a esposa parar de trabalhar"* vira um
  toque no ícone da trilha, não um formulário.

---

## Superado por documento-fonte

O CFP concordou com a minha leitura de que "Meu Orçamento" e "Meu Planejamento
Patrimonial" seriam duas portas para a mesma ferramenta. A especificação de
orçamento do Nélio, recebida depois de a rodada começar, **desfaz isso**: são
duas ferramentas com horizontes diferentes (24 meses × 90 anos), unidades
diferentes e naturezas diferentes — uma tem realizado, a outra é projeção pura.
Ver `especificacao/duas-ferramentas.md`.

O Redator propôs uma síntese que vale considerar: **um nome, duas portas, dois
focos**. Compatível com a separação, desde que o horizonte de cada ferramenta
fique explícito.
