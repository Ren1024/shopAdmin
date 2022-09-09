<template>
  <el-form :model="skuFrom" label-width="100px">
    <el-form-item label="SPU 名称">
      skuFrom
    </el-form-item>

    <el-form-item label="SKU 名称">
      <el-input v-model="skuFrom.skuName" placeholder="SKU 名称"></el-input>
    </el-form-item>

    <el-form-item label="价格(元)">
      <el-input v-model="skuFrom.price" placeholder="SKU 价格" type="number"></el-input>
    </el-form-item>

    <el-form-item label="重量(千克)">
      <el-input v-model="skuFrom.weight" placeholder="SKU 重量" type="number"></el-input>
    </el-form-item>

    <el-form-item label="规格描述">
      <el-input v-model="skuFrom.skuDesc" placeholder="SKU 规格描述" type="textarea" rows="4"></el-input>
    </el-form-item>

    <el-form-item label="平台属性" >
      <el-form :inline="true" class="demo-form-inline" label-width="80px">
        <el-form-item 
          :label="attr.attrName" 
          v-for="(attr, index) in attrInfoList" 
          :key="attr.id">
          <el-select v-model="attr.attrIdAttrValueId" placeholder="请选择">
            <el-option 
              :label="attrValue.valueName" 
              :value="`${attr.id}:${attrValue.id}`" 
              v-for="(attrValue, index) in attr.attrValueList"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>

    <el-form-item label="销售属性">
      <el-form :inline="true" class="demo-form-inline" label-width="80px">
        <el-form-item 
          :label="spuSaleAttr.saleAttrName" 
          v-for="(spuSaleAttr, index) in spuSaleAttrList" 
          :key="spuSaleAttr.id">
          <el-select v-model="spuSaleAttr.spuSaleAttrValueId" placeholder="请选择">
            <el-option 
              :label="spuSaleAttrValue.saleAttrValueName" 
              :value="`${spuSaleAttr.id}:${spuSaleAttrValue.id}`"
              v-for="(spuSaleAttrValue, index) in spuSaleAttr.spuSaleAttrValueList"
              :key="spuSaleAttrValue.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>

    <el-form-item label="图片列表">
      <el-table :data="spuImageList" border style="width:100%;" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column label="图片"  width="width">
          <template slot-scope="{row, $index}">
            <img :src="row.imgUrl" alt="" style="width:100px; height:100px">
          </template>
        </el-table-column>
        <el-table-column label="名称" prop="imgName" width="width">

        </el-table-column>
        <el-table-column label="操作" width="width">
          <template slot-scope="{row, $index}">
            <el-button type="primary" size="mini" v-if="row.isDefault === '0'" @click="setDefault(row)">设为默认</el-button>
            <el-tag type="primary" v-else>默认</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="save">保存</el-button>
      <el-button @click="cancel">取消</el-button>
    </el-form-item>

  </el-form>
</template>

