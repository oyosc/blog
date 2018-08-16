import User from '../database/mongodb/models/user'
const objectId = require('mongodb').ObjectID;
import errCodes from '../base/errCodes'

//在数据库中查询用户
async function findOneUser(info){
    if(info.id){
        info._id = objectId(info.id);
        delete info.id;
    }
    let result = await User.findOne(
        info
    ).select('-password').then((userInfo) => {
        if(userInfo){
            return {'statusCode':'200','message':'该用户在数据库中', userInfo}
        }else{
            return {'statusCode':'20001','message':errCodes['20001']}
        }
    }).catch((err) =>{
        log.error(__filename, __line(__filename), err)
        return {'statusCode': '20002', 'message': JSON.stringify(err)};
    })
    return result;
}

//在数据库中注册用户
async function registerUser(info){
    let newUser = new User(
        info
    )
    let result = await newUser.save().then(data => {
        return {'statusCode': '200', 'message': '用户注册成功', data}
    }).catch(err => {
        log.error(__filename, __line(__filename), err)
        return {'statusCode': '20008', 'message': '用户注册失败'}
    })
    return result
}

//在数据库中查询多个用户
async function findUsers(userInfo, pageNum){
    let skip = pageNum - 1<0?0:(pageNum-1)*10;
    if(userInfo.id){
        userInfo._id = objectId(userInfo.id);
        delete userInfo.id;
    }
    return User.find(
        userInfo, 
        '_id username type password', 
        {skip:skip, limit:10}
        );
}

async function findUsersByNames(names){
    if(names.length === 0){
        return {'statusCode': '200', 'message': '用户名为空', data: []}
    }
    let result = User.find({$or: [{username: {$in: names}}, {github_name: {$in: names}}]}).then(data => {
        return {'statusCode': '200', 'message': '用户查询成功', data}
    }).catch(err => {
        log.error(__filename, __line(__filename), err)
        return {'statusCode': '20008', 'message': '用户查询失败'}
    })
    return result
}

//在数据库中查询符合条件的用户数量
async function countUsers(userInfo){
    if(userInfo.id){
        userInfo._id = objectId(userInfo.id);
        delete userInfo.id;
    }
    return User.find(
        userInfo
        ).count();
}

module.exports = {
    findOneUser,
    findUsers,
    countUsers,
    registerUser,
    findUsersByNames
}