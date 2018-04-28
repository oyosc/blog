import User from '../../models/user'
const objectId = require('mongodb').ObjectID;
import errCodes from '../errCodes'

async function findUserById(id){
    let result = await User.findOne(
        {_id: objectId(id)}
    ).then((userInfo) => {
        if(userInfo){
            return {'errCode':'200','message':'该用户存在数据库中'}
        }else{
            return {'errCode':'10001','message':errCodes['10001']}
        }
    })
    return result;
}

module.exports = {
    findUserById
}