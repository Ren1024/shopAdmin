import request from '@/utils/request'

export default {
    /* 
    // 根据三级id获取筛选列表
    GET /admin/product/attrInfoList/{category1Id}/{category2Id}/{category3Id}
    attrInfoList

    // 根据id删除属性
    DELETE /admin/product/deleteAttr/{attrId}
    deleteAttr

    POST /admin/product/saveAttrInfo
    saveAttrInfo 
    */
    //获取三级分类列表    
    getList(category1Id,category2Id,category3Id){
        return request.get(`/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`)
    },

    // 根据id删除商品属性
    delete(attrId){
        return request.delete(`/admin/product/deleteAttr/${attrId}`)
    },

    // 添加或修改商品属性
    addOrUpdate(attr){
        return request.post('/admin/product/saveAttrInfo',attr)
    }
}