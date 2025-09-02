const { Bancos, Boletos, streamToPromise } = require('../lib/index');

const boleto = {
  banco: new Bancos.Itau(),
  pagador: {
    nome: 'Maria Teste Multa',
    registroNacional: '406.745.360-45',
    endereco: {
      logradouro: 'Rua GH',
      bairro: 'São José',
      cidade: 'Governador Valadares',
      estadoUF: 'MG',
      cep: '35050-320'
    }
  },
  instrucoes: ['Instruções de responsabilidade do BENEFICIÁRIO.'],
  beneficiario: {
    nome: 'Empresa Fictícia LTDA',
    cnpj:'43576788000191',
    dadosBancarios: {
      carteira: '157',
      agencia: '2938',
      agenciaDigito: '*',
      conta: '10183',
      contaDigito: '4',
      nossoNumero: '80001397',
      nossoNumeroDigito: '',
      codigo: '26185',
      digitoCodigoBeneficiario: '2',
      convenio: '157610183',
    },
    endereco: {
      logradouro: 'Rua Pedro Lessa, 15',
      bairro: 'Centro',
      cidade: 'Rio de Janeiro',
      estadoUF: 'RJ',
      cep: '20030-030'
    }
  },
  boleto: {
    numeroDocumento: 'ND000054/1',
    especieDocumento: 'DM',
    valor: 179.61,
    datas: {
      vencimento: '05-09-2025',
      processamento: '02-09-2025',
      documentos: '12-08-2025'
    }
  }
};

const novoBoleto = new Boletos(boleto);
novoBoleto.gerarBoleto();

novoBoleto.pdfFile().then(async ({ stream }) => {
  // ctx.res.set('Content-type', 'application/pdf');	
  await streamToPromise(stream);
}).catch((error) => {
  return error;
});