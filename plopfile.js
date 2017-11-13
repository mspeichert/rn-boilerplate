const fs = require('fs');
const path = require('path');
const inquirerRecursive = require('inquirer-recursive');

const TEMPLATES_PATH = 'plop-templates';

module.exports = function (plop) {
    const propTypesList = [
        'array',
        'bool',
        'func',
        'number',
        'object',
        'string',
        'symbol',
        'node',
        'element',
    ];

    plop.setWelcomeMessage('What would you like to generate?');
    plop.addPrompt('recursive', inquirerRecursive);

    /**
     * Scene generator
     */
    plop.setGenerator('scene', {
        description: 'is a basic view of application',
        prompts: [
            {
                type: 'input',
                name: 'name',
                message: 'enter name',
                validate: nameRequired,
            }
        ],
        actions: [
            ...addManyTemplates('scenes'),
            {
                type: 'modify',
                path: 'src/i18n/locales/en.js',
                pattern: /(\/\*DONT-REMOVE--end-of-data\*\/)/g,
                template: getLanguageExample()
            }
        ]
    });

    /**
     * Component generator
     */
    plop.setGenerator('component', {
        description: 'is a building block',
        prompts: [
            {
                type: 'input',
                name: 'name',
                message: 'enter name',
                validate: nameRequired,
            },
            {
                type: 'recursive',
                message: 'Add a new props?',
                name: 'props',
                prompts: [
                    {
                        type: 'input',
                        name: 'name',
                        message: 'Enter prop name',
                        validate: nameRequired,
                    },
                    {
                        type: 'list',
                        name: 'type',
                        message: 'Select prop type',
                        choices: propTypesList,
                        pageSize: propTypesList.length
                    },
                    {
                        type: 'confirm',
                        name: 'required',
                        message: 'Is required?'
                    }
                ]
            }],
        actions: addManyTemplates('components')
    });

    /**
     * Services generator
     */
    plop.setGenerator('service', {
        description: 'is responsible for serves specific functionality',
        prompts: [
            {
                type: 'input',
                name: 'name',
                message: 'enter name',
                validate: nameRequired,
            }
        ],
        actions: [
            ...addManyTemplates('services'),
        ]
    });
};

function addManyTemplates(dir) {
    const templatesDir = path.join(TEMPLATES_PATH, dir);
    const templatesFiles = fs.readdirSync(templatesDir);

    return templatesFiles.map((template) => {
        const templateNameWithoutExtension = path.parse(template).name;

        return {
            type: 'add',
            templateFile: path.join(templatesDir, `${template}`),
            path: `src/${dir}/{{pascalCase name}}/${templateNameWithoutExtension}.js`,
        }
    });
}

function getLanguageExample() {
    return `{{camelCase name}}: {
        title: '{{camelCase name}}',
        example: 'Lorem ipsum dolor sit amet.',
    },
    $1`;
}

function nameRequired(value) {
    if ((/.+/).test(value)) {
        return true;
    }
    return 'name is required';
}