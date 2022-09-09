<template>
  <div>
    <el-card>
      <CategorySelector @changeCategory="changeCategory" :isShowList="isShowList"></CategorySelector>
    </el-card>
    <el-card style="margin-top: 20px">
      <!-- 属性展示列表 -->
      <div v-show="isShowList">
        <el-button type="primary" icon="el-icon-plus" @click="showAddDiv" :disabled="!category3Id">添加属性</el-button>
        <el-table 
          border
          :data="categoryList"
          style="margin-top:20px"
        >
          <el-table-column 
            type="index"
            align="center"
            label="序号"
            width="80"
          >
          </el-table-column>
          <el-table-column 
            prop="attrName"
            label="属性名称"
            width="150"
          >
          </el-table-column>
          <el-table-column 
            label="属性值列表"
            width="width"
          >
            <template slot-scope="{row, $index}">
              <el-tag type="success"
                v-for="(attrValue, index) in row.attrValueList"
                :key="attrValue.id"
                style="margin-right:10px"
              >
                {{attrValue.valueName}}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column 
            label="操作"
            width="150"
          >
            <!-- <el-button type="warning" icon="el-icon-edit" size="mini"></el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini"></el-button> -->
            <template slot-scope="{row, $index}">
              <HintButton 
                type="warning" 
                icon="el-icon-edit" 
                size="mini" 
                title="编辑属性" 
                @click="showUpdateDiv(row)"
              ></HintButton>

              <el-popconfirm
                :title="`你确认删除${row.attrName}么？`"
                @onConfirm="deleteAttr(row)"
              >
                <HintButton 
                  slot="reference"
                  type="danger" 
                  icon="el-icon-delete" 
                  size="mini" 
                  title="删除属性"
                ></HintButton>
              </el-popconfirm>
            </template>
            
          </el-table-column>
        </el-table>
      </div>
      
      <!-- 属性值添加或编辑 -->
      <div v-show="!isShowList">
        <el-form :model="attrForm" :inline="true">
          <el-form-item label="属性名">
            <el-input v-model="attrForm.attrName"></el-input>
          </el-form-item>
        </el-form>
        <el-button type="primary" icon="el-icon-plus" :disabled="!attrForm.attrName" @click="addAttrValue">添加属性值</el-button>
        <el-button @click="isShowList = true">取消</el-button>
        <el-table 
          border 
          :data="attrForm.attrValueList"
          style="margin:20px 0"
        >
          <el-table-column
            type="index"
            align="center"
            label="序号"
            width="80">
          </el-table-column>
          <el-table-column
            prop="prop"
            label="属性名称"
            width="width">
            <template slot-scope="{row, $index}">
              <el-input 
                v-if="row.isEdit" 
                :ref="$index"
                v-model="row.valueName" 
                placeholder="请输入属性值名称"
                @blur="switchLook(row)"
                @keyup.enter.native="switchLook(row)"
                size="mini"
              ></el-input>
              <span 
                v-else 
                @click="switchEdit(row,$index)"
                style="display: block; width:100%; height:100%;"
              >{{row.valueName}}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            width="width">
            <template slot-scope="{row, $index}">
              <el-popconfirm
                :title="`你确认删除${row.valueName}么？`"
                @onConfirm="attrForm.attrValueList.splice($index, 1)"
              >
                <HintButton 
                  slot="reference"
                  type="danger" 
                  icon="el-icon-delete" 
                  size="mini" 
                  title="删除属性"
                ></HintButton>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-button type="primary" @click="save" :disabled="attrForm.attrValueList.length === 0">保存</el-button>
        <el-button @click="isShowList = true">取消</el-button>
        
      </div>
    </el-card>
  </div>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep'

