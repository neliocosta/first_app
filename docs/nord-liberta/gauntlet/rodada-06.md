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

---

## Veredito da rodada: **0 / 6 SATISFEITO**

| Agente | Veredito | O achado mais caro |
|---|---|---|
| **Cliente** *(veto)* | NÃO SATISFEITO | A despesa projetada contradizia por 2× o custo de vida que ele declarou no exame |
| **UX/UI** *(veto)* | NÃO SATISFEITO | No zoom de 7 meses o eixo de valor não participa do zoom: "aproximei e vi uma laje" |
| **Planejador CFP** | NÃO SATISFEITO | Vazamento de R$ 125/mês na travessia; premissa que sustenta o plano nunca declarada |
| **Psicólogo** | NÃO SATISFEITO | 35 anos de aposentadoria planejada pintados como déficit laranja |
| **Engenheiro** | NÃO SATISFEITO | `dividirJanelas` duplicava eventos pontuais — R$ 119.818 criados do nada |
| **Redator** | NÃO SATISFEITO | Alerta invertido: dizia "o plano tira mais do que o caixa comporta" quando o plano traz de menos |

### Convergências independentes (o sinal mais forte da rodada)

Três agentes chegaram, por caminhos diferentes, ao **mesmo** defeito: a aposentadoria
planejada renderizada como fracasso. Dois chegaram à **mesma** contradição entre a
despesa do orçamento e o custo de vida declarado. Quando o painel converge sem se
consultar, o defeito é real.

### Arbitragem: Cliente × CFP sobre a alavanca de rentabilidade

Conflito direto entre dois pareceres.

- **Cliente:** "não assino uma projeção de 46 anos com uma linha só, sem faixa, sem
  'e se render menos'. Isso é papo de banco com gráfico bonito." → exige a alavanca.
- **CFP:** "a taxa não ser alavanca do simulador é acerto sério — *enshrine* isso,
  senão o próximo desenvolvedor 'melhora' a UX e me entrega uma máquina de comprar
  rentabilidade." → proíbe a alavanca.

**Decisão: alavanca de mão única.** A rentabilidade só desce. Dá para testar se o
plano aguenta render menos; não dá para fazê-lo fechar rendendo mais.
*Prudência é simulável; otimismo não é.* Os dois estão certos sobre coisas
diferentes, e a assimetria atende os dois sem diluir nenhum.

### Bloqueantes fechados nesta rodada

**Motor**
1. Despesa nunca mais é número opaco — toda janela declara componentes com proveniência.
2. `pvNecessario()`, a pergunta inversa: a ponte passa a ser derivada da necessidade
   (R$ 873.159), não cravada. O PMT bate exato e o vazamento acabou.
3. Retirada planejada ≠ falta. `fluxo.natureza` separa `sustentadoPeloPatrimonio` de
   `descoberto`; laranja fica reservado ao que de fato não fecha.
4. Alerta invertido corrigido, com variante para mês com e sem renda.
5. `dividirJanelas` só parte eventos de janela; a alavanca de aporte tem alcance
   (morre no fim da fase) e só mexe na folga sem destino — nunca no custo declarado.
6. `brl(NaN)` devolve `—`, nunca "R$ 0".
7. Validação de carga: caixinha inexistente, janela invertida, orçamentos sobrepostos.
8. Imóvel a 0% real + ⚠ LACUNA; IR sobre a venda existe na linha com valor não apurado.

**Tela**
9. Eixo de valor corta a base abaixo de 36 meses, com o corte **declarado** na tela.
10. Leitura da janela ("nesta janela: +R$ 102.359 · +2,0%") — é ela que responde
    "o que acontece nos próximos 7 meses".
11. Abre em hoje. Antes o primeiro número era um mês a 5 anos de distância.
12. Legenda clicável responde "quando esse objetivo termina", com destaque no gráfico.
13. Estoque vira fluxo: "sustenta R$ X/mês sem tocar no dinheiro guardado".
14. Duas colunas no desktop; palco fixo no topo quando se simula no celular.
15. `touch-action: pan-y` e roda que só toma a página quando o gesto é de zoom.
16. Transições animadas; toque inspeciona; pinça pela hipotenusa; inércia por velocidade.
17. Vocabulário unificado: Reserva de emergência · Renda de 2036 a 2041 · Visão geral ·
    Aporte mensal/extra · Vive do rendimento · Renda por prazo · "o dinheiro guardado".
18. "Zeradas" vira dois estados: *já cumpriram o papel* × *ainda não começou*.
19. Achado de simulação não é erro — cor própria e a consequência ao lado do slider.
20. Copy morta ressuscitada: notas das caixinhas, proveniência, o "porquê" dos eventos.

Bancada de conferência: **21 → 31**, incluindo o invariante que teria pego a
contradição original e o branch de mudança de taxa dentro de janela de consumo,
que nunca rodava.

### Aberto para a rodada 07

Do CFP: passivo como camada de primeira classe com cronograma de amortização;
previdência e INSS; gestão de riscos (morte/invalidez) no motor; sucessório líquido
de ITCMD; inflação específica de saúde; premissas versionadas com trava de
suitability sobre a taxa; gerador de cenário-base a partir da coleta.

Do Engenheiro: modelar `Cenario`/`Caixinha`/`EventoPatrimonial`/`Simulacao` em §3.2 e
§3.4 da especificação; registro de tipos de evento em um lugar só; superfície de
autoria para o consultor; cobertura de teste para `simulacao.js` e `viewport.js`.

Do Psicólogo: ligar a ferramenta à cadência mensal (o aporte informado devolve
"quer ver onde ele cai na sua linha do tempo?"); saída para o humano no pico de
motivação; caminho de volta ao lado de todo alerta negativo (§10.3).

Do Cliente: o outro galho da árvore — e se eu morrer; saída em papel para o contador;
editar as próprias caixinhas.

Do UX: tooltip na crosshair; rótulo dentro da banda; ícones redesenhados por forma
(direção) e preenchimento (cadência), para a cor virar redundante.
