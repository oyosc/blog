export const jwtConfig = {
    jwt_secret: 'koa_react_secret'
}

// mongodb config
export const mongoConfig = {
    ip: process.env.NODE_ENV === 'production' ? '127.0.0.1' : '127.0.0.1',
    port: process.env.NODE_ENV === 'production' ? '27017' : '27017',
    db: process.env.NODE_ENV === 'production' ? 'blog' : 'blog'
}

// api proxy config
export const apiProxy = {
    ip: process.env.NODE_ENV === 'production' ? '127.0.0.1' : '127.0.0.1',
    port: process.env.NODE_ENV === 'production' ? '8080' : '8080'
}

// node main config
export const nodeConfig = {
    ip: process.env.NODE_ENV === 'production' ? '127.0.0.1' : '127.0.0.1',
    port: process.env.NODE_ENV === 'production' ? '3030' : '3000'
}

// redis message
export const redisConfig = {
    ip: process.env.NODE_ENV === 'production' ? '127.0.0.1' : '127.0.0.1',
    port: process.env.NODE_ENV === 'production' ? '6379' : '6379'
}

export const githubOauth = {
    clientID: '4c44c1800fc3ea625eb7',
    clientSecret: '730740923ddff6294cefe4ab719eaaf417ad443d',
    callbackURL: 'http://127.0.0.1/api/auth/github/callback'
}

export const corsConfig = {
    origin: process.env.NODE_ENV === 'production' ? 'http://127.0.0.1' : 'http://127.0.0.1'
}
