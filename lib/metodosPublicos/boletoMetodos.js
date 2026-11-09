const fs = require('fs');
const Boleto = require('../utils/functions/boletoUtils');
const BoletoStringify = require('../stringify/boletoStringify');

module.exports = class Boletos {
  constructor({ banco, pagador, boleto, beneficiario, instrucoes }) {
    this.banco = banco;
    this.pagador = pagador;
    this.boleto = boleto;
    this.beneficiario = beneficiario;
    this.instrucoes = instrucoes;
    this.boletoInfo;
  }

  gerarBoleto() {
    const dataInstance = Boleto.Datas;
    const { datas, valor, especieDocumento, numeroDocumento, localPagamento } = this.boleto;

    this.boletoInfo = Boleto.Boleto.novoBoleto()
      .comDatas(dataInstance.novasDatas()
        .comVencimento(datas.vencimento)
        .comProcessamento(datas.processamento)
        .comDocumento(datas.documentos))
      .comBeneficiario(BoletoStringify.createBeneficiario(this.beneficiario, this.banco,datas.processamento))
      .comPagador(BoletoStringify.createPagador(this.pagador))
      .comBanco(this.banco)
      .comValorBoleto(parseFloat(valor).toFixed(2))
      .comNumeroDoDocumento(numeroDocumento)
      .comEspecieDocumento(especieDocumento)
      .comLocaisDePagamento(localPagamento)
      .comInstrucoes(BoletoStringify.createInstrucoes(this.instrucoes));
  }

  pdfFile(nomeArquivo) {
    const stream = fs.createWriteStream(nomeArquivo);

    return new Boleto.Gerador(this.boletoInfo).gerarPDF({
      creditos: '',
      stream,
    }).then(() => ({ boleto: this.boleto, stream }));
  }

  pdfStream(stream) {
    return new Boleto.Gerador(this.boletoInfo).gerarPDF({
      creditos: '',
      stream,
    }).then(() => ({ boleto: this.boleto, stream }));
  }
};