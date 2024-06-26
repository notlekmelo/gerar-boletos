const Boleto = require('../utils/functions/boletoUtils');

module.exports = class BoletoStringify {
    static enderecoPagador({ logradouro, bairro, cidade, estadoUF, cep }) {
      return Boleto.Endereco.novoEndereco()
        .comLogradouro(logradouro)
        .comBairro(bairro)
        .comCidade(cidade)
        .comUf(estadoUF)
        .comCep(cep);
    }
  
    static createPagador({ endereco, nome, registroNacional }) {
      const enderecoPagador = this.enderecoPagador(endereco);
      return Boleto.Pagador.novoPagador()
        .comNome(nome)
        .comRegistroNacional(registroNacional)
        .comEndereco(enderecoPagador);
    }
  
    static createBeneficiario({ dadosBancarios, endereco, cnpj, nome },banco,data) {
      const enderecoBeneficiario = this.enderecoPagador(endereco);
  
      let novoBeneficiario = Boleto.Beneficiario.novoBeneficiario()
        .comNome(nome)
        .comRegistroNacional(cnpj)
        .comCarteira(dadosBancarios.carteira)
        .comAgencia(dadosBancarios.agencia)
        .comDigitoAgencia(dadosBancarios.agenciaDigito)
        .comCodigoBeneficiario(dadosBancarios.codigo)
        .comDigitoCodigoBeneficiario(dadosBancarios.digitoCodigoBeneficiario)
        .comConta(dadosBancarios.conta)
        .comDigitoConta(dadosBancarios.contaDigito)
        .comNumeroConvenio(dadosBancarios.convenio)
        .comNossoNumero(dadosBancarios.nossoNumero,banco) //11 -digitos // "00000005752"
        .comDigitoNossoNumero(dadosBancarios.nossoNumeroDigito,banco,data) // Digito a ser calculado
        .comEndereco(enderecoBeneficiario);
  
      return novoBeneficiario;
    }
  
    static createInstrucoes(instrucoes) {
      if (!Array.isArray(instrucoes)) {
        return [instrucoes];
      }
      return instrucoes;
    }
  };