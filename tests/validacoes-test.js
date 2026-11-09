const { describe, it } = require('node:test');
const assert = require('node:assert');
const {Validacoes:validacoes} = require('../lib/index');

describe('eTituloDeEleitor', () => {
	it('É capaz de validar titulos de eleitor', function() {
		assert.ok(validacoes.eTituloDeEleitor('106644440302'));
		assert.ok(validacoes.eTituloDeEleitor('0196 3894 2097'));
		assert.ok(validacoes.eTituloDeEleitor('1265934718-72'));
		assert.ok(validacoes.eTituloDeEleitor('0043568709/06'));
		assert.ok(validacoes.eTituloDeEleitor('2733 9734 0264'));
		assert.ok(validacoes.eTituloDeEleitor('  \t 7.232.3\t06.121-78   '));

	});

	it('Retorna o estado de origem do titulo eleitoral caso ele seja válido', function() {
		assert.equal(validacoes.eTituloDeEleitor('1066 4444 0302'), 'RJ');
		assert.equal(validacoes.eTituloDeEleitor('0196 3894 2097'), 'DF');
		assert.equal(validacoes.eTituloDeEleitor('1265 9347 1872'), 'MT');
		assert.equal(validacoes.eTituloDeEleitor('0043 5687 0906'), 'SC');
		assert.equal(validacoes.eTituloDeEleitor('2733 9734 0264'), 'MG');
		assert.equal(validacoes.eTituloDeEleitor('7232 3061 2178'), 'SE');

	});

	it('Retorna ZZ caso seja um titulo de eleitor emitido no exterior', function() {
		assert.equal(validacoes.eTituloDeEleitor('123412342801'), 'ZZ');

	});
});

describe('eEan', () => {
	it('É capaz de validar EAN-8', function() {
		assert.ok(validacoes.eEan('23734524'));
		assert.ok(validacoes.eEan('91459381'));
		assert.ok(validacoes.eEan('62999878'));

	});

	it('É capaz de validar EAN-12', function() {
		assert.ok(validacoes.eEan('569265982372'));
		assert.ok(validacoes.eEan('666376876870'));
		assert.ok(validacoes.eEan('887776655449'));

	});

	it('É capaz de validar EAN-13', function() {
		assert.ok(validacoes.eEan('7898419154154'));
		assert.ok(validacoes.eEan('7897424082124'));
		assert.ok(validacoes.eEan('7891058020316'));

	});

	it('É capaz de validar EAN-14', function() {
		assert.ok(validacoes.eEan('41412342345348'));
		assert.ok(validacoes.eEan('55443423232328'));
		assert.ok(validacoes.eEan('88887722635653'));

	});
});

describe('ePlaca', () => {
	it('Valida-se placas válidas com ou sem máscara', function() {
		assert.ok(validacoes.ePlaca('abc1234'));
		assert.ok(validacoes.ePlaca('abc-1234'));

		assert.ok(validacoes.ePlaca('jjd0931'));
		assert.ok(validacoes.ePlaca('jjd-0931'));

		assert.ok(validacoes.ePlaca('ddw1177'));
		assert.ok(validacoes.ePlaca('ddw-1177'));

	});

	it('Placas inválidas não são validadas', function() {
		assert.ok(!validacoes.ePlaca('ddwd1177'));
		assert.ok(!validacoes.ePlaca('ddw11772'));
		assert.ok(!validacoes.ePlaca('ddw-a772'));
		assert.ok(!validacoes.ePlaca('1dw-3772'));
		assert.ok(!validacoes.ePlaca('foo bar'));
		assert.ok(!validacoes.ePlaca(new Date()));
		assert.ok(!validacoes.ePlaca(12345));

	});
});

describe('eCep', () => {
	it('Valida-se ceps válidos com ou sem máscara', function() {
		assert.ok(validacoes.eCep('71530070'));
		assert.ok(validacoes.eCep('71530-070'));
		assert.ok(validacoes.eCep('71.530070'));
		assert.ok(validacoes.eCep('71.530-070'));

	});

	it('Ceps inválidos não são validados', function() {
		assert.ok(!validacoes.eCep('71530a070'));
		assert.ok(!validacoes.eCep('71530-0709'));
		assert.ok(!validacoes.eCep('771.530070'));
		assert.ok(!validacoes.eCep(' 71.530-070'));

	});
});

