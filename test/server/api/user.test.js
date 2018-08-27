import indexServer from '../../../server/server'
import apiServer from '../../../server/api/apiServer'
import request from 'supertest'
import {asyncRequest} from '../../../server/base/util'
import support from '../../support/support'

beforeAll(async () => {
    await support.ready(true, indexServer)
})

afterAll(async () => {
    await support.ready(false, indexServer)
    indexServer.close()
    apiServer.close()
})

describe('test/server/api/user.test.js', () => {
    it('login with valid user', async () => {
        console.log('support: ', support.normalUser)
        let response = await request(indexServer)
            .post('/api/user/login')
            .send({
                username: support.normalUser.username,
                password: support.normalUser.password
            })
        let testRes = {
            header: expect.objectContaining({
                authorization: expect.stringMatching(/[\w\S]+/)
            }),
            status: 200,
            text: expect.stringContaining('{\"code\":0,\"message\":\"登陆成功\",\"result\":{\"token\":')
        }
        // console.log('response: ', response)
        expect(response).toMatchObject(expect.objectContaining(
            testRes
        ))
    })

    it('login with invalid user', async () => {
        let response = await request(indexServer)
            .post('/api/user/login')
            .send({
                username: support.normalUser.username,
                password: '1234567'
            })
        let testRes = {
            status: 200,
            text: expect.stringContaining('{\"code\":1,')
        }
        expect(response).toMatchObject(expect.objectContaining(
            testRes
        ))
    })

    describe('login with github', () => {
        it('should 302 when get /api/auth/github', async () => {
            let response = await request(indexServer)
                .get('/api/auth/github')
            expect(response.status).toBe(302)
            expect(response.headers).toHaveProperty('location', expect.stringContaining('github.com/login/oauth/authorize'))
        })

        it('should 500 when get /auth/github/callback', async () => {
            let response = await request(indexServer)
                .get('/api/auth/github/callback?code=123456')
            expect(response.status).toBe(500)
        })
    })

    describe('call the user_auth', () => {
        it('should 200 when get the /api/user/userInfo', async () => {
            console.log('normalUserVerify: ', support.normalUserVerify)
            let response = await request(indexServer)
                .get('/api/user/userInfo')
                .set('authorization', support.normalUserVerify.authorization)
                .set('cookie', support.normalUserVerify.cookie)
            expect(response.status).toBe(200)
            expect(response.text).toEqual(expect.stringContaining('{\"code\":0'))
        })
    })
})
