import express from 'express'
import flash from 'express-flash'
import session from 'express-session'
import FileStore from 'session-file-store'
import path from 'path'
import os from 'os'

export const configureMiddlewares = (app) => {
    app.use(express.json())
    app.use(express.static('public'))
    app.use(flash())
    app.use(express.urlencoded({ extended: true }))
    app.use(configureSessionMiddleware())
}

const configureSessionMiddleware = () => {
    const Store = FileStore(session)

    const FileStoreWithPrototype = function (...args) {
        Store.call(this, ...args)
    }
    FileStoreWithPrototype.prototype = Object.create(Store.prototype)

    return session({
        name: 'session',
        secret: 'secretly_secret',
        resave: false,
        saveUninitialized: false,
        store: new FileStoreWithPrototype({
            logFn: () => {},
            path: path.join(os.tmpdir(), 'sessions')
        }),
        cookie: {
            secure: false,
            maxAge: 360000,
            expires: new Date(Date.now() + 360000),
            httpOnly: true
        }
    })
}
