module.exports = {
	root: true,
	env: { browser: true, es2020: true },
	extends: [
		'eslint:recommended',
		'plugin:react/recommended',
		'plugin:react/jsx-runtime',
		'plugin:react-hooks/recommended',
		'plugin:@typescript-eslint/recommended', // Add TypeScript support
	],
	ignorePatterns: ['dist', '.eslintrc.cjs'],
	parser: '@typescript-eslint/parser', // Specify the TypeScript parser
	parserOptions: {
		ecmaVersion: 'latest',
		sourceType: 'module',
		ecmaFeatures: {
			jsx: true, // Enable JSX parsing
		},
	},
	settings: { react: { version: '18.2' } },
	plugins: ['react-refresh', '@typescript-eslint'], // Add TypeScript plugin
	rules: {
		'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
		'no-console': ['warn', { allow: ['warn', 'error', 'info'] }],
		'prefer-const': 'error',
		'no-irregular-whitespace': 'off',
		'no-unused-expressions': 'off',
		'@typescript-eslint/no-unused-expressions': 'off',
		'no-unused-vars': [
			'warn',
			{
				args: 'none',
				caughtErrors: 'none',
				vars: 'local',
			},
		],
		'@typescript-eslint/no-unused-vars': [
			'warn',
			{
				args: 'none',
				caughtErrors: 'none',
				vars: 'local',
			},
		],
		'no-empty': ['error', { allowEmptyCatch: true }],
	},
};
