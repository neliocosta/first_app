# Feedback do Nélio — lote C (as três decisões travadas pela rodada 08)

Respostas às três perguntas que a rodada 08 deixou como decisão do dono do produto.
Nenhuma delas era reescrita minha: as três moviam o número-título e nenhuma podia ser
inventada. Entram na `projecao-de-vida-v4.md`.

---

## C1 · Expectativa de vida: **95 anos**

> *"Uma das variáveis em que a gente trabalha nas nossas calculadoras é a expectativa de vida.
> Por padrão, a gente trata a expectativa de vida como 95 anos."*

**Decidido:** `expectativaDeVida = 95` é parâmetro da casa, com o valor que as calculadoras da
Nord já usam. Não é campo do cliente e não é chute meu.

Isto responde a pergunta que ficou sem dono no §7 da v3 — *"até quando o dinheiro precisa
durar?"* — e mata a amplitude de 2,04× que o CFP e o Cliente acharam por caminhos diferentes.

**Consequência direta:** a meta passa a ser calculável.

| | Ricardo, para aos 69, R$ 16.000/mês, 4,91% a.a. |
|---|---|
| até 90 | R$ 2.536.635 |
| **até 95 (decidido)** | **R$ 2.847.982** |
| até 100 | R$ 3.092.980 |

**O que a decisão não é:** horizonte finito significa que existe um mês em que o dinheiro acaba
se o plano não fechar. Isso não é defeito — é informação, e vira `mesDeRuina`, resultado de
primeira classe na v4 (§9.9 e §12), sempre com o caminho de volta ao lado.

**O que fica em aberto, e é pergunta de metodologia, não de produto:** 95 anos é o padrão da
casa. Um cliente com histórico familiar de longevidade quer 100. Isso é ajuste por cliente
(dentro de faixa da casa) ou é fixo para todos? A v4 assume **fixo pela casa, ajustável só pelo
Admin**, coerente com o B13 — e registra a pergunta.

## C2 · Retorno real líquido: **4,91% a.a. (~0,40% a.m.)**, configurável no Admin

> *"Essa é uma das variáveis que pode ser configurada no perfil do Admin, mas atualmente a gente
> considera 4,91% ao ano, que seria equivalente a 0,40% ao mês de retorno real líquido."*

**Decidido:** a taxa que desconta a meta é **parâmetro da casa**, versionada, com valor de hoje
**4,91% a.a.** É exatamente a taxa da perpetuidade do B8 etapa 6, e cai dentro da faixa
configurável de 3% a 9%.

Fecha a cobrança do CFP de que *"o motor já pratica um glide path no mês 181 que a especificação
nunca declarou"*. A partir daqui a taxa da fase de saque tem nome, dono e versão — não é o
resíduo de um evento `mudancaTaxa` escrito à mão num cenário.

**Formato canônico na tela (B10), sem exceção:** `4,91% a.a. (~0,40% a.m.)`.

**A distinção que a v4 passa a fazer explícita, porque são dois eixos diferentes:**

| Parâmetro | O que governa | Valor |
|---|---|---|
| `taxaDeReferencia` (C2) | desconta a **meta** e a perpetuidade | 4,91% a.a. |
| `tetoPorPerfil` (B14) | teto da taxa-alvo **configurada em cada caixa** | 6% · 7,5% · 9% |

**Sensibilidade, para dimensionar o poder deste parâmetro:** cada ponto percentual a menos
acrescenta ~R$ 344 mil à meta do Ricardo. É o número mais alavancado da plataforma, e é por isso
que ele desce da casa e entra no congelamento por `premissasVersao` (B13/B15).

**⚠ Fica em aberto:** o Nélio deu **uma** taxa, não uma por perfil. A v4 implementa uma taxa de
referência única, como decidido. Se a consultoria quiser diferenciar a taxa de desconto por
perfil de risco, é mudança de metodologia, não de código — e o CFP vai pedir na próxima rodada.

