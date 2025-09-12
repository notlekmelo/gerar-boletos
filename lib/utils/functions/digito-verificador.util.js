const GeradorDeDigitoPadrao = require('../../boleto/gerador-de-digito-padrao');

module.exports.digitoVerificadorBradesco = function(carteira, nossoNumero) {
  const numeroCalculo = carteira.toString().padStart(2, '0') + nossoNumero.toString().padStart(11, '0')
  let aux = 2;
  let soma = 0;
  for (let i = numeroCalculo.length - 1; i >= 0; i--) {
    soma += Number(numeroCalculo[i]) * aux;
    aux++;
    if (aux == 8) {
      aux = 2
    }
  }
  const resto = soma % 11
  const subtracao = 11 - resto;
  switch (subtracao) {
    case 10: return 'P'
    case 11: return 0
    default: return subtracao;
  }
}

module.exports.digitoVerificadorItau = function(agencia, conta, carteira, nossoNumero) {
  const numeroCalculo = agencia.toString().padStart(4, '0') + conta.toString().padStart(5, '0')
                          + carteira.toString().padStart(3, '0') + nossoNumero.toString().padStart(2, '0');
  return GeradorDeDigitoPadrao.mod10(numeroCalculo);
}