import User from '../../models/user'
const objectId = require('mongodb').ObjectID;
import errCodes from '../errCodes'

//在数据库中查询用户
async function findOneUser(info){
    console.log("findOneUser");
    if(info.id){
        info._id = objectId(info.id);
        delete info.id;
    }
    let result = await User.findOne(
        info
    ).then((userInfo) => {
        if(userInfo){
            return {'statusCode':'200','message':'该用户在数据库中', userInfo}
        }else{
            return {'statusCode':'20001','message':errCodes['20001']}
        }
    }).catch((err) =>{
        return {'statusCode': '20002', 'message': JSON.stringify(err)};
    })
    return result;
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
    countUsers
}