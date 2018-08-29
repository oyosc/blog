# github第三方登录功能

***[项目地址：](https://github.com/oyosc/blog)https://github.com/oyosc/blog***

## 第一种方法: 因为前后端端口不一致，后端使用passport库，来进行github第三方登录会造成跨域问题，所以前端需要直接链接到github的授权地址，并且在项目首页进行路由的匹配，防止直接404
## 主要代码如下:
### 前端:
- 增加github登录按钮，代码路径: [blog/app/containers/home/components/login/LoginForm.js](https://github.com/oyosc/blog/blob/master/app/containers/home/components/login/LoginForm.js)
```
<Button className={`${style.buttonStyle}`} type="primary" >
    <a href={progress.env.NODE_ENV === 'production' ? progress.env.API_URL + '/api/auth/github' : '' }>github登录</a>
</Button>
```
- 首页增加redirect组件，在github跳转到你的回调地址的时候可以直接对后端请求，代码路径: [blog/app/containers/front/Front.js](https://github.com/oyosc/blog/blob/master/app/containers/front/Front.js)
```
<Switch>
    <Redirect exact from='/api/auth/github/404' to='/' />
    <Route exact path={url} component={Home} history={this.props.history}/>
    <Route path={'/detail/:id'} component={Detail} />
    <Route path={'/:tag'} component={Home} />
    <Route path={'/api/auth/github/:callback?'} history={this.props.history} component={Home} />
    <Route component={NotFound} />
</Switch>
``` 
- 在github回调之后，直接向后端请求github登录接口，代码路径：[blog/app/containers/home/home.js](https://github.com/oyosc/blog/blob/master/app/containers/home/home.js)
```
componentDidMount () {
    this.props.get_article_list(this.props.match.params.tag || '')
    let href = window.location.href
    if (href.indexOf('auth/github/callback') !== -1) {
        href = href.split('api')[1]
        this.props.login_with_github(href)
    }
}
```

### 后端
- 使用passport这个库从而得到github相关的信息，代码路径: [blog/server/api/apiServer.js](https://github.com/oyosc/blog/blob/master/server/api/apiServer.js)
```
// oauth中间件
app.use(passport.initialize())

// github oauth
passport.serializeUser((user, done) => {
    done(null, user)
})

passport.deserializeUser((user, done) => {
    done(null, user)
})

passport.use(new GitHubStrategy(githubOauth, githubStrategyMiddleware))
```
- 后端接口处理函数，代码路径: [blog/server/controllers/user.js](https://github.com/oyosc/blog/blob/master/server/controllers/user.js)
```
async function loginWithGithub (ctx) {
    console.log('loginWithGithub')
    let userInfo = ctx.req.user
    let githubName = userInfo.username
    let isExistResult = await User.findOneUser({github_name: githubName})
    if (isExistResult.statusCode === '200') {
        ctx.session.username = isExistResult.userInfo.username
        ctx.session.userId = isExistResult.userInfo._id
        isExistResult.userInfo.username = isExistResult.userInfo.github_name
        let token = await signToke(isExistResult.userInfo)
        responseClient(ctx.response, 200, 0, 'github用户已经存在正确信息', {token})
    } else {
        let registerUserInfo = {
            username: Math.random().toString(36).substr(2),
            type: '1',
            github_url: userInfo.profileUrl,
            github_name: githubName,
            avatar: userInfo.photos[0].value
        }
        let registerResult = await User.registerUser(registerUserInfo)
        if (registerResult.statusCode === '200') {
            ctx.session.username = registerResult.data.username
            ctx.session.userId = registerResult.data._id
            registerResult.data.username = registerResult.data.github_name
            let token = await signToke(registerResult.data)
            responseClient(ctx.response, 200, 0, 'github用户注册成功', {token})
        } else {
            responseClient(ctx.response, 200, 1, 'github用户注册失败')
        }
    }
}
```

## 第二种方法，这里是我刚开始的思路，主要就是前端使用window.open来打开github授权地址，然后后端接收到回调过来的CODE码，在后台继续对github进行请求从而获得相应的用户信息
```
async function login_with_github(ctx){
    console.log("node login with github")
    console.log(ctx.request.body)
    let {code} = ctx.request.body

    let data = {
        "code": code,
        "client_id": github_oauth.client_id,
        "client_secret": github_oauth.client_secret
    }

    
    let options = {
        url: github_oauth.token_path,
        method: 'POST',
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify(data)
    }
    
    let result = await asyncRequest(options)
    if(result.code == 1){
        let access_token = result.data.body.split('&')[0]
        let getOptions = {
            url: github_oauth.user_path + access_token,
            method: 'GET',
            headers: {
                'User-Agent': 'oyosc'
            }
        }
        console.log(getOptions)
        let user_result = await asyncRequest(getOptions)
        console.log(user_result)
        if(user_result.code == 1){
            let user_info = JSON.parse(user_result.data.body)
            let githubName = user_info.login
            let is_exist_result = await User.findOneUser({github_name: githubName})
            console.log("is_exist_result")
            console.log(is_exist_result)
            if(is_exist_result.statusCode == '200'){
                is_exist_result.userInfo.username = is_exist_result.userInfo.github_name
                let token = await signToke(is_exist_result.userInfo);
                responseClient(ctx.response, 200, 0, 'github用户已经存在正确信息', {token});
            }else{
                let register_user_info = {
                    username: Math.random().toString(36).substr(2),
                    type: 1, 
                    github_url: user_info.html_url,
                    github_name: githubName,
                    avatar: user_info.avatar_url
                }
                let register_result = await User.registerUser(register_user_info)
                console.log('register_result')
                console.log(register_result)
                if(register_result.statusCode == '200'){
                    is_exist_result.userInfo.username = is_exist_result.userInfo.github_name
                    let token = await signToke(register_result.data);
                    responseClient(ctx.response, 200, 0, 'github用户注册成功', {token});
                }else{
                    responseClient(ctx.response, 200, 1, 'github用户注册失败');
                }
            }
        }else{
            responseClient(ctx.response, 200, 1, 'github第三方登录请求access_token失败');
        }
    }else{
        responseClient(ctx.response, 200, 1, result.err);
    }
}
```
