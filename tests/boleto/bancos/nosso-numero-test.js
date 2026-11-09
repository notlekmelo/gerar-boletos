const { it } = require('node:test');
const assert = require('node:assert/strict');
const Pdf = require('pdfkit');
const { Bancos, Boletos } = require('../../../lib');
const { Beneficiario, Gerador } = require('../../../lib/utils/functions/boletoUtils');

function criarBoleto(banco, carteira, nossoNumero, nossoNumeroDigito) {
	const boleto = new Boletos({
		banco,
		pagador: { nome: 'Pagador de teste', registroNacional: '97264269604', endereco: {} },
		beneficiario: {
			nome: 'Beneficiário de teste', cnpj: '19950366000150', endereco: {},
			dadosBancarios: {
				carteira, nossoNumero, nossoNumeroDigito, agencia: '4221', agenciaDigito: '1',
				conta: '0012345', contaDigito: '6', codigo: '648995',
				digitoCodigoBeneficiario: '8', convenio: '123456'
			}
		},
		instrucoes: [],
		boleto: {
			numeroDocumento: '123', especieDocumento: 'DM', valor: 158.76,
			datas: { vencimento: '02-04-2020', processamento: '02-04-2020', documentos: '02-04-2020' }
		}
	});
	boleto.gerarBoleto();
	return boleto.boletoInfo;
}

// CAIXA, seção 4.2.4.6 e Anexo IV: 14/000000000000019, DV = 7.
// https://www.caixa.gov.br/Downloads/cobranca-caixa/ESP_COD_BARRAS_SIGCB_COBRANCA_CAIXA.pdf
for (const carteira of ['14', 14, 'RG']) {
	it(`Caixa (${carteira}) imprime prefixo + sequencial e calcula DV sobre 17 posições`, () => {
		const banco = new Bancos.Caixa();
		const boleto = criarBoleto(banco, carteira, '19');
		assert.equal(boleto.getBeneficiario().getNossoNumero(), '000000000000019');
		assert.equal(banco.getNossoNumeroFormatado(boleto.getBeneficiario()), '14000000000000019');
		assert.equal(boleto.getBeneficiario().getDigitoNossoNumero(), '7');
		assert.equal(banco.getNossoNumeroECodigoDocumento(boleto), '14000000000000019-7');
	});
}

it('Caixa admite DV zero e preserva zeros à esquerda', () => {
	const banco = new Bancos.Caixa();
	const boleto = criarBoleto(banco, '14', '000000000000003');
	assert.equal(banco.getNossoNumeroECodigoDocumento(boleto), '14000000000000003-0');
});

it('Caixa mantém o prefixo 24 do layout legado', () => {
	const banco = new Bancos.Caixa();
	for (const carteira of ['24', 'SR']) {
		const boleto = criarBoleto(banco, carteira, '900000000000132');
		assert.equal(banco.getNossoNumeroFormatado(boleto.getBeneficiario()), '24900000000000132');
	}
});

// TOTVS/Manual CECRED v07: conta (7) + DV da conta (1) + sequencial (9).
// https://tdn-homolog.totvs.com/pages/releaseview.action?pageId=421388567
it('Cecred imprime os 17 dígitos completos sem truncar conta ou zeros', () => {
	const banco = new Bancos.Cecred();
	const boleto = criarBoleto(banco, '09', '00123456000000123');
	assert.equal(banco.getNossoNumeroFormatado(boleto.getBeneficiario()), '00123456000000123');
	assert.equal(banco.getNossoNumeroECodigoDocumento(boleto), '00123456000000123');
	assert.equal(banco.geraCodigoDeBarrasPara(boleto).slice(19), '1234560012345600000012309');
});

it('Cecred mantém o sufixo opcional informado pela API existente', () => {
	const banco = new Bancos.Cecred();
	const boleto = criarBoleto(banco, '09', '00123456000000123', '8');
	assert.equal(banco.getNossoNumeroECodigoDocumento(boleto), '00123456000000123-8');
});

it('Cecred rejeita número incompleto, longo ou não numérico ao formatar', () => {
	const banco = new Bancos.Cecred();
	for (const numero of ['123', '100123456000000123', '0012345600000012X']) {
		const beneficiario = Beneficiario.novoBeneficiario().comNossoNumero(numero, banco);
		assert.throws(() => banco.getNossoNumeroFormatado(beneficiario), /17 dígitos/);
	}
});

for (const [Banco, carteira, numero, esperado] of [
	[Bancos.Caixa, '14', '19', '14000000000000019-7'],
	[Bancos.Cecred, '09', '00123456000000123', '00123456000000123']
]) {
	it(`${Banco.name} envia o Nosso Número completo aos campos do PDF`, async (t) => {
		const banco = new Banco();
		const boleto = criarBoleto(banco, carteira, numero);
		const codigoAntes = banco.geraCodigoDeBarrasPara(boleto);
		const originalText = Pdf.prototype.text;
		const campos = [];
		t.mock.method(Pdf.prototype, 'text', function(texto, x, y, options) {
			if (texto === esperado) {
				campos.push(texto);
				assert.ok(this.widthOfString(texto) <= options.width, 'O número deve caber no campo');
			}
			return originalText.call(this, texto, x, y, options);
		});
		const base64 = await new Gerador(boleto).gerarPDF({ base64: true });
		assert.ok(campos.length >= 2, 'Recibo e ficha de compensação devem conter o número completo');
		assert.equal(Buffer.from(base64, 'base64').subarray(0, 5).toString(), '%PDF-');
		assert.equal(banco.geraCodigoDeBarrasPara(boleto), codigoAntes);
	});
}