describe('eRegistroNacional', () => {
	it('Verifica que é possível validar cpfs', function() {
		assert.equal(validacoes.eRegistroNacional('227.175.903-07'), 'cpf');
		assert.equal(validacoes.eRegistroNacional('16511762645'), 'cpf');
		assert.equal(validacoes.eRegistroNacional('434.803.222-04'), 'cpf');
		assert.equal(validacoes.eRegistroNacional('82647731330'), 'cpf');
		assert.equal(validacoes.eRegistroNacional(' 711.477.475-39 '), 'cpf');
		assert.equal(validacoes.eRegistroNacional('711.477.475-39'), 'cpf');

	});

	it('Verifica que é possível validar cnpjs', function() {
		assert.equal(validacoes.eRegistroNacional('16.555.517/0001-87'), 'cnpj');
		assert.equal(validacoes.eRegistroNacional('14638632000190'), 'cnpj');
		assert.equal(validacoes.eRegistroNacional(' 88.142.322/0001-16 '), 'cnpj');
		assert.equal(validacoes.eRegistroNacional('88.142.322/0001-16'), 'cnpj');
		assert.equal(validacoes.eRegistroNacional('28716876000158'), 'cnpj');
		assert.equal(validacoes.eRegistroNacional('13.381.462/0001-48'), 'cnpj');

		assert.equal(validacoes.eRegistroNacional('00.000.000/0000-00'), false);
		assert.equal(validacoes.eRegistroNacional('11.111.111/1111-11'), false);
		assert.equal(validacoes.eRegistroNacional('22.222.222/2222-22'), false);
		assert.equal(validacoes.eRegistroNacional('33.333.333/3333-33'), false);
		assert.equal(validacoes.eRegistroNacional('44.444.444/4444-44'), false);
		assert.equal(validacoes.eRegistroNacional('55.555.555/5555-55'), false);
		assert.equal(validacoes.eRegistroNacional('66.666.666/6666-66'), false);
		assert.equal(validacoes.eRegistroNacional('77.777.777/7777-77'), false);
		assert.equal(validacoes.eRegistroNacional('88.888.888/8888-88'), false);
		assert.equal(validacoes.eRegistroNacional('99.999.999/9999-99'), false);

	});

	it('Verifica que é possível especificar tipo de registro nacional a ser validado', function() {
		assert.ok(!validacoes.eRegistroNacional('227.175.903-07', 'cnpj'));
		assert.ok(!validacoes.eRegistroNacional('16511762645', 'cnpj'));
		assert.ok(!validacoes.eRegistroNacional('434.803.222-04', 'cnpj'));
		assert.ok(!validacoes.eRegistroNacional('82647731330', 'cnpj'));
		assert.ok(!validacoes.eRegistroNacional(' 711.477.475-39 ', 'cnpj'));
		assert.ok(!validacoes.eRegistroNacional('711.477.475-39', 'cnpj'));

		assert.ok(!validacoes.eRegistroNacional('16.555.517/0001-87', 'cpf'));
		assert.ok(!validacoes.eRegistroNacional('14638632000190', 'cpf'));
		assert.ok(!validacoes.eRegistroNacional(' 88.142.322/0001-16 ', 'cpf'));
		assert.ok(!validacoes.eRegistroNacional('88.142.322/0001-16', 'cpf'));
		assert.ok(!validacoes.eRegistroNacional('28716876000158', 'cpf'));
		assert.ok(!validacoes.eRegistroNacional('13.381.462/0001-48', 'cpf'));

		assert.equal(validacoes.eRegistroNacional('227.175.903-07', 'cpf'), 'cpf');
		assert.equal(validacoes.eRegistroNacional('16511762645', 'cpf'), 'cpf');
		assert.equal(validacoes.eRegistroNacional('434.803.222-04', 'cpf'), 'cpf');
		assert.equal(validacoes.eRegistroNacional('82647731330', 'cpf'), 'cpf');
		assert.equal(validacoes.eRegistroNacional(' 711.477.475-39 ', 'cpf'), 'cpf');
		assert.equal(validacoes.eRegistroNacional('711.477.475-39', 'cpf'), 'cpf');

		assert.equal(validacoes.eRegistroNacional('16.555.517/0001-87', 'cnpj'), 'cnpj');
		assert.equal(validacoes.eRegistroNacional('14638632000190', 'cnpj'), 'cnpj');
		assert.equal(validacoes.eRegistroNacional(' 88.142.322/0001-16 ', 'cnpj'), 'cnpj');
		assert.equal(validacoes.eRegistroNacional('88.142.322/0001-16', 'cnpj'), 'cnpj');
		assert.equal(validacoes.eRegistroNacional('28716876000158', 'cnpj'), 'cnpj');
		assert.equal(validacoes.eRegistroNacional('13.381.462/0001-48', 'cnpj'), 'cnpj');

	});

	it('Retorna \'false\' caso não seja nem cpf nem cnpj', function() {
		assert.equal(validacoes.eRegistroNacional('foo bar'), false);
		assert.equal(validacoes.eRegistroNacional('14.638.632/0001-9'), false);
		assert.equal(validacoes.eRegistroNacional('434.803.222-05'), false);
		assert.equal(validacoes.eRegistroNacional('13.555.517/0001-87'), false);
		assert.equal(validacoes.eRegistroNacional('165.117.626-455'), false);

	});
});

