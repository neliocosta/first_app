# Rodada 09 — a Projeção de Vida v4

**Objeto:** `especificacao/projecao-de-vida-v4.md` — uma **especificação**, não código.
**Painel:** 6 agentes. Vetos: Cliente e UX/UI.
**Entrada da v4:** os 28 bloqueantes da rodada 08 e as três decisões do lote C.

## Veredito: **0 / 6**

| Agente | Veredito | O achado mais caro |
|---|---|---|
| **Cliente** *(veto)* | NÃO SATISFEITO | O §7 fixa a meta por horizonte finito e o §6.6 mantém a perpetuidade viva sem regra de precedência — R$ 1.149.643 de amplitude **dentro da própria v4**, sempre com a tela mostrando o número menor |
| **UX/UI** *(veto)* | NÃO SATISFEITO | O §9.1 trocou 844 por 664 e esqueceu a própria folha de 88px que o critério 20 exige visível: **736 em 664**, e a banda do bloqueante do Cliente cai para **4,6px** — pior que os 6,9px da v3 |
| **Engenheiro** | NÃO SATISFEITO | `brl(null) === "R$ 0"`, na função cujo comentário promete o oposto, sobre o `null` que o próprio motor grava na lacuna do IR |
| **Planejador CFP** | NÃO SATISFEITO | A meta é descontada a 4,91% e a curva é projetada a até 9% — quem atinge a meta exata termina aos 95 com **R$ 3.965.411 sobrando**, e o `mesDeRuina` desliga por construção para moderado e arrojado |
| **Psicólogo** | NÃO SATISFEITO | O bloqueante 16 — *conquista planejada nunca é queda* — não foi endereçado: a v4 **canoniza** o defeito no registro único de eventos |
| **Redator** | NÃO SATISFEITO | O §15 declara que a palavra "caixa" **não existe** e a v4 a usa 38 vezes, uma delas em string de tela — enquanto os três vazamentos da rodada 08 seguem idênticos em produção |

Terceiro 0/6 seguido. **E, ainda assim, a rodada mais produtiva do loop até aqui:** pela contagem do
Engenheiro, dos 28 bloqueantes da rodada 08, **14 fecharam de verdade**, 9 fecharam pela metade, 3
estão escritos e são contraditos pelo próprio documento, e 2 não têm mecanismo nenhum. A dívida
mudou de natureza — saiu de "falta desenhar" e entrou em "o documento se contradiz em pontos
verificáveis".

O que impede o selo é uma frase só, e é do Engenheiro:

> **A v4 repete, dentro de si, a família de defeito que ela existe para corrigir.** Ela mata "caixa"
> com dois sentidos e dá três significados à hachura. Ela conserta a aritmética de 8-contra-9 glifos
> e escreve "quatro bordas" sobre cinco linhas. Ela cria a regra *"todo número ILUSTRATIVO sai do
> motor"* e imprime como número-título um valor que o motor não produz.

---

## As convergências independentes

Nenhum agente leu o parecer do outro. Onde dois ou mais chegaram ao mesmo defeito por caminhos
diferentes, o defeito é real. Conferi cada número na calculadora antes de registrar.

### 1. A meta **ainda** não fecha em um número — 4 agentes + a orquestração

A convergência mais forte que este loop já produziu, e a mais cara: é o número-título da
ferramenta, e é exatamente o que as três decisões do lote C existiram para fechar.

O lote C **funcionou** — a amplitude de 2,04× da rodada 08 morreu, e R$ 2.847.982 reproduz **ao
centavo** com 312 meses, taxa mensal equivalente composta (0,400238% a.m.) e anuidade postecipada.
Só que a v4 nunca declara nenhuma dessas três convenções, e cada agente encontrou uma porta
diferente para sair do número:

