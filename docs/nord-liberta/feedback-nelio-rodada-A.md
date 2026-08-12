# Feedback do Nélio — lote A (exame e entrada na jornada)

> Recebido em prompts sucessivos. **Não atacar até o lote fechar.**
> Status: `RECEBIDO · AGUARDANDO OS DEMAIS ITENS`

---

## A1 · Entrada na jornada: o cliente está travado no exame

Hoje a aplicação abre direto no exame e o cliente fica preso nele. Não é o
melhor comportamento de jornada.

**O que deve existir:** uma **trilha, no espírito da trilha educacional do
Duolingo**, que mostre com clareza qual é a próxima etapa e a próxima ação.
A trilha explica que a próxima etapa é o exame; aí sim ele entra no exame e
responde. O passo a passo claro é bom — o que não pode é o exame ser a porta.

## A2 · O vídeo do exame está com dimensionamento errado

Provavelmente é 16:9 e não está sendo tratado como tal.

## A3 · Subtexto sob o título da pergunta

Cada pergunta precisa de um subtexto abaixo do título, explicando em mais
detalhe — para quem não assistir ao vídeo.

## A4 · Valor de poupança: faixa quando varia

Se a pessoa responder que **varia muito**, é preciso pedir **de quanto até
quanto** varia (mínimo e máximo).

## A5 · Fim dos ícones de valores pré-determinados — em TODAS as perguntas

Os atalhos de valor induzem resposta preguiçosa e não realista.

**Regra geral, sem exceção:** nenhuma pergunta do exame usa chips/ícones de
valor pré-determinado. Só campo de texto para o valor, mais a opção "varia
muito" com mínimo e máximo onde couber.

Isso vale para a poupança, para os ativos financeiros e para **qualquer outra
pergunta** onde os atalhos apareçam hoje.

## A6 · "Você já parou pra avaliar quanto precisa para realizar esses objetivos?"

As opções passam a ser apenas **Sim** / **Não**.

Pode existir um **"não sei dizer"** para a pessoa conseguir responder — mas ele
é **mapeado como "Não"** na metodologia de cálculo do Score.

## A7 · "Em qual valor você imagina que precisa investir por mês…"

Mesma coisa do A5: nada de sugestões pré-determinadas induzindo a resposta.

## A8 · Ativos financeiros

1. Falta a opção **"varia muito"**.
2. Sem os ícones de valores pré-determinados (A5).
3. Talvez valha decompor em campos próprios:
   - FGTS
   - previdência privada da empresa
   - dinheiro em conta corrente
   - valores na carteira de investimentos

## A9 · Campos de idade: proteger contra a roda do mouse

Hoje são input numérico e girar a roda do mouse altera o valor imputado.

**Correção:** botões de **−** e **+** à direita, de modo que não haja como a
roda alterar o valor.

## A10 · "Tenho um plano para garantir o futuro": múltipla escolha

Hoje só dá para marcar uma opção. Nessas perguntas o cliente pode marcar
**todas** as que se aplicam.

## A11 · Resultado do exame: descrição e gradação por pilar

No resultado, cada pilar precisa de **descrição da situação** e de uma
**gradação**. (Referência visual enviada: Score geral + Patrimônio, Poupança,
Proteção, Consciência, Atitude, cada um com valor percentual e uma frase
explicando o que o pilar mede.)

### Escala de gradação (oficial)

| Faixa | Rótulo | Cor |
|---|---|---|
| 0 – 20 | Preocupante | vermelho |
| 21 – 40 | Ruim | laranja escuro |
| 41 – 60 | Regular | azul claro |
| 61 – 80 | Bom | verde claro |
| 81 – 100 | Ótimo | verde vivo |

**⚠ A confirmar antes de implementar:** os tokens exatos de cor. O Design
System hoje tem `score.good #2E9E5B`, `score.medium #FA7A35`, `score.low
#D64545` — três faixas, não cinco, e sem azul. Essa escala de cinco precisa de
tokens novos, e "azul claro" no meio de uma rampa vermelho→verde é uma escolha
deliberada que vale registrar (quebra a rampa de matiz, mas é o padrão que a
Nord já usa hoje).

---

## Pendências deste lote

- Faltam os demais prompts do Nélio.
- Verificar quantas perguntas do exame usam chips de valor hoje (A5 é
  transversal e provavelmente é o item de maior alcance do lote).
- A5 conflita com a decisão original de `InputMoedaChips` como componente
  prioritário da especificação (§14). A especificação precisa ser atualizada —
  não é só mudar a tela.
- A11 muda o `Resultado.jsx` e possivelmente a metodologia do Score
  (⚠ LACUNA: as fórmulas dos 5 pilares nunca foram passadas).
