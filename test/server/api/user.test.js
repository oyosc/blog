import indexServer from '../../../server/server'
import apiServer from '../../../server/api/apiServer'
import request from 'supertest'
import {asyncRequest} from '../../../server/base/util'

afterAll(() => {
    indexServer.close()
    apiServer.close()
})

describe('test/server/api/user.test.js', () => {
    it('login with valid user', async () => {
        let response = await request(indexServer)
            .post('/api/user/login')
            .send({
                username: 'admin',
                password: '123456'
            })
        let testRes = {
            header: expect.objectContaining({
                authorization: expect.stringMatching(/[\w\S]+/)
            }),
            status: 200,
            text: expect.stringContaining('{\"code\":0,\"message\":\"登陆成功\",\"result\":{\"token\":')
        }
        expect(response).toMatchObject(expect.objectContaining(
            testRes
        ))
    })

    it('login with invalid user', async () => {
        let response = await request(indexServer)
            .post('/api/user/login')
            .send({
                username: 'admin',
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
        let authorization, cookie
        beforeAll(async () => {
            let response = await request(indexServer)
                .post('/api/user/login')
                .send({
                    username: 'admin',
                    password: '123456'
                })
            if (response.text.indexOf('{\"code\":0') > -1) {
                authorization = response.headers.authorization
                let reg = new RegExp('koa_react_cookie([\\S]*)=([\\S]+)[^; ]', 'g')
                let cookieResult = response.headers['set-cookie'][0].match(reg)
                cookie = cookieResult[0] + ';' + cookieResult[1]
            }
        })

        it('should 200 when get the /api/user/userInfo', async () => {
            console.log('authorization: ', authorization)
            console.log('cookie: ', cookie)
            let response = await request(indexServer)
                .get('/api/user/userInfo')
                .set('authorization', authorization)
                .set('cookie', cookie)
            expect(response.status).toBe(200)
            expect(response.text).toEqual(expect.stringContaining('{\"code\":0'))
        })
    })
})
