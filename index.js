#!/usr/bin/env node

// Required packages:
ejs = require('ejs');
fs = require('fs-extra');
path = require('path');
funks = require(path.resolve(__dirname, 'funks.js'));
program = require('commander');
replace = require('replace-in-file');


// Parse command-line-arguments:
program
  .version('1.0.0')
  .option('--modelFile <modelFilePath>',
    'The valid file path to your model file')
  .option('--migrationFile <migrationFilePath>',
    'The valid file path to your migration file')
  .option('--name <modelName>',
    'The name of the model as provided to \'sequelize model:create\'.')
  .option(
    '--associations <ModelName:associationType, ModelName2:associationType2 ...>',
    'ModelName as instantiated in Sequelize and associationType one of belongsTo, hasOne, hasMany'
  ).parse(process.argv);


// Execute:
console.log('modelFile: %s, migrationFile:%s, name: %s, associations: %s',
  program.modelFile, program.migrationFile, program.name, program.associations
);
// Generate the JavaScript to be inserted:
var ejbOpts = {
  name: program.name,
  nameLc: program.name.toLowerCase(),
  associationsArr: funks.associationsArray(program.associations)
}

// Insert the above generated JavaScript:
// - in the model file
modelJs = funks.generateJs('model', ejbOpts);
replace({
  files: program.modelFile,
  from: /\/\/ associations can be defined here/,
  to: modelJs
}).catch(function(error) {
  console.error("Error occurred changing the model file:", error)
})

// - in the migration file
migrationJs = funks.generateJs('migration', ejbOpts);
if (migrationJs !== '') {
  replace({
    files: program.migrationFile,
    from: /\s+createdAt:/,
    to: "\n" + migrationJs + ',\ncreatedAt:'
  }).catch(function(error) {
    console.error("Error occurred changing the migration file:", error)
  })
}
