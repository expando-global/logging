// import test from 'ava';
// import { composePayload, postToNewRelic } from './new-relic-collector';
// import { LogLevel, LogMessage } from '../index';
// import nock from 'nock';

import test from 'ava';

test('UNCOMMENT THIS TEST FILE ONCE YOU HAVE A COLLECTOR', (t) => {
    t.pass();
});

// test('get payload from log messages', (t) => {
//     const log: LogMessage[] = [
//         {
//             message: 'aefw',
//             data: {
//                 a: 1,
//             },
//             level: LogLevel.INFO,
//         },
//     ];
//     const expectedPayload = {
//         common: { attributes: { service: 'order-service' } },
//         logs: [
//             {
//                 message: 'aefw',
//                 data: { a: 1 },
//                 level: LogLevel.INFO,
//                 logtype: 'INFO',
//             },
//         ],
//     };
//     t.deepEqual(composePayload(log), expectedPayload);
// });

// test('warning on 400 and 403 error code', async (t) => {
//     // nock.recorder.rec();
//     nock('https://log-api.eu.newrelic.com:443', { encodedQueryParams: true })
//         .post('/log/v1', [
//             {
//                 common: { attributes: { service: 'order-service' } },
//                 logs: [
//                     {
//                         timestamp: 123,
//                         message: 'aefw',
//                         data: { a: 1 },
//                         level: 'INFO',
//                         logtype: 'INFO',
//                     },
//                 ],
//             },
//         ])
//         .reply(403, {}, [
//             'Content-Type',
//             'application/json; charset=UTF-8',
//             'Content-Length',
//             '2',
//             'Access-Control-Allow-Methods',
//             'GET, POST, PUT, HEAD, OPTIONS',
//             'Access-Control-Allow-Credentials',
//             'true',
//             'Access-Control-Allow-Origin',
//             '*',
//             'Connection',
//             'close',
//         ]);

//     const log: LogMessage[] = [
//         {
//             message: 'aefw',
//             data: {
//                 a: 1,
//             },
//             level: LogLevel.INFO,
//         },
//     ];
//     const payload = composePayload(log);
//     await postToNewRelic(payload);

//     nock('https://log-api.eu.newrelic.com:443', { encodedQueryParams: true })
//         .post('/log/v1', [
//             {
//                 common: { attributes: { service: 'order-service' } },
//                 logs: [
//                     {
//                         timestamp: 123,
//                         message: 'aefw',
//                         data: { a: 1 },
//                         level: 'INFO',
//                         logtype: 'INFO',
//                     },
//                 ],
//             },
//         ])
//         .reply(400, {}, [
//             'Content-Type',
//             'application/json; charset=UTF-8',
//             'Content-Length',
//             '2',
//             'Access-Control-Allow-Methods',
//             'GET, POST, PUT, HEAD, OPTIONS',
//             'Access-Control-Allow-Credentials',
//             'true',
//             'Access-Control-Allow-Origin',
//             '*',
//             'Connection',
//             'close',
//         ]);

//     await postToNewRelic(payload);
//     t.pass();
// });

// test('throws error on other than 400 and 403 errors', async (t) => {
//     // nock.recorder.rec();
//     nock('https://log-api.eu.newrelic.com:443', { encodedQueryParams: true })
//         .post('/log/v1', [
//             {
//                 common: { attributes: { service: 'order-service' } },
//                 logs: [
//                     {
//                         timestamp: 123,
//                         message: 'aefw',
//                         data: { a: 1 },
//                         level: 'INFO',
//                         logtype: 'INFO',
//                     },
//                 ],
//             },
//         ])
//         .reply(500, {}, [
//             'Content-Type',
//             'application/json; charset=UTF-8',
//             'Content-Length',
//             '2',
//             'Access-Control-Allow-Methods',
//             'GET, POST, PUT, HEAD, OPTIONS',
//             'Access-Control-Allow-Credentials',
//             'true',
//             'Access-Control-Allow-Origin',
//             '*',
//             'Connection',
//             'close',
//         ]);
//     t.pass();
// });
