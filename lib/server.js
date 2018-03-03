'use strict';

const fastify = require('fastify');
const Sector = require('sector-client');
const config = require('./config');
const pino = require('pino');

const sec = new Sector();
const log = pino();
const app = fastify();


/**
 * Arm methods
 */

const armPartial = async () => {
    const login = await sec.login(config.get('sectUsername'), config.get('sectPassword'));
    log.info(`/arm/partial - login was ${login.status}`);

    const system = await sec.system();
    log.info(`/arm/partial - status at alarm with id ${system[0].PanelId} is ${system[0].ArmedStatus}`);

    if (system[0].ArmedStatus === 'disarmed') {
        const armed = await sec.armPartial(system[0].PanelId, config.get('sectKey'));
        log.info(`/arm/partial - set alarm with id ${system[0].PanelId} to status ${armed.panelData.ArmedStatus}`);
    } else {
        log.info(`/arm/partial - did not change status of alarm with id ${system[0].PanelId}`);
    }

    const logoff = await sec.logoff();
    log.info(`/arm/partial - logoff was ${logoff.status}`);
};

const armTotal = async () => {
    const login = await sec.login(config.get('sectUsername'), config.get('sectPassword'));
    log.info(`/arm/total - login was ${login.status}`);

    const system = await sec.system();
    log.info(`/arm/total - status at alarm with id ${system[0].PanelId} is ${system[0].ArmedStatus}`);

    if (system[0].ArmedStatus === 'disarmed') {
        const armed = await sec.armTotal(system[0].PanelId, config.get('sectKey'));
        log.info(`/arm/total - set alarm with id ${system[0].PanelId} to status ${armed.panelData.ArmedStatus}`);
    } else {
        log.info(`/arm/total - did not change status of alarm with id ${system[0].PanelId}`);
    }

    const logoff = await sec.logoff();
    log.info(`/arm/total - logoff was ${logoff.status}`);
};


/**
 * Http routes
 */

app.get('/status', async (req, rep) => {
    rep.type('application/json').code(200);
    await sec.login(config.get('sectUsername'), config.get('sectPassword'));
    const status = await sec.status();
    await sec.logoff();
    return { status: status.Panel.ArmedStatus };
});

app.get('/arm/partial', async (req, rep) => {
    if (req.query.key !== config.get('apiKey')) {
        const err = new Error();
        err.statusCode = 403;
        err.message = 'Forbidden';
        throw err;
    }

    armPartial();

    rep.type('text/plain').code(200);
    return 'OK';
});

app.get('/arm/total', async (req, rep) => {
    if (req.query.key !== config.get('apiKey')) {
        const err = new Error();
        err.statusCode = 403;
        err.message = 'Forbidden';
        throw err;
    }

    armTotal();

    rep.type('text/plain').code(200);
    return 'OK';
});


/**
 * Start app
 */

app.listen(config.get('httpServerPort'), (error) => {
    if (error) throw error;
    log.info(`server listening on ${app.server.address().port}`);
});
