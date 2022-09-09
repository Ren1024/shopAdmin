<template>
  <div>
      <!-- 添加按钮 -->
      <el-button type="primary" icon="el-icon-plus" @click="showAddDialog">添加</el-button>
      
      <!-- 表单 -->
      <el-table
        :data="trademarkList" 
        border
        style="margin: 20px 0"
      >
        <el-table-column
          align="center"
          label="序号"
          type="index"
          width="80">
        </el-table-column>
        <el-table-column
          prop="tmName"
          label="品牌名称"
          width="width">
        </el-table-column>
        <el-table-column
          label="品牌logo"
          width="width"
        >
          <template slot-scope="{row, $index}">
            <img :src="row.logoUrl" alt="" style="height:60px; width:60px">
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="width"
        >
          <template v-slot="{row, $index}">
            <el-button type="warning" icon="el-icon-edit" size="mini" @click="showUpdateDialog(row)">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteTrademark(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 对话框 -->
      <el-dialog :title="tmForm.id ? '编辑品牌' : '添加品牌'" :visible.sync="dialogFormVisible">
        <el-form :model="tmForm" style="width: 80%" :rules="rules" ref="tmForm">
          <el-form-item label="活动名称" label-width="120px" prop="tmName">
            <el-input v-model="tmForm.tmName" autocomplete="off" ></el-input>
          </el-form-item>
          <el-form-item label="品牌LOGO" label-width="120px" prop="logoUrl">
            <el-upload
              class="avatar-uploader"
              action="/dev-api/admin/product/upload"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload">
              <img v-if="tmForm.logoUrl" :src="tmForm.logoUrl" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
               <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </el-form-item>

        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="addOrUpdate">确 定</el-button>
        </div>
      </el-dialog>
      
      <!-- 分页器 -->
      <el-pagination
      @size-change="handleSizeChange"
      @current-change="getTrademarkList"
      style="text-align:center"
      :current-page="page"
      :page-sizes="[3, 5, 7]"
      :page-size="limit"
      layout="prev, pager, next, jumper, ->, sizes, total"
      :total="total">
    </el-pagination>
  </div>
</template>

<script>
import { call } from 'body-parser'

export default {
  name: 'TradeMarkList',
  data(){

    // 自定义校验规则回调函数
    const validateName = (rule, value, callback) => {
      // value-要校验的对象
      // callback-成功或失败的回调，callback()成功，callback(new Error)失败
      if(value.length < 3 || value.length > 10){
        callback(new Error('名称必须在3到10之间'))
      }else {
        callback()
      }
    }

    return {
      page: 1,
      limit: 3,
      trademarkList:[],
      total: 0,

      dialogFormVisible: false, //对话框的显示/隐藏
      tmForm: { //对话框收集数据
        tmName:'',
        logoUrl:'',
      },
      // imageUrl:'',
      rules: {  //表单验证规则
        /* 
          required: 是否为必填项
          trigger：触发时机，blur：失去焦点的时候，change：输入框改变的时候，   整体校验的时候
        */
        tmName: [
          { required: true, message: '请输入品牌名称', trigger: 'blur' },
          // { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'change' }

          // 自定义表单规则
           { validator: validateName, trigger: 'blur' }
        ],
        logoUrl: [
          // Upload触发时机必须是整体校验才会触发
          { required: true, message: '请选择上传的图片', trigger: 'change' }
        ],
      }
    }
  },
  mounted(){
    this.getTrademarkList()
  },
  methods:{
    // 获取表单信息回调
    async getTrademarkList(page = 1){
      this.page = page
      const result = await this.$API.trademark.getTrademark(this.page, this.limit)
      if(result.code === 200){
        this.trademarkList = result.data.records
        this.total = result.data.total
      }
    },
    handleSizeChange(limit){
      this.limit = limit
      this.getTrademarkList()
    },

    // 品牌LOGO上传回调
    handleAvatarSuccess(res, file) {
        // this.imageUrl = URL.createObjectURL(file.raw);
        this.tmForm.logoUrl = res.data
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg';
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return isJPG && isLt2M;
    },

    // 点击添加按钮，显示对话框
    showAddDialog(){
      this.dialogFormVisible = true
      // 每次弹出对话框，需要清空数据，
      this.tmForm = { 
        tmName:'',
        logoUrl:'',
      }
    },
    // 点击编辑按钮，显示对话框
    showUpdateDialog(row){
        this.dialogFormVisible = true
        // this.tmForm = row
        this.tmForm = {...row}
    },
    // 添加或修改品牌发送请求
    addOrUpdate(){
      // 对表单进行整体校验
      this.$refs.tmForm.validate(async (valid) => {
        if (valid) {
          // 1、获取收集到的参数数据
          let trademark = this.tmForm
          // 2、整理收集的参数数据
          // 3、发送请求
          try {
            await this.$API.trademark.addOrUpdateTrademark(trademark)
            // 4、成功干啥
            // 关闭对话框
            this.dialogFormVisible = false
            // 提示用户
            this.$message.success(trademark.id ? '修改品牌成功' : '添加品牌成功')
            // 重新获取品牌列表
            // 添加成功，第一页，修改成功，当前页
            this.getTrademarkList(trademark.id ? this.page : 1)
          } catch (error) {
            // 5、失败干哈
            // 关闭对话框
            this.dialogFormVisible = false
            // 提示用户
            this.$message.error(trademark.id ? '修改品牌失败' : '添加品牌失败')
          }
        } else {
          console.log('校验表单失败，不提交！');
          return false;
        }
      });

    },
    // 删除品牌的回调
    deleteTrademark(row) {
      this.$confirm(`你确定删除${row.tmName}么？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        // 确定删除，发送请求
        try {
          await this.$API.trademark.deleteTrademark(row.id)
          // 成功做什么？
          // 提示
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          // 重新获取品牌列表
          // 判断当前页数据，大于1条，获取当前页。否则，获取上一页
          this.getTrademarkList(this.trademarkList.length > 1 ? this.page : this.page - 1)
        } catch (error) {
          // 失败做什么？
          this.$message.error('删除失败！')
        }
        
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });          
      });
    }
  }
}
</script>

<style>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
