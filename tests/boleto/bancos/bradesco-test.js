const { beforeEach, it } = require('node:test');
const assert = require('node:assert');
const PdfGerador = require('../../../lib/pdf-gerador');
var fs = require('fs'),
	boletos = require('../../../lib/utils/functions/boletoUtils.js'),
	Bradesco = require('../../../lib/boleto/bancos/bradesco.js'),
	geradorDeLinhaDigitavel = require('../../../lib/boleto/gerador-de-linha-digitavel.js'),

	Datas = boletos.Datas,
	Endereco = boletos.Endereco,
	Beneficiario = boletos.Beneficiario,
	Pagador = boletos.Pagador,
	Boleto = boletos.Boleto,

	banco,
	boleto;

beforeEach(function() {
	banco = new Bradesco();

	var datas = Datas.novasDatas();

	datas.comDocumento('02-04-2020');
	datas.comProcessamento('02-04-2020');
	datas.comVencimento('02-04-2020');

	var beneficiario = Beneficiario.novoBeneficiario();
	beneficiario.comNome('Leonardo Bessa');
	beneficiario.comRegistroNacional('73114004652');
	beneficiario.comAgencia('2949');
	beneficiario.comDigitoAgencia('1');
	beneficiario.comCodigoBeneficiario('6580');
	beneficiario.comDigitoCodigoBeneficiario('3');
	beneficiario.comNumeroConvenio('1207113');
	beneficiario.comCarteira('6');
	beneficiario.comNossoNumero('3');
	beneficiario.comDigitoNossoNumero('7');

	var enderecoDoBeneficiario = Endereco.novoEndereco();
	enderecoDoBeneficiario.comLogradouro('Rua da Programação');
	enderecoDoBeneficiario.comBairro('Zona Rural');
	enderecoDoBeneficiario.comCep('71550050');
	enderecoDoBeneficiario.comCidade('Patos de Minas');
	enderecoDoBeneficiario.comUf('MG');
	beneficiario.comEndereco(enderecoDoBeneficiario);

	var pagador = Pagador.novoPagador();
	pagador.comNome('Fulano');
	pagador.comRegistroNacional('97264269604');

	var enderecoDoPagador = Endereco.novoEndereco();
	enderecoDoPagador.comLogradouro('Avenida dos Testes Unitários');
	enderecoDoPagador.comBairro('Barra da Tijuca');
	enderecoDoPagador.comCep('72000000');
	enderecoDoPagador.comCidade('Rio de Janeiro');
	enderecoDoPagador.comUf('RJ');
	pagador.comEndereco(enderecoDoPagador);

	boleto = Boleto.novoBoleto();
	boleto.comDatas(datas);
	boleto.comBeneficiario(beneficiario);
	boleto.comBanco(banco);
	boleto.comPagador(pagador);
	boleto.comValor(1);
	boleto.comNumeroDoDocumento('4323');
	boleto.comLocaisDePagamento([
		'Pagável preferencialmente na rede Bradesco ou no Bradesco expresso'
	]);

});

it('Nosso número formatado deve ter 11 digitos', function() {
	var nossoNumero = banco.getNossoNumeroFormatado(boleto.getBeneficiario());
	assert.equal(11, nossoNumero.length);
	assert.equal('00000000003', nossoNumero);

});

it('Carteira formatado deve ter dois dígitos', function() {
	var carteiraFormatado = banco.getCarteiraFormatado(boleto.getBeneficiario());

	assert.equal(2, carteiraFormatado.length);
	assert.equal('06', carteiraFormatado);

});

it('Conta corrente formatada deve ter sete dígitos', function() {
	var codigoFormatado = banco.getCodigoFormatado(boleto.getBeneficiario());

	assert.equal(7, codigoFormatado.length);
	assert.equal('0006580', codigoFormatado);

});

it('Testa geração de linha digitavel', function() {
	var codigoDeBarras = banco.geraCodigoDeBarrasPara(boleto),
		linhaEsperada = '23792.94909 60000.000004 03000.658009 9 81550000000100';

	assert.equal(linhaEsperada, geradorDeLinhaDigitavel(codigoDeBarras));

});

it('Testa código de barras', function() {
	var codigoDeBarras = banco.geraCodigoDeBarrasPara(boleto);

	assert.equal('23799815500000001002949060000000000300065800', codigoDeBarras);

});

it('Verifica nome correto do banco', function() {
	assert.equal(banco.getNome(), 'Banco Bradesco S.A.');

});

it('Verifica a numeração correta do banco', function() {
	assert.equal(banco.getNumeroFormatadoComDigito(), '237-2');

});

it('Verifica que arquivo de imagem do logotipo existe', function() {
	assert.ok(fs.existsSync(banco.getImagem()));

});

it('Verifica deve imprimir o nome do banco no boleto', function() {
	assert.ok(!banco.getImprimirNome());

});

it('Exibir campo CIP retorna verdadeiro', function() {
	assert.equal(banco.exibirCampoCip(), true);

});

it('Verifica criação de pdf', function() {
	return new PdfGerador(boleto).pdfFile(
		'../tests/boleto/bancos/boleto-bradesco.pdf'
	).then(async({path})=>{
		assert.ok(fs.existsSync(path));
		assert.equal(fs.unlinkSync(path), undefined);

	});
});
