<template>
  <div>
    <el-form :model="spuInfo" label-width="100px">
      <el-form-item label="SPU名称">
        <el-input v-model="spuInfo.spuName" placeholder="SPU名称"></el-input>
      </el-form-item>

      <el-form-item label="品牌">
        <el-select v-model="spuInfo.tmId" placeholder="请选择品牌">
          <el-option :label="tm.tmName" :value="tm.id" v-for="(tm, index) in trademarkList" :key="tm.id"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="SPU描述">
        <el-input v-model="spuInfo.description" placeholder="SPU描述" type="textarea" rows="4"></el-input>
      </el-form-item>

      <el-form-item label="SPU图片">
        <el-upload
          action="/dev-api/admin/product/upload"
          list-type="picture-card"
          :file-list="spuImageList"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :on-success="handleSuccess"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
      </el-form-item>

      <el-form-item label="销售属性">
        <el-select 
          v-model="spuSaleAttrIdName" 
          :placeholder="unselectedSaleAttrList.length > 0 ? `还有${unselectedSaleAttrList.length}项没选择` : '没有没选的了！！'"
        >
          <el-option 
            :label="unselectedSaleAttr.name" 
            :value="`${unselectedSaleAttr.id}:${unselectedSaleAttr.name}`" 
            v-for="(unselectedSaleAttr,index) in unselectedSaleAttrList"
            :key="unselectedSaleAttr.id"
          ></el-option>
        </el-select>
        <el-button 
          type="primary" 
          icon="el-icon-plus" 
          @click="addSaleAttr"
          :disabled="!spuSaleAttrIdName"
        >添加销售属性</el-button>

        <el-table 
          border 
          style="width:100%; margin:20px 0" 
          :data="spuInfo.spuSaleAttrList"
        >
          <el-table-column label="序号" type="index" algin="center" width="80"></el-table-column>
          <el-table-column 
            label="属性名" 
            width="100" 
            prop="saleAttrName">
          </el-table-column>
          <el-table-column 
            label="属性值名称列表" 
            width="width">
            <template slot-scope="{row, $index}">
              <!-- 
                :disable-transitions="false"
                @close="handleClose(tag)"
               -->
              <el-tag
                v-for="(spuSaleAttrValue, index) in row.spuSaleAttrValueList"
                :key="spuSaleAttrValue.id"
                closable 
                @close="row.spuSaleAttrValueList.splice(index, 1)"
              >
                {{ spuSaleAttrValue.saleAttrValueName }}
              </el-tag>

              <el-input
                class="input-new-tag"
                v-if="row.inputVisible"
                v-model="row.inputValue"
                ref="saveTagInput"
                size="small"
                @keyup.enter.native="handleInputConfirm(row)"
                @blur="handleInputConfirm(row)"
              >
              </el-input>

              <el-button v-else class="button-new-tag" size="small" @click="showInput(row)">+ 添加</el-button>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="100">
            <template slot-scope="{row, $index}">
              <HintButton 
                type="warning" 
                size="mini" 
                icon="el-icon-delete" 
                title="删除"
                @click="spuInfo.spuSaleAttrList.splice($index, 1)"
              ></HintButton>
            </template>
          </el-table-column>
        </el-table>
        <el-button type="primary" @click="save">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
    name: "SpuFrom",
    data() {
        return {
            spuInfo: {
                category3Id: 0,
                spuName: "",
                description: "",
                tmId: "",
                spuImageList: [
                // {
                //   "id": 0,
                //   "imgName": "string",
                //   "imgUrl": "string",
                //   "spuId": 0
                // }
                ],
                spuSaleAttrList: [
                // {
                //   "baseSaleAttrId": 0,
                //   "id": 0,
                //   "saleAttrName": "string",
                //   "spuId": 0,
                //   "spuSaleAttrValueList": [
                //     {
                //       "baseSaleAttrId": 0,
                //       "id": 0,
                //       "isChecked": "string",
                //       "saleAttrName": "string",
                //       "saleAttrValueName": "string",
                //       "spuId": 0
                //     }
                //   ]
                // }
                ],
            },
            category3Id:'',
            spuImageList: [],
            trademarkList: [],
            saleAttrList: [],

            spuSaleAttrIdName: "",
            dialogImageUrl: "",
            dialogVisible: false
        };
    },
    methods: {
        // 上传图片相关回调
        // 图片删除成功回调
        handleRemove(file, fileList) {
          // console.log(file, fileList);
          this.spuImageList = fileList
        },
        // 图片添加成功回调
        handleSuccess(response, file, fileList){
          // console.log(file, fileList);
          this.spuImageList = fileList
        },
        // 图片放大镜回调
        handlePictureCardPreview(file) {
            this.dialogImageUrl = file.url;
            this.dialogVisible = true;
        },
        // 修改spu初始化请求
        async initUpdateSpuFrom(sup) {
          
            this.category3Id = sup.category3Id
            // 获取商品详细信息
            // http://localhost:9528/dev-api/admin/product/getSpuById/6878
            const spuResult = await this.$API.spu.getSpuInfo(sup.id);
            if (spuResult.code === 200) {
                this.spuInfo = spuResult.data;
            }
            // 获取商品全部图片列表
            // http://localhost:9528/dev-api/admin/product/spuImageList/6878
            const imgResult = await this.$API.sku.spuImageList(sup.id);
            if (imgResult.code === 200) {
                // 需要整理数据  [{name: 'food.jpg', url: 'https://xxx.cdn.com/xxx.jpg'}]
                let spuImageList = imgResult.data;
                spuImageList.forEach(item => {
                    item.name = item.imgName;
                    item.url = item.imgUrl;
                });
                this.spuImageList = spuImageList;
            }
            // 获取全部品牌属性列表
            this.getTrademarkList();
            // 获取全部销售属性列表
            this.baseSaleAttrList();
        },
        // 添加spu初始化请求
        initAddSupFrom(category3Id) {
          this.category3Id = category3Id
            // 获取全部品牌属性列表
            this.getTrademarkList();
            // 获取全部销售属性列表
            this.baseSaleAttrList();
        },
        // 获取全部品牌属性列表
        async getTrademarkList() {
            // 获取全部品牌属性列表
            // http://localhost:9528/dev-api/admin/product/baseTrademark/getTrademarkList
            const trademarkResult = await this.$API.trademark.getTrademarkList();
            if (trademarkResult.code === 200) {
                this.trademarkList = trademarkResult.data;
            }
        },
        // 获取全部销售属性列表
        async baseSaleAttrList() {
            // 获取全部销售属性列表
            // http://localhost:9528/dev-api/admin/product/baseSaleAttrList
            const saleAttrResult = await this.$API.spu.baseSaleAttrList();
            if (saleAttrResult.code === 200) {
                this.saleAttrList = saleAttrResult.data;
            }
        },

        // 添加销售属性
        addSaleAttr(){
          let [baseSaleAttrId, saleAttrName] = this.spuSaleAttrIdName.split(':')
          let obj = {
            baseSaleAttrId,
            saleAttrName,
            spuSaleAttrValueList:[]
          }

          // 添加到列表中
          this.spuInfo.spuSaleAttrList.push(obj)
          
          // 清除下拉框数据
          this.spuSaleAttrIdName = ''
        },

        // 显示输入框
        showInput(row){
          this.$set(row,'inputVisible', true)
          // 自动获取焦点
          this.$nextTick(() => {
            this.$refs.saveTagInput.focus()
          })
        },

        // 失去焦点或点击回车回调
        handleInputConfirm(row){
          // 收集数据
          let saleAttrValueName = row.inputValue.trim()
          let baseSaleAttrId = row.baseSaleAttrId
          // 数据校验
          if(!saleAttrValueName){
            row.inputValue = ''
            return
          }
          let isRepeat = row.spuSaleAttrValueList.some(item => item.saleAttrValueName === saleAttrValueName)

          if(isRepeat){
            this.$message.error('销售属性值名称不能重复！！')
            return
          }

          // 整理数据
          let obj = {
            saleAttrValueName,
            baseSaleAttrId
          }
          // 添加数据
          row.spuSaleAttrValueList.push(obj)
          // 清空输入框数据
          row.inputValue = ''
          //切换成查看模式
          row.inputVisible = false
        },

        // 保存
        async save(){
          // 收集数据
          let {spuInfo, spuImageList, } = this
          // 整理数据
          
          // 1、整理spuImageList
          // {  需要的数据
          //   "imgName": "string",
          //   "imgUrl": "string",
          // }

          // { 原来的数据
          //   id:7
          //   imgName:"2b78b6fdabfd2fbe.jpg"
          //   imgUrl:"http://47.93.148.192:8080/group1/M00/00/01/rBHu8l-rgJqAHPnoAAF9hoDNfsc505.jpg"
          //   name:"2b78b6fdabfd2fbe.jpg"
          //   spuId:2
          //   status:"success"
          //   uid:1662518913220
          //   url:"http://47.93.148.192:8080/
          // }

          // { 新增的数据
          //   name:"aa6bc0fc-d3c7-40d1-8713-514b701a089d7532624.png"
          //   percentage:100
          //   raw:File
          //   response:Object
          //   size:30488
          //   status:"success"
          //   uid:1662518955586
          //   url:"blob:http:
          // }
          spuInfo.spuImageList = spuImageList.map(item => {
            return {
              imgName: item.name,
              imgUrl: item.imgUrl || item.response.data
            }
          })

          // 2、整理spuSaleAttrList属性值中多余的属性inputVisible和inputValue
          spuInfo.spuSaleAttrList.forEach(item => {
            delete item.inputVisible
            delete item.inputValue
          })

          // 3、收集category3Id
          spuInfo.category3Id = this.category3Id

          // 发送请求
          try {
            // 成功做什么
            await this.$API.spu.addUpdateSpuInfo(spuInfo)
            this.$message.success('保存成功！')
            // 返回页面
            this.$emit('update:visible', false)
            // 通知父组件成功，父组件需要重新获取数据，需要添加标识符，判断是添加还是修改
            this.$emit('successBack')
            // 重置自身数据
            this.resetData()

          } catch (error) {
            // 失败做什么
            this.$message.error('保存失败！！')
          }
          
        },
        // 重置data数据
        resetData(){
          this.spuInfo = {
              category3Id: 0,
              spuName: "",
              description: "",
              tmId: "",
              spuImageList: [],
              spuSaleAttrList: [],
          }
          this.category3Id = ''
          this.spuImageList = []
          this.trademarkList = []
          this.saleAttrList = []

          this.spuSaleAttrIdName = ""
          this.dialogImageUrl = ""
          this.dialogVisible = false
        },
        // 取消
        cancel(){
          // 返回父组件
          this.$emit('update:visible', false)
          // 通知父组件清除标识符
          this.$emit('cancelBack')
          // 清空data中数据
          this.resetData()
        }
    },
    computed:{
      unselectedSaleAttrList(){
        // 未选择的销售属性，通过全部销售属性筛选，排除已有的销售属性中和全部销售属性相同的
        return this.saleAttrList.filter(saleAttr => {
          // 拿全部销售属性中每一个和 已有的全部作比较，不一样返回
          return this.spuInfo.spuSaleAttrList.every(spuSaleAttr => {
            return saleAttr.name !== spuSaleAttr.saleAttrName
          })
        })
      }
    }
}
</script>

<style>
  .el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
</style>
