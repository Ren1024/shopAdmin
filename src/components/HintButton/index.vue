<template>

    <!-- tooltip在触发原生事件时，会有bug -->
  <!-- <el-tooltip :content="title" placement="top-start">
    <el-button v-bind="$attrs" v-on="$listeners"></el-button>
  </el-tooltip> -->

  <a href="javascript:;" :title="title">
    <el-button v-bind="$attrs" v-on="$listeners"></el-button>
  </a>
</template>

<script>
export default {
  name: 'HintButton',
  props:['title']
  
}
</script>

<style>
  a {
    margin: 0 5px;
  }
</style>