## C3 · O self-service faz a projeção. A fronteira comercial é outra.

> *"A ideia é que sim, o cliente self service possa também fazer essa projeção. O que o cliente
> que contratou o serviço tem a mais é a entrega do relatório e o preenchimento das tarefas em
> aberto, bem como a disponibilidade de fazer agendamentos de reunião para tirar dúvidas."*

**Decidido, e é mais aberto do que eu tinha proposto.** Eu havia sugerido rascunho aberto e
roteiro fechado. O Nélio abriu a **ferramenta inteira** e moveu a fronteira para fora dela.

| | Self-service | Cliente contratante |
|---|---|---|
| Rascunho de 3 minutos | ✅ | ✅ |
| Roteiro completo, todas as etapas | ✅ | ✅ |
| A tela, navegação, simulação | ✅ | ✅ |
| **Relatório entregue** | ❌ | ✅ |
| **Tarefas em aberto preenchidas** | ❌ | ✅ |
| **Agendamento de reunião** | ❌ | ✅ |

**A fronteira é o trabalho humano, não a ferramenta.** O que se compra é o consultor: o relatório
que ele entrega, as tarefas que ele preenche e o tempo dele para tirar dúvida. A ferramenta
sozinha mostra; ela não conclui.

Isto é coerente com o convite da especificação selada (§11.4): *"você já enxergou onde está; um
consultor transforma isso num plano"* — agora com o "enxergou" valendo a projeção inteira, e não
só o exame.

**Resolve a contradição entre dois documentos do próprio Nélio**, que a rodada 08 apontou:
o A12 dizia que concluir o exame não pode levar a um beco e o A13 punha "Meu Planejamento
Patrimonial" na Home; a selada §3.1 travava o self-service em `exameConcluido`. **A selada muda:**
`exameConcluido` deixa de ser estado de espera e passa a ser habitável.

**O que esta decisão arrasta, e a v4 precisa resolver:**

1. **LGPD.** O self-service entrega patrimônio, renda e gasto sem contrato assinado. Base legal,
   finalidade e retenção próprias — ⚠ LACUNA jurídica, agora com prioridade alta, porque o
   volume de titulares sem contrato passa a ser maior que o de clientes.
2. **Suitability.** O self-service não tem consultor nem questionário. Cai no caminho
   autodeclarado do B11 em caráter **permanente**: a taxa é travada do mesmo jeito, e os
   capítulos que prescrevem produto continuam bloqueados. Não é estado transitório.
3. **`mesDeRuina` sem rede.** O contratante que descobre que o dinheiro acaba aos 88 tem uma
   reunião para marcar. O self-service não tem. A tela precisa terminar em algum lugar digno
   para ele — e esse lugar é o convite, nunca um alerta sem saída.
4. **Radar.** Rascunho de self-service **não** gera item na fila do consultor. A conversão
   acontece no produto, pelo convite; o consultor entra quando o lead pede. Senão a estimativa
   de 450h/ano da Monique piora antes de a ferramenta pagar por si.
5. **Nenhuma tarefa nasce aqui.** Tarefa nasce de vertical, na devolutiva, com o consultor
   (contexto §2.1). Para o self-service, a coluna de ação continua vazia — estado honesto, como
   a selada §10.4 já exige.

---

## O que as três decisões fecham, somadas

O número-título da ferramenta passa a ser calculável e defensável:

> **Ricardo precisa ter R$ 2.847.982 guardados para viver sem trabalhar.**
> *Custo de vida de R$ 16.000/mês, dos 69 aos 95 anos, descontado a 4,91% a.a. (~0,40% a.m.).*

Antes das três decisões, o mesmo cliente admitia qualquer valor entre R$ 1,75 milhão e R$ 3,58
milhões, todos compatíveis com o texto da v3. **Amplitude de 2,04× → um número, com as três
premissas nomeadas ao lado dele.**
