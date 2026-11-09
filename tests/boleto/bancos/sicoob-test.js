const { beforeEach, it } = require('node:test');
const assert = require('node:assert');
const PdfGerador = require('../../../lib/pdf-gerador');
var fs = require('fs'),
	boletos = require('../../../lib/utils/functions/boletoUtils.js'),
	Sicoob = require('../../../lib/boleto/bancos/sicoob.js'),

	Datas = boletos.Datas,
	Endereco = boletos.Endereco,
	Beneficiario = boletos.Beneficiario,
	Pagador = boletos.Pagador,
	Boleto = boletos.Boleto,

	banco,
	boleto,
	beneficiario;

beforeEach(function() {
	var datas = Datas.novasDatas();
	datas.comDocumento('02-01-2016');
	datas.comProcessamento('02-01-2016');
	datas.comVencimento('02-10-2016');

	const pagador = Pagador.novoPagador();
	pagador.comNome('BASILIO ANTONIO CAMPANHOLO');
	pagador.comRegistroNacional('26018683172');

	beneficiario = Beneficiario.novoBeneficiario();
	beneficiario.comNome('GREENSTONE DES. E PROC. DE DADOS MINERAIS LTDA ME');
	beneficiario.comRegistroNacional('21202793000100');
	beneficiario.comAgencia('4155');
	beneficiario.comCarteira('1');
	beneficiario.comCodigoBeneficiario('101060');
	beneficiario.comDigitoCodigoBeneficiario('0');
	beneficiario.comNossoNumero('515');
	beneficiario.comDigitoNossoNumero('8');

	banco = new Sicoob();

	boleto = Boleto.novoBoleto();
	boleto.comDatas(datas);
	boleto.comBeneficiario(beneficiario);
	boleto.comBanco(banco);
	boleto.comPagador(pagador);
	boleto.comValorBoleto(1200);
	boleto.comNumeroDoDocumento(103);

});

it('Verifica que arquivo de imagem do logotipo existe', function() {
	assert.ok(fs.existsSync(banco.getImagem()));

});

it('Verifica criação de pdf', function() { //Mover para teste adequado

	var datas2 = Datas.novasDatas();
	datas2.comDocumento('09-19-2014');
	datas2.comProcessamento('09-19-2014');
	datas2.comVencimento('09-26-2014');

	var beneficiario2 = Beneficiario.novoBeneficiario();
	beneficiario2.comNome('GREENSTONE DES. E PROC. DE DADOS MINERAIS LTDA ME');
	beneficiario2.comRegistroNacional('21202793000100');
	beneficiario2.comAgencia('4155');
	beneficiario2.comCarteira('1');
	beneficiario2.comCodigoBeneficiario('101060');
	beneficiario2.comDigitoCodigoBeneficiario('0');
	beneficiario2.comNossoNumero('515');
	beneficiario2.comDigitoNossoNumero('8');

	var pagador2 = Pagador.novoPagador();
	pagador2.comNome('Asnésio da Silva');

	var boleto2 = Boleto.novoBoleto();
	boleto2.comEspecieDocumento('FS');
	boleto2.comDatas(datas2);
	boleto2.comBeneficiario(beneficiario2);
	boleto2.comBanco(banco);
	boleto2.comPagador(pagador2);
	boleto2.comValorBoleto(1200);
	boleto2.comNumeroDoDocumento('5');
	boleto2.comBanco(banco);

	var enderecoDoPagador = Endereco.novoEndereco();
	enderecoDoPagador.comLogradouro('Avenida dos Testes Unitários');
	enderecoDoPagador.comBairro('Barra da Tijuca');
	enderecoDoPagador.comCep('72000000');
	enderecoDoPagador.comCidade('Rio de Janeiro');
	enderecoDoPagador.comUf('RJ');

	pagador2.comEndereco(enderecoDoPagador);

	boleto.comLocaisDePagamento([
		'Pagável em qualquer banco ou casa lotérica até o vencimento'
	]);

	boleto.comInstrucoes([
		'Conceder desconto de R$ 10,00 até o vencimento',
		'Multa de R$ 2,34 após o vencimento',
		'Mora de R$ 0,76 ao dia após o vencimento',
		'Protestar após 10 dias de vencido',
		'Agradecemos a preferência, volte sempre!'
	]);

	return new PdfGerador([boleto, boleto2]).pdfFile(
		'../tests/boleto/bancos/boleto-sicoob.pdf'
	).then(async({path})=>{
		assert.ok(fs.existsSync(path));
		assert.equal(fs.unlinkSync(path), undefined);

	});
});
