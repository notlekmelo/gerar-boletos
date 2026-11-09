const js = require('@eslint/js');
const globals = require('globals');

module.exports = [
	{ ignores: ['node_modules/**', '.vs/**', 'tmp/**'] },
	js.configs.recommended,
	{
		languageOptions: {
			sourceType: 'commonjs',
			globals: globals.node
		},
		rules: {
			'linebreak-style': ['error', 'unix'],
			quotes: ['error', 'single'],
			semi: ['error', 'always']
		}
	}
];