| Convenção que o texto ou o código admite | Meta do Ricardo | Quem achou |
|---|---|---|
| §7 · postecipada a 4,91% — **o número impresso** | R$ 2.847.982 | (a referência) |
| §7 · **a fórmula literal do §7** é antecipada | R$ 2.859.381 | Cliente, CFP |
| motor · `pmtConsumoImediato()` é **declaradamente** antecipada | R$ 2.859.381 | Engenheiro |
| §6.5/C2 · mensalização por "0,40% a.m." literal | R$ 2.848.824 | orquestração |
| `cenarios.js:165` · 5,5% escrito à mão, e **assertado** em `verificar.mjs:128` | R$ 2.688.686 | Engenheiro |
| §6.6 e §13.4 · **perpetuidade, sem regra de precedência** | R$ 3.997.625 | Cliente |
| §7 · `m₀` nunca é definido — descontado a hoje em vez do mês de parada | R$ 1.387.663 | UX |

**Amplitude de R$ 1.308.939 entre as convenções compatíveis com o texto** — e de 2,05× se `m₀` for
lido como hoje. A rodada 08 matou uma amplitude de 2,04×; a v4 devolveu outra, menor em espírito e
igual em consequência.

Três consequências que cada agente trouxe por conta própria:

- **A fórmula escrita no §7 não produz o número impresso no §7.** Δ R$ 11.398,70. O critério de
  aceite 12 ("a meta é descontada mês a mês") fica intestável, porque não há convenção contra a
  qual testar. *(Cliente, CFP, Engenheiro)*
- **A meta e a curva usam taxas diferentes na mesma tela.** A meta desconta a `taxaDeReferencia`
  (4,91%); a curva projeta por `Caixinha.taxaAnual`, que o teto de perfil deixa chegar a 9%.
  Conferido: quem acumula exatamente R$ 2.847.982 e projeta no teto do moderado termina aos 95 com
  **R$ 3.965.411 sobrando**; no arrojado, R$ 8.122.805. **O `mesDeRuina` nunca dispara para
  moderado nem arrojado** — o resultado de primeira classe que a C1 criou é desligado por
  construção. *(CFP, Engenheiro)*
- **Cinco horizontes convivem no mesmo sistema:** §1 diz 80–90 anos, C1 decidiu 95,
  `cenarios.js:55` mostra "projeção até os 100", `:58` roda 552 meses, `:117` diz "dos 69 aos 99".
  E a lacuna *"quem define `Cenario.horizonte`"* saiu do §18 sem ter sido resolvida. *(Cliente)*

A sensibilidade anunciada no lote C também não reproduz: não é "~R$ 344 mil por ponto percentual"
simétrico, é **+R$ 306.176 / −R$ 261.784**. *(CFP)*

### 2. A conquista planejada continua renderizada como queda — 3 agentes

Bloqueante 16 da rodada 08. **Não foi endereçado, e a v4 promoveu o defeito a exemplo canônico:**

> `projecao-de-vida-v4.md:1304` — `saquePontual` · ▽ sólido · **"Saiu de uma vez"** ·
> *"Entrada da casa — R$ 230.000 em mar/2030"*

Está na tabela que a própria v4 declara ser a **fonte única da verdade** do motor, da simulação e
da iconografia. `grep` por "regra de sinal" na v4: zero ocorrências. A correção pedida —
`transferencia` de `financeiro` para `bens` somada a um `Passivo`, com patrimônio líquido intacto —
existe no documento como *tipo de evento* (§13.4, "O carro virou dinheiro") e nunca é aplicada ao
caso que a exigia.

**É violação de inviolável** (nº 2: melhora de dado não pode parecer piora de vida), e a metodologia
põe inviolável acima de qualquer parecer. Os três agentes o classificaram como bloqueante sem se
lerem. *(Psicólogo, Cliente, Engenheiro)*

### 3. A tela não cabe — de novo, por outra aritmética — 3 agentes

