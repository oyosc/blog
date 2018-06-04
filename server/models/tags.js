import Tags from '../../models/tags'
const objectId = require('mongodb').ObjectID;
import errCodes from '../errCodes'
import {MD5_SUFFIX, md5} from '../util'

//获取所有标签
async function getAllTags(){
    let result = await Tags.find(null, 'name')
        .then((tagsInfo) => {
            if(tagsInfo){
                return {'errCode':'200','message':'成功查询到tag信息', tagsInfo}
            }else{
                return {'errCode': '20004', 'message': errCodes['20004']}
            }
        }).catch(err => {
            return {'errCode': '20005', 'message': JSON.stringify(err)}
        })
    return result
}

//删除标签
async function delTag(name){
    let result = await Tags.remove({name})
        .then((result) => {
            if(result.result.n === 1){
                return {'errCode':'200','message':'成功删除tag信息'}
            }else{
                return {'errCode': '20006', 'message': errCodes['20006']}
            }
        }).catch(err => {
            return {'errCode': '20005', 'message': JSON.stringify(err)}
        })
    return result
}

//添加标签
async function addTag(name){
    let result = await Tags.findOne({name})
        .then(async result => {
            if(!result){
                let tag = new Tags({name});
                return await tag.save().then((data) => {
                    return {'errCode': '200', 'message': '标签添加成功'}
                }).catch(err => {
                    return {'errCode': '20008', 'message': JSON.stringify(err)}
                })
            }else{
                return {'errCode': '20007', 'message': errCodes['20007']}
            }
        }).catch(err => {
            return {'errCode': '20005', 'message': JSON.stringify(err)}
        })
}