import { alertDevops } from '../email-alert';

const CHECK_HEALTH_EVERY_MS = parseInt(
    process.env.CHECK_HEALTH_EVERY_MS || '600000',
);

const healthWarningHeader = (word: string, mark: string = '!') => {
    const width = process.stdout.columns || 80;
    return (
        '\n' +
        mark.repeat(width / mark.length) +
        '\n' +
        (word + ' ').repeat(15).slice(0, width)
    );
};

// TODO implement in /status endpoint
export const LoggingHealth = {
    working: true,
    fatalErrors: new Set<string>(),
    numberOfLostLogs: 0,
    alertedNumberOfLostLogs: 0,
    temporaryErrors: new Set<string>(),
    numberOfLogsToRetry: 0,
    heartbeat: function (
        status: 'OK' | 'TEMPORARY_FAILURE' | 'DEAD',
        numberOfAffected: number,
        error?: string,
    ) {
        switch (status) {
            case 'OK':
                this.working = true;
                if (this.numberOfLogsToRetry !== 0) {
                    this.numberOfLogsToRetry = Math.max(
                        this.numberOfLogsToRetry - numberOfAffected,
                        0,
                    );
                }
                break;
            case 'TEMPORARY_FAILURE':
                this.numberOfLogsToRetry += numberOfAffected;
                if (error) this.temporaryErrors.add(error);
                break;
            case 'DEAD':
                this.working = false;
                this.numberOfLostLogs += numberOfAffected;
                if (error) this.fatalErrors.add(error);
                break;
        }
    },
    checkAndAlertHealth: function () {
        if (this.numberOfLogsToRetry) {
            console.log(healthWarningHeader('WARNING', '- '));
            console.log(
                `There are currently ${this.numberOfLogsToRetry} logs waiting to be collected during retry`,
            );
            console.log("Logs weren't collected due to these errors:", [
                ...this.temporaryErrors,
            ]);
        }

        if (!this.working) {
            console.log(healthWarningHeader('FATAL'));
            console.log(
                'Logger is not working! Lost logs:',
                this.numberOfLostLogs,
            );
            console.log("Logs couldn't be collected due to these errors:", [
                ...this.fatalErrors,
            ]);

            if (this.alertedNumberOfLostLogs < this.numberOfLostLogs) {
                const alertMessage =
                    `Number of logs lost since last alert: ${
                        this.numberOfLostLogs - this.alertedNumberOfLostLogs
                    }.\n` +
                    `Logs couldn't be collected due to these errors: ${[
                        ...this.fatalErrors,
                    ].join(',')}\n` +
                    `Number of logs lost during process runtime: ${this.numberOfLostLogs}.\n`;

                alertDevops(
                    `FATAL (PID: ${process.pid}): Log collector is dead!`,
                    alertMessage,
                );
                this.alertedNumberOfLostLogs = this.numberOfLostLogs;
            }
        }
    },
};

(function checkLoggingHealth() {
    const printOutLoggingHealth = () => {
        LoggingHealth.checkAndAlertHealth();
        setTimeout(printOutLoggingHealth, CHECK_HEALTH_EVERY_MS);
    };
    printOutLoggingHealth();
})();