export default {
  name: 'AttrList',
  data(){
    return {
      category1Id:'',
      category2Id:'',
      category3Id:'',
      categoryList:[],

      isShowList:true,

      attrForm:{
          attrName: "",
          attrValueList: [
          //   {
          //     "attrId": 0,
          //     "id": 0,
          //     "valueName": "string"
          //   }
          ],
          categoryId: 0,
          categoryLevel: 3,
      }
    }
  },
  methods:{
    changeCategory({categoryId, level}){
      if(level === 1){
        // 接受子组件传递的一级id
        this.category1Id = categoryId

        // 重置二三级id级数组
        this.category2Id = ''
        this.category3Id = ''
        this.categoryList = []
      }else if(level === 2){
        this.category2Id = categoryId

        // 重置三级id级数组
        this.category3Id = ''
        this.categoryList = []
      }else {
        this.category3Id = categoryId
        // 获取属性列表
        this.getCategoryList()
      }
    },
    async getCategoryList(){
      const {category1Id, category2Id, category3Id} = this
      const result = await this.$API.attr.getList(category1Id, category2Id, category3Id)
      if(result.code === 200){
        this.categoryList = result.data
      }
    },
    // 添加按钮，显示添加/编辑属性页面
    showAddDiv(){
      this.isShowList = false
      // 重置attrForm里面的数据
      this.attrForm = {
          attrName: "",
          attrValueList: [],
          categoryId: this.category3Id,
          categoryLevel: 3,
      }
    },
    // 添加属性值按钮
    addAttrValue(){
      this.attrForm.attrValueList.push({
          //这个是添加属性值的当前属性名id 
          attrId: this.attrForm.id,
          valueName: "",
          // 添加属性，标记编辑模式，和查看模式
          isEdit:true,
      })

      // 自动获取焦点
      this.$nextTick(() => {
        this.$refs[this.attrForm.attrValueList.length - 1].focus()
      })
    },
    // 点击编辑按钮切换编辑页面
    showUpdateDiv(row){
      this.isShowList = false
      this.attrForm = cloneDeep(row)
      // 给每一个属性值都添加观察模式标记
      this.attrForm.attrValueList.forEach(item => {
          this.$set(item,'isEdit', false)
      })
    },
    // 切换模式到查看者
    switchLook(row){
      let valueName = row.valueName.trim()
      // 1、输入不能为空
      if(!valueName){
        this.$message.warning('输入的属性值名称不能为空')
        return
      }
      // 2、输入不能重复
      let isRepeat = this.attrForm.attrValueList.some(item => {
        // 排除自身
        if(item !== row){
          return item.valueName.trim() === valueName
        }
      })
      // 判断isRepeat的值
      if(isRepeat){
        this.$message.warning('输入的属性值名称不能重复')
        return 
      }
      row.isEdit = false
    },
    // 切换到编辑模式
    switchEdit(row,index){
      row.isEdit = true
      // 自动获取焦点
      this.$nextTick(() => {
        this.$refs[index].focus()
      })
    },

    // 保存属性值
    async save(){
      // 收集数据
      let attr = this.attrForm
      // 整理数据
      // 1、属性值不能为空
      // 2、去除不需要的属性，如isEdit
      attr.attrValueList = attr.attrValueList.filter(item => {
        if(item.valueName){
          delete item.isEdit
          return true
        }
      })
      // 3、属性列表不能为空
      if(attr.attrValueList.length === 0){
        this.$message.error('属性值列表不能为空')
        return
      }
      // 发送请求
      try {
        await this.$API.attr.addOrUpdate(attr)
        // 成功干啥
        // 1、提示用户，2、返回属性列表页，3、重新获取属性列表
        this.$message.success('保存成功')
        this.isShowList = true
        this.getCategoryList()
      } catch (error) {
        // 失败干啥
        this.$message.error('保存失败')
      }
    },
    // 删除属性值
    async deleteAttr(row){
      try {
        await this.$API.attr.delete(row.id)
        this.$message.success('删除成功!')
        this.getCategoryList()
      } catch (error) {
        this.$message.error('删除失败！')
      }
      
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
