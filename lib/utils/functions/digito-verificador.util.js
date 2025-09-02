const GeradorDeDigitoPadrao = require('../../boleto/gerador-de-digito-padrao');

export function digitoVerificadorBradesco(carteira, nossoNumero) {
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
  return 11 - resto; 
}

export function digitoVerificadorItau(agencia, conta, carteira, nossoNumero) {
  const numeroCalculo = pad(agencia, 4, '0') + pad(conta,5,'0') + pad(carteira,3,'0') + pad(nossoNumero,8,'0');
  return GeradorDeDigitoPadrao.mod10(numeroCalculo);
}