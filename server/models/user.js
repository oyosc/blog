import User from '../../models/user'
const objectId = require('mongodb').ObjectID;
import errCodes from '../errCodes'
import {MD5_SUFFIX, md5} from '../util'

//在数据库中查询用户
async function findUser(info){
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
            return {'errCode':'10001','message':errCodes['10001']}
        }
    }).catch((err) =>{
        return {'errCode': '10002', 'message': JSON.stringify(err)};
    })
    return result;
}

module.exports = {
    findUser
}