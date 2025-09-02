
const Boleto = require('./utils/functions/boletoUtils');
const formatacoes = require('./utils/functions/formatacoesUtils');
const validacoes = require('./utils/functions/validacoesUtils');
const StreamToPromise = require('../lib/utils/stream-utils');
const digitosVerificadores = require('./utils/functions/digito-verificador.util');
const Boletos = require('./metodosPublicos/boletoMetodos');

module.exports = {
  Boletos,
  Bancos: Boleto.bancos,
  formatacoes,
  Validacoes: validacoes,
  StreamToPromise,
  digitosVerificadores
};

