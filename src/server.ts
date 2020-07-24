
import http, { createServer} from 'http'

import App from './app'
import config from './config'

interface ErrnoException extends Error {
    errno?: number;
    code?: string;
    path?: string;
    syscall?: string;
    stack?: string;
}

class Server {

    public app: App
    public server: http.Server

    constructor() {

        console.log('Server initializing')

        this.app = new App()
        this.server = createServer(this.app.app)
    }

    public start(): void {

        console.log('Server starting')
        
        const port = this.normalizePort(config.server.port)

        this.server.listen(port)
        this.server.on('error', (err: ErrnoException) => this.onError(err, port))
        this.server.on('listening', () => this.onListening(this.server))
    }

    private normalizePort(val: any): any {

        var port  = parseInt(val, 10)

        if (isNaN(port)) return val

        if (port >= 0) return port

        return false
    }

    private onError(error: ErrnoException, port: any): void {

        if (error.syscall !== 'listen') {
            throw error;
        }

        var bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

        // handle specific listen errors with friendly messages
        switch (error.code) {
            case 'EACCES':
                console.error(bind + ' requires elevated privileges');
                process.exit(1);
                break;
            case 'EADDRINUSE':
                console.error(bind + ' is already in use');
                process.exit(1);
                break;
            default:
                throw error;
        }
    }

    private onListening(server: any): void {

        var addr = server.address();
        var bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;

        console.log('Server listening on ' + bind);
    }
}

export default Server
