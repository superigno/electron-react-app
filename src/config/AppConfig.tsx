import logger from 'electron-log';
import Path from 'path';

export default class AppConfig {

    static loadAppDefaults = () => {

        const isDev = process.env.NODE_ENV === 'development';
    
        logger.transports.console.format = '{text}';
        logger.transports.file.resolvePath = (variables) => {
            return Path.join('logs', 'fxchoice.log');
        }
    
        if (!isDev) {
            logger.transports.console.level = false;
        }
    
        //Log uncaught errors
        window.onerror = function (message, url, line, col) {
            logger.error(`Uncaught Error: ${message}\n${url}:${line}:${col}`);
            return false;
        };
    
        //Log uncaught node errors
        process.on('uncaughtException', (err) => {
            logger.error('Uncaught Exception:', err);
            return false;
        });
    
    }
  
  }