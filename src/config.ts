
require('custom-env').env(true)

const env = process.env

const config = {
    environment: env.ENV || 'unknown',
    server: {
        port: env.PORT
    },
    database: {
        engine: env.DB_ENGINE,
        mongodb: env.MONGO_CONN || ''
    },
    mails: {
        admin: env.ADMIN_MAIL,
        noreply: env.NOREPLY_MAIL,
    },
    security: {
        session_key: env.SESSION_KEY,
        session_secret: env.SESSION_SECRET,
        cookie_secret: env.COOKIE_SECRET,
        passport_secret: env.PASSPORT_SECRET,
    },
    mailer: {
        enabled: env.MAILER_ENABLED,
        path: env.MAILER_PATH
    }
}

export default config
