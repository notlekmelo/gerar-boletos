# gerar-boletos

#### NPM badges
<!-- [START badges] -->
[![NPM gerar-boletos package](https://img.shields.io/npm/v/gerar-boletos.svg)](https://npmjs.org/package/gerar-boletos)
[![npm downloads](https://img.shields.io/npm/dm/gerar-boletos.svg?maxAge=604800)](https://npm-stat.com/charts.html?package=gerar-boletos&from=2017-01-1)
[![npm downloads](https://img.shields.io/npm/dt/gerar-boletos.svg?maxAge=604800)](https://npm-stat.com/charts.html?package=gerar-boletos&from=2017-01-1)
<!-- [END badges] -->

Biblioteca em Node.js para geração de boletos utilizando PDFKit 

Geração de boletos para bancos:
- Bradesco
- Caixa
- Ailos (Cecred)
- Itaú
- Sicoob
- Sicredi
- Santander
- Banco do Brasil

### Requisitos e desenvolvimento

Use Node.js `^20.19.0 || ^22.13.0 || >=24` (recomendado: Node.js 24 LTS).
A atualização do ESLint 10 exige essas versões; Node.js 10 não é mais suportado.

O projeto usa npm e versiona `package-lock.json` para instalações reproduzíveis.
O antigo `yarn.lock` foi removido para manter um único lockfile.

```sh
npm ci
npm test
npm run lint
npm audit
```

Os testes usam `node:test` e `node:assert`, sem Nodeunit. PDFKit e Moment usam
as versões estáveis atuais. `base64-stream` permanece em 1.0.0, a última estável.
O override de `crypto-js` foi removido porque o PDFKit atual não depende dele.
O override de `minimatch` em 11.0.5 ou superior corrige GHSA-g3hv-75wg-m249
na árvore de desenvolvimento do ESLint; ele deve ser revisto quando o ESLint
adotar essa versão diretamente.

As funções `pdfFile` e `pdfStream` resolvem após o destino terminar de gravar e
rejeitam em caso de erro. `StreamToPromise` (com iniciais maiúsculas) também
aceita streams de escrita já finalizados e propaga erros. Cada geração de PDF
usa suas próprias opções, sem reutilizar o stream de uma geração anterior.

Os dados dos testes bancários foram atualizados para informar conta e dígito
do beneficiário. Foram corrigidas a preservação dos 15 dígitos do nosso número
da Caixa e dos 17 dígitos do Cecred, quando o banco é informado a
`comNossoNumero`, e a validação do limite de locais de pagamento recebidos
como array. Testes automatizados não substituem
a homologação dos boletos com os respectivos bancos.

### Nosso Número: Caixa SIGCB e Cecred/Ailos

Para a **Caixa SIGCB**, informe em `dadosBancarios.nossoNumero` o sequencial de
até 15 dígitos, sem prefixo e sem DV. A biblioteca completa os zeros à esquerda,
acrescenta o prefixo da carteira (`14`, ou `RG`, para registrada com emissão pelo
beneficiário) e calcula o DV módulo 11 sobre as 17 posições. O campo impresso
inclui o prefixo: sequencial `19`, carteira `14` → `14000000000000019-7`.
O prefixo legado `24`/`SR` continua sendo preservado.

Para o **Cecred/Ailos**, a API existente recebe em `dadosBancarios.nossoNumero`
o número **completo como string de 17 dígitos**: conta (7) + DV da conta (1) +
sequencial (9). Exemplo: `0012345` + `6` + `000000123` → `00123456000000123`.
Esses 17 dígitos são impressos integralmente, sem truncamento. A API não monta
essa composição automaticamente a partir de um sequencial de 9 dígitos.
Se `nossoNumeroDigito` for fornecido, o sufixo opcional legado continua sendo
exibido separadamente; ele não substitui o DV da conta que integra os 17 dígitos.

Referências usadas para esta correção:

- [Caixa — especificação SIGCB](https://www.caixa.gov.br/Downloads/cobranca-caixa/ESP_COD_BARRAS_SIGCB_COBRANCA_CAIXA.pdf), seção 4.2.4.6 e Anexo IV (exemplo `14/000000000000019`, DV `7`).
- [TOTVS — geração do Nosso Número](https://tdn-homolog.totvs.com/pages/releaseview.action?pageId=421388567), seção Banco Cecred 085, baseada no manual CECRED CNAB 240 v07/2016.

### Install

```javascript
npm i gerar-boletos
```
### Exemplos de uso

```javascript
npm run gerarBrasil
```
```javascript
npm run gerarBradesco
```
```javascript
npm run gerarCecred
```

* [pasta com arquivos de exemplo](/examples)

### Run tests

```javascript
npm run test
```


