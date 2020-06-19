export enum LogLevel {
    DEBUG = 'DEBUG',
    INFO = 'INFO',
    WARN = 'WARN',
    ERROR = 'ERROR',
}

export interface LogMessage {
    level: LogLevel;
    message?: string;
    data?: object | object[];
    stackTrace?: string;
}

export const mapArgsToMessage = (...args: (string | object | Error)[]) => {
    const logDetails: Pick<LogMessage, 'message' | 'data' | 'stackTrace'> = {};

    for (let arg of args) {
        if (arg instanceof Error) {
            if (logDetails.message) {
                Object.assign(logDetails, {
                    stackTrace: arg.stack,
                });
            } else {
                Object.assign(logDetails, {
                    message: arg.message,
                    stackTrace: arg.stack,
                });
            }
        } else if (typeof arg === 'object') {
            if (logDetails.data) {
                if (Array.isArray(logDetails.data)) {
                    logDetails.data.push(arg);
                } else {
                    logDetails.data = [logDetails.data, arg];
                }
            } else {
                Object.assign(logDetails, { data: arg });
            }
        } else if (typeof arg === 'string') {
            if (logDetails.message) {
                logDetails.message = logDetails.message.concat(' ', arg);
            } else {
                Object.assign(logDetails, { message: arg });
            }
        }
    }

    return logDetails;
};

export function hijackConsoleApi(consoleLogger: Function, level: LogLevel) {
    return async function () {
        const logMessage: LogMessage = {
            level,
            ...mapArgsToMessage(...arguments),
        };

        if (process.env?.NODE_ENV === 'production') {
            // @ts-ignore
            consoleLogger.call(this, JSON.stringify(logMessage));
        } else {
            // @ts-ignore
            consoleLogger.apply(this, [
                `[${logMessage.level}]`,
                logMessage.message || '',
                logMessage.data || '',
                logMessage.stackTrace || '',
            ]);
        }

        // If we want to collect log to external service, we can do that here
    };
}

console.debug = hijackConsoleApi(console.debug, LogLevel.DEBUG);
console.info = hijackConsoleApi(console.info, LogLevel.INFO);
console.warn = hijackConsoleApi(console.warn, LogLevel.WARN);
console.error = hijackConsoleApi(console.error, LogLevel.ERROR);
console.info('Mounted custom logger');
