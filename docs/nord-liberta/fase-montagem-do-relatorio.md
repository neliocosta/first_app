# Fase 2.5 · Montagem do Relatório — etapa faltante no modelo

> Revelada pelo Nélio na Rodada 5. **Não está na especificação v3** e não está no protótipo.
> Este documento registra o que já sabemos, para não se perder. Ainda **não é** uma spec fechada.

## O que é

Entre a **Coleta** (reunião com o cliente) e a **Devolutiva** (playlist de capítulos que o cliente
assiste) existe uma etapa em que **o consultor desenha o planejamento**. É a tela onde ele monta o
relatório a partir do que coletou.

```
Exame  →  Coleta  →  【 MONTAGEM DO RELATÓRIO 】  →  Devolutiva  →  Ciclo mensal  →  Semestral
         (com o cliente)      (o consultor sozinho)     (o cliente assiste)
```

## A distinção que a define

> "**Não é algo que o cliente me passa na reunião de coleta, é algo que olho quando estou montando
> o plano dele.**" — Nélio

Isso separa dois tipos de insumo que estavam sendo confundidos:

| | **Coleta** | **Montagem do Relatório** |
|---|---|---|
| Quem responde | O cliente, na reunião | O consultor, sozinho |
| Natureza do dado | O que só o cliente sabe | O que o consultor levanta, calcula ou decide |
| Exemplo | "Em qual estado você mora?" | A alíquota de ITCMD daquele estado |
| Exemplo | "Quanto você acha que a empresa vale?" | Se esse número entra no plano e como |
| Proveniência | `declarado` | `validado` / premissa do consultor |

**Regra derivada:** pergunta cuja resposta o consultor consegue levantar sozinho **não ocupa tempo
de reunião**. Isso confirma, por outro caminho, o que o psicólogo argumentou na Rodada 5 — só que
o destino não é "assíncrono genérico", é **esta tela**.

## O que já sabemos que vive aqui

Itens que o painel pediu e que estavam sem lugar — agora têm:

- **Alíquota de ITCMD** do estado do cliente (Nélio, explícito).
- **Premissas de projeção** (retorno, inflação, horizonte) — hoje `⚠ LACUNA` no Anexo A da spec.
- **A divisão do aporte mensal por objetivo** — o Ricardo pediu ver a conta e ela virou a tarefa
  "definir com o consultor a divisão do aporte". O lugar de montar essa proposta é aqui.
- **Controle editorial da devolutiva** — a Monique exigiu poder editar número, decisão e tarefa
  antes de publicar algo que sai com o CFP® dela. A tela do consultor hoje só liga/desliga módulo.
- **Ganho de capital da venda da empresa** — o cliente informa preço e custo; o consultor aplica a
  alíquota e decide o que entra no plano.
- **Necessidade de proteção** — a coleta pega coberturas e dependentes; o cálculo do capital
  segurado necessário é trabalho de montagem.

## Perguntas em aberto (para o Nélio)

1. A montagem é **uma tela só** ou uma sequência por vertical?
2. O consultor monta **do zero** ou o sistema pré-propõe (como o motor de elegibilidade já faz com
   os módulos) e ele ajusta?
3. O relatório montado é um **artefato exportável** (PDF que o cliente recebe) além de virar a
   devolutiva na plataforma?
4. Existe revisão/aprovação por outro consultor ou pelo admin antes de publicar?
5. Que parte da montagem o cliente chega a ver? (a spec diz que a prévia do reexame é só do
   consultor — vale o mesmo para as premissas?)

## Impacto no que já está construído

- **`faseCliente`** (spec §2.2) ganha `montagem` entre `coletaSuficiente` e `devolutivaEmMontagem`
  — ou os dois se fundem, a depender da resposta 1.
- **Proveniência**: os números da montagem são um quarto tipo, distinto de `declarado`/`estimado`/
  `validado` — são **premissa do consultor**, e precisam aparecer como tal no "como chegamos".
- **A trava de suitability** deixa de ser só um alerta na coleta: a montagem é o ponto natural
  onde o sistema recusa publicar tarefa de produto sem perfil preenchido.
- Vários `⚠ LACUNA` do Anexo A deixam de ser "falta metodologia" e viram "é entrada desta tela".
