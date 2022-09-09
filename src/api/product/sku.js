import request from '@/utils/request'

export default {
    // /admin/product/spuImageList/{spuId}  get
    // 获取spu所有图片列表
    spuImageList(spuId){
        return request.get(`/admin/product/spuImageList/${spuId}`)
    },

    // /admin/product/spuSaleAttrList/{spuId}
    // 根据spuid获取销售属性
    getSpuSaleAttrList(spuId){
        return request.get(`/admin/product/spuSaleAttrList/${spuId}`)
    },

    // /admin/product/spuImageList/{spuId}
    // 根据spuid获取图片列表
    getSpuImageList(spuId){
        return request.get(`/admin/product/spuImageList/${spuId}`)
    },

    // /admin/product/saveSkuInfo ||updateSkuInfo   post
    // 添加或修改sku
    addUpdateSkuInfo(skuInfo){
        return request.post(`/admin/product/${skuInfo.id ? 'update' : 'save'}SkuInfo`,skuInfo)
    },

    // /admin/product/findBySpuId/{spuId}  get
    // 根据指定的spuid，获取对应的sku列表
    getSkuBaseInfo(spuId){
        return request.get(`/admin/product/findBySpuId/${spuId}`)
    }
}