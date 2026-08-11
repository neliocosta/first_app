# Decisões para a v1.0 navegável (demo) — registro

Respostas do Nélio em 2026-08-11. Este documento é a fonte da verdade do escopo do demo.

## A — Estratégicas
- **A1. Audiência:** (a) **liderança/sócios da Nord**, para aprovar o conceito.
- **A2. Superfícies:** **cliente completo (mobile) + uma "espiada" no consultor** (desktop), com switch.
- **A3. Escopo da jornada:** **arco completo** (Exame → Devolutiva → Plano de ação → Início/ciclo mensal →
  Minha jornada); **Educação e Semestral em versão vitrine**.
- **A4. Números ilustrativos:** **sim**, com selo "dados de demonstração".
- **A5. Persona:** Ricardo (54, rede de óticas) — 1 persona bem contada.

## B — Escopo & conteúdo
- **B1. Exame:** usar as **33 perguntas reais** de `perguntasQuiz.txt` (recebidas).
- **B2. Módulos de devolutiva:** *a elaborar* (ver §Elaboração).
- **B3. Verticais fundas:** *a elaborar* (ver §Elaboração).
- **B4. WhatsApp:** **mock da tela do WhatsApp** dentro do demo.
- **B5. Educação:** coleção como vitrine + **1 quiz jogável**.

## C — Dados & método
- **C1. Projeções:** modelo simplificado ilustrativo, premissas visíveis e rotuladas como exemplo.
- **C2. Score:** mock plausível + aviso honesto de "leitura inicial" (fórmula oficial = LACUNA).
- **C3. Retrato do Ricardo:** proposto por mim, ajustável.

## D — Identidade & assets
- **D1. Design system:** `NORDLIBERTADESIGNSYSTEM.md` (recebido) + logos `.png`
  (**pendente:** subir `nord-liberta-color.png` e `nord-liberta-white.png` para `public/assets/logo/`).
- **D2. Vídeo do conceito:** embed real — https://www.youtube.com/watch?v=cSD7eNNfWBA
- **D3. Nome do consultor no demo:** **"Nélio Costa, CFP®"** (campo continua variável no modelo).

## E — Técnico
- **E1.** React + Tailwind, mobile-first, mock + localStorage, sem backend/auth, pt-BR, switch + reiniciar demo.
- **E2.** Local (`npm run dev`), pronto para hospedar.
- **E3.** Esqueleto navegável primeiro, aprofundar por rodada.

---

## Achados na leitura dos arquivos (afetam o build)

### 1. O bug de produção está confirmado no arquivo de perguntas
A pergunta 14 ("E quais destes bens estão segurados?") tem opções `["Veículos", "Nenhum"]`, enquanto a
13 oferece `["Veículos", "Casa", "Apartamento", "Imóveis Comerciais", "Outros", "Nenhum"]`. É exatamente
o bug descrito no contexto §1. **No demo, a 14 espelha dinamicamente o que foi marcado na 13.**

### 2. As 6 condicionais estão identificadas
Derivadas da estrutura do questionário (batem com as "6 regras" do contexto):
1. Q5, Q6, Q7, Q8 só aparecem se **Q4 = SIM** (tem objetivo claro).
2. Q14 só aparece se **Q13 ≠ Nenhum** — e suas opções espelham a Q13 (correção do bug).
3. Q15 (valor dos bens) só aparece se **Q13 ≠ Nenhum**.
4. Q18 (saldo devedor) só aparece se **Q17 = Sim**.
5. Q22 (qual é o plano de renda) só aparece se **Q21 = Sim**.
6. Q23 (executa o plano) só aparece se **Q21 = Sim**.

### 3. Conflitos entre o Design System e a especificação (decisão do Nélio — ver §Elaboração)
- **Fundo da área do cliente:** o Design System §1 manda **navy full-bleed `#131F2E`** (premium);
  o contexto v5 §11 dizia "fundo branco/cinza muito claro".
- **Navegação:** o Design System diz "**sem chrome de navegação persistente**" na área do cliente;
  a spec v3 §2.1 define **bottom nav de 5 abas**.
- **Emoji:** o Design System permite emoji com parcimônia na saudação ("Olá, Ana 👋"); o contexto
  dizia "sem emoji decorativo". (Menor — sigo o Design System, que é mais recente e é a marca.)

---

## Elaboração pendente
- B2 (módulos da devolutiva) e B3 (verticais fundas).
- Os 2 conflitos de design acima.


---

## Decisões da Rodada 5 (Nélio, 2026-08-11)

**1. Avaliação da participação societária — não existe política.**
A consultoria não avalia empresa. Se o cliente tem uma ideia do valuation, o dado entra; se não
souber, **fica em branco**. Não é `⚠ LACUNA` esperando metodologia — é campo opcional por desenho.
O plano trata empresa sem valor como **não estimada**, nunca como zero.

**2. ITCMD por UF sai da coleta.**
Não é pergunta de reunião. Na coleta fica apenas "em qual estado você mora?" (dado do cliente);
a alíquota é levantada pelo consultor na **Montagem do Relatório**.

**3. A ordem da coleta NÃO muda — o perfil fica no fim, de propósito.**
O psicólogo propôs mover a seção 09 (perfil/suitability) para o começo, argumentando fadiga.
**Rejeitado pelo Nélio, com razão metodológica:** quem preenche o perfil é o consultor, e para
inferir o perfil ele precisa **ter tido a conversa inteira**. Perfil no início seria julgamento
sem base. A crítica de fadiga permanece válida para os campos de *transcrição* (apólices,
CNPJ de fundo, vesting) — não para o perfil.

**4. Existe uma etapa não modelada: Montagem do Relatório.**
Ver `fase-montagem-do-relatorio.md`. É onde o consultor desenha o plano depois da coleta e antes
da devolutiva. Resolve o destino de vários itens que o painel pediu e que estavam sem lugar.
