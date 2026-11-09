const { beforeEach, it } = require('node:test');
const assert = require('node:assert');
const PdfGerador = require('../../../lib/pdf-gerador');
var fs = require('fs'),
	boletos = require('../../../lib/utils/functions/boletoUtils.js'),
	Caixa = require('../../../lib/boleto/bancos/caixa.js'),
	geradorDeLinhaDigitavel = require('../../../lib/boleto/gerador-de-linha-digitavel.js'),

	Datas = boletos.Datas,
	Endereco = boletos.Endereco,
	Beneficiario = boletos.Beneficiario,
	Pagador = boletos.Pagador,
	Boleto = boletos.Boleto,

	banco,
	boletoSinco,
	boletoSicgb,
	beneficiario;

beforeEach(function() {
	banco = new Caixa();

	// SINCO
	var datas = Datas.novasDatas();
	datas.comDocumento('04-22-2013');
	datas.comProcessamento('04-22-2013');
	datas.comVencimento('04-29-2013');

	const pagador = Pagador.novoPagador();
	pagador.comNome('Mario Amaral');

	beneficiario = Beneficiario.novoBeneficiario();
	beneficiario.comNome('Rodrigo Turini');
	beneficiario.comRegistroNacional('19950366000150');
	beneficiario.comAgencia('2873');
	beneficiario.comCarteira('1');
	beneficiario.comCodigoBeneficiario('2359');
	beneficiario.comNossoNumero('990000000003994458', banco);
	beneficiario.comDigitoNossoNumero('0');

	boletoSinco = Boleto.novoBoleto();
	boletoSinco.comDatas(datas);
	boletoSinco.comBeneficiario(beneficiario);
	boletoSinco.comBanco(banco);
	boletoSinco.comPagador(pagador);
	boletoSinco.comValorBoleto(4016.10);
	boletoSinco.comNumeroDoDocumento(3084373);

	// SIGCB
	var datas2 = Datas.novasDatas();
	datas2.comDocumento('02-04-2020');
	datas2.comProcessamento('02-04-2020');
	datas2.comVencimento('02-04-2020');

	var beneficiario2 = Beneficiario.novoBeneficiario();
	beneficiario2.comNome('Gammasoft Desenvolvimento de Software Ltda');
	beneficiario2.comAgencia('589');
	beneficiario2.comCarteira('24');
	beneficiario2.comCodigoBeneficiario('290274');
	beneficiario2.comDigitoCodigoBeneficiario('5');
	beneficiario2.comNossoNumero('900000000000132', banco);
	beneficiario2.comDigitoNossoNumero('3');
	beneficiario2.comRegistroNacional('19950366000150');

	var enderecoDoBeneficiario = Endereco.novoEndereco();
	enderecoDoBeneficiario.comLogradouro('Rua da Programação');
	enderecoDoBeneficiario.comBairro('Zona Rural');
	enderecoDoBeneficiario.comCep('71550050');
	enderecoDoBeneficiario.comCidade('Patos de Minas');
	enderecoDoBeneficiario.comUf('MG');
	beneficiario2.comEndereco(enderecoDoBeneficiario);

	var pagador2 = Pagador.novoPagador();
	pagador2.comNome('Paulo Fulano da Silva');
	pagador2.comRegistroNacional('77134854817');

	var enderecoDoPagador = Endereco.novoEndereco();
	enderecoDoPagador.comLogradouro('Avenida dos Testes Unitários');
	enderecoDoPagador.comBairro('Barra da Tijuca');
	enderecoDoPagador.comCep('72000000');
	enderecoDoPagador.comCidade('Rio de Janeiro');
	enderecoDoPagador.comUf('RJ');
	pagador2.comEndereco(enderecoDoPagador);

	boletoSicgb = Boleto.novoBoleto();
	boletoSicgb.comDatas(datas2);
	boletoSicgb.comBeneficiario(beneficiario2);
	boletoSicgb.comBanco(banco);
	boletoSicgb.comPagador(pagador2);
	boletoSicgb.comValorBoleto(80.00);
	boletoSicgb.comNumeroDoDocumento('NF100/00000132');
	boletoSicgb.comLocaisDePagamento([
		'PREFERENCIALMENTE NAS CASAS LOTÉRICAS ATÉ O VALOR LIMITE'
	]);

});

it('Nosso número formatado deve ter 17 digitos', function() {
	// var nossoNumeroSinco = banco.getNossoNumeroFormatado(boletoSinco.getBeneficiario());
	// assert.equal(17, nossoNumeroSinco.length);
	// assert.equal('990000000003994458', nossoNumeroSinco); //Sinco deve ter 18?

	var nossoNumeroSicgb = banco.getNossoNumeroFormatado(boletoSicgb.getBeneficiario());
	assert.equal(17, nossoNumeroSicgb.length);
	assert.equal('24900000000000132', nossoNumeroSicgb); // Sicgb deve ter 17?

});