O §9.1 acertou o alvo (390 × 664 em vez de 844) e corrigiu as seis linhas que faltavam. Mas criou
uma folha inferior com peek de 88px e **não a somou ao orçamento**:

| Configuração | Soma | Com a folha em peek | Contra 664 |
|---|---|---|---|
| O diagrama do §9.1 (264 / 148) | 648 | **736** | **estoura 72px** |
| Só os mínimos (220 / 120) | 576 | **664** | cabe — em 664,00 exatos |

O critério de aceite 20 exige a tela em 390 × 664 **com a folha em peek**. Logo: ou o diagrama é
falso, ou o critério 20 é falso. E a única configuração que cabe tem **folga zero** numa seção que
chama duas de suas linhas de "elásticas". Os detentes pioram: a folha "cheia 88%" cobre 99% do
palco, quatro linhas abaixo da regra que diz que ela *"nunca cobre mais de 50% do palco"*.

Consequência que fecha o círculo com o veto do Cliente: com o palco espremido ao mínimo,
"Formação dos filhos" (2,1% do patrimônio) renderiza a **4,6px** — pior que os 6,9px que motivaram
o veto do UX na rodada 08. *(UX, Cliente, Engenheiro)*

### 4. O colapso do §9.5 tem dois limiares que se contradizem — 2 agentes

O piso de banda é **14px**; o gatilho do colapso é **`menorBanda / palco < 4%`**. Num palco de
264px, 14px são **5,30%**. Toda banda entre 4,00% e 5,30% **não dispara o colapso e fica abaixo do
piso** — reprovando no critério de aceite 18 da própria v4. O piso só é alcançável pelo gatilho de
4% com palco ≥ 350px, acima de todos os palcos que o §9.1 declara. A regra certa é em pixels, não
em porcentagem — que é exatamente a correção que o §9.5 acabou de fazer para trocar contagem por
proporção, cometida de novo um parágrafo abaixo. *(UX, Engenheiro)*

### 5. `indeterminado` já é zero — hoje, no código — 2 agentes

O §5.6 é uma das melhores seções do documento e a tabela de propagação está certa. Mas ela nomeia
a **classe da solução** ("sentinela tipada com funções totais") e nunca a **representação**: não há
valor, nem serialização, nem terceiro ramo nos `if`. Enquanto isso, no motor:

```js
// demo/src/motor/projecao.js:461-464
export const brl = (n) =>
  (Number.isFinite(Number(n)) ? … : '—'); // nunca "R$ 0" para um número que não existe
```

`Number(null)` é `0`, e `0` é finito. Executado: **`brl(null)` devolve `"R$ 0"`** — na função cujo
comentário, na linha seguinte, promete que isso nunca acontece, e sobre o `valorNoMes: null` que o
próprio motor grava na lacuna do IR (`projecao.js:291`). `calculo.js:47` tem uma segunda `brl` que
converte todo *falsy* em zero.

O Psicólogo chegou ao mesmo lugar pela outra ponta: **"silêncio nunca é zero" desapareceu da v4** —
a trava não está no §16, e o §5.6 empurra o mês não informado para zero por dentro, ao definir
`lacuna` como *"movimenta zero deliberadamente"*. *(Engenheiro, Psicólogo)*

### 6. `tetoPorPrazo` trava onde a alavanca não vale nada — 4 agentes

O segundo eixo de trava é a resposta da rodada 08 à válvula de escape do §6.4. Ele está **escrito,
é ⚠ LACUNA no §18, e já produz número ilustrativo na tela**. Pior: a justificativa do §6.5 é falsa
nos próprios números — diante de *"faltam R$ 4.306"*, subir a taxa de 4% para 6% numa caixa de 7
meses compra **R$ 343**, não fecha o buraco, e nem 9% fecha (seriam precisos 30,25% a.a.). A trava
foi dimensionada contra o caso em que ela não é necessária, e continua aberta na caixa `liberdade`,
onde 4% contra 9% valem R$ 4,6 milhões. *(Cliente, CFP, Psicólogo, Engenheiro)*

