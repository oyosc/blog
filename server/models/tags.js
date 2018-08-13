import Tags from '../database/mongodb/models/tags'
import errCodes from '../base/errCodes'

//获取所有标签
async function getAllTags(){
    let result = await Tags.find(null, 'name')
        .then((tagsInfo) => {
            if(tagsInfo){
                return {'statusCode':'200','message':'成功查询到tag信息', tagsInfo}
            }else{
                return {'statusCode': '20003', 'message': errCodes['20003']}
            }
        }).catch(err => {
            return {'statusCode': '20002', 'message': JSON.stringify(err)}
        })
    return result
}

//删除标签
async function delTag(name){
    console.log(name)
    let result = await Tags.remove(name)
        .then((result) => {
            console.log(result);
            if(result.n === 1){
                return {'statusCode':'200','message':'成功删除tag信息'}
            }else{
                return {'statusCode': '20006', 'message': errCodes['20006']}
            }
        }).catch(err => {
            console.log("deltagerr")
            console.log(err)
            return {'statusCode': '20002', 'message': JSON.stringify(err)}
        })
    return result
}

//添加标签
async function addTag(name){
    let result = await Tags.findOne(name)
        .then(async result => {
            if(!result){
                let tag = new Tags(name);
                return await tag.save().then((data) => {
                    return {'statusCode': '200', 'message': '标签添加成功'}
                }).catch(err => {
                    return {'statusCode': '20008', 'message': JSON.stringify(err)}
                })
            }else{
                return {'statusCode': '20007', 'message': errCodes['20007']}
            }
        }).catch(err => {
            return {'statusCode': '20002', 'message': JSON.stringify(err)}
        })
    return result
}

module.exports = {
    getAllTags,
    delTag,
    addTag
}