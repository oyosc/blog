// 添加生产环境或者开发环境下的配置
let prod = {
    fore_end_url: 'http://127.0.0.1',
    api_url: 'http://127.0.0.1:3033',
    md5_suffix: 'eisdsadawwada这个是加密的信息哦%%%@@!',
    githubOauth: {
        clientID: 'xxxx1800fc3ea625exx',
        clientSecret: 'xxx4b61778532d83301ad3b30e9dbc725008764b',
        callbackURL: 'http://127.0.0.1/api/auth/github/callback'
    },
    corsConfig: {
        origin: 'http://127.0.0.1'
    },
    jwtConfig: {
        jwt_secret: 'koa_react_secret'
    },
    mongoConfig: {
        ip: '127.0.0.1',
        port: '27017',
        db: 'blog'
    },
    apiProxy: {
        ip: '127.0.0.1',
        port: '8080'
    },
    nodeConfig: {
        ip: '127.0.0.1',
        port: '3030'
    },
    redisConfig: {
        ip: '127.0.0.1',
        port: '6379'
    },
    issueConfig: {
        issueSize: 30,
        apiUrl: 'https://api.github.com/repos/oyosc/blog',
        issueAccessToken: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
        issueState: 'open',
        issueUnfiledFlag: '未归档',
        issueFiledFlag: '已归档'
    }
}

let dev = {
    fore_end_url: 'http://127.0.0.1',
    api_url: 'http://127.0.0.1:3033',
    md5_suffix: 'eisdsadawwada这个是加密的信息哦%%%@@!',
    githubOauth: {
        clientID: '4c44c1800fc3ea625eb7',
        clientSecret: '730740923ddff6294cefe4ab719eaaf417ad443d',
        callbackURL: 'http://127.0.0.1/api/auth/github/callback'
    },
    corsConfig: {
        origin: 'http://127.0.0.1'
    },
    jwtConfig: {
        jwt_secret: 'koa_react_secret'
    },
    mongoConfig: {
        ip: '127.0.0.1',
        port: '27017',
        db: 'blog'
    },
    apiProxy: {
        ip: '127.0.0.1',
        port: '8080'
    },
    nodeConfig: {
        ip: '127.0.0.1',
        port: '3030'
    },
    redisConfig: {
        ip: '127.0.0.1',
        port: '6379'
    }
}

module.exports = {
    prod,
    dev
}
