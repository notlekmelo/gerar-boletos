const { describe, it } = require('node:test');
const assert = require('node:assert');
const { formatacoes } = require('../lib/index');

describe('removerMascara', () => {
	it('Remove mascara de dinheiro', function() {
		assert.equal(formatacoes.removerMascara('R$ 12,23'), '12,23');

	});

	it('Remove mascaras de porcentagem', function() {
		assert.equal(formatacoes.removerMascara('10%'), '10');
		assert.equal(formatacoes.removerMascara('8,34 %'), '8,34');

	});

	it('Remove mascaras de Cnpj', function() {
		assert.equal(formatacoes.removerMascara('18.028.400/0001-70'), '18028400000170');

	});

	it('Remove mascaras de Cpf', function() {
		assert.equal(formatacoes.removerMascara('934.621.219-52'), '93462121952');

	});

	it('Remove mascaras de Telefone', function() {
		assert.equal(formatacoes.removerMascara('(61) 8633-3051'), '6186333051');

	});

	it('Remove mascaras de Placa', function() {
		assert.equal(formatacoes.removerMascara('ABC-2366'), 'ABC2366');

	});

	it('Remove mascaras de Cep', function() {
		assert.equal(formatacoes.removerMascara('71.530-070'), '71530070');

	});

	it('Remove espaços em branco no começo e no final', function() {
		assert.equal(formatacoes.removerMascara('    71.420-070  \t'), '71420070');

	});

	it('Se for passado algo que não é uma string então o mesmo é retornado', function() {
		assert.equal(formatacoes.removerMascara(null), null);
		assert.equal(formatacoes.removerMascara({}.devolvaUndefined), undefined);
		assert.equal(formatacoes.removerMascara(123), 123);

	});
});

describe('dinheiro', () => {
	it('Trata casas decimais por padrão', function() {
		assert.equal(formatacoes.dinheiro(1), 'R$ 1,00');
		assert.equal(formatacoes.dinheiro(12), 'R$ 12,00');
		assert.equal(formatacoes.dinheiro(123), 'R$ 123,00');
		assert.equal(formatacoes.dinheiro(1234), 'R$ 1.234,00');
		assert.equal(formatacoes.dinheiro(12345), 'R$ 12.345,00');

	});

	it('Não arredonda, simplesmente corta as casas decimais além do especificado', function() {
		assert.equal(formatacoes.dinheiro(35.855), 'R$ 35,85');
		assert.equal(formatacoes.dinheiro(35.859), 'R$ 35,85');

		assert.equal(formatacoes.dinheiro(35.855, {
			casasDecimais: 3
		}), 'R$ 35,855');

		assert.equal(formatacoes.dinheiro(35.859, {
			casasDecimais: 3
		}), 'R$ 35,859');

		assert.equal(formatacoes.dinheiro(1.005), 'R$ 1,00');
		assert.equal(formatacoes.dinheiro(1.005, {
			casasDecimais: 3
		}), 'R$ 1,005');

	});

	it('É possível passar outro símbolo', function() {
		assert.equal(formatacoes.dinheiro(73.315, {
			simbolo: 'BRL '
		}), 'BRL 73,31');

	});

	it('É possível posicionar o símbolo a direita', function() {
		assert.equal(formatacoes.dinheiro(859.385, {
			simbolo: 'BRL',
			posicionamento: 'direita'
		}), '859,38BRL');

	});
});

describe('dinheiroPorExtenso', () => {
	it('Escreve o valor R$ 0,00 adequadamente', function() {
		assert.equal(formatacoes.dinheiroPorExtenso(0), 'zero reais');

	});

	it('Escreve o valor R$ 1,00 adequadamente', function() {
		assert.equal(formatacoes.dinheiroPorExtenso(1), 'um real');

	});

	it('Escreve o valor R$ 2,00 adequadamente', function() {
		assert.equal(formatacoes.dinheiroPorExtenso(2), 'dois reais');

	});

	it('Escreve o valor R$ 17,34 adequadamente', function() {
		assert.equal(formatacoes.dinheiroPorExtenso(17.34), 'dezessete reais e trinta e quatro centavos');

	});

	it('Escreve o valor R$ 432,97 adequadamente', function() {
		assert.equal(formatacoes.dinheiroPorExtenso(432.97), 'quatrocentos e trinta e dois reais e noventa e sete centavos');

	});

	it('Escreve o valor R$ 1234,56 adequadamente', function() {
		assert.equal(formatacoes.dinheiroPorExtenso(1234.56), 'um mil e duzentos e trinta e quatro reais e cinquenta e seis centavos');

	});

	it('Escreve o valor R$ 21234,56 adequadamente', function() {
		assert.equal(formatacoes.dinheiroPorExtenso(21234.56), 'vinte e um mil e duzentos e trinta e quatro reais e cinquenta e seis centavos');

	});

	it('Escreve o valor R$ 121234,56 adequadamente', function() {
		assert.equal(formatacoes.dinheiroPorExtenso(121234.56), 'cento e vinte e um mil e duzentos e trinta e quatro reais e cinquenta e seis centavos');

	});
});

describe('numero', () => {
	it('Por padrão não trata casas decimais a menos que você especifique', function() {
		assert.equal(formatacoes.numero(1), '1');
		assert.equal(formatacoes.numero(1.00), '1');
		assert.equal(formatacoes.numero(1.010), '1,01');

		assert.equal(formatacoes.numero(1.00, {
			casasDecimais: 2
		}), '1,00');

		assert.equal(formatacoes.numero(1.010, {
			casasDecimais: 3
		}), '1,010');

	});

	it('Pocisiona separador de milhar padrão', function() {
		assert.equal(formatacoes.numero(1234.2), '1.234,2');
		assert.equal(formatacoes.numero(12345.2), '12.345,2');
		assert.equal(formatacoes.numero(1112345.2, {
			casasDecimais: 2
		}), '1.112.345,20');

	});
});