### 7. A poda de copy foi escrita pela segunda vez e não aplicada pela segunda vez — 3 agentes

O §15 reescreveu a tabela de dívida de copy da rodada 08. Conferido linha a linha: **as três
strings estão idênticas**.

| Onde | Hoje, em produção | O que a v4 promete há duas rodadas |
|---|---|---|
| `projecao.js:300` | *"e **a caixinha tem** R$ 32.100"* | *"e você separou R$ 32.100"* |
| `projecao.js:398` | *"O plano **manda** guardar"* | *"O plano **prevê** guardar"* |
| `projecao.js:292` | *"valor ainda não calculado"* | *"ainda não sabemos"* |

O Redator achou mais sete vazamentos vivos (`projecao.js:170, 313, 350, 404, 443`, `cenarios.js:147`,
`Evolucao.jsx:544`), incluindo mensagens de erro de bancada escritas em português de gente para o
cliente — e `projecao.js:181` imprimindo *"Vale a primeira."*, a frase que a decisão 6 do §5.7 da
própria v4 repudia por escrito. O Psicólogo, independentemente, contou o invariante do caminho de
volta falsificado em **14 de 14 alertas** do motor.

E "caixa", que o §15 declara inexistente, aparece **38 vezes na v4** — uma delas em string de tela,
no §9.5: *"as caixas menores estão ampliadas para caber"*. *(Redator, Psicólogo, Engenheiro)*

### 8. O §12.4 diz "quatro bordas" e lista cinco — 2 agentes + a orquestração

A seção se chama "as quatro bordas", a tabela tem cinco linhas, e o critério de aceite 28 pede
"aderência nas cinco bordas do §12.4". O Engenheiro acrescenta a sexta que falta — os meses 1 a 11,
quando ainda não há janela móvel de 12 meses — e o buraco maior: *"na desacumulação a aderência não
se aplica; o indicador é outro"* **nunca nomeia o outro indicador**, deixando sem métrica ~35 dos 41
anos projetados. *(CFP, Engenheiro, orquestração)*

---

## O que eu conferi na calculadora

Registro separado, porque a rodada 08 me ensinou que os meus próprios números são o ponto cego.

**Confere:**
- R$ 2.847.982 reproduz **exatamente** (312 meses, 0,400238% a.m., postecipada). O lote C fez o que
  prometeu.
- O orçamento de tela fecha em 648 e cabe em 664 — **enquanto se ignora a folha**.
- A auditoria mecânica de referências cruzadas voltou **limpa**: as quatro referências quebradas da
  rodada 08 foram fechadas, e a v4 desambigua com a palavra "selada" quando aponta para o outro
  documento. Restam duas citações a critérios de aceite escritas como se fossem seção (`§19.13`,
  `§19.24`).
- `node demo/src/motor/verificar.mjs` → **37/37, exit 0.** A bancada roda verde.

**Não confere:**
- **O §16.7 falsifica o número-título e o critério de aceite 26.** A regra de arredondamento diz
  *"real nos 24 meses · milhar até 10 anos · dezena de milhar depois"*. A meta do Ricardo é sobre um
  horizonte de 15 anos e aparece **ao real** — em R$ 2.847.982 — no §7, no §0.1 e no lote C. Pela
  própria regra, deveria ser R$ 2.850.000. É a única forma de dark pattern que o §16.7 diz que uma
  ferramenta honesta comete sem perceber, cometida no número mais visível do produto.
- **O §19.27 pede "os 31 testes da rodada 06"; a bancada tem 37.** Um critério de aceite com o
  número errado é um critério que ninguém conferiu.
