import moment from 'moment';
import winston from 'winston';

const { combine, timestamp, label, printf, colorize, cli } = winston.format;

const myFormat = printf(({ level, message, label, timestamp }) => {
  return `[${moment(timestamp).format('hh:mm:ss')}] [${label}] [${level}]: ${message}`;
});

const logger = winston.createLogger({
  level: 'info',
  format: combine(label({ label: 'app' }), timestamp(), colorize(), cli(), myFormat),
  defaultMeta: { service: 'HADA' },
  transports: [new winston.transports.Console(), new winston.transports.File({ filename: 'combined.log' })],
});

export default logger;