describe('eCnpj', () => {
	it('Verifica que é possível validar cnpjs', function() {
		assert.ok(validacoes.eCnpj('16.555.517/0001-87'));
		assert.ok(validacoes.eCnpj('14638632000190'));
		assert.ok(validacoes.eCnpj(' 88.142.322/0001-16  '));
		assert.ok(validacoes.eCnpj('88.142.322/0001-16'));
		assert.ok(validacoes.eCnpj('28716876000158'));
		assert.ok(validacoes.eCnpj('13.381.462/0001-48'));

	});

	it('Retorna false para cnpj inválido', function() {
		assert.ok(!validacoes.eCnpj('16.55.517/0001-87'));
		assert.ok(!validacoes.eCnpj('146386320001901'));
		assert.ok(!validacoes.eCnpj('foo bar'));
		assert.ok(!validacoes.eCnpj('2328716876000158'));
		assert.ok(!validacoes.eCnpj('a1 3.381.462/0001-48'));

	});
});

describe('eMatriz', () => {
	it('Verifica que é possivel identificar uma matriz pelo CNPJ', function() {

		assert.ok(validacoes.eMatriz('00.132.781/0001-78'));
		assert.ok(validacoes.eMatriz('00.000.000/0001-91'));
		assert.ok(validacoes.eMatriz('19950366000150'));

		assert.equal(validacoes.eMatriz('00123123000209'), false);
		assert.equal(validacoes.eMatriz('00123432000513'), false);
		assert.equal(validacoes.eMatriz('12123432009982'), false);

	});

	it('Verifica que retorna nulo caso não seja passado um CNPJ', function() {
		assert.equal(validacoes.eMatriz('123456'), null);
		assert.equal(validacoes.eMatriz('testando'), null);

	});
});

describe('eFilial', () => {
	it('Verifica que é possível identificar uma filial pelo CNPJ, e que o seu número é retornado', function() {

		assert.equal(validacoes.eFilial('00.132.781/0001-78'), false);
		assert.equal(validacoes.eFilial('00.000.000/0001-91'), false);
		assert.equal(validacoes.eFilial('19950366000150'), false);

		assert.equal(validacoes.eFilial('00123123000209'), 2);
		assert.equal(validacoes.eFilial('00123432000513'), 5);
		assert.equal(validacoes.eFilial('12123432009982'), 99);

	});

	it('Verifica que retorna nulo caso não seja passado um CNPJ', function() {
		assert.equal(validacoes.eFilial('123456'), null);
		assert.equal(validacoes.eFilial('testando'), null);

	});
});

describe('eCpf', () => {
	it('Verifica que é possível validar cpfs', function() {
		assert.ok(validacoes.eCpf('  227.175.903-07   '));
		assert.ok(validacoes.eCpf('227.175.903-07'));
		assert.ok(validacoes.eCpf('16511762645'));
		assert.ok(validacoes.eCpf('434.803.222-04'));
		assert.ok(validacoes.eCpf('82647731330'));
		assert.ok(validacoes.eCpf('711.477.475-39'));

	});

	it('Retorna false para cpf inválido', function() {
		assert.ok(!validacoes.eCpf('227.175.903-08'));
		assert.ok(!validacoes.eCpf('16511762645u'));
		assert.ok(!validacoes.eCpf('foo bar'));
		assert.ok(!validacoes.eCpf('826471731330'));
		assert.ok(!validacoes.eCpf('731.477.475-39'));

	});
});

describe('eNit', () => {
	it('Verifica que é apenas um alias para .ePisPasep', function() {
		assert.equal(validacoes.ePisPasep.toString(), validacoes.eNit.toString());

	});
});

describe('ePisPasep', () => {
	it('Verifica que é possível validar PIS/PASEPs', function() {
		assert.ok(validacoes.ePisPasep('  125.6932.537-8   '));
		assert.ok(validacoes.ePisPasep('125.6932.537-8'));
		assert.ok(validacoes.ePisPasep('12561040048'));
		assert.ok(validacoes.ePisPasep('125.8576.637-5'));
		assert.ok(validacoes.ePisPasep('12521311083'));
		assert.ok(validacoes.ePisPasep('125.4158.627-4'));
		assert.ok(validacoes.ePisPasep('131.42928.27-7'));

	});

	it('Retorna false para PIS/PASEP inválido', function() {
		assert.ok(!validacoes.ePisPasep('PIS is not a valid PIS'));
		assert.ok(!validacoes.ePisPasep('125.0407.095-1'));
		assert.ok(!validacoes.ePisPasep('125.7720.536-X'));
		assert.ok(!validacoes.ePisPasep('125.3587.244-99'));
		assert.ok(!validacoes.ePisPasep(' '));

	});
});
