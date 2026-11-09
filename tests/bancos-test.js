const { describe, it } = require('node:test');
const assert = require('node:assert');
const bancos = require('../lib/utils/functions/bancosUtils');

describe('itau', () => {
	it('calcularDigitoVerificador', function() {
		assert.equal(bancos.itau.calcularDigitoVerificador('0654', '08711'), '3');

	});

	it('validarAgenciaEConta', function() {
		assert.ok(bancos.itau.validarAgenciaEConta('0654', '087113'));

	});

	it('validarAgencia - Verifica que sempre retorna falso', function() {
		//O itaú utiliza apenas um DV para agência e conta, este método está disponível
		//apenas para se adequar a interface
		assert.equal(bancos.itau.validarAgencia('0654'), false);

	});

	it('validarConta - Verifica que sempre retorna falso', function() {
		//O itaú utiliza apenas um DV para agência e conta, este método está disponível
		//apenas para se adequar a interface
		assert.equal(bancos.itau.validarConta('087113'), false);

	});
});

describe('341', () => {
	it('Verifica que mesmas funções disposniveis em bancos.itau estão disponiveis em banco["341"]', function() {
		assert.equal(bancos.itau.calcularDigitoVerificador.toString(), bancos['341'].calcularDigitoVerificador.toString());
		assert.equal(bancos.itau.validarAgenciaEConta.toString(), bancos['341'].validarAgenciaEConta.toString());
		assert.equal(bancos.itau.validarAgencia.toString(), bancos['341'].validarAgencia.toString());
		assert.equal(bancos.itau.validarConta.toString(), bancos['341'].validarConta.toString());

	});
});

describe('bancoDoBrasil', () => {
	it('calcularDigitoVerificador - Verifica que cálculo funciona para agência', function() {
		assert.equal(bancos.bancoDoBrasil.calcularDigitoVerificador('1507'), '5');

	});

	it('calcularDigitoVerificador - Verifica que cálculo funciona para conta', function() {
		assert.equal(bancos.bancoDoBrasil.calcularDigitoVerificador('33203'), '8');

	});

	it('validarAgenciaEConta', function() {
		assert.ok(bancos.bancoDoBrasil.validarAgenciaEConta('15075', '332038'));

	});

	it('validarAgencia', function() {
		assert.ok(bancos.bancoDoBrasil.validarAgencia('15075'));

	});

	it('validarConta', function() {
		assert.ok(bancos.bancoDoBrasil.validarConta('332038'));

	});
});

describe('001', () => {
	it('Verifica que mesmas funções disposniveis em bancos.bancoDoBrasil estão disponiveis em banco["001"]', function() {
		assert.equal(bancos.bancoDoBrasil.calcularDigitoVerificador.toString(), bancos['001'].calcularDigitoVerificador.toString());
		assert.equal(bancos.bancoDoBrasil.validarAgenciaEConta.toString(), bancos['001'].validarAgenciaEConta.toString());
		assert.equal(bancos.bancoDoBrasil.validarAgencia.toString(), bancos['001'].validarAgencia.toString());
		assert.equal(bancos.bancoDoBrasil.validarConta.toString(), bancos['001'].validarConta.toString());

	});
});
