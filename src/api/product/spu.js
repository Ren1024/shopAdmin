import request from '@/utils/request'

export default {
    // /admin/product/{page}/{limit}    get
    // 获取spu分页列表数据
    getSpuList(page,limit,category3Id){
        return request.get(`/admin/product/${page}/${limit}`,{params:{category3Id}})
    },

    // /admin/product/saveSpuInfo
    // 添加spu信息
    // addSpuInfo(spuInfo){
    //     return request.post('/admin/product/saveSpuInfo',{data:{spuInfo}})
    // },
    // 修改spu信息
    // updateSpuInfo(spuInfo){
    //     return request.post('/admin/product/updateSpuInfo',{data:{spuInfo}})
    // },
    // 添加或修改spu信息
    addUpdateSpuInfo(spuInfo){
        return request.post(`/admin/product/${spuInfo.id? 'update' :'save'}SpuInfo`,spuInfo)
    },

    // /admin/product/getSpuById/{spuId}    get
    // 获取spu详细信息
    getSpuInfo(spuId){
        return request.get(`/admin/product/getSpuById/${spuId}`)
    },

    // /admin/product/baseSaleAttrList  get
    // 获取所有销售属性
    baseSaleAttrList(){
        return request.get('/admin/product/baseSaleAttrList')
    },

    // /admin/product/deleteSpu/{spuId}     delete
    deleteSpu(spuId){
        return request.delete(`/admin/product/deleteSpu/${spuId}`)
    },

    // /admin/product/getSpuById/{spuId}  get
    // 获取spu基本信息
    getSpuBaseInfo(spuId){
        return request.get(`/admin/product/getSpuById/${spuId}`)
    }
}