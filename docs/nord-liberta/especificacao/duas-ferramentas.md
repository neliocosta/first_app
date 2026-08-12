# Orçamento Familiar × Projeção de Vida — são duas ferramentas

> Escrito depois de ler `fontes/especificacao-orcamento-familiar.txt`, a
> especificação que o Nélio já tinha desenhado. **Corrige uma conclusão errada
> minha:** eu tinha assumido, em `projecao-de-vida-v2.md` §4, que "Meu
> Orçamento" e "Meu Planejamento Patrimonial" eram duas portas para a mesma
> ferramenta. Não são. A Home do Nélio estava certa e eu estava errado.

---

## O que separa as duas

| | **Meu Orçamento** | **Projeção de Vida** |
|---|---|---|
| Horizonte | **24 meses** | **80–90 anos** |
| Unidade | categoria e subcategoria de gasto | evento e caixinha |
| Pergunta | *"para onde foi / vai cada real deste mês?"* | *"o que acontece com o meu patrimônio ao longo da vida?"* |
| Tem realizado? | **Sim** — orçado × realizado, Open Finance | Não. É projeção pura. |
| Precisão | alta, com dado importado | decrescente com a distância |
| Cadência de uso | mensal, contínua | pontual, em reunião e revisão |
| Erra por | classificação errada de transação | premissa errada |

São ferramentas de **naturezas diferentes**: uma olha para trás e para os
próximos dois anos com dado real; a outra olha para a vida inteira com premissa
declarada. Fundi-las produziria uma tela que mente sobre a própria precisão.

## O elo entre elas — e é um só

O orçamento macro divide a renda em três: **Fixos · Ajustáveis · Futuro e
Sonhos**. A terceira fatia é a sobra que vira patrimônio.

```
Orçamento Familiar                    Projeção de Vida
────────────────────                  ─────────────────
Renda consolidada
   ├─ Fixos       (≈50%)
   ├─ Ajustáveis  (≈30%)
   └─ Futuro e Sonhos (≈20%)  ──────► aportes nas caixinhas
                                          ├─ Reserva de emergência
                                          ├─ Compromissos
                                          ├─ Objetivos
                                          └─ Liberdade financeira
```

**"Futuro e Sonhos" é a fronteira.** O Orçamento responde *quanto* sobra; a
Projeção responde *para onde vai e no que se transforma*. Uma fonte da verdade,
um sentido de fluxo, sem duplicação.

Isso também resolve o §6.4 do detalhamento micro que a especificação de
orçamento deixou em aberto (*"o detalhamento micro de Futuro e Sonhos deverá ser
especificado posteriormente"*): **as subcategorias de Futuro e Sonhos são as
caixinhas da Projeção de Vida.** Não precisa inventar uma lista nova.

---

## O que a especificação do Nélio corrige na `projecao-de-vida-v2.md`

Cinco pontos onde eu escrevi errado ou de menos:

**1. A sequência de preenchimento que eu propus não é a do orçamento.**
Eu escrevi "12 meses com precisão → macro → eventos". A especificação do Nélio
é **Renda → Macro → Micro → Expandido 24 meses → Orçado × Realizado** — de cima
para baixo, por percentual, não de baixo para cima por extrato. A minha versão
some; a dele vale.

**2. Consolidação da renda vem antes de tudo, e tem uma escolha de base.**
Renda anual total (salários, pró-labore, distribuição de lucros, bônus,
comissões) e o cliente escolhe: só fluxos mensais, ou **renda anual
mensalizada** (anual ÷ 12), esta apresentada como recomendada.

Isso conversa direto com o modelo de rendas múltiplas do item 3 do feedback:
a lista de rendas por pessoa **é** o que alimenta a consolidação.

**3. A estrutura macro 50/30/20 não existia na minha spec.**
Fixos ≤ 50%, Ajustáveis ≤ 30%, Futuro e Sonhos ≥ 20%, soma sempre 100%.
Ultrapassar dispara **alerta educativo sem bloquear**.

**Assimetria deliberada que vale registrar:** no macro o sistema **alerta e
deixa passar**; no micro ele **impede a gravação** quando a soma das
subcategorias ultrapassa o teto da categoria. Faz sentido — o macro é uma
escolha de vida (posso decidir gastar 60% em fixos), o micro é aritmética
(a soma não pode estourar o próprio teto).

**4. Periodicidade do micro é outra coisa que a periodicidade da renda.**
Aqui é **conversão para base mensal**: diário útil × 22, semanal × 4,3,
anual ÷ 12. A interface mostra o valor informado **e** o equivalente mensal.

Diferente da periodicidade de renda do item 3 do feedback, onde uma renda
trimestral **não** vira média mensal — ela cai no mês em que cai. Duas regras
opostas, cada uma certa no seu lugar, e isso precisa estar explícito para
ninguém "consertar" uma achando que é a outra.

**5. Open Finance é decisão tomada, não ⚠ LACUNA.**
Eu marquei a importação como lacuna. A especificação já define: realizado
alimentado manualmente **ou** por Open Finance, com classificação automática
sugerida pela descrição (Uber → Ajustáveis → Transportes de Aplicativo) e
correção pelo usuário realimentando o classificador.

O que **continua** lacuna, e o Cliente cobrou na rodada 07: a **tela de
consentimento** — quem vê o quê, se a Nord Investimentos vê, como se desliga,
o que apaga, retenção, e o consentimento **separado do cônjuge** num produto
que é familiar por definição.

---

## O que fica valendo da `projecao-de-vida-v2.md`

Não vai tudo fora. Continua de pé, porque é da outra ferramenta:

- Modelo de **rendas múltiplas por pessoa**, ativa/passiva, com natureza — é o
  insumo da consolidação de renda do orçamento **e** da projeção.
- **Regra de continuidade** (período sem mudança repete) — vale para a
  Projeção de Vida, que vai a 90 anos. **Não** vale para o Orçamento, que é
  fechado em 24 meses e tem recorrente + pontual + parcelado explícitos.
- **Eventos de mudança de patrimônio** — os oito tipos já implementados.
- **Tela cheia com faixas paralelas e navegação de editor de vídeo** — pedido
  explícito do Nélio para a Projeção de Vida.
- Os **bloqueantes do Cliente na rodada 07**, todos ainda válidos: renda ativa
  sem fim é mentira de décadas; vender um ativo tem de encerrar as rendas dele;
  caixinha precisa de meta e veredito; renda precisa aceitar faixa mínimo–máximo.

---

## Onde as duas ferramentas se encontram na tela

O **Orçamento** produz, ao fim dos seus 24 meses, um número por mês:
*"Futuro e Sonhos: R$ X"*.

A **Projeção de Vida** consome esse número como o aporte mensal dos primeiros
24 meses — com proveniência alta, porque veio de orçamento detalhado e
possivelmente de realizado — e, a partir do mês 25, aplica a regra de
continuidade sobre a última configuração conhecida.

É exatamente o degrau de fidelidade que a v2 propunha desenhar na régua, agora
com uma fronteira real em vez de arbitrária: **até o mês 24 é orçamento; do 25
em diante é projeção.**
