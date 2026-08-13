# Postmortem — por que o desenvolvimento recente falhou, e como recomeçar

> Escrito em resposta ao feedback direto do Nélio: *"o resultado final da entrega
> ficou muito ruim, vários feedbacks foram ignorados, o consumo de tokens foi
> agressivo, a navegação está perdida, o logo não foi aplicado."*
>
> Cada afirmação abaixo foi verificada no código antes de ser escrita.

## Os três fracassos concretos

### 1. O logo nunca foi aplicado

`demo/public/assets/logo/` está **vazia**. O componente `Marca`
(`demo/src/components/ui.jsx:4-6`) tem o próprio comentário confessando o
problema:

> *"Símbolo Nord recriado em SVG (anel com gradiente laranja + rosa dos
> ventos). Substituir por public/assets/logo/\*.png quando os arquivos oficiais
> entrarem."*

Os arquivos oficiais foram enviados numa sessão anterior ("D1: Anexo.md e logos
.png"). Nunca foram colocados na pasta. Um logo desenhado à mão como
placeholder ficou em produção, com um lembrete escrito para trocar depois — e
"depois" nunca chegou.

### 2. A navegação tem três plantas de casa sobrepostas, nenhuma terminada

- Decisão original: **híbrido — hub + bottom nav**.
- Depois: uma 6ª aba foi adicionada à bottom nav (`Patrimônio`), quando o
  próprio agente de UX já tinha apontado, na rodada 06, que 5 abas já era o
  teto usável.
- Depois: o Nélio pediu, duas vezes, que a Projeção de Vida fosse **tela
  cheia**, fora do shell — como um editor de vídeo. Isso foi registrado como
  exigência bloqueante (rodada 07, exigência 17 do UX) e **nunca
  implementado**: `demo/src/App.jsx:123` mostra a tela ainda dentro do
  `ShellCliente`, com bottom nav visível.
- Depois: a Home/cockpit com 12 destinos (A12–A14) foi especificada em detalhe
  e nunca construída. `demo/src/screens/cliente/Inicio.jsx` é a tela antiga,
  sem tutorial, sem reuniões, sem calculadoras.

Três arquiteturas de informação coexistindo em documentos diferentes, sem
nenhuma reconciliação final. O produto "parece perdido" porque literalmente
nenhuma versão da navegação foi levada até o fim.

### 3. Zero itens do primeiro lote de feedback (A1–A11) viraram código

O item mais citado como "de maior alcance do lote" — remover os chips de valor
pré-determinado de todas as perguntas do exame (A5) — **continua no código**:
`demo/src/screens/Exame.jsx:175`, `InputMoedaChips` intacto. Nenhum subtexto
sob as perguntas (A3), nenhum stepper de idade (A9), nenhuma trilha antes do
exame (A1), nenhum sim/não binário (A6), nenhuma multi-escolha (A10).

## A causa raiz

**A crítica virou o produto, em vez de ser o portão para o produto.**

O Gauntlet Loop de 6 agentes é caro por construção — cada rodada dispara 6
execuções paralelas, cada uma lendo dezenas de arquivos e devolvendo pareceres
de 5 a 15 mil palavras. Isso é o preço certo para decisões estruturais grandes:
foi assim que a rodada 06 pegou um bug real que criava R$ 119.818 do nada, e
esse achado valeu o custo inteiro da rodada.

O erro foi repetir esse mesmo motor pesado para **iterar um parágrafo de
especificação**, rodada após rodada (rodada 07 + 16 trocas do "lote B"), sem
nunca fechar em código. Nas duas últimas rodadas, os agentes geraram entre 700
mil e 900 mil tokens de crítica. Ao final, a Projeção de Vida — o item mais
caro de todo o processo — **ainda não existe como uma linha de código**.

Em paralelo, o trabalho barato e visível (logo, chips, navegação) foi
abandonado, porque a atenção foi para a parte intelectualmente mais
interessante do feedback (um motor novo, um modelo de dados novo), não para a
de maior retorno por esforço.

**E não houve checkpoint.** Em nenhum momento das últimas duas sessões a
pergunta foi feita: *"isso já é grande o suficiente — paramos de acrescentar
escopo e construímos o que já foi decidido?"* O feedback generoso em detalhe do
Nélio virou escopo sem fim, porque cada resposta minha convidava a próxima
rodada de refinamento em vez de fechar uma etapa.

## O que NÃO deve ser jogado fora

O motor de projeção patrimonial (`demo/src/motor/projecao.js`) é engenharia
correta e testada — 31 de 31 conferências passam, incluindo os invariantes que
o próprio Gauntlet exigiu (conciliação sem vazamento, PMT antecipado correto,
perpetuidade que nunca consome o principal). O defeito não está no motor. Está
no processo em volta dele.

## O plano de reinício

**1. Congelar novos pedidos de especificação até fechar o que já foi decidido.**
Nada de rodada 08 do Gauntlet sobre a Projeção de Vida até o backlog abaixo
estar zerado.

**2. Fechar A1–A14 primeiro — são horas, não rodadas.**
Nenhum desses itens precisa de painel de 6 agentes: são diretivas diretas do
Nélio, não questões de design em aberto.

| Item | Trabalho |
|---|---|
| Logo oficial | receber os PNGs de novo (ou localizar o upload anterior) e trocar `Marca` |
| A5 — fim dos chips | remover `InputMoedaChips`, campo de texto + "varia muito" com min/máx |
| A9 — steppers de idade | trocar `type="number"` por − / + |
| A6, A10 — sim/não e multi-escolha | mudar o tipo de resposta das duas perguntas |
| A1 — trilha antes do exame | uma tela nova, simples, no espírito Duolingo |
| A2, A3 — vídeo 16:9 + subtexto | ajuste de CSS + campo de texto |
| A11 — gradação de 5 faixas no resultado | usar a paleta já validada em `gradacao-score.html` |
| A12–A14 — Home | construir como hub, consolidando o que já existe (Plano, Educação, Minha jornada) antes de inventar telas novas |

**3. Decidir a navegação UMA vez, por escrito, e parar de acrescentar em cima.**
Proposta: Home como hub (destino pós-exame e pós-login) → bottom nav curta
(4–5 itens de uso diário) → ferramentas grandes (Projeção de Vida) abertas em
tela cheia, alcançadas a partir da Home, nunca dentro da bottom nav.

**4. Só então voltar à Projeção de Vida — como construção, não como mais
especificação.** A v2 e os pareceres da rodada 07 mais os 16 itens do lote B
já têm conteúdo suficiente para uma v3 definitiva. Escrever a v3, rodar **uma**
rodada de Gauntlet sobre ela, e ir para código.

**5. Mudar o ritmo daqui para frente:** depois de qualquer lote de feedback,
triagem antes de agir — o que é diretiva direta (implementa na hora, sem
painel) versus o que é decisão de design em aberto (aí sim spec + Gauntlet). E
checkpoint explícito com o Nélio antes de disparar qualquer rodada nova de
6 agentes — nunca autônomo.
