import request from '@/utils/request'

// 品牌管理接口

export default {
    /* DELETE /admin/product/baseTrademark/remove/{id}
    删除BaseTrademark

    POST /admin/product/baseTrademark/save
    新增BaseTrademark

    PUT /admin/product/baseTrademark/update
    修改BaseTrademark

    GET /admin/product/baseTrademark/{page}/{limit}
    分页列表 */

    // 获取品牌列表
    getTrademark(page,limit){
        return request.get(`/admin/product/baseTrademark/${page}/${limit}`)
    },

    // 删除品牌
    deleteTrademark(id){
        return request.delete(`/admin/product/baseTrademark/remove/${id}`)
    },

    // 新增品牌或更新品牌
    // 需要携带请求体，新增不带id，更新需要携带id
    /* {
        "id": 0,
        "logoUrl": "string",
        "tmName": "string"
      } */
    addOrUpdateTrademark(trademark){
        if(trademark.id){
            return request.put('/admin/product/baseTrademark/update', trademark)
        }else {
            return request.post('/admin/product/baseTrademark/save', trademark)
        }
    },

    // /admin/product/baseTrademark/getTrademarkList    get
    // 获取全部品牌列表
    getTrademarkList(){
        return request.get('/admin/product/baseTrademark/getTrademarkList')
    }
}