import winston from 'winston';

const {createLogger, format, transports} = winston;
const {combine, timestamp, label, printf, colorize} = format;

export default (logModule: string): winston.Logger => {
  const logFormat = combine(
    colorize({all: true}),
    label({label: 'Project-Nutella'}),
    timestamp({format: 'YY-MM-DD HH:MM:SS'}),
    printf(
      ({
        level: printLevel,
        message: printMessage,
        label: printLabel,
        timestamp: printTimestamp,
      }) =>
        `[${printTimestamp}] [${printLabel}] | ${logModule} | ${printLevel} : ${printMessage}`,
    ),
  );

  const options = {
    console: {
      handleExceptions: true,
      json: false,
      format: logFormat,
    },
  };

  return createLogger({
    level: 'debug',
    transports: [new transports.Console(options.console)],
    exitOnError: false,
  });
};
