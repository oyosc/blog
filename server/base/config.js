export const jwtConfig = {
    jwt_secret: 'koa_react_secret'
}

// mongodb config
export const mongoConfig = {
    ip: '127.0.0.1',
    port: '27017',
    db: 'blog'
}

// api proxy config
export const apiProxy = {
    ip: '127.0.0.1',
    port: '8080'
}

// node main config
export const nodeConfig = {
    ip: '127.0.0.1',
    port: '3030'
}

// redis message
export const redisConfig = {
    ip: '127.0.0.1',
    port: '6379'
}

export const githubOauth = {
    clientID: '4c44c1800fc3ea625eb7',
    clientSecret: '730740923ddff6294cefe4ab719eaaf417ad443d',
    callbackURL: 'http://127.0.0.1/api/auth/github/callback'
}
