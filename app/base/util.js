const jwt = require('jsonwebtoken')

// 客户端解析localsotrage中的token
export function resolveToken (authorization) {
    let decoded = jwt.decode(authorization, {complete: true})
    let userId = decoded.payload['userId']
    let username = decoded.payload['username']
    let userType = decoded.payload['userType']
    let avatarUrl = decoded.payload['avatar_url']
    let github_url = decoded.payload['github_url']
    return {userId, username, userType, avatarUrl, github_url}
}