- E o registro do Engenheiro sobre a bancada verde, que vale mais que o verde: **nenhuma das 37
  asserções toca `brl()`, `validar()` de camada, cobertura de janelas, `PRIORIDADE` com tipo
  ausente, `despesaIrredutivel()` sem `componentes[]` ou a taxa da casa.** Sete achados desta rodada
  vivem exatamente nesses vãos — e é por isso que sobreviveram a três rodadas.

---

## As arbitragens

### A · O `mesDeRuina` do self-service: convite (C3) × "estado negativo nunca é peça comercial" (Psicólogo)

- **C3 (decisão do Nélio):** o self-service faz a projeção inteira e termina no convite, nunca num
  alerta sem saída.
- **Psicólogo:** onde a saída é a compra, o apelo ao medo vira venda. Contar a alguém a data em que
  o dinheiro dele acaba e terminar a tela numa oferta é a estrutura clássica do *fear appeal*
  comercial — e o número da saída, hoje, é escrito à mão e não fecha.

**Decisão: a C3 fica inteira, e o Psicólogo ganha a sequência e o canal.** São coisas diferentes.
O que o Psicólogo proíbe não é o convite — é o convite ocupando o lugar da saída. Portanto:

> **A alavanca vem antes, na mesma tela e com o mesmo peso. O convite é uma superfície separada e
> mais quieta, embaixo. E o `mesDeRuina` nunca é o gatilho nem o corpo de uma mensagem de saída** —
> sem push, sem WhatsApp, sem e-mail, sem item de radar.

