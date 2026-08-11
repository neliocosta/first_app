/**
 * FORMULÁRIO DE COLETA — Nord Liberta
 * Fonte: coletaCompleta.md (formulário em uso hoje na consultoria).
 *
 * MODELO "EXPANDE, NÃO REPETE"
 * O exame de 33 perguntas é feito ANTES da reunião de coleta e dá a visão macro.
 * Na reunião, o consultor não repergunta — ele expande:
 *   exame: "Você possui dependentes financeiros?" → Sim
 *   coleta: "Vimos no seu exame que você tem dependentes. Quantos e quais são?"
 *
 * Cada campo que já foi respondido no exame carrega `deExame: 'qNN'` e um `expande`
 * (a fala do consultor). A proveniência entra como `declarado` já pré-preenchida;
 * o consultor confirma e ela vira `validado`.
 *
 * ⚠ Campos marcados `obrigatorio: true` correspondem aos ★ do formulário original.
 */

export const TIPO = {
  TEXTO: 'texto', MOEDA: 'moeda', NUMERO: 'numero', DATA: 'data', MES: 'mes',
  EMAIL: 'email', TEL: 'tel', SIMNAO: 'simNao', SELECAO: 'selecao', MULTI: 'multi',
  ESCALA: 'escala', AREA: 'area', ARQUIVO: 'arquivo', CALCULADO: 'calculado',
};

