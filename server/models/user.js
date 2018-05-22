import User from '../../models/user'
const objectId = require('mongodb').ObjectID;
import errCodes from '../errCodes'
import {MD5_SUFFIX, md5} from '../util'

//在数据库中查询用户
async function findOneUser(info){
    if(info.id){
        info._id = objectId(info.id);
        delete info.id;
    }
    let result = await User.findOne(
        info
    ).then((userInfo) => {
        if(userInfo){
            return {'errCode':'200','message':'该用户在数据库中', userInfo}
        }else{
            return {'errCode':'20001','message':errCodes['20001']}
        }
    }).catch((err) =>{
        return {'errCode': '20002', 'message': JSON.stringify(err)};
    })
    return result;
}

//在数据库中查询多个用户
async function findUsers({userInfo, pageNum}){
    let skip = pageNum - 1<0?0:(pageNum-1)*10;
    if(userInfo.id){
        userInfo._id = objectId(userInfo.id);
        delete userInfo.id;
    }
    let result = await User.find(
        userInfo, 
        '_id username type password', 
        {skip:skip, limit:10}
        ).then((result) => {
            if(result){
                return {'errCode': '200', 'message': '查询到符合记录的用户', result}
            }else{
                return {'errCode': '20003', 'message': errCodes['20003']}
            }
        }).catch(err => {
            return {'errCode': '20002', 'message': JSON.stringify(err)}
        })
}


module.exports = {
    findUser,
    findUsers
}