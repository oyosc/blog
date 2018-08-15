export const jwt_config = {
    jwt_secret: 'koa_react_secret'
}

//mongodb config
export const mongo_config = {
    ip: '127.0.0.1',
    port: '27017',
    db: 'blog'
}

//api proxy config
export const api_proxy = {
    ip: '127.0.0.1',
    port: '8080'
}

//node main config
export const node_config = {
    ip: '127.0.0.1',
    port: '3000'
}

//redis message
export const redisConfig = {
    ip: '127.0.0.1',
    port: '6379'
}

export const github_oauth = {
    client_id: "4c44c1800fc3ea625eb7",
    client_secret: "730740923ddff6294cefe4ab719eaaf417ad443d",
    token_path: "https://github.com/login/oauth/access_token",
    user_path: "https://api.github.com/user?"
}