export const SECOES = [
  {
    id: 's01', numero: '01', titulo: 'Objetivos Financeiros', vertical: 'financeira', icone: 'target',
    grupos: [
      {
        titulo: 'Diagnóstico', campos: [
          { chave: 'obj.temObjetivo', rotulo: 'Tem objetivo financeiro claro?', tipo: TIPO.SIMNAO, obrigatorio: true,
            deExame: 'q04', expande: 'Vimos no seu exame que você já tem objetivos claros. Quais são eles?' },
          { chave: 'obj.avaliouValor', rotulo: 'Avaliou quanto precisa para o(s) objetivo(s)?', tipo: TIPO.SIMNAO, obrigatorio: true, deExame: 'q05' },
          { chave: 'obj.temPlano', rotulo: 'Tem plano concreto para atingir o objetivo?', tipo: TIPO.SIMNAO, obrigatorio: true,
            ajuda: 'Plano superficial = Não', deExame: 'q06' },
          { chave: 'obj.imaginaInvestir', rotulo: 'Quanto imagina precisar investir por mês', tipo: TIPO.MOEDA, obrigatorio: true, deExame: 'q07' },
          { chave: 'obj.investeHoje', rotulo: 'Quanto está de fato investindo por mês', tipo: TIPO.MOEDA, obrigatorio: true, deExame: 'q08' },
        ],
      },
      {
        titulo: 'Objetivos', repetivel: true, rotuloItem: 'Objetivo', campos: [
          { chave: 'titulo', rotulo: 'Título do objetivo', tipo: TIPO.TEXTO },
          { chave: 'categoria', rotulo: 'Categoria', tipo: TIPO.SELECAO,
            opcoes: ['Compra de Casa', 'Compra de Veículo', 'Viagem', 'Intercâmbio', 'Aposentadoria Segura',
                     'Futuro dos Filhos', 'Casamento', 'Quitar Dívidas', 'Segurança Financeira', 'Outro'] },
          { chave: 'descricao', rotulo: 'Descrição', tipo: TIPO.TEXTO },
          { chave: 'mesAlvo', rotulo: 'Mês alvo', tipo: TIPO.MES },
          { chave: 'valorNaData', rotulo: 'Valor necessário na data alvo', tipo: TIPO.MOEDA },
          { chave: 'custoTotal', rotulo: 'Custo total do objetivo', tipo: TIPO.MOEDA },
          { chave: 'temEntrada', rotulo: 'Tem bem de entrada?', tipo: TIPO.SIMNAO },
          { chave: 'custoMensalDepois', rotulo: 'Gera custo mensal após realização?', tipo: TIPO.SIMNAO },
          { chave: 'separarPorMes', rotulo: 'Quanto separar por mês', tipo: TIPO.MOEDA },
          { chave: 'jaTemValor', rotulo: 'Já tem valor separado?', tipo: TIPO.SIMNAO },
          { chave: 'saldoSeparado', rotulo: 'Saldo já separado', tipo: TIPO.MOEDA, revelaSe: { campo: 'jaTemValor', igual: 'Sim' } },
          { chave: 'planoAtual', rotulo: 'Plano atual do cliente', tipo: TIPO.AREA },
          { chave: 'obs', rotulo: 'Observações', tipo: TIPO.AREA },
        ],
      },
      {
        titulo: 'Compromissos Financeiros', repetivel: true, rotuloItem: 'Compromisso', campos: [
          { chave: 'titulo', rotulo: 'Título', tipo: TIPO.TEXTO },
          { chave: 'descricao', rotulo: 'Descrição', tipo: TIPO.TEXTO },
          { chave: 'mes', rotulo: 'Mês do compromisso', tipo: TIPO.MES },
          { chave: 'valor', rotulo: 'Valor', tipo: TIPO.MOEDA },
        ],
      },
    ],
  },
  {
    id: 's02', numero: '02', titulo: 'Orçamento Doméstico', vertical: 'financeira', icone: 'wallet',
    grupos: [
      {
        titulo: 'Orçamento', campos: [
          { chave: 'orc.periodicidade', rotulo: 'Periodicidade do orçamento', tipo: TIPO.SELECAO, opcoes: ['Mensal', 'Anual'] },
          { chave: 'orc.custoVida', rotulo: 'Custo de vida', tipo: TIPO.MOEDA, obrigatorio: true,
            ajuda: 'Somente o valor de sua responsabilidade', deExame: 'q28',
            expande: 'No exame você estimou o seu custo de vida. Vamos abrir isso por categoria?' },
          { chave: 'orc.vezesPoupou', rotulo: 'Quantas vezes poupou esse valor nos últimos 12 meses?', tipo: TIPO.SELECAO,
            opcoes: ['Nenhuma', '1–3 vezes', '4–6 vezes', '7–9 vezes', '10 ou mais'], obrigatorio: true, deExame: 'q03' },
          { chave: 'orc.acompanha', rotulo: 'Acompanha as despesas mensais?', tipo: TIPO.SELECAO,
            opcoes: ['Sim - em detalhes', 'Sim - parcialmente', 'Não mas tenho ideia', 'Não faço ideia'], obrigatorio: true, deExame: 'q27' },
        ],
      },
      {
        titulo: 'Poupança', campos: [
          { chave: 'orc.poupaMes', rotulo: 'Quanto poupa por mês em média', tipo: TIPO.MOEDA, obrigatorio: true,
            ajuda: 'Soma de tudo que guarda ou investe', deExame: 'q02' },
        ],
      },
    ],
  },
  {
    id: 's03', numero: '03', titulo: 'Ativos, Patrimônio e Dívidas', vertical: 'ativos', icone: 'trending-up',
    grupos: [
      {
        titulo: 'Reserva de Emergência', campos: [
          { chave: 'res.ativosFinanceiros', rotulo: 'Total de ativos financeiros', tipo: TIPO.MOEDA, obrigatorio: true,
            ajuda: 'Investimentos + poupança + conta corrente (sem imóveis/veículos)', deExame: 'q09' },
          { chave: 'res.reserva', rotulo: 'Quanto deste valor é reserva de emergência', tipo: TIPO.MOEDA, obrigatorio: true, deExame: 'q10' },
          { chave: 'res.guardandoMais', rotulo: 'Está guardando mensalmente para aumentar a reserva?', tipo: TIPO.SIMNAO, obrigatorio: true, deExame: 'q11' },
          { chave: 'res.ideal', rotulo: 'Valor ideal de reserva para o perfil', tipo: TIPO.MOEDA, obrigatorio: true, deExame: 'q12' },
        ],
      },
      {
        titulo: 'Patrimônio (resumo)', campos: [
          { chave: 'pat.bens', rotulo: 'Quais bens possui?', tipo: TIPO.MULTI,
            opcoes: ['Veículos', 'Casa', 'Apartamento', 'Imóveis Comerciais', 'Empresa / participação societária', 'Outros', 'Nenhum'],
            deExame: 'q13', expande: 'Vimos os bens que você marcou no exame. Vamos detalhar cada um?' },
          { chave: 'pat.valorTotal', rotulo: 'Valor estimado total dos bens', tipo: TIPO.MOEDA,
            ajuda: 'Desconsiderar saldo devedor de financiamentos', deExame: 'q15' },
        ],
      },
      {
        titulo: 'Ativos Financeiros', repetivel: true, rotuloItem: 'Ativo Financeiro', campos: [
          { chave: 'tipo', rotulo: 'Tipo do ativo', tipo: TIPO.SELECAO,
            opcoes: ['Renda fixa', 'Fundo', 'Ações', 'FII', 'Previdência', 'Conta corrente', 'Poupança', 'Exterior', 'Cripto', 'Outro'] },
          { chave: 'saldo', rotulo: 'Saldo atual', tipo: TIPO.MOEDA },
          { chave: 'instituicao', rotulo: 'Instituição', tipo: TIPO.TEXTO },
          { chave: 'detalhes', rotulo: 'Outros detalhes', tipo: TIPO.AREA },
        ],
      },
      {
        titulo: 'Bens', repetivel: true, rotuloItem: 'Bem', campos: [
          { chave: 'tipo', rotulo: 'Tipo do bem', tipo: TIPO.SELECAO,
            opcoes: ['Veículo', 'Casa', 'Apartamento', 'Imóvel comercial', 'Terreno', 'Outro'] },
          { chave: 'descricao', rotulo: 'Descrição', tipo: TIPO.TEXTO, exemplo: 'Honda Civic 2020' },
          { chave: 'valorAtual', rotulo: 'Valor estimado atual', tipo: TIPO.MOEDA },
          { chave: 'quitado', rotulo: 'Quitado?', tipo: TIPO.SELECAO, opcoes: ['Sim', 'Não - financiado'] },
          { chave: 'saldoDevedor', rotulo: 'Saldo devedor', tipo: TIPO.MOEDA, revelaSe: { campo: 'quitado', igual: 'Não - financiado' } },
          { chave: 'parcela', rotulo: 'Parcela mensal do financiamento', tipo: TIPO.MOEDA, revelaSe: { campo: 'quitado', igual: 'Não - financiado' } },
          { chave: 'rendaPassiva', rotulo: 'Gera renda passiva?', tipo: TIPO.SIMNAO },
          { chave: 'compartilhado', rotulo: 'Bem compartilhado com outra pessoa?', tipo: TIPO.SIMNAO },
          { chave: 'obs', rotulo: 'Observações', tipo: TIPO.AREA },
        ],
      },
      {
        titulo: 'Outros Ativos', repetivel: true, rotuloItem: 'Outro Ativo', campos: [
          { chave: 'titulo', rotulo: 'Título do ativo', tipo: TIPO.TEXTO, exemplo: 'Participação societária' },
          { chave: 'valor', rotulo: 'Valor estimado a considerar', tipo: TIPO.MOEDA },
          { chave: 'descricao', rotulo: 'Descrição', tipo: TIPO.AREA },
          { chave: 'rendaPassiva', rotulo: 'Gera renda passiva?', tipo: TIPO.SIMNAO },
          { chave: 'detalhes', rotulo: 'Outros detalhes', tipo: TIPO.AREA },
        ],
      },
      {
        titulo: 'Dívidas', campos: [
          { chave: 'div.outras', rotulo: 'Possui outras dívidas?', tipo: TIPO.SIMNAO, obrigatorio: true,
            ajuda: 'Além dos financiamentos já informados acima', deExame: 'q17' },
          { chave: 'div.saldoTotal', rotulo: 'Saldo devedor total', tipo: TIPO.MOEDA, obrigatorio: true,
            ajuda: 'Deixe R$ 0 se não tiver dívidas', deExame: 'q18',
            expande: 'Você informou o saldo total no exame. Vamos abrir contrato a contrato, com as taxas?' },
        ],
      },
    ],
  },
  {
    id: 's04', numero: '04', titulo: 'Proteção', vertical: 'riscos', icone: 'shield',
    grupos: [
      { titulo: 'Proteção Automóvel', condicional: true, campos: [
        { chave: 'auto.tem', rotulo: 'Protegido?', tipo: TIPO.SIMNAO, deExame: 'q14',
          expande: 'No exame você marcou quais bens estão segurados. Vamos pegar os dados da apólice?' },
        { chave: 'auto.seguradora', rotulo: 'Seguradora', tipo: TIPO.TEXTO, revelaSe: { campo: 'auto.tem', igual: 'Sim' } },
        { chave: 'auto.bem', rotulo: 'Bem segurado', tipo: TIPO.TEXTO, revelaSe: { campo: 'auto.tem', igual: 'Sim' } },
        { chave: 'auto.covIRC', rotulo: 'Cobertura Incêndio/Roubo/Colisão', tipo: TIPO.MOEDA, revelaSe: { campo: 'auto.tem', igual: 'Sim' } },
        { chave: 'auto.covAPP', rotulo: 'Cobertura APP', tipo: TIPO.MOEDA, revelaSe: { campo: 'auto.tem', igual: 'Sim' } },
        { chave: 'auto.covRCVF', rotulo: 'Cobertura RCV-F', tipo: TIPO.MOEDA, revelaSe: { campo: 'auto.tem', igual: 'Sim' } },
        { chave: 'auto.premio', rotulo: 'Prêmio anual', tipo: TIPO.MOEDA, revelaSe: { campo: 'auto.tem', igual: 'Sim' } },
        { chave: 'auto.renovacao', rotulo: 'Mês de renovação', tipo: TIPO.MES, revelaSe: { campo: 'auto.tem', igual: 'Sim' } },
      ]},
      { titulo: 'Proteção Residencial', condicional: true, campos: [
        { chave: 'resid.tem', rotulo: 'Protegido?', tipo: TIPO.SIMNAO, deExame: 'q14' },
        { chave: 'resid.seguradora', rotulo: 'Seguradora', tipo: TIPO.TEXTO, revelaSe: { campo: 'resid.tem', igual: 'Sim' } },
        { chave: 'resid.imovel', rotulo: 'Imóvel segurado', tipo: TIPO.TEXTO, revelaSe: { campo: 'resid.tem', igual: 'Sim' } },
        { chave: 'resid.covIncendio', rotulo: 'Cobertura Incêndio', tipo: TIPO.MOEDA, revelaSe: { campo: 'resid.tem', igual: 'Sim' } },
        { chave: 'resid.covEletricos', rotulo: 'Cobertura Danos Elétricos', tipo: TIPO.MOEDA, revelaSe: { campo: 'resid.tem', igual: 'Sim' } },
        { chave: 'resid.covSubtracao', rotulo: 'Cobertura Subtração de Bens', tipo: TIPO.MOEDA, revelaSe: { campo: 'resid.tem', igual: 'Sim' } },
        { chave: 'resid.covRC', rotulo: 'Cobertura RC Familiar', tipo: TIPO.MOEDA, revelaSe: { campo: 'resid.tem', igual: 'Sim' } },
        { chave: 'resid.premio', rotulo: 'Prêmio anual', tipo: TIPO.MOEDA, revelaSe: { campo: 'resid.tem', igual: 'Sim' } },
        { chave: 'resid.renovacao', rotulo: 'Mês de renovação', tipo: TIPO.MES, revelaSe: { campo: 'resid.tem', igual: 'Sim' } },
      ]},
      { titulo: 'Proteção Vida', condicional: true, campos: [
        { chave: 'vida.tem', rotulo: 'Protegido?', tipo: TIPO.SIMNAO, deExame: 'q16',
          expande: 'O exame mostrou quais seguros você tem. Vamos ver a cobertura e o prazo de cada um?' },
        { chave: 'vida.seguradora', rotulo: 'Seguradora', tipo: TIPO.TEXTO, revelaSe: { campo: 'vida.tem', igual: 'Sim' } },
        { chave: 'vida.coberto', rotulo: 'Valor coberto', tipo: TIPO.MOEDA, revelaSe: { campo: 'vida.tem', igual: 'Sim' } },
        { chave: 'vida.premio', rotulo: 'Prêmio mensal', tipo: TIPO.MOEDA, revelaSe: { campo: 'vida.tem', igual: 'Sim' } },
        { chave: 'vida.tipo', rotulo: 'Tipo do seguro', tipo: TIPO.SELECAO, opcoes: ['Temporário', 'Vitalício', 'Resgatável', 'Outro'], revelaSe: { campo: 'vida.tem', igual: 'Sim' } },
        { chave: 'vida.prazo', rotulo: 'Prazo de cobertura', tipo: TIPO.TEXTO, exemplo: '20 anos', revelaSe: { campo: 'vida.tem', igual: 'Sim' } },
      ]},
      { titulo: 'Proteção Acidentes', condicional: true, campos: [
        { chave: 'acid.tem', rotulo: 'Protegido?', tipo: TIPO.SIMNAO, deExame: 'q16' },
        { chave: 'acid.seguradora', rotulo: 'Seguradora', tipo: TIPO.TEXTO, revelaSe: { campo: 'acid.tem', igual: 'Sim' } },
        { chave: 'acid.coberto', rotulo: 'Valor coberto', tipo: TIPO.MOEDA, revelaSe: { campo: 'acid.tem', igual: 'Sim' } },
        { chave: 'acid.premio', rotulo: 'Prêmio mensal', tipo: TIPO.MOEDA, revelaSe: { campo: 'acid.tem', igual: 'Sim' } },
      ]},
      { titulo: 'Plano de Saúde', condicional: true, campos: [
        { chave: 'saude.tem', rotulo: 'Protegido?', tipo: TIPO.SIMNAO, deExame: 'q16' },
        { chave: 'saude.tipo', rotulo: 'Tipo de plano', tipo: TIPO.SELECAO, opcoes: ['Individual', 'Familiar', 'Empresarial', 'Por adesão'], revelaSe: { campo: 'saude.tem', igual: 'Sim' } },
        { chave: 'saude.operadora', rotulo: 'Operadora', tipo: TIPO.TEXTO, revelaSe: { campo: 'saude.tem', igual: 'Sim' } },
        { chave: 'saude.nome', rotulo: 'Nome do plano', tipo: TIPO.TEXTO, revelaSe: { campo: 'saude.tem', igual: 'Sim' } },
      ]},
    ],
  },
  {
    id: 's05', numero: '05', titulo: 'Aposentadoria', vertical: 'aposentadoria', icone: 'piggy-bank',
    grupos: [
      { titulo: 'Diagnóstico', campos: [
        { chave: 'apo.idadeInicio', rotulo: 'Idade que começou a trabalhar', tipo: TIPO.NUMERO, unidade: 'anos', obrigatorio: true, deExame: 'q19' },
        { chave: 'apo.idadeFim', rotulo: 'Pretende trabalhar até qual idade?', tipo: TIPO.NUMERO, unidade: 'anos', obrigatorio: true, deExame: 'q20' },
        { chave: 'apo.rendaDesejada', rotulo: 'Renda desejada na aposentadoria', tipo: TIPO.MOEDA,
          expande: 'O exame não pergunta isso — é aqui que a gente descobre quanto você quer receber por mês.' },
        { chave: 'apo.temPlano', rotulo: 'Tem plano concreto de onde virá a renda?', tipo: TIPO.SIMNAO, obrigatorio: true, deExame: 'q21' },
        { chave: 'apo.qualPlano', rotulo: 'Qual seria o plano?', tipo: TIPO.MULTI,
          opcoes: ['Pensão pública INSS/RPPS', 'Previdência privada', 'Investimentos'], deExame: 'q22' },
        { chave: 'apo.executando', rotulo: 'O que está executando hoje?', tipo: TIPO.MULTI,
          opcoes: ['Contribuindo com INSS/RPPS', 'Previdência fechada da empresa', 'Investimentos/Previdência aberta'], deExame: 'q23' },
      ]},
      { titulo: 'Previdência Pública', campos: [
        { chave: 'prev.tipo', rotulo: 'Tipo de previdência pública', tipo: TIPO.SELECAO, opcoes: ['INSS - Regime Geral', 'RPPS - Servidor Público', 'Nenhuma'] },
        { chave: 'prev.idadeBeneficio', rotulo: 'Idade estimada para receber o benefício', tipo: TIPO.NUMERO, unidade: 'anos' },
        { chave: 'prev.valorBeneficio', rotulo: 'Valor estimado do benefício', tipo: TIPO.MOEDA },
        { chave: 'prev.primeiraContrib', rotulo: 'Mês da primeira contribuição', tipo: TIPO.MES, avancado: true },
        { chave: 'prev.numContrib', rotulo: 'Nº estimado de contribuições', tipo: TIPO.NUMERO, avancado: true },
        { chave: 'prev.contribMedia', rotulo: 'Valor médio de contribuição', tipo: TIPO.MOEDA, avancado: true },
        { chave: 'prev.contribAtual', rotulo: 'Valor atual de contribuição', tipo: TIPO.MOEDA, avancado: true },
        { chave: 'prev.obsRPPS', rotulo: 'Condições especiais / Observações — RPPS', tipo: TIPO.AREA, avancado: true },
      ]},
      { titulo: 'Planos de Previdência Fechada', repetivel: true, rotuloItem: 'Plano Fechado', semItens: 'Cliente não possui previdência fechada', campos: [
        { chave: 'entidade', rotulo: 'Entidade', tipo: TIPO.TEXTO },
        { chave: 'tipoPlano', rotulo: 'Tipo do Plano', tipo: TIPO.SELECAO, opcoes: ['PGBL', 'VGBL', 'BD', 'CD', 'CV'] },
        { chave: 'regimeTrib', rotulo: 'Regime Tributário', tipo: TIPO.SELECAO, opcoes: ['Progressivo', 'Regressivo'] },
        { chave: 'fundo', rotulo: 'Nome do Fundo', tipo: TIPO.TEXTO },
        { chave: 'cnpj', rotulo: 'CNPJ do Fundo', tipo: TIPO.TEXTO },
        { chave: 'perfilRisco', rotulo: 'Perfil de Risco', tipo: TIPO.SELECAO, opcoes: ['Conservador', 'Moderado', 'Arrojado'] },
        { chave: 'contribMensal', rotulo: 'Contribuição mensal atual', tipo: TIPO.MOEDA },
        { chave: 'contrapartida', rotulo: 'Contrapartida da patrocinadora', tipo: TIPO.MOEDA },
        { chave: 'saldo', rotulo: 'Saldo atual total', tipo: TIPO.MOEDA },
        { chave: 'entrada', rotulo: 'Mês de entrada no plano', tipo: TIPO.MES },
        { chave: 'numContrib', rotulo: 'Nº de contribuições feitas', tipo: TIPO.NUMERO },
        { chave: 'vestingProprio', rotulo: 'Vesting 100% saldo próprio', tipo: TIPO.TEXTO, exemplo: '5 anos' },
        { chave: 'vestingPatroc', rotulo: 'Vesting 100% saldo patrocinadora', tipo: TIPO.TEXTO, exemplo: '10 anos' },
        { chave: 'regras', rotulo: 'Regras de resgate, portabilidade e observações', tipo: TIPO.AREA },
      ]},
      { titulo: 'Planos de Previdência Aberta', repetivel: true, rotuloItem: 'Plano Aberto', semItens: 'Cliente não possui previdência aberta', campos: [
        { chave: 'tipoPlano', rotulo: 'Tipo do Plano', tipo: TIPO.SELECAO, opcoes: ['PGBL', 'VGBL'] },
        { chave: 'regimeTrib', rotulo: 'Regime Tributário', tipo: TIPO.SELECAO, opcoes: ['Progressivo', 'Regressivo'] },
        { chave: 'fundo', rotulo: 'Nome do Fundo', tipo: TIPO.TEXTO },
        { chave: 'cnpj', rotulo: 'CNPJ do Fundo', tipo: TIPO.TEXTO },
        { chave: 'perfilRisco', rotulo: 'Perfil de Risco', tipo: TIPO.SELECAO, opcoes: ['Conservador', 'Moderado', 'Arrojado'] },
        { chave: 'contribMensal', rotulo: 'Contribuição mensal atual', tipo: TIPO.MOEDA },
        { chave: 'saldo', rotulo: 'Saldo atual total', tipo: TIPO.MOEDA },
        { chave: 'inicio', rotulo: 'Data de início do plano', tipo: TIPO.DATA },
      ]},
    ],
  },
  {
    id: 's06', numero: '06', titulo: 'Financeiro e Contábil', vertical: 'tributario', icone: 'receipt',
    grupos: [
      { titulo: 'Perfil de Renda', campos: [
        { chave: 'ren.natureza', rotulo: 'Natureza da principal fonte de renda', tipo: TIPO.SELECAO, obrigatorio: true,
          opcoes: ['Registrado CLT', 'Servidor Público', 'Aposentadoria/Pensão', 'Profissional Liberal/Autônomo', 'Empresário', 'Sem Renda'],
          deExame: 'q24', expande: 'Vimos que você é empresário. Vamos entender como a renda sai da empresa?' },
        { chave: 'ren.liquida', rotulo: 'Renda líquida mensal', tipo: TIPO.MOEDA, obrigatorio: true, deExame: 'q25' },
      ]},
      { titulo: 'Imposto de Renda', campos: [
        { chave: 'ir.regime', rotulo: 'Regime de declaração', tipo: TIPO.SELECAO, opcoes: ['Simplificado', 'Completo', 'Não declara'] },
      ]},
      { titulo: 'Renda Ativa', repetivel: true, rotuloItem: 'Renda Ativa', campos: [
        { chave: 'regime', rotulo: 'Regime de trabalho', tipo: TIPO.SELECAO, opcoes: ['Registrado CLT', 'Profissional Liberal/Autônomo', 'Empresário', 'Servidor Público'] },
        { chave: 'horas', rotulo: 'Horas de trabalho/mês', tipo: TIPO.NUMERO },
        { chave: 'bruta', rotulo: 'Renda bruta mensal', tipo: TIPO.MOEDA },
        { chave: 'liquida', rotulo: 'Renda líquida mensal', tipo: TIPO.MOEDA },
        { chave: 'comissoes', rotulo: 'Comissões mensal', tipo: TIPO.MOEDA },
        { chave: 'decimoTerceiro', rotulo: 'Recebe 13º salário?', tipo: TIPO.SIMNAO },
        { chave: 'bonus', rotulo: 'Bônus anual', tipo: TIPO.MOEDA },
        { chave: 'plr', rotulo: 'PLR anual', tipo: TIPO.MOEDA },
      ]},
      { titulo: 'Renda Passiva', repetivel: true, rotuloItem: 'Renda Passiva', campos: [
        { chave: 'tipo', rotulo: 'Tipo da renda passiva', tipo: TIPO.SELECAO, opcoes: ['Aluguel', 'Dividendos', 'Juros', 'Royalties', 'Pró-labore', 'Outro'] },
        { chave: 'ativo', rotulo: 'Ativo que gera esta renda', tipo: TIPO.TEXTO },
        { chave: 'bruta', rotulo: 'Renda bruta mensal esperada', tipo: TIPO.MOEDA },
        { chave: 'liquida', rotulo: 'Renda líquida mensal esperada', tipo: TIPO.MOEDA },
      ]},
      { titulo: 'Resumo de Rendas', campos: [
        { chave: 'ren.resumo', rotulo: 'Resumo de Renda Mensal', tipo: TIPO.CALCULADO, ajuda: 'Renda Ativa + Renda Passiva = Total' },
      ]},
    ],
  },
  {
    id: 's07', numero: '07', titulo: 'Cenário Atual', vertical: 'financeira', icone: 'home',
    grupos: [
      { titulo: 'Cenário', campos: [
        { chave: 'cen.dependentes', rotulo: 'Tem dependentes financeiros?', tipo: TIPO.SIMNAO, obrigatorio: true,
          ajuda: 'Filhos, pais ou outros que não se sustentariam sem o cliente', deExame: 'q26',
          expande: 'Vimos no seu exame que você tem dependentes. Quantos e quais são?' },
        { chave: 'cen.avaliadoProfissional', rotulo: 'Já teve produtos financeiros avaliados por um profissional?', tipo: TIPO.SIMNAO, obrigatorio: true, deExame: 'q29' },
      ]},
      { titulo: 'Moradia', campos: [
        { chave: 'mor.estrutura', rotulo: 'Estrutura de moradia atual', tipo: TIPO.SELECAO,
          opcoes: ['Aluguel', 'Imóvel financiado', 'Imóvel quitado', 'Com terceiros - família etc.'] },
        { chave: 'mor.fgts', rotulo: 'Saldo de FGTS', tipo: TIPO.MOEDA },
      ]},
      { titulo: 'Família & Dependentes', repetivel: true, rotuloItem: 'Dependente', campos: [
        { chave: 'relacao', rotulo: 'Relação', tipo: TIPO.SELECAO, opcoes: ['Filho(a)', 'Cônjuge', 'Pai/Mãe', 'Irmão(ã)', 'Outro'] },
        { chave: 'nome', rotulo: 'Nome', tipo: TIPO.TEXTO },
        { chave: 'idade', rotulo: 'Idade atual', tipo: TIPO.NUMERO, unidade: 'anos' },
        { chave: 'tipoDependencia', rotulo: 'Tipo de dependência', tipo: TIPO.SELECAO, opcoes: ['Total', 'Parcial - ajuda'] },
        { chave: 'custoMensal', rotulo: 'Custo mensal estimado', tipo: TIPO.MOEDA },
      ]},
    ],
  },
  {
    id: 's08', numero: '08', titulo: 'Dados Pessoais', vertical: null, icone: 'user',
    grupos: [
      { titulo: 'Identificação', campos: [
        { chave: 'pes.estadoCivil', rotulo: 'Estado civil', tipo: TIPO.SELECAO, obrigatorio: true,
          opcoes: ['Solteiro(a)', 'Casado(a)', 'Divorciado(a)', 'Separado(a)', 'Viúvo(a)'], deExame: 'q30' },
        { chave: 'pes.genero', rotulo: 'Gênero', tipo: TIPO.SELECAO, obrigatorio: true,
          opcoes: ['Feminino', 'Masculino', 'Outro', 'Prefiro não declarar'], deExame: 'q31' },
        { chave: 'pes.nascimento', rotulo: 'Data de nascimento', tipo: TIPO.DATA, obrigatorio: true, deExame: 'q32', sensivel: true },
        { chave: 'pes.email', rotulo: 'Email', tipo: TIPO.EMAIL, obrigatorio: true, deExame: 'q33', sensivel: true },
        { chave: 'pes.telefone', rotulo: 'Telefone / WhatsApp', tipo: TIPO.TEL, obrigatorio: true, sensivel: true,
          expande: 'O exame não pede telefone — é aqui que o canal de acompanhamento nasce.' },
      ]},
    ],
  },
  {
    id: 's09', numero: '09', titulo: 'Perfil e Comportamento', vertical: 'ativos', icone: 'user',
    grupos: [
      { titulo: 'Autoavaliação', campos: [
        { chave: 'per.autoavaliacao', rotulo: 'Sente que está usando seu dinheiro da melhor forma?', tipo: TIPO.ESCALA,
          opcoes: ['1-Nada bem', '2-Pouco bem', '3-Neutro', '4-Bem', '5-Muito bem'], obrigatorio: true, deExame: 'q01' },
      ]},
      {
        titulo: 'Perfil de Risco e Comportamento', soConsultor: true,
        nota: 'Preenchido pelo consultor — é o instrumento de suitability. Nenhuma tarefa de produto de investimento é publicada sem isto.',
        campos: [
          { chave: 'per.disposicaoRisco', rotulo: 'Disposição a risco', tipo: TIPO.SELECAO, opcoes: ['Baixo', 'Médio', 'Alto'], suitability: true },
          { chave: 'per.capacidadeRisco', rotulo: 'Capacidade para risco', tipo: TIPO.SELECAO, opcoes: ['Baixo', 'Médio', 'Alto'], suitability: true },
          { chave: 'per.relacaoDinheiro', rotulo: 'Relação com o dinheiro', tipo: TIPO.SELECAO, opcoes: ['Gastador', 'Poupador', 'Neutro'] },
          { chave: 'per.restricaoClasse', rotulo: 'Possui restrição a alguma classe de ativo?', tipo: TIPO.AREA, exemplo: 'Não investe em ações' },
          { chave: 'per.ativoIntocavel', rotulo: 'Possui algum ativo que não deseja se desfazer?', tipo: TIPO.AREA, exemplo: 'Apartamento da família' },
          { chave: 'per.classeVetada', rotulo: 'Classe de ativo que não quer de forma alguma?', tipo: TIPO.AREA, exemplo: 'Criptoativos' },
        ],
      },
      { titulo: 'Perpetuidade / Herança', vertical: 'sucessorio', campos: [
        { chave: 'per.perpetuidade', rotulo: 'Deseja perpetuidade ou deixar valores de herança?', tipo: TIPO.AREA,
          expande: 'É a única porta de entrada do sucessório hoje — e é por onde o tema começa.' },
      ]},
    ],
  },
  {
    id: 's10', numero: '10', titulo: 'Anexos', vertical: null, icone: 'folder',
    grupos: [
      { titulo: 'Documentos', campos: [
        { chave: 'anx.entregues', rotulo: 'Documentos entregues/pendentes', tipo: TIPO.MULTI,
          opcoes: ['Extratos dos investimentos', 'Declaração de imposto de renda', 'Apólices de seguros', 'Outros'] },
        { chave: 'anx.obs', rotulo: 'Observações sobre os anexos', tipo: TIPO.AREA },
        { chave: 'anx.arquivos', rotulo: 'Upload de arquivo', tipo: TIPO.ARQUIVO, sensivel: true,
          ajuda: 'PDF, imagens, planilhas · máx. 10MB por arquivo' },
      ]},
    ],
  },
  {
    id: 's11', numero: '11', titulo: 'Próximas Tarefas', vertical: null, icone: 'check',
    grupos: [
      { titulo: 'Tarefas', repetivel: true, rotuloItem: 'Tarefa', campos: [
        { chave: 'tarefa', rotulo: 'Tarefa', tipo: TIPO.TEXTO, exemplo: 'Enviar proposta de previdência' },
        { chave: 'prazo', rotulo: 'Prazo', tipo: TIPO.MES },
        { chave: 'responsavel', rotulo: 'Responsável', tipo: TIPO.SELECAO, opcoes: ['Consultor', 'Cliente', 'Equipe'] },
        { chave: 'status', rotulo: 'Status', tipo: TIPO.SELECAO, opcoes: ['A fazer', 'Em andamento', 'Concluída'] },
      ]},
    ],
  },
];

/* ── Derivados ────────────────────────────────────────────────────────────── */

export const todosOsCampos = () =>
  SECOES.flatMap((s) => s.grupos.flatMap((g) =>
    (g.repetivel ? [] : g.campos.map((c) => ({ ...c, secaoId: s.id, grupo: g.titulo, vertical: g.vertical || s.vertical })))));

/** Campos que o exame já respondeu — a base do "expande, não repete". */
export const camposDoExame = () => todosOsCampos().filter((c) => c.deExame);

/** Campos obrigatórios ainda sem resposta = o que falta para a coleta ficar suficiente. */
export const camposObrigatorios = () => todosOsCampos().filter((c) => c.obrigatorio);

/** Campos que compõem o instrumento de suitability (trava para produto de investimento). */
export const camposSuitability = () => todosOsCampos().filter((c) => c.suitability);

export const ESTATISTICAS = {
  secoes: SECOES.length,
  gruposRepetiveis: SECOES.flatMap((s) => s.grupos).filter((g) => g.repetivel).length,
  camposFixos: todosOsCampos().length,
  vindosDoExame: camposDoExame().length,
};