Isto é a própria fronteira da C3 ("a conversão acontece no produto, pelo convite; o consultor entra
quando o lead pede"), e resolve o item 3 do lote C sem diluí-lo. Fica de pé o bloqueante do
Psicólogo que **não** é arbitrável: o número da saída tem de sair do motor, como todo número
ILUSTRATIVO desde o §0.3.

### B · Aposentadoria: bloqueada (§14/§18) × "o dado já existe na coleta" (CFP)

- **v4:** previdência e INSS são lacuna **estrutural** — a entidade não existe, e a vertical fica
  bloqueada.
- **CFP:** a coleta já tem previdência aberta e fechada, com tipo, regime tributário e saldo; o §4.3
  já modela o INSS. O bloqueio derruba a vertical de Aposentadoria para ~100% da carteira.

**Decisão: o CFP tem razão, e a v4 cometeu no §14 o erro que o §14 acabou de corrigir** —
diagnosticar ausência de estrutura onde há ausência de **consumo**. A lacuna se parte em duas:

| Fica lacuna (⚠ compliance) | Deixa de ser lacuna |
|---|---|
| Regime tributário do **resgate** (PGBL sobre o valor integral, come-cotas, ganho de capital) | A **entidade** de plano de previdência, que a coleta já captura |
| A conversão **saldo → renda** (tábua, conversão atuarial) | O INSS como renda com `dependenciaDoTrabalho: continua` |

Aposentadoria sai de "bloqueada" e passa a **coberta com a linha do imposto aberta** — a mesma
honestidade que o §7 já aplica ao IR do resgate e o §14 ao IR da venda da ótica. Racional para
contrariar o texto da v4: a autoridade de domínio sobre o que a coleta captura é da CFP.

### C · A `Simulacao` salva: §9.9 exige × §16.6 proíbe (Engenheiro × Psicólogo)

Cinco declarações normativas incompatíveis, e os dois agentes estão certos sobre coisas diferentes.
O §16.6 existe para fechar o **vazamento comercial** ("a venda não acontece na tela, acontece na
fila"), não para impedir o cliente de guardar uma comparação que é dele.

**Decisão: o eixo é visibilidade, não disco** — formulação do Engenheiro, que resolve os dois.
A `Simulacao` pode persistir **no escopo do próprio cliente**, sob `nl:v1:cliente:{id}:sim:*`, sem
índice que o radar possa varrer e sem tabela que o consultor leia. E `persistida: false` deixa de
ser campo: um campo que só admite um valor é um comentário (CFP), e a garantia do critério 25 é
arquitetural — a tabela não existe.

### D · O número-título precisa de uma linha na tela que já estoura 72px

Não é conflito entre agentes; é a restrição real que a v5 tem de encarar, e prefiro nomeá-la a
deixá-la para a rodada 10. O UX exige que R$ 2.847.982 tenha pixels próprios (hoje tem zero e custa
dois gestos) **e** que a tela caiba em 664 com a folha em peek. As duas coisas só coexistem se a
folha sair do estado padrão:

> **A tela abre com a folha fechada (alça de 24px). `peek` passa a ser estado, não default.** O
> critério 20 se reescreve sobre a alça, e o número-título ocupa a linha que sobra no bloco de
> identidade.

---

## O que o painel elogiou, e que fica

- **§9.3 (navegação) fechou inteiro** — os três agentes que o tocaram o aprovaram, e o UX registrou
  que é a métrica nº 2 da persona dele satisfeita: *"o melhor trabalho da v4"*. A fórmula da âncora,
  a política de borda, `hoje` preservando a largura e os chips no lugar do *segmented control*.
- **§11.1 é a melhor seção de segurança do projeto** (Engenheiro): append-only, `vigenteDesde`
  futuro, quatro olhos, prévia de impacto, procedimento de reversão.
- **A tautologia morreu.** O invariante diferencial do §5.4 **pode falhar** — era o bloqueante nº 3
  da rodada 08 e fechou com precisão.
- **§17.1 substituiu a linha de tabela por parecer.** A aba "Minha jornada" voltou, com ponto de
  entrada, transição e volta declarados — e o Redator confirmou que ela está viva em
  `MinhaJornada.jsx`.
- **§12.3, a ponte das três copies** (Psicólogo): atribuição externa contra o efeito de violação da
  abstinência, e a ponte aterrissa na resposta, não na ferramenta.
- **§9.4, a textura como fita própria** — o UX pediu e a v4 entregou sem destruir a redundância que
  protege o daltônico.
- **"Separar mais mostra de onde sai o dinheiro"** (§6.4) — o Cliente e o Psicólogo, separadamente,
  o chamaram do melhor mecanismo do produto. Fecha um dark pattern de contabilidade mental de
  verdade.
- **§11.2 fecha os três buracos do `PerfilDeRisco`**, incluindo o seletor `modulosPublicaveis()` que
  destravava capítulo de produto com um chute.
- **A v4 produziu mais copy assinável que todas as versões anteriores somadas** (Redator, 12 frases)
  — e o critério de aceite de copy passou a existir.
- O Cliente registrou o que mais me importa ouvir dele: **o card do §6.4 fecha ao centavo**
  (R$ 30.694,27), as citações de código estão todas corretas, e as datas são coerentes entre quatro
  seções. *"É a primeira vez que eu consigo conferir e dá certo."*

---

## O que a rodada me ensinou sobre o próprio método

**A rodada 08 me ensinou que delta que remove requisito precisa de parecer, não de linha. A rodada
09 ensina a metade que faltava: delta que declara *fechamento* precisa da mesma cerimônia.**

O §0.1 declara o glide path resolvido "(§7, §11)" — e a expressão "glide path" aparece **uma única
vez em 1.599 linhas**, nessa mesma linha da tabela que declara o fechamento. O §14 diz que
Aposentadoria "fecha com C1+C2" na coluna *Estado* e lista, na coluna *Falta* da mesma linha, a
lacuna estrutural que a bloqueia. A tabela do §0.1 está virando o que a tabela do §16 da v3 foi:
o lugar onde a afirmação ficou mais barata de escrever que a regra.

**Segundo aprendizado, e é o mais duro:** a tabela de dívida de copy foi escrita duas vezes e
aplicada zero vezes. Escrever a correção no documento passou a ser o substituto de fazê-la — e o
loop não tem como perceber isso sozinho, porque o log de rodada lê a especificação, não a tela.
Por isso o §19.24 (varredura de vocabulário no build) deixa de ser critério de aceite da v5 e passa
a ser **pré-condição da rodada 10**: enquanto a varredura não rodar, o Redator não tem o que
avaliar que já não tenha avaliado duas vezes.

**Terceiro:** a bancada verde é um anestésico. 37 asserções passando esconderam `brl(null)`,
`validar()` de camada e a cobertura de janelas por três rodadas. Teste que confere o cenário-âncora
contra si mesmo prova consistência, não correção.

---

## Bloqueantes para a v5

Consolidados dos seis pareceres. Os importantes e menores ficam nos pareceres.

**O número**
1. **Fechar a meta em um número reprodutível:** declarar a convenção (postecipada), `n` em **meses**
   (312, não idades), a equivalência composta, e `m₀` = mês de parada — os quatro em
   `ParametrosDaCasa`, versionados. A fórmula do §7 tem de produzir o número do §7.
2. **Regra de precedência entre horizonte finito e perpetuidade** (§7 × §6.6/§13.4), e reconciliar
   o cenário-âncora, que hoje é o de perpetuidade.
3. **Reconciliar a C2 com `Caixinha.taxaAnual`:** a taxa que projeta a curva desce da casa como a
   que desconta a meta, ou o veredito compara grandezas de taxas diferentes e o `mesDeRuina` fica
   desligado para dois dos três perfis. O glide path sai de `cenarios.js:165`.
4. **Um horizonte só** — resolver os cinco, e devolver ao §18 a lacuna "quem define
   `Cenario.horizonte`", que saiu sem ser respondida.
5. **§16.7 vale para o número-título** — R$ 2.850.000, não R$ 2.847.982; ou o §16.7 ganha a exceção,
   com parecer.

**Inviolável**
6. **Conquista planejada nunca é queda:** entrada da casa vira `transferencia` + `Passivo` no §13.4,
   regra de sinal na leitura da janela (§9.4), trava no §16 e critério no §19. É o bloqueante 16 da
   rodada 08, na segunda rodada sem mecanismo.
7. **Aplicar a poda de copy** — as três strings da rodada 08 mais as sete novas, e a varredura do
   §19.24 rodando no build **antes** da rodada 10.
8. **`brl(null)` e `calculo.js:47`** — `indeterminado` deixa de ser zero na função de formatação,
   hoje.
9. **Representação de `indeterminado`**, não a classe da solução: valor, serialização, terceiro ramo,
   e os 33 sítios aritméticos migrados.
10. **"Silêncio nunca é zero" volta ao §16** como trava explícita, e o `lacuna` deixa de ser
    definido como "movimenta zero".

**Tela**
11. **§9.1 com a folha dentro do orçamento** — 736 contra 664; folha fechada no estado padrão;
    elasticidade que exista; z-index e faixa reservada para os chips do §9.3; o número-título com
    linha própria; `Simular` fora do FAB, que cobre 67% do chip `hoje`.
12. **Um limiar só para o colapso** (`menorBandaPx < 14`), rótulo externo para a banda no piso, e a
    distorção declarada.
13. **Cadência derivada da instância (`mesFim`), não do tipo** — 8 dos 16 eventos do cenário-âncora
    recebem o glifo errado; e a hachura não pode ganhar o terceiro significado que o §5.6 lhe dá
    contra o argumento do §9.4.
14. **Regra de overflow do trilho** — segue existindo só como critério de aceite, sem seção
    normativa, e o trilho de 44px não comporta as três pistas que a v4 lhe pede.
15. **Como uma caixa recebe foco** — "a caixa em foco" governa o único veredito visível e não existe
    em lugar nenhum; e o terceiro estado do veredito da `liberdade`, que hoje é proibido de dizer
    "suficiente" e obrigado a mostrar veredito.

**Modelo e segurança**
16. **`prov` separa proveniência de papel orçamentário** — são duas dimensões ortogonais no mesmo
    campo, e é por isso que a alavanca tem alcance R$ 0 no macro.
17. **A entidade `Despesa` com periodicidade** — três entidades nomeadas no §5.5, nenhuma no §13.1.
18. **`Pessoa` com namespace e um registro só de consentimento**; e o produtor de consentimento que
    a C3 exige para dado de terceiro coletado no self-service.
19. **O append-only sobrevive ao reset da demo** — `store.js:149/:185` varrem `nl:v1:casa:*`.
20. **Estados impossíveis param de passar em silêncio** — camada desconhecida some com 90% do
    patrimônio sem alerta; sobreposição de janelas é `atenção` contra o critério 4.

**Atendimento e escala**
21. **Aposentadoria desbloqueada** conforme a arbitragem B, e `mesesDeReserva` sai do §18 — o dado
    já existe na coleta.
22. **A meta sai rotulada como estimativa** (selada §3.3): derivação com projeção, divisão, taxa e
    horizonte não é afirmação nua.
23. **A `Fase 2.5 · Montagem do Relatório` entra na v4 ou ganha parecer** — a calculadora de alocação
    reparte o financeiro na mesma tela que o §6.2, em outra fase, sem dizer qual manda.
24. **Escala piorou, não melhorou:** a CFP recontou com as seis obrigações novas e chegou a
    **717h–1.203h/ano** para 150 clientes (41% a 68% do ano útil), contra as 450h da rodada 08.
    Derivar as seis listas repetíveis da coleta é bloqueante de viabilidade, não de conforto.
25. **A chave `Objetivo` ↔ `Caixinha` fechou numa direção só** — `reserva` e `liberdade` não têm
    objetivo, ficam fora da `prioridadeCascata`, e meia chave não aloca meio aporte.
26. **A `SugestaoDeReparticao` não tem retorno** — `status` sem estados nomeados, sem tela e sem
    prazo; o laço do B9, que é a resposta ao veto do Cliente, termina em silêncio.
27. **O §12.4** — seis bordas, contagem certa, e **nomear o indicador da desacumulação**, que hoje
    deixa ~35 dos 41 anos sem métrica.
28. **O §12.2 entrega direito de veto e reivindica *commitment device*** — o cliente digita o valor
    e declara o *quando* (intenções de implementação), ou a seção para de reivindicar o mecanismo.

---

## Lacunas novas a registrar (⚠ não inventar)

- **Convenção de anuidade e de mensalização** como parâmetro versionado — não como convenção tácita.
- **Regra bruto × líquido em `rendasQuePersistem`** — sem ela, erro otimista de até R$ 489.497 (CFP).
- **A tabela `tetoPorPrazo`**, que já produz número ilustrativo na tela sem existir.
- **Entidade de cobertura (`Apolice`)** para Riscos, e `prazo de cobertura` como campo estruturado —
  hoje é texto livre na coleta.
- **Campos-âncora do Sucessório** (regime de bens, herdeiros, testamento, holding): o §14 os declara
  "não consumidos" e eles não existem na coleta. É lacuna **de coleta**, não de consumo.
- **Sobre qual patrimônio o "N anos" do §8 é contado** — 11 meses, 5,1 anos ou 25,1 anos conforme a
  base: 26,7× de amplitude na tela mais sensível do produto.
- **A aritmética da recuperação na janela móvel de 12 meses** — excedente acumulável, teto de 100%,
  e o tratamento do mês silencioso.
- **`prefers-reduced-motion`** e a política de animação (Psicólogo, acessibilidade).

---

*Rodada 09 encerrada · 0/6 · próxima entrada: `projecao-de-vida-v5.md`*
*Pré-condição declarada para a rodada 10: a varredura de vocabulário do §19.24 rodando no build.*
