# Rodada 06 — Ferramenta de Evolução Patrimonial e Fluxo de Caixa

**Objeto da crítica:** uma ferramenta nova, não a especificação inteira.
**Painel:** agora com **6 agentes** — entrou o `ux-ui-designer`.
**Critério de aprovação (definido pelo Nélio):** só é aprovada quando **o
especialista de UX/UI E o cliente** considerarem que a ferramenta entrega com
clareza o que vai acontecer com o patrimônio e o orçamento da pessoa ao longo
do tempo. Os outros quatro agentes opinam e podem levantar bloqueantes, mas o
veto é desses dois.

## A régua de aprovação, nas palavras do Nélio

1. Um cliente pagaria **R$ 5.000 só para ter acesso a essa ferramenta**.
2. Um **investidor de Venture Capital** olharia e concluiria que a empresa
   cresce e tem penetração de mercado.
3. Um **especialista de UX** consideraria a experiência fluida, sem excesso de
   cliques, com iconografia e elementos visuais comunicando cada evento e cada
   dado importante com clareza.

## O que a ferramenta precisa fazer

- **Uma tela só** com a evolução do patrimônio ao longo do tempo.
- **Visão macro:** patrimônio financeiro · bens · participações societárias.
- **Visão caixinhas:** o financeiro repartido em reserva, compromissos, cada
  objetivo e liberdade financeira — cada caixinha com sua própria rentabilidade
  esperada (ex.: reserva a 4% a.a., liberdade a 7,5% a.a.).
- **Eventos configuráveis:** aporte pontual · aporte contínuo · janela de
  rentabilidade · resgate pontual (realização de objetivo) · resgate mensal
  contínuo · perpetuidade (saca só a rentabilidade, sem tocar no principal) ·
  consumo do patrimônio por período (o sistema calcula o PMT equivalente).
  Existe ainda `transferencia`, derivada, para mover valor entre caixinhas.
- **O diferencial declarado: a navegabilidade.** Toda ferramenta de evolução
  patrimonial do mercado peca no tamanho único: o gráfico ocupa a tela toda e
  eventos próximos (a compra de um carro em 7 meses) ficam ilegíveis. Aqui tem
  de dar para **afastar e ver a vida inteira, aproximar e ver os próximos 7
  meses, arrastar para os lados e acompanhar mês a mês** — no mesmo objeto.
- **Fluxo de caixa acoplado:** o projetado do orçamento (entra, sai, sobra),
  embaixo do gráfico de patrimônio, na mesma régua de tempo. A sobra é o que
  faz o patrimônio financeiro crescer junto com a rentabilidade.
- **Simulação:** o cliente deve querer passar tempo dando zoom, indo para a
  esquerda e para a direita, simulando um aporte aqui, mudando o orçamento ali.

## Onde está o trabalho

| Peça | Arquivo |
|---|---|
| Motor de projeção (fonte única) | `demo/src/motor/projecao.js` |
| Cenários (Ricardo + exemplo da spec) | `demo/src/motor/cenarios.js` |
| Simulação | `demo/src/motor/simulacao.js` |
| Bancada de conferência da matemática | `demo/src/motor/verificar.mjs` |
| Viewport, gestos, escala, eixo | `demo/src/components/viewport.js` |
| A tela | `demo/src/screens/Evolucao.jsx` |

**Capturas desta rodada** (`demo/capturas/`) — leia as imagens, é sobre elas que
o parecer de UX se sustenta:

- `r6-01-celular-10anos.png` — abertura no celular
- `r6-02-celular-7meses.png` — zoom máximo, os próximos 7 meses
- `r6-03-celular-vida-inteira.png` — zoom mínimo, 46 anos
- `r6-04-celular-macro.png` — visão macro (3 camadas)
- `r6-05-celular-travessia.png` — a venda da ótica e a travessia 2036–2041
- `r6-06-celular-simulacao-venda-fraca.png` — simulação com a ótica valendo R$ 700 mil
- `r6-07-desktop-10anos.png`, `r6-08-desktop-vida-inteira.png`,
  `r6-09-desktop-7meses.png`, `r6-10-desktop-especificacao.png`

## Convenções que o motor declara (e que podem ser atacadas)

1. **Valores reais**, moeda de hoje, taxas reais acima da inflação.
2. **Ordem dentro do mês:** rendimento sobre o saldo de abertura; aportes e
   saques no fim do mês.
3. **Prioridade dos eventos** dentro do mês é fixa, não é a ordem de cadastro.
4. **Conciliação:** sobra de caixa = aportes − saques, contando só movimentos
   contínuos. Pontuais (venda de um bem, realização de um objetivo) são dinheiro
   de fora do orçamento do mês. Descasamento acima da tolerância vira alerta
   nomeado — nenhum real evapora em silêncio.
5. **Perpetuidade** saca o que a vida custa, limitado ao que a carteira rendeu;
   se a vida custa mais que o rendimento, alerta de que manter aquilo significa
   consumir o principal.

## Estado da conferência matemática

`node demo/src/motor/verificar.mjs` → **21/21 passam**, incluindo os oito
pontos do exemplo que o Nélio especificou (sobra mês a mês, destino de cada
real, aporte pontual no mês 13, mudança de taxa no mês 25) e o invariante de
que a caixinha da travessia zera exatamente no mês 180.

---

## Pareceres

_(preenchido pelos agentes)_
