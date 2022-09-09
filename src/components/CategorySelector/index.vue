<template>
  <div>
    <el-form :inline="true" :model="categoryForm" class="demo-form-inline" :disabled="!isShowList">
        <el-form-item label="一级分类">
            <el-select v-model="categoryForm.category1Id" placeholder="请选择" @change="changeCategory1">
              <el-option
                v-for="c1 in category1List"
                :key="c1.id"
                :label="c1.name"
                :value="c1.id"
              >
              </el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="二级分类">
            <el-select v-model="categoryForm.category2Id" placeholder="请选择" @change="changeCategory2">
              <el-option
                v-for="c2 in category2List"
                :key="c2.id"
                :label="c2.name"
                :value="c2.id"
              >
              </el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="三级分类">
            <el-select v-model="categoryForm.category3Id" placeholder="请选择" @change="changeCategory3">
              <el-option
                v-for="c3 in category3List"
                :key="c3.id"
                :label="c3.name"
                :value="c3.id"
              >
              </el-option>
            </el-select>
        </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'CategorySelector',
  props:['isShowList'],
  data(){
    return {
      categoryForm: {
        category1Id: '',
        category2Id: '',
        category3Id: '',
      },
      category1List:[],
      category2List:[],
      category3List:[],
    }
  },
  mounted(){
    this.getCategory1List()
  },
  methods:{
    // 获取一级分类
    async getCategory1List(){
      const result = await this.$API.category.getCategory1()
      if(result.code === 200){
        this.category1List = result.data
      }
    },
    // 当一级分类改变时，获取二级分类
    async changeCategory1(category1Id){
      // 一级菜单发生改变，清楚二三级菜单数据
      this.categoryForm.category2Id = ''
      this.categoryForm.category3Id = ''
      this.category2List = []
      this.category3List = []

      // 把数据传给父组件
      this.$emit('changeCategory',{categoryId: category1Id, level: 1})

      // 发请求获取二级菜单
      const result = await this.$API.category.getCategory2(category1Id)
      if(result.code === 200){
        this.category2List = result.data
      }
    },
    // 当二级分类改变时，获取三级分类
    async changeCategory2(category2Id){
      // 先重置三级菜单，在请求三级菜单
      this.categoryForm.category3Id = ''
      this.category3List = []

      // 把数据传给父组件
      this.$emit('changeCategory',{categoryId: category2Id, level: 2})

      const result = await this.$API.category.getCategory3(category2Id)
      if(result.code === 200){
        this.category3List = result.data
      }
    },

    // 当三级菜单改变时，
    changeCategory3(category3Id){
      // 把数据传给父组件
      // console.log('changeCategory3');
      this.$emit('changeCategory',{categoryId: category3Id, level: 3})
    }

  }
}
</script>

