<template>
  <div class="about">
    <h1>This is an about page</h1>
    <p class="p">p tags</p>
  </div>
  <t-button theme="danger"> 填充按钮 </t-button>
</template>

<style lang="less">

@red: blue;
.about{
  .p{
    color: @red;
  }
}
</style>

<script setup lang="ts">
// document.documentElement.setAttribute('theme-mode', 'dark');
</script>