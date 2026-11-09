const path = require('path');
const StringUtils = require('../../utils/string-utils');
const pad = StringUtils.pad;

const CodigoDeBarrasBuilder = require('../codigo-de-barras-builder');

var Sicredi = (function () {
  var NUMERO_SICREDI = '748',
    DIGITO_SICREDI = 'X';

  function Sicredi() {}

  Sicredi.prototype.getTitulos = function () {
    return {
      instrucoes: 'Instruções',
      nomeDoPagador: 'Nome do Pagador',
      especie: 'Espécie',
      quantidade: 'Quantidade Moeda',
      valor: 'Valor Moeda',
      moraMulta: '(+) Juros / Multa',
    };
  };

  Sicredi.prototype.exibirReciboDoPagadorCompleto = function () {
    return true;
  };

  Sicredi.prototype.exibirCampoCip = function () {
    return false;
  };

  Sicredi.prototype.geraCodigoDeBarrasPara = function (boleto) {
    var beneficiario = boleto.getBeneficiario(),
      data = boleto.getDatas(),
      campoLivre = [];

    campoLivre.push('1');
    campoLivre.push('1');
    campoLivre.push(
      pad(
        data.getProcessamentoFormatado().substring(8) +
          '2' +
          beneficiario.getNossoNumero() +
          beneficiario.getDigitoNossoNumero(),
        9,
        '0',
      ),
    );
    campoLivre.push(beneficiario.getAgenciaFormatada());
    campoLivre.push(beneficiario.getDigitoAgencia());
    if (beneficiario.getCodigoBeneficiario() > 0) {
      campoLivre.push(pad(beneficiario.getCodigoBeneficiario(), 5, '0'));
    } else {
      campoLivre.push(pad(beneficiario.getConta(), 5, '0'));
    }
    if (boleto.getValorBoleto() > 0) {
      campoLivre.push('1');
    } else {
      campoLivre.push('0');
    }
    campoLivre.push('0');
    const digCampoLivre = beneficiario.Modulo11(campoLivre.join(''), 9, false);
    campoLivre.push(digCampoLivre);

    return new CodigoDeBarrasBuilder(boleto).comCampoLivre(campoLivre);
  };

  Sicredi.prototype.getNumeroFormatadoComDigito = function () {
    return [NUMERO_SICREDI, DIGITO_SICREDI].join('-');
  };

  Sicredi.prototype.getNumeroFormatado = function () {
    return NUMERO_SICREDI;
  };

  Sicredi.prototype.getCarteiraFormatado = function (beneficiario) {
    return pad(beneficiario.getCarteira(), 1, '0');
  };

  Sicredi.prototype.getCarteiraTexto = function (beneficiario) {
    return pad(beneficiario.getCarteira(), 2, '0');
  };

  Sicredi.prototype.getCodigoFormatado = function (beneficiario) {
    return pad(beneficiario.getCodigoBeneficiario(), 7, '0');
  };

  Sicredi.prototype.getImagem = function () {
    return path.join(__dirname, 'logotipos/sicred.png');
  };

  Sicredi.prototype.getNossoNumeroFormatado = function (beneficiario) {
    return pad(beneficiario.getNossoNumero(), 8, '0');
  };

  Sicredi.prototype.getNossoNumeroECodigoDocumento = function (boleto) {
    var beneficiario = boleto.getBeneficiario();
    var data = boleto.getDatas();

    return (
      data.getProcessamentoFormatado().substring(8) +
      '/' +
      '2' +
      this.getNossoNumeroFormatado(beneficiario).substring(3) +
      '-' +
      beneficiario.getDigitoNossoNumero()
    );
  };

  Sicredi.prototype.getNome = function () {
    return 'Sicredi';
  };

  Sicredi.prototype.getImprimirNome = function () {
    return false;
  };

  Sicredi.prototype.getAgenciaECodigoBeneficiario = function (boleto) {
    var beneficiario = boleto.getBeneficiario(),
      codigo = beneficiario.getAgenciaFormatada() + '.' + beneficiario.getDigitoAgencia() + '.';
    if (beneficiario.getCodigoBeneficiario() > 0) {
      codigo = codigo + beneficiario.getCodigoBeneficiario();
    } else {
      codigo = codigo + beneficiario.getConta();
    }

    return codigo;
  };

  Sicredi.novoSicredi = function () {
    return new Sicredi();
  };

  return Sicredi;
})();

module.exports = Sicredi;
