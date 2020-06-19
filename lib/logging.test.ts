import test from 'ava';
import { LogLevel, LogMessage, mapArgsToMessage } from './index';
import timekeeper from 'timekeeper';
import nock from 'nock';
// import { LogsQueue, collectLog, collectLogs } from './collectors/new-relic-collector';

test('map error to log', (t) => {
    const now = new Date('2020-03-28T16:33:50.000Z');
    timekeeper.freeze(now);

    const error = new Error('errorrissimo');

    // Error
    t.is(mapArgsToMessage(error).message, 'errorrissimo');
    t.is(mapArgsToMessage(error).data, undefined);
    t.is(typeof mapArgsToMessage(error).stackTrace, 'string');
});
test('map string and error to log', (t) => {
    const now = new Date('2020-03-28T16:33:50.000Z');
    timekeeper.freeze(now);
    const string1 = 'first logged message';

    const error = new Error('errorrissimo');

    // string, Error
    t.is(mapArgsToMessage(string1, error).message, 'first logged message');
    t.is(mapArgsToMessage(string1, error).data, undefined);
    t.is(typeof mapArgsToMessage(string1, error).stackTrace, 'string');
});

test('map error and string to log', (t) => {
    const now = new Date('2020-03-28T16:33:50.000Z');
    timekeeper.freeze(now);
    const string1 = 'first logged message';

    const error = new Error('errorrissimo');

    // Error, string
    t.is(
        mapArgsToMessage(error, string1).message,
        'errorrissimo first logged message',
    );
    t.is(mapArgsToMessage(error, string1).data, undefined);
    t.is(typeof mapArgsToMessage(error, string1).stackTrace, 'string');
});

test('map string and object to log', (t) => {
    const now = new Date('2020-03-28T16:33:50.000Z');
    timekeeper.freeze(now);
    const string1 = 'first logged message';
    const dataObj1 = {
        a: 1,
        b: 'wef',
    };

    // string, object
    t.deepEqual(
        mapArgsToMessage(string1, dataObj1).message,
        'first logged message',
    );
    t.deepEqual(mapArgsToMessage(string1, dataObj1).data, dataObj1);
});

test('map object and string to log', (t) => {
    const now = new Date('2020-03-28T16:33:50.000Z');
    timekeeper.freeze(now);
    const string1 = 'first logged message';
    const dataObj1 = {
        a: 1,
        b: 'wef',
    };

    // object, string
    t.deepEqual(
        mapArgsToMessage(dataObj1, string1).message,
        'first logged message',
    );
    t.deepEqual(mapArgsToMessage(dataObj1, string1).data, dataObj1);
});

test('map object to log', (t) => {
    const now = new Date('2020-03-28T16:33:50.000Z');
    timekeeper.freeze(now);
    const dataObj1 = {
        a: 1,
        b: 'wef',
    };

    // object
    t.deepEqual(mapArgsToMessage(dataObj1), {
        data: dataObj1,
    });
});

test('map two objects to log', (t) => {
    const now = new Date('2020-03-28T16:33:50.000Z');
    timekeeper.freeze(now);
    const dataObj1 = {
        a: 1,
        b: 'wef',
    };

    const dataObj2 = {
        c: 'ASFS',
        d: new Date(),
    };

    // object, object
    t.deepEqual(mapArgsToMessage(dataObj1, dataObj2), {
        data: [dataObj1, dataObj2],
    });
});

test('map error and object to log', (t) => {
    const now = new Date('2020-03-28T16:33:50.000Z');
    timekeeper.freeze(now);
    const error = new Error('errorrissimo');

    const dataObj1 = {
        a: 1,
        b: 'wef',
    };

    // error, object
    t.is(mapArgsToMessage(error, dataObj1).message, 'errorrissimo');
    t.is(mapArgsToMessage(error, dataObj1).data, dataObj1);
    t.is(typeof mapArgsToMessage(error, dataObj1).stackTrace, 'string');
});

test('map object and error to log message', async (t) => {
    const now = new Date('2020-03-28T16:33:50.000Z');
    timekeeper.freeze(now);
    const dataObj1 = {
        a: 1,
        b: 'wef',
    };

    const error = new Error('errorrissimo');

    // object, error
    t.is(mapArgsToMessage(dataObj1, error).message, 'errorrissimo');
    t.is(mapArgsToMessage(dataObj1, error).data, dataObj1);
    t.is(typeof mapArgsToMessage(dataObj1, error).stackTrace, 'string');
});

// test('send logs to new relic', async (t) => {
//     const logMessages: LogMessage[] = [
//         {
//             timestamp: 123,
//             message: 'aefw',
//             data: { a: 1 },
//             level: LogLevel.INFO,
//         },
//         {
//             timestamp: 321,
//             message: 'asdfasdf',
//             data: { b: 2 },
//             level: LogLevel.WARN,
//         },
//     ];
//     // nock.recorder.rec();

//     nock('https://log-api.eu.newrelic.com:443', { encodedQueryParams: true })
//         .post('/log/v1', [
//             {
//                 common: {
//                     attributes: {
//                         service: 'order-service',
//                     },
//                 },
//                 logs: [
//                     {
//                         timestamp: 123,
//                         message: 'aefw',
//                         data: {
//                             a: 1,
//                         },
//                         level: 'INFO',
//                         logtype: 'INFO',
//                     },
//                     {
//                         timestamp: 321,
//                         message: 'asdfasdf',
//                         data: {
//                             b: 2,
//                         },
//                         level: 'WARN',
//                         logtype: 'WARN',
//                     },
//                 ],
//             },
//         ])
//         .reply(202, { requestId: 'f27a9532-0021-b000-0000-017218bf48e4' }, [
//             'Content-Type',
//             'application/json; charset=UTF-8',
//             'Content-Length',
//             '52',
//             'Access-Control-Allow-Methods',
//             'GET, POST, PUT, HEAD, OPTIONS',
//             'Access-Control-Allow-Credentials',
//             'true',
//             'Access-Control-Allow-Origin',
//             '*',
//             'Connection',
//             'close',
//         ]);

//     await collectLogs(logMessages);
//     t.pass();
// });

// test('register log to send', (t) => {
//     const logMessage: LogMessage = {
//         timestamp: 321,
//         level: LogLevel.ERROR,
//         message: 'sfsfsfsf',
//     };

//     // Log about mounting custom logger
//     t.is(LogsQueue.length, 1);
//     collectLog(logMessage);
//     t.is(LogsQueue.length, 2);
// });
