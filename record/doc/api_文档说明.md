```
首页:
/api/getArticles                获取已发布文章列表
/api/getArticleDetail           获取文章详情
/api/getAllTags   获取全部标签(分类)

admin:
/api/admin/tags/addTag       添加标签
/api/admin/tags/delTag       删除标签
/api/admin/getUsers     获取全部的用户
/api/admin/article/get  获取所有文章(包含未发布)
/api/admin/article/add  添加文章
/api/admin/article/delete  删除文章
/api/admin/article/update  更新文章
/api/admin/comment/show  查询评论
/api/admin/comment/audit  对评论进行审核
/api/admin/comment/config/set  选择需要对评论审核还是不审核
/api/admin/comment/config/get  获取对评论是否进行审核(未完成，还存在bug)

user:
/api/user/login         登录
/api/user/userInfo      身份验证
/api/user/logout      注销
/api/user/comment/add      添加评论
/api/user/comment/show      查询一篇文章下面的评论
/api/user/comment/likeHot/add      给评论进行点赞
/api/user/comment/likeHot/delete      给评论取消点赞
```