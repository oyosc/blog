import {prod, dev} from '../../config'

let config
if (process.env.NODE_ENV === 'production') {
    config = prod
} else {
    config = dev
}

export const jwtConfig = config.jwtConfig

// mongodb config
export const mongoConfig = config.mongoConfig

// api proxy config
export const apiProxy = config.apiProxy

// node main config
export const nodeConfig = config.nodeConfig

// redis message
export const redisConfig = config.redisConfig

export const githubOauth = config.githubOauth

export const corsConfig = config.corsConfig

// issue config
export const issueConfig = config.issueConfig
