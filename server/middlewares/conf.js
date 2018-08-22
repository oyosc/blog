import {githubOauth} from '../base/config'
import {responseClient} from '../base/util'

exports.github = (ctx, next) => {
    if (githubOauth.client_id === 'your GITHUB_CLIENT_ID') {
        responseClient(ctx.response, 200, 1, 'call the admin to set github oauth.')
    }
    console.log('123456')
    next()
}
