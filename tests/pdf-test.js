const { it } = require('node:test');
const assert = require('node:assert/strict');
const { Writable, PassThrough } = require('node:stream');
const { mkdtemp, readFile, rm } = require('node:fs/promises');
const { tmpdir } = require('node:os');
const path = require('node:path');
const { Bancos, Boletos, StreamToPromise } = require('../lib');
const PdfGerador = require('../lib/pdf-gerador');
const { Gerador, Beneficiario } = require('../lib/utils/functions/boletoUtils');

function criarBoleto() {
	const boleto = new Boletos({
		banco: new Bancos.Bradesco(),
		pagador: { nome: 'Pagador de teste', registroNacional: '97264269604', endereco: {} },
		beneficiario: {
			nome: 'Beneficiário de teste', cnpj: '19950366000150', endereco: {},
			dadosBancarios: {
				carteira: '06', agencia: '2949', agenciaDigito: '1', conta: '6580',
				contaDigito: '3', codigo: '6580', digitoCodigoBeneficiario: '3',
				convenio: '1207113', nossoNumero: '3', nossoNumeroDigito: '7'
			}
		},
		instrucoes: [],
		boleto: {
			numeroDocumento: '4323', especieDocumento: 'DM', valor: 1,
			datas: { vencimento: '02-04-2020', processamento: '02-04-2020', documentos: '02-04-2020' }
		}
	});
	boleto.gerarBoleto();
	return boleto;
}

function verificarPdf(buffer) {
	assert.equal(buffer.subarray(0, 5).toString(), '%PDF-');
	assert.match(buffer.subarray(-100).toString(), /startxref\s+\d+\s+%%EOF/);
	assert.ok(buffer.length > 1000);
}

it('PDFKit gera um arquivo completo antes de pdfFile resolver', async () => {
	const directory = await mkdtemp(path.join(tmpdir(), 'gerar-boletos-'));
	try {
		const filename = path.join(directory, 'boleto.pdf');
		const { stream } = await criarBoleto().pdfFile(filename);
		assert.ok(stream.writableFinished);
		verificarPdf(await readFile(filename));
		assert.equal(await StreamToPromise(stream), stream);
	} finally {
		await rm(directory, { recursive: true, force: true });
	}
});

it('PDFKit gera base64 e stream legível completos', async () => {
	const boleto = criarBoleto().boletoInfo;
	const base64 = await new Gerador(boleto).gerarPDF({ base64: true });
	verificarPdf(Buffer.from(base64, 'base64'));
	const stream = await new Gerador(boleto).gerarPDF();
	const chunks = [];
	for await (const chunk of stream) chunks.push(chunk);
	verificarPdf(Buffer.concat(chunks));
});

it('pdfStream aguarda a finalização do destino', async () => {
	let finalized = false;
	const chunks = [];
	const stream = new Writable({
		write(chunk, encoding, callback) { chunks.push(chunk); callback(); },
		final(callback) { setImmediate(() => { finalized = true; callback(); }); }
	});
	await criarBoleto().pdfStream(stream);
	assert.ok(finalized);
	assert.ok(stream.writableFinished);
	verificarPdf(Buffer.concat(chunks));
});

for (const api of ['Boletos', 'PdfGerador']) {
	it(`${api}.pdfStream propaga falhas de escrita`, async () => {
		const error = new Error('Falha de escrita de teste');
		const stream = new Writable({ write(chunk, encoding, callback) { callback(error); } });
		const boleto = criarBoleto();
		const gerador = api === 'Boletos' ? boleto : new PdfGerador(boleto.boletoInfo);
		await assert.rejects(gerador.pdfStream(stream), error);
	});
}

it('pdfFile propaga falhas ao abrir o destino', async () => {
	const directory = await mkdtemp(path.join(tmpdir(), 'gerar-boletos-'));
	try {
		await assert.rejects(criarBoleto().pdfFile(directory), { code: 'EISDIR' });
	} finally {
		await rm(directory, { recursive: true, force: true });
	}
});

it('streamToPromise rejeita quando o stream falha', async () => {
	const stream = new PassThrough();
	const error = new Error('Falha de stream de teste');
	const completion = StreamToPromise(stream);
	stream.destroy(error);
	await assert.rejects(completion, error);
});

for (const [Banco, nossoNumero] of [
	[Bancos.Caixa, '900000000000132'],
	[Bancos.Cecred, '00115290000000004']
]) {
	it(`${Banco.name} preserva os dígitos do nosso número`, () => {
		const beneficiario = Beneficiario.novoBeneficiario().comNossoNumero(nossoNumero, new Banco());
		assert.equal(beneficiario.getNossoNumero(), nossoNumero);
	});
}
