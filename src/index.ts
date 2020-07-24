
import cluster from 'cluster'

import Server from './server'
import config from './config'

import os from 'os'

const showGreetings = () => {

    console.log('Greetings!')
}

const createWorker = (cluster: any) => {

    console.log('Creating worker')

    var worker = cluster.fork();

    return worker;
}

if (cluster.isMaster) {

    showGreetings()

    const env = config.environment

    console.log('Server on', env, 'environment')

    const num_cpus = env != 'production' ? 1 : os.cpus().length

    for (let i = 0; i < num_cpus; i += 1) {

        const worker = createWorker(cluster)

        worker.on('message', (msg: String) => console.log('worker message:', msg))
    }

    cluster.on('exit', (worker, code, signal) => {

        console.log('Worker', worker.process.pid, 'died')

        if (env === 'production') {

            console.log('Generating new worker')

            const worker = createWorker(cluster)

            worker.on('message', (msg: String) => console.log('worker message:', msg))
        }
    })
} else {
    
    const server = new Server()
    server.start()
}
