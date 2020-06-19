// import _ from 'lodash';
// import got from 'got';
// import { LogMessage } from '..';
// import { LoggingHealth } from './logging-health';

// const newRelicConfig = require('../../../../newrelic').config;
// const { license_key } = newRelicConfig;
// const [app_name] = newRelicConfig.app_name;

// const LOGS_BULK_SIZE = parseInt(process.env.LOGS_BULK_SIZE || '100');
// const SEND_LOGS_AFTER_MS = parseInt(process.env.SEND_LOGS_AFTER_MS || '1000');

// interface IPayload {
//     common: {
//         attributes: {
//             service: string;
//         };
//     };
//     logs: LogMessage[];
// }

// export async function postToNewRelic(payload: IPayload) {
//     try {
//         await got.post('https://log-api.eu.newrelic.com/log/v1', {
//             headers: {
//                 'X-License-Key': license_key,
//             },
//             body: JSON.stringify([payload]),
//             retry: { retries: 1 },
//         });
//         LoggingHealth.heartbeat('OK', payload.logs.length);
//     } catch (e) {
//         if (_.inRange(e?.statusCode, 400, 500)) {
//             // 4xx — Bad Request, let's consider this unrecoverable
//             // (413 should not happen due to chunking)
//             LoggingHealth.heartbeat(
//                 'DEAD',
//                 payload.logs.length,
//                 e?.toString(),
//             );
//         } else if (_.inRange(e?.statusCode, 500, 510)) {
//             // 50x — NR Internal Error, we should be able to send these later
//             LoggingHealth.heartbeat(
//                 'TEMPORARY_FAILURE',
//                 payload.logs.length,
//                 e?.toString(),
//             );
//             putBackForCollectionRetry(payload.logs);
//         }
//     }
// }

// function addLogtype(message: LogMessage) {
//     return {
//         ...message,
//         logtype: message.level,
//     };
// }

// export function composePayload(logMessages: LogMessage[]): IPayload {
//     return {
//         common: {
//             attributes: {
//                 service: app_name,
//             },
//         },
//         logs: logMessages.map(addLogtype),
//     };
// }

// export async function collectLogs(logMessages: LogMessage[]) {
//     if (!license_key) return;

//     await postToNewRelic(composePayload(logMessages));
// }

// /** Main buffer for log messages that should be sent to NR */
// export const LogsQueue: LogMessage[] = [];

// export const flushToNewRelic = () => {
//     const totalChunks = Math.ceil(LogsQueue.length / LOGS_BULK_SIZE);
//     const chunks = _.range(totalChunks).map((chunkIndex) =>
//         LogsQueue.splice(0, LOGS_BULK_SIZE),
//     );

//     return Promise.all(chunks.map(collectLogs));
// };

// export const debouncedFlushToNewRelic = _.debounce(
//     flushToNewRelic,
//     SEND_LOGS_AFTER_MS,
// );

// export async function triggerLogCollection() {
//     if (!LogsQueue.length) return;

//     if (LogsQueue.length >= LOGS_BULK_SIZE) {
//         flushToNewRelic();
//         debouncedFlushToNewRelic.cancel();
//     } else {
//         debouncedFlushToNewRelic();
//     }
// }

// function putBackForCollectionRetry(logMessages: LogMessage[]) {
//     LogsQueue.unshift(...logMessages);
//     setImmediate(triggerLogCollection);
// }

// export function collectLog(logMessage: LogMessage) {
//     LogsQueue.push(logMessage);
//     setImmediate(triggerLogCollection);
// }
