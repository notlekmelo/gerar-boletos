const path = require('path');
const StringUtils = require('../../utils/string-utils');
const pad = StringUtils.pad;

const CodigoDeBarrasBuilder = require('../codigo-de-barras-builder');

var Caixa = (function() {
	var NUMERO_CAIXA = '104',
		DIGITO_CAIXA = '0';

	function Caixa() {

	}

	Caixa.prototype.getTitulos = function() {
		return {
			instrucoes: 'Instruções (Texto de Responsabilidade do Beneficiário):',
			nomeDoPagador: 'Nome do Pagador',
			especie: 'Espécie Moeda',
			quantidade: 'Qtde Moeda',
			valor: 'Valor'
		};
	};

	Caixa.prototype.exibirReciboDoPagadorCompleto = function() {
		return true;
	};

	Caixa.prototype.exibirCampoCip = function() {
		return false;
	};

	Caixa.prototype.geraCodigoDeBarrasPara = function(boleto) {
		var beneficiario = boleto.getBeneficiario(),
			nossoNumeroFormatado = this.getNossoNumeroFormatado(beneficiario),
			campoLivre = [];

		let codigoBeneficiario = beneficiario.getCodigoBeneficiario();
		if (parseInt(codigoBeneficiario) > 1100000){
			campoLivre.push(pad(codigoBeneficiario,7,'0'));
		} 
		else {
			campoLivre.push(pad(codigoBeneficiario,6,'0'));
			campoLivre.push(beneficiario.Modulo11(pad(codigoBeneficiario,6,'0'),9,false));
		} 
		campoLivre.push(nossoNumeroFormatado.substring(2, 5));
		campoLivre.push('1');
		campoLivre.push(nossoNumeroFormatado.substring(5, 8));
		campoLivre.push('4');
		campoLivre.push(nossoNumeroFormatado.substring(8));
		campoLivre.push(beneficiario.Modulo11(campoLivre.join(''),9,false));

		return new CodigoDeBarrasBuilder(boleto).comCampoLivre(campoLivre);
	};

	Caixa.prototype.getNumeroFormatadoComDigito = function() {
		return [NUMERO_CAIXA, DIGITO_CAIXA].join('-');
	};

	Caixa.prototype.getCarteiraFormatado = function(beneficiario) {
		return pad(beneficiario.getCarteira(), 2, '0');
	};

	Caixa.prototype.getCarteiraTexto = function(beneficiario) {
		return {
			1: 'RG',
			14: 'RG',
			2: 'SR',
			24: 'SR'
		}[beneficiario.getCarteira()];
	};

	Caixa.prototype.getCodigoFormatado = function(beneficiario) {
		return pad(beneficiario.getCodigoBeneficiario(), 5, '0');
	};

	Caixa.prototype.getImagem = function() {
		return path.join(__dirname, 'logotipos/caixa-economica-federal.png');
	};

	Caixa.prototype.getNossoNumeroFormatado = function(beneficiario) {
		return [
			pad(beneficiario.getCarteira(), 2, '0'),
			pad(beneficiario.getNossoNumero(), 15, '0')
		].join('');
	};

	Caixa.prototype.getNossoNumeroECodigoDocumento = function(boleto) {
		var beneficiario = boleto.getBeneficiario();

		return [
			pad(beneficiario.getNossoNumero(), 15, '0'),
			beneficiario.getDigitoNossoNumero()
		].join('-');
	};

	Caixa.prototype.getNumeroFormatado = function() {
		return NUMERO_CAIXA;
	};

	Caixa.prototype.getNome = function() {
		return 'Caixa Econômica Federal S/A';
	};

	Caixa.prototype.getImprimirNome = function() {
		return false;
	};

	Caixa.prototype.getAgenciaECodigoBeneficiario = function(boleto) {
		var beneficiario = boleto.getBeneficiario(),

			codigo = pad(this.getCodigoFormatado(beneficiario),7,'0'),
			digitoCodigo = beneficiario.getDigitoCodigoBeneficiario();

		if (digitoCodigo) {
			codigo += '-' + digitoCodigo;
		}

		return beneficiario.getAgenciaFormatada() + '/' + codigo;
	};

	Caixa.novoCaixa = function() {
		return new Caixa();
	};

	return Caixa;
})();

module.exports = Caixa;
