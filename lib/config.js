'use strict';

const path = require('path');
const fs = require('fs');
const convict = require('convict');
const pckage = require('../package.json');


const conf = convict({
    env: {
        doc: 'Applicaton environments',
        format: ['development', 'production'],
        default: 'development',
        env: 'NODE_ENV',
        arg: 'node-env'
    },

    name: {
        doc: 'Name of the application',
        format: '*',
        default: pckage.name
    },

    version: {
        doc: 'Version of the application',
        format: '*',
        default: pckage.version
    },

    httpServerPort: {
        doc: 'The port the http server should bind to',
        format: 'port',
        default: 9100,
        env: 'PORT',
        arg: 'port'
    },

    httpServerHost: {
        doc: 'The host the http server should bind to',
        format: String,
        default: '0.0.0.0',
        env: 'HOST',
        arg: 'host'
    },


    sectUsername: {
        doc: 'Username to the alarm account',
        format: String,
        default: '',
        env: 'SECT_USERNAME'
    },

    sectPassword: {
        doc: 'Password to the alarm account',
        format: String,
        default: '',
        env: 'SECT_PASSWORD'
    },

    sectKey: {
        doc: 'Key to the alarm',
        format: String,
        default: '',
        env: 'SECT_KEY'
    },

    apiKey: {
        doc: 'API key used in routes',
        format: String,
        default: '',
        env: 'API_KEY'
    }
});



// Load and validate configuration depending on environment

if (fs.existsSync(path.resolve(__dirname, '../config/local.json'))) {
    conf.loadFile([path.resolve(__dirname, '../config/', `${conf.get('env')}.json`), path.resolve(__dirname, '../config/local.json')]);
} else {
    conf.loadFile([path.resolve(__dirname, '../config/', `${conf.get('env')}.json`)]);
}

conf.validate();

module.exports = conf;
