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

## Respondido pelo Nélio (2026-08-11)

> **Status: não construir agora.** O Nélio vai passar as specs completas desta tela.
> O que está abaixo é o que já foi decidido; o resto aguarda.

**1. Formato — uma tela só.** Não é uma sequência por vertical.

**2. O consultor monta do zero, com auxílio de calculadoras do sistema.**
Diferente da devolutiva (onde o motor de elegibilidade pré-sugere a playlist e o consultor revisa),
aqui a autoria é dele. O sistema entra como **ferramenta de cálculo**, não como proponente.
→ As "11 calculadoras" do site atual (contexto §1) provavelmente vivem aqui.

**3. O relatório deixa de ser PDF e passa a viver na devolutiva.**
Hoje o entregável é um `.pdf`; a intenção é que fique **só na área logada, na tela de devolutiva**.
⚠ **Implicação a rastrear:** isso significa que a devolutiva não é um resumo do relatório — ela
**é** o relatório. Tudo o que hoje o PDF carrega precisa caber na estrutura de capítulos
(conceito → números → decisão → tarefas), ou a migração perde conteúdo. Vale conferir com um
PDF real antes de fechar a spec da devolutiva.

**4. Não existe revisão hoje — mas passa a existir: campo "Auditado por:".**
Sugestão do painel (Monique, R4: *"retirar meu nome e meu CFP® de qualquer conteúdo que eu não
pude editar"*) aceita pelo Nélio. Registra quem auditou o relatório antes de publicar.

**5. O cliente não vê nada da montagem.**
Ele participa da **coleta** e acessa o **material de apresentação da consultoria** — a montagem é
o consultor sozinho. Confirma a regra de visibilidade da spec §3.4.

## Ainda em aberto

- O **"material de apresentação da consultoria"** citado em (5) é um artefato que não está
  modelado em lugar nenhum. O que é, quem produz, onde o cliente acessa?
- Quais são as **calculadoras** que a tela oferece (as 11 do site atual? outras?).
- O campo "Auditado por:" é opcional ou trava a publicação?

## Impacto no que já está construído

- **`faseCliente`** (spec §2.2) ganha `montagem` entre `coletaSuficiente` e `devolutivaEmMontagem`
  — ou os dois se fundem, a depender da resposta 1.
- **Proveniência**: os números da montagem são um quarto tipo, distinto de `declarado`/`estimado`/
  `validado` — são **premissa do consultor**, e precisam aparecer como tal no "como chegamos".
- **A trava de suitability** deixa de ser só um alerta na coleta: a montagem é o ponto natural
  onde o sistema recusa publicar tarefa de produto sem perfil preenchido.
- Vários `⚠ LACUNA` do Anexo A deixam de ser "falta metodologia" e viram "é entrada desta tela".
