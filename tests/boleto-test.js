const { describe, it } = require('node:test');
const assert = require('node:assert');
const boleto = require('../lib/utils/functions/boletoUtils');
const bancos = boleto.bancos;
const Endereco = boleto.Endereco;
const Gerador = boleto.Gerador;
const Boleto = boleto.Boleto;
const Datas = boleto.Datas;

describe('especiesDeDocumento', () => {
	it('Verifica que contém o número correto de espécies', function() {
		assert.equal(Object.keys(boleto.especiesDeDocumento).length, 21);

	});
});

describe('bancos', () => {
	it('Todos os bancos estão disponíveis', function() {
		assert.ok(new bancos.Itau());
		assert.ok(new bancos['341']());

		assert.ok(new bancos.Caixa());
		assert.ok(new bancos['104']());

		assert.ok(new bancos.Bradesco());
		assert.ok(new bancos['237']());

		assert.ok(new bancos.Sicoob());
		assert.ok(new bancos['756']());

		assert.ok(new bancos.Cecred());
		assert.ok(new bancos['085']());
		console.log(Object.keys(bancos).length);
		assert.equal(16, Object.keys(bancos).length);

	});
});

describe('Gerador', () => {
	it('Verifica que é possível instanciar o gerador', function() {
		assert.ok(new Gerador());

	});

	it('Verifica que o gerador apresenta as funções esperadas', function() {
		var gerador = new Gerador();

		assert.equal(typeof gerador.gerarPDF, 'function');
		assert.equal(typeof gerador.gerarHTML, 'function');

	});

	it('Verifica que a geração de HTML lança uma exceção', function() {
		assert.throws(function() {
			new Gerador().gerarHTML();
		});

	});
});

describe('Pagador', () => {

});

describe('Beneficiario', () => {

});

describe('Datas', () => {
	it('É possível instanciar um objeto de datas', function() {
		var datas = Datas.novasDatas();

		assert.ok(datas);

	});

	it('Deve lançar exceção se as datas forem muito antigas', function() {
		assert.throws(function() {
			Datas.novasDatas()
				.comDocumento(1, 1, 1996)
				.comVencimento(1, 1, 1996)
				.comProcessamento(1, 1, 1996);
		});

	});

	it('Deve lançar exceção se as datas estiverem além de 2999', function() {
		assert.throws(function() {
			Datas.novasDatas()
				.comDocumento(1, 1, 2999)
				.comVencimento(1, 1, 2999)
				.comProcessamento(1, 1, 2999);
		});

	});
});

describe('Endereco', () => {
	it('Deve imprimir endereco completo', function() {
		var endereco = Endereco.novoEndereco()
			.comLogradouro('RODOVIA SC 401, KM 1 - EDIFÍCIO CELTA')
			.comBairro('PARQTEC ALFA')
			.comCep('88030-000')
			.comCidade('FLORIANÓPOLIS')
			.comUf('SC');

		assert.equal(endereco.getEnderecoCompleto(), [
			'RODOVIA SC 401, KM 1 - EDIFÍCIO CELTA ',
			'PARQTEC ALFA 88.030-000 FLORIANÓPOLIS SC'
		].join(''));

	});

	it('Deve imprimir endereco sem logradouro', function() {
		var endereco = Endereco.novoEndereco()
			.comBairro('PARQTEC ALFA')
			.comCep('88030-000')
			.comCidade('FLORIANÓPOLIS')
			.comUf('SC');

		assert.equal(endereco.getEnderecoCompleto(), 'PARQTEC ALFA 88.030-000 FLORIANÓPOLIS SC');

	});

	it('Deve imprimir endereco sem cep', function() {
		var endereco = Endereco.novoEndereco()
			.comLogradouro('RODOVIA SC 401, KM 1 - EDIFÍCIO CELTA')
			.comBairro('PARQTEC ALFA')
			.comCidade('FLORIANÓPOLIS')
			.comUf('SC');

		assert.equal(endereco.getEnderecoCompleto(), [
			'RODOVIA SC 401, KM 1 - EDIFÍCIO CELTA ',
			'PARQTEC ALFA FLORIANÓPOLIS SC'
		].join(''));

	});

	it('Deve imprimir vazio se endereço não preenchido', function() {
		var endereco = Endereco.novoEndereco();

		assert.equal(endereco.getEnderecoCompleto(), '');

	});
});