it('Carteira formatado deve ter dois dígitos', function() {
	var beneficiario = Beneficiario.novoBeneficiario().comCarteira('1'),
		numeroFormatado = banco.getCarteiraFormatado(beneficiario);

	assert.equal(2, numeroFormatado.length);
	assert.equal('01', numeroFormatado);

});

it('Conta corrente formatada deve ter cinco dígitos', function() {
	var numeroFormatado = banco.getCodigoFormatado(beneficiario);

	assert.equal(5, numeroFormatado.length);
	assert.equal('02359', numeroFormatado);

});

it('Linha digitavel com carteira SIGCB 1', function() {
	var datas2 = Datas.novasDatas();
	datas2.comDocumento('02-04-2020');
	datas2.comProcessamento('02-04-2020');
	datas2.comVencimento('02-04-2020');

	var beneficiario2 = Beneficiario.novoBeneficiario();
	beneficiario2.comNome('AGUINALDO LUIZ TELES - ME');
	beneficiario2.comAgencia('4221');
	beneficiario2.comCarteira('14');
	beneficiario2.comCodigoBeneficiario('648995');
	beneficiario2.comDigitoCodigoBeneficiario('8');
	beneficiario2.comNossoNumero('000000000000007', banco);
	beneficiario2.comDigitoNossoNumero('3');
	beneficiario2.comRegistroNacional('08432498000173');

	var enderecoDoBeneficiario = Endereco.novoEndereco();
	enderecoDoBeneficiario.comLogradouro('Rua da Programação');
	enderecoDoBeneficiario.comBairro('Zona Rural');
	enderecoDoBeneficiario.comCep('71550050');
	enderecoDoBeneficiario.comCidade('Patos de Minas');
	enderecoDoBeneficiario.comUf('MG');
	beneficiario2.comEndereco(enderecoDoBeneficiario);

	var pagador2 = Pagador.novoPagador();
	pagador2.comNome('Paulo Fulano da Silva');
	pagador2.comRegistroNacional('77134854817');

	var enderecoDoPagador = Endereco.novoEndereco();
	enderecoDoPagador.comLogradouro('Avenida dos Testes Unitários');
	enderecoDoPagador.comBairro('Barra da Tijuca');
	enderecoDoPagador.comCep('72000000');
	enderecoDoPagador.comCidade('Rio de Janeiro');
	enderecoDoPagador.comUf('RJ');
	pagador2.comEndereco(enderecoDoPagador);

	boletoSinco = Boleto.novoBoleto();
	boletoSinco.comDatas(datas2);
	boletoSinco.comBeneficiario(beneficiario2);
	boletoSinco.comBanco(banco);
	boletoSinco.comPagador(pagador2);
	boletoSinco.comValorBoleto(158.76);
	boletoSinco.comNumeroDoDocumento('NF100/00000215');
	boletoSinco.comLocaisDePagamento([
		'PREFERENCIALMENTE NAS CASAS LOTÉRICAS ATÉ O VALOR LIMITE'
	]);

	var codigoDeBarras = banco.geraCodigoDeBarrasPara(boletoSinco),
		linhaEsperada = '10496.48999 58000.100048 00000.000711 7 81550000015876';
	console.log(geradorDeLinhaDigitavel(codigoDeBarras, banco));
	assert.equal(linhaEsperada, geradorDeLinhaDigitavel(codigoDeBarras, banco));

});

it('Linha digitavel com carteira SIGCB 2', function() {
	var codigoDeBarras = banco.geraCodigoDeBarrasPara(boletoSicgb),
		linhaEsperada = '10492.90271 45900.100046 00000.013292 1 81550000008000';

	assert.equal(linhaEsperada, geradorDeLinhaDigitavel(codigoDeBarras, banco));

});

it('Verifica a numeração correta do banco', function() {
	assert.equal(banco.getNumeroFormatadoComDigito(), '104-0');

});

it('Verifica que arquivo de imagem do logotipo existe', function() {
	assert.ok(fs.existsSync(banco.getImagem()));

});

it('Exibir campo CIP retorna falso', function() {
	assert.equal(banco.exibirCampoCip(), false);

});

it('Verifica criação de pdf - SIGCB 1', function() {
	return new PdfGerador(boletoSicgb).pdfFile(
		'../tests/boleto/bancos/boleto-caixa1.pdf'
	).then(async({path})=>{
		assert.ok(fs.existsSync(path));
		assert.equal(fs.unlinkSync(path), undefined);

	});
});

it('Verifica criação de pdf - SIGCB 2', async function() {
	return new PdfGerador(boletoSicgb).pdfFile(
		'../tests/boleto/bancos/boleto-caixa2.pdf'
	).then(async({path})=>{
		assert.ok(fs.existsSync(path));
		assert.equal(fs.unlinkSync(path), undefined);

	});
});
