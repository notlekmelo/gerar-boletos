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
  return 11 - resto == 10 ? 'P' : 11 - resto; 
}

module.exports.digitoVerificadorItau = function(agencia, conta, carteira, nossoNumero) {
  const numeroCalculo = agencia.toString().padStart(4, '0') + conta.toString().padStart(5, '0')
                          + carteira.toString().padStart(3, '0') + nossoNumero.toString().padStart(2, '0');
  return GeradorDeDigitoPadrao.mod10(numeroCalculo);
}