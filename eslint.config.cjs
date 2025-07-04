const js = require('@eslint/js');
const react = require('eslint-plugin-react');

module.exports = [
    js.configs.recommended,
    {
        plugins: {
            react,
        },
        languageOptions: {
            ecmaVersion: 2021,
            sourceType: 'module',
            parserOptions: {
                ecmaFeatures: {
                    jsx: true,
                },
            },
            globals: {
                React: 'writable',
                require: 'readonly',
                console: 'readonly',
                Alert: 'readonly',
                setTimeout: 'readonly',
                clearTimeout: 'readonly',
            },
        },
        settings: {
            react: {
                version: 'detect',
            },
        },
        rules: {
            // 1️⃣ Methoden dürfen max. 30 Zeilen lang sein
            'max-lines-per-function': ['warn', {
                max: 30,
                skipBlankLines: true,
                skipComments: true,
            }],

            // 2️⃣ Variablen und Methoden müssen camelCase sein
            'camelcase': ['error', { properties: 'never' }],

            // 3️⃣ JSX-Komponenten müssen PascalCase sein
            'react/jsx-pascal-case': ['error'],

            // ❌ Alles andere deaktiviert
            'no-undef': 'off',
            'no-unused-vars': 'off',
        },
    }
];
