<template>
  <div>
    <!-- 三级分类联动 -->
    <el-card>
      <CategorySelector :isShowList="isShowList" @changeCategory="changeCategory"></CategorySelector>
    </el-card>
    <el-card style="margin-top:20px">
      <div v-show="!isShowSkuFrom && !isShowSpuFrom">
         <!-- 添加按钮 -->
        <el-button 
          type="primary" 
          icon="el-icon-plus" 
          style="margin-bottom:20px" 
          @click="showAddSpuFrom"
        >添加SPU</el-button>
        <!-- 展示列表 -->
        <el-table :data="spuList" border>
          <el-table-column 
            label="序号" 
            type="index" 
            align="center"
            width="80"
          ></el-table-column>
          <el-table-column 
            prop="spuName"
            label="SPU名称" 
            width="width"
          ></el-table-column>
          <el-table-column 
            prop="description"
            label="SPU描述" 
            width="width"
          ></el-table-column>
          <el-table-column 
            label="操作" 
            width="width"
            
          >
            <template slot-scope="{row, $index}">
              <HintButton 
                type="success" 
                icon="el-icon-plus" 
                size="mini" 
                title="添加SKU" 
                @click="showAddSkuFrom(row)"
              ></HintButton>
              <HintButton 
                type="warning" 
                icon="el-icon-edit" 
                size="mini" 
                title="修改SPU" 
                @click="showUpdateSpuFrom(row)"
              ></HintButton>
              <HintButton 
                type="info" 
                icon="el-icon-info" 
                size="mini" 
                title="查看SPU信息"
                @click="lookSpuInfo(row)"
              ></HintButton>
              <HintButton 
                type="danger" 
                icon="el-icon-delete" 
                size="mini" 
                title="删除SPU" 
                @click="deleteSpu(row)"
              ></HintButton>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页 -->
        <el-pagination
          style="text-align:center"
          @size-change="handleSizeChange"
          @current-change="getSpuList"
          :current-page="page"
          :page-sizes="[2, 4, 6, 8]"
          :page-size="limit"
          layout="prev, pager, next, jumper, ->, sizes, total"
          :total="total">
        </el-pagination>
      </div>
      <SkuFrom v-show="isShowSkuFrom" ref="sku" :visible.sync="isShowSkuFrom"></SkuFrom>
      <!-- <SpuFrom v-show="isShowSpuFrom" ref="spu" :visible.sync="isShowSpuFrom"></SpuFrom> -->
      <SpuFrom 
        v-show="isShowSpuFrom" 
        ref="spu" 
        :visible="isShowSpuFrom" 
        @update:visible="isShowSpuFrom = $event"
        @successBack="successBack"
        @cancelBack="cancelBack"
      ></SpuFrom>
    </el-card>
    <!-- 查看sku列表 -->
    <el-dialog
      :title="spuInfo.spuName"
      :visible.sync="dialogVisible"
      width="50%"
      :before-close="handleClose">
      <el-table :data="skuBaseInfoList" v-loading="loading">
        <el-table-column label="名称" prop="skuName"></el-table-column>
        <el-table-column label="价格（元）" prop="price"></el-table-column>
        <el-table-column label="重量（KG）" prop="weight"></el-table-column>
        <el-table-column label="默认图片">
          <template slot-scope="{row, $index}">
            <img :src="row.skuDefaultImg" alt="" style="width:100px; height:100px">
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import SkuFrom from '@/views/product/components/SkuFrom.vue'
import SpuFrom from '@/views/product/components/SpuFrom.vue'
export default {
  name: 'SpuList',
  components:{
    SkuFrom,
    SpuFrom
  },
  data(){
    return {
      category1Id:'',
      category2Id:'',
      category3Id:'',
      spuList:[],

      page:1,
      limit:2,
      total:0,

      isShowList:true,

      isShowSkuFrom: false,
      isShowSpuFrom: false,

      dialogVisible: false,
      spuInfo:{},
      skuBaseInfoList:[],
      loading:false,
    }
  },
  methods:{
    changeCategory({categoryId, level}){
      if(level === 1){
        this.category1Id = categoryId
        this.category2Id = ''
        this.category3Id = ''
        this.spuList = []
      }else if(level === 2){
        this.category2Id = categoryId
        this.category3Id = ''
        this.spuList = []
      }else {
        this.category3Id = categoryId
        this.getSpuList()
      }
    },
    // 获取spu信息列表
    async getSpuList(pager = 1){
      this.page = pager
      const {page, limit, category3Id} = this
      const result = await this.$API.spu.getSpuList(page, limit, category3Id)
      if(result.code === 200){
        this.spuList = result.data.records
        this.total = result.data.total
      }
    },
    // 修改当前条数
    handleSizeChange(size){
      this.limit = size
      this.getSpuList()
    },
    // 添加spu按钮
    showAddSpuFrom(){
      this.isShowSpuFrom = true
      this.$refs.spu.initAddSupFrom(this.category3Id)
    },
    // 修改spu按钮
    showUpdateSpuFrom(row){
      // 添加标识符
      this.flag = row.id
      this.isShowSpuFrom = true
      this.$refs.spu.initUpdateSpuFrom(row)
    },
    // 添加sku按钮
    showAddSkuFrom(row){
      this.isShowSkuFrom = true
      // 调用sku中的方法，初始化展示数据
      this.$refs.sku.initAddSkuFrom(row, this.category1Id, this.category2Id)
    },
    // 子组件保存成功后的回调
    successBack(){
      // 判断是添加成功还是修改成功
      if(this.flag){
        // 修改成功
        this.getSpuList(this.page)
      }else{
        // 添加成功
        this.getSpuList()
      }
      // 重置标识数据
      this.flag = null
    },
    // 子组件取消，父组件干活
    cancelBack(){
      this.flag = null
    },
    // 删除spu
    async deleteSpu(row){
      // 发送请求删除
      try {
        // 成功干什么？
        await this.$API.spu.deleteSpu(row.id)
        this.$message.success('删除成功！')
        // 重新获取数据，判断页码
        this.getSpuList(this.spuList.length > 1 ? this.page : this.page-1)
      } catch (error) {
        // 失败干什么？
        this.$message.error('删除失败！')
      }
      
    },
    // 对话框关闭之前
    handleClose(done) {
      this.dialogVisible = false
      // 重置sku基础信息列表
      this.skuBaseInfoList = []
    },
    // 查看spu信息
    async lookSpuInfo(row){
      this.dialogVisible = true
      this.spuInfo = row
      this.loading = true
      // 发送请求获取spu信息
      let result = await this.$API.sku.getSkuBaseInfo(row.id)
      if(result.code === 200){
        // console.log(result);
        this.skuBaseInfoList = result.data
        this.loading = false
      }
      
    }
  },
  watch:{
    isShowSkuFrom(val, oldVal){
      this.isShowList = !val
    },
    isShowSpuFrom(val, oldVal){
      this.isShowList = !val
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