describe('Boleto', () => {
	it('É possível instanciar um novo boleto', function() {
		var boleto = Boleto.novoBoleto();

		assert.ok(boleto);

	});

	it('Novo boleto deve ter alguns valores padrão', function() {
		var boleto = Boleto.novoBoleto();

		assert.equal(boleto.getEspecieMoeda(), 'R$');
		assert.equal(boleto.getCodigoEspecieMoeda(), 9);
		assert.equal(boleto.getAceite(), false);
		assert.equal(boleto.getEspecieDocumento(), 'DV');

	});

	it('Calcula corretamente o fator de vencimento', function() {
		var dataDeVencimento = new Date(2015, 3 - 1, 21, 0, 0, 0, 0),
			datas = Datas.novasDatas().comVencimento(dataDeVencimento),
			boleto = Boleto.novoBoleto().comDatas(datas);

		assert.equal(boleto.getFatorVencimento(), '6374');

	});

	it('Calcula corretamente o fator de vencimento, ignorando as horas - 1', function() {
		var dataDeVencimento = new Date(2008, 5 - 1, 2, 0, 0, 0, 0),
			datas = Datas.novasDatas().comVencimento(dataDeVencimento),
			boleto = Boleto.novoBoleto().comDatas(datas);

		assert.equal(boleto.getFatorVencimento(), '3860');

	});

	it('Calcula corretamente o fator de vencimento, ignorando as horas - 2', function() {
		var dataDeVencimento = new Date(2008, 5 - 1, 2, 23, 59, 59, 999),
			datas = Datas.novasDatas().comVencimento(dataDeVencimento),
			boleto = Boleto.novoBoleto().comDatas(datas);

		assert.equal(boleto.getFatorVencimento(), '3860');

	});

	it('Lança exceção ao tentar definir um valor negativo para o boleto', function() {
		assert.throws(function() {
			Boleto.novoBoleto().comValorBoleto(-5);
		});

	});

	it('O valor formatado deve ter 10 digitos - 1', function() {
		var boleto = Boleto.novoBoleto().comValorBoleto(3),
			valorFormatado = boleto.getValorFormatado();

		assert.equal(10, valorFormatado.length);
		assert.equal('0000000300', valorFormatado);

	});

	it('O valor formatado deve ter 10 digitos - 2', function() {
		var boleto = Boleto.novoBoleto().comValorBoleto(3.1),
			valorFormatado = boleto.getValorFormatado();

		assert.equal(10, valorFormatado.length);
		assert.equal('0000000310', valorFormatado);

	});

	it('O valor formatado deve ter 10 digitos - 3', function() {
		var boleto = Boleto.novoBoleto().comValorBoleto(3.18),
			valorFormatado = boleto.getValorFormatado();

		assert.equal(10, valorFormatado.length);
		assert.equal('0000000318', valorFormatado);

	});

	it('O valor formatado deve ter 10 digitos - 4', function() {
		var boleto = Boleto.novoBoleto().comValorBoleto(300),
			valorFormatado = boleto.getValorFormatado();

		assert.equal(10, valorFormatado.length);
		assert.equal('0000030000', valorFormatado);

	});

	it('São consideradas apenas as primeiras duas casas decimais do valor', function() {
		var boleto = Boleto.novoBoleto().comValorBoleto(3.189),
			valorFormatado = boleto.getValorFormatado();

		assert.equal(10, valorFormatado.length);
		assert.equal('0000000318', valorFormatado);

	});

	it('Número do documento formatado deve ter 4 digitos', function() {
		var boleto = Boleto.novoBoleto().comNumeroDoDocumento('232'),
			numeroFormatado = boleto.getNumeroDoDocumentoFormatado();

		assert.equal(4, numeroFormatado.length);
		assert.equal('0232', numeroFormatado);

	});

	it('Boleto não deve aceitar mais do que cinco instruções', function() {
		assert.throws(function() {
			Boleto.novoBoleto().comInstrucoes('', '', '', '', '', '');
		});

		assert.throws(function() {
			Boleto.novoBoleto().comInstrucoes(['', '', '', '', '', '']);
		});

	});

	it('Boleto não deve aceitar mais do que cinco descrições', function() {
		assert.throws(function() {
			Boleto.novoBoleto().comDescricoes('', '', '', '', '', '');
		});

		assert.throws(function() {
			Boleto.novoBoleto().comDescricoes(['', '', '', '', '', '']);
		});

	});

	it('Boleto não deve aceitar mais do que dois locais de pagamento', function() {
		assert.throws(function() {
			Boleto.novoBoleto().comLocaisDePagamento('', '', '');
		});

		assert.throws(function() {
			Boleto.novoBoleto().comLocaisDePagamento(['', '', '']);
		});

	});

	it('Não deve ser possivel definir um novo boleto com valor superior a R$ 99.999.999,99', function() {
		assert.throws(function() {
			Boleto.novoBoleto().comValorBoleto(100000000.00);
		});

	});

	it('Deve retornar formatação em formato legivel', function() {
		var boleto;

		boleto = Boleto.novoBoleto().comValorBoleto(0);
		assert.equal('R$ 0,00', boleto.getValorFormatadoBRL());

		boleto = Boleto.novoBoleto().comValorBoleto(1);
		assert.equal('R$ 1,00', boleto.getValorFormatadoBRL());

		boleto = Boleto.novoBoleto().comValorBoleto(1.2);
		assert.equal('R$ 1,20', boleto.getValorFormatadoBRL());

		boleto = Boleto.novoBoleto().comValorBoleto(1.23);
		assert.equal('R$ 1,23', boleto.getValorFormatadoBRL());

		boleto = Boleto.novoBoleto().comValorBoleto(1.235);
		assert.equal('R$ 1,23', boleto.getValorFormatadoBRL());

		boleto = Boleto.novoBoleto().comValorBoleto(10.23);
		assert.equal('R$ 10,23', boleto.getValorFormatadoBRL());

		boleto = Boleto.novoBoleto().comValorBoleto(100.23);
		assert.equal('R$ 100,23', boleto.getValorFormatadoBRL());

		boleto = Boleto.novoBoleto().comValorBoleto(1000.23);
		assert.equal('R$ 1.000,23', boleto.getValorFormatadoBRL());

		boleto = Boleto.novoBoleto().comValorBoleto(10002.23);
		assert.equal('R$ 10.002,23', boleto.getValorFormatadoBRL());

		boleto = Boleto.novoBoleto().comValorBoleto(210002.23);
		assert.equal('R$ 210.002,23', boleto.getValorFormatadoBRL());

		boleto = Boleto.novoBoleto().comValorBoleto(3210002.23);
		assert.equal('R$ 3.210.002,23', boleto.getValorFormatadoBRL());

		boleto = Boleto.novoBoleto().comValorBoleto(13210002.23);
		assert.equal('R$ 13.210.002,23', boleto.getValorFormatadoBRL());

		boleto = Boleto.novoBoleto().comValorBoleto(99999999.99);
		assert.equal('R$ 99.999.999,99', boleto.getValorFormatadoBRL());

	});
});