describe('data', () => {
	it('Verifica formatação correta', function() {
		var data = new Date(2014, 10, 20);
		assert.equal(formatacoes.data(data), '20/11/2014');

	});

	it('Caso não seja uma data válida retorna o que foi passado', function() {
		var data = new Date('inválido');
		assert.equal(formatacoes.data(data), 'Invalid Date');

	});
});

describe('hora', () => {
	it('Verifica formatação correta', function() {
		var data = new Date(2014, 10, 20, 23, 34, 45);
		assert.equal(formatacoes.hora(data), '23:34:45');

	});

	it('Pode-se formatar sem os segundos', function() {
		var data = new Date(2014, 10, 20, 23, 34, 45);
		assert.equal(formatacoes.hora(data, {
			comSegundos: false
		}), '23:34');

	});

	it('Caso não seja uma data válida retorna o que foi passado', function() {
		var data = new Date('inválido');
		assert.equal(formatacoes.hora(data), 'Invalid Date');

	});
});

describe('dataEHora', () => {
	it('Verifica formatação correta', function() {
		var data = new Date(2014, 10, 20, 23, 34, 45);
		assert.equal(formatacoes.dataEHora(data), '20/11/2014 23:34:45');

	});

	it('Caso não seja uma data válida retorna o que foi passado', function() {
		var data = new Date('inválido');
		assert.equal(formatacoes.dataEHora(data), 'Invalid Date');

	});
});

describe('tituloDeEleitor', () => {
	it('Formata de acordo com a formatação impressa no título de eleitor', function() {
		assert.equal(formatacoes.tituloDeEleitor('273397340264'), '2733 9734 0264');
		assert.equal(formatacoes.tituloDeEleitor('\t2 7 3-39-734026-4   '), '2733 9734 0264');

	});
});

describe('linhaDigitavel', () => {
	it('Formata a linha digitavel de um boleto se tiver 47 caracteres', function() {

		var esperado = '34191.57213 89766.660164 74514.590004 6 56550000268016',
			original = '34191572138976666016474514590004656550000268016';

		assert.equal(formatacoes.linhaDigitavel(original), esperado);

	});
});

describe('boletoBancario', () => {
	it('Verifica que é apenas um alias para .linhaDigitavel', function() {
		var linhaDigitavel = formatacoes.linhaDigitavel.toString(),
			boletoBancario = formatacoes.boletoBancario.toString();

		assert.equal(linhaDigitavel, boletoBancario);

	});
});

describe('nit', () => {
	it('Verifica que é apenas um alias para .pisPasep', function() {
		assert.equal(formatacoes.pisPasep.toString(), formatacoes.nit.toString());

	});
});

describe('pisPasep', () => {
	it('Verifica que a máscara é aplicada corretamente', function() {
		assert.equal(formatacoes.pisPasep('12541586274'), '125.4158.627-4');
		assert.equal(formatacoes.pisPasep('\t   12541586274  '), '125.4158.627-4');

	});
});

describe('cnpj', () => {
	it('Verifica que a máscara é aplicada corretamente', function() {

		assert.equal(formatacoes.cnpj('18028400000170'), '18.028.400/0001-70');
		assert.equal(formatacoes.cnpj(' 18028400000170 '), '18.028.400/0001-70');

	});

	it('Se passa algo que não era cnpj retorna o que foi passado anteriormente', function() {

		assert.equal(formatacoes.cnpj('18028400000171'), '18028400000171');
		assert.equal(formatacoes.cnpj('a8028400000170'), 'a8028400000170');

	});
});

describe('cpf', () => {
	it('Verifica que a máscara é aplicada corretamente', function() {

		assert.equal(formatacoes.cpf('93462121952'), '934.621.219-52');
		assert.equal(formatacoes.cpf(' 93462121952 '), '934.621.219-52');

	});

	it('Se passa algo que não era cpf retorna o que foi passado anteriormente', function() {

		assert.equal(formatacoes.cnpj('foo bar'), 'foo bar');
		assert.equal(formatacoes.cnpj('93462121953'), '93462121953');

	});
});

describe('registroNacional', () => {
	it('Verifica que a máscara é aplicada corretamente', function() {

		assert.equal(formatacoes.registroNacional('18028400000170'), '18.028.400/0001-70');
		assert.equal(formatacoes.registroNacional(' 18028400000170 '), '18.028.400/0001-70');

		assert.equal(formatacoes.registroNacional('93462121952'), '934.621.219-52');
		assert.equal(formatacoes.registroNacional(' 93462121952 '), '934.621.219-52');

	});
});

describe('placa', () => {
	it('Verifica que máscara é aplicada corretamente', function() {
		assert.equal(formatacoes.placa('abc2366'), 'ABC-2366');
		assert.equal(formatacoes.placa('abc-2343'), 'ABC-2343');

	});

	it('Verifica que retorna a mesma coisa quando texto não é placa', function() {
		assert.equal(formatacoes.placa('abcd-2366'), 'abcd-2366');
		assert.equal(formatacoes.placa('foo'), 'foo');

	});
});

describe('cep', () => {
	it('Verifica que máscara é aplicada corretamente', function() {
		assert.equal(formatacoes.cep('71530070'), '71.530-070');
		assert.equal(formatacoes.cep('71.530070'), '71.530-070');
		assert.equal(formatacoes.cep('71530-070'), '71.530-070');

	});

	it('Verifica que retorna a mesma coisa quando texto não é cep', function() {
		assert.equal(formatacoes.cep('715300700'), '715300700');
		assert.equal(formatacoes.cep('foo'), 'foo');

	});
});