<script>
export default {
  name: 'SkuFrom',
  data(){
    return {
      skuFrom:{
        // 父组件传过来的
        category3Id: '',
        tmId: '',

        // v-model直接收集
        price: '',
        skuDesc: '',
        weight: '',
        skuName: '',

        // 通过代码去收集
        skuDefaultImg: '',
        skuAttrValueList: [
          // {
          //   只需要这两个id
          //   attrId: 0,
          //   valueId: 0,

          //   attrName: "string",
          //   id: 0,
          //   skuId: 0,
          //   valueName: "string"
          // }
        ],
        skuImageList: [
          // {
          //   id: 0,
          //   imgName: "string",
          //   imgUrl: "string",
          //   isDefault: "string",
          //   skuId: 0,
          //   spuImgId: 0
          // }
        ],
        skuSaleAttrValueList: [
          // {
          //   id: 0,
          //   saleAttrId: 0,
          //   saleAttrName: "string",
          //   saleAttrValueId: 0,
          //   saleAttrValueName: "string",
          //   skuId: 0,
          //   spuId: 0
          // }
        ],
      },
      sku:{},

      attrInfoList:[],
      spuSaleAttrList:[],
      spuImageList:[], //展示用的图片列表
      checkedImgList:[] //选中的图片列表

    }
  },
  methods:{
    // 初始化请求，展示数据
    async initAddSkuFrom(row,category1Id,category2Id){
      // 先储存row
      this.sku = row
      // 根据三级分类列表，获取商品信息
      // http://localhost:9529/dev-api/admin/product/attrInfoList/2/13/61
      const promise1 = this.$API.attr.getList(category1Id, category2Id, row.category3Id)
      // 根据spuid获取商品销售属性
      // http://localhost:9529/dev-api/admin/product/spuSaleAttrList/1168
      const promise2 = this.$API.sku.getSpuSaleAttrList(row.id)
      // 根据spuid获取商品图片列表
      // http://localhost:9529/dev-api/admin/product/spuImageList/1168
      const promise3 = this.$API.sku.getSpuImageList(row.id)

      let result = await Promise.all([promise1, promise2, promise3])
      this.attrInfoList = result[0].data
      this.spuSaleAttrList = result[1].data
      let spuImageList = result[2].data
      // 给每一个图片对象添加标识数据，标记默认选中
      spuImageList.forEach(item => item.isDefault = '0')
      this.spuImageList = spuImageList
    },
    // 图片选择或取消的回调
    handleSelectionChange(val) {
      this.checkedImgList = val;
    },
    // 设置图片默认
    setDefault(row){
      // 排他
      this.spuImageList.forEach(item => item.isDefault = '0')
      row.isDefault = '1'
      // 保存默认的图片地址
      this.skuFrom.skuDefaultImg = row.imgUrl
    },
    // 保存
    async save(){
      // 收集数据
      let {skuFrom, sku, attrInfoList, spuSaleAttrList, checkedImgList} = this
      // 整理数据
      // 1、整理父组件传过来的数据
      skuFrom.category3Id = sku.category3Id
      skuFrom.tmId = sku.tmId
      skuFrom.spuId = sku.id

      // 2、收集图片
      //要求的结构
      // {
      //   imgName: "string",
      //   imgUrl: "string",
      //   isDefault: "string",
      //   spuImgId: 0,
      // },
      skuFrom.skuImageList = checkedImgList.map(item => {
        return {
          imgName:item.imgName,
          imgUrl:item.imgUrl,
          isDefault:item.isDefault,
          spuImgId:item.id
        }
      })
     

      // 3、整理收集的平台属性数据
      // 需要的结构
      // {
      //   attrId: 0,
      //   valueId: 0,
      // },
      skuFrom.skuAttrValueList = attrInfoList.reduce((prev, item) => {
        if(item.attrIdAttrValueId){
          let [attrId, valueId] = item.attrIdAttrValueId.split(':')
          let obj = {
            attrId,
            valueId
          }
          prev.push(obj)
        }
        return prev
      },[])

      // 4、整理销售属性
      // 需要的格式
      // {
      //    saleAttrId: 0,
      //    saleAttrValueId: 0,
      // }
      skuFrom.skuSaleAttrValueList = spuSaleAttrList.reduce((prev, item) => {
        if(item.spuSaleAttrValueId){
          let [saleAttrId, saleAttrValueId] = item.spuSaleAttrValueId.split(':')
          let obj = {
            saleAttrId,
            saleAttrValueId
          }
          prev.push(obj)
        }
        return prev
      }, [])
      
      // 发送请求
      try {
        // 成功做什么？
        await this.$API.sku.addUpdateSkuInfo(skuFrom)
        this.$message.success('保存成功！')
        // 返回页面
        this.$emit('update:visible', false)
        // 重置数据
        this.resetData()
      } catch (error) {
        // 失败做什么？
        this.$message.error('保存失败！')
      }
    },
    // 重置data数据
    resetData(){
      this.skuFrom = {
        // 父组件传过来的
        category3Id: '',
        tmId: '',
        // v-model直接收集
        price: '',
        skuDesc: '',
        weight: '',
        skuName: '',
        // 通过代码去收集
        skuDefaultImg: '',
        skuAttrValueList: [],
        skuImageList: [],
        skuSaleAttrValueList: [],
      },
      this.sku = {}
      this.attrInfoList = []
      this.spuSaleAttrList = []
      this.spuImageList = [] //展示用的图片列表
      this.checkedImgList = [] //选中的图片列表
    },
    // 取消
    cancel(){
      // 跳转页面
      this.$emit('update:visible', false)
      // 重置数据
      this.resetData()
    }
  }
}
</script>


