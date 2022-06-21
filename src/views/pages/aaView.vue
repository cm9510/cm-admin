<template>
<div class="mar">
  <t-button theme="primary" @click="visibleModal = true"> 模态对话框 </t-button>
</div>
  <t-dialog
  placement="center"
      v-model:visible="visibleModal"
      header="模态对话框"
      mode="modal"
      draggable
      :on-confirm="() => (visibleModal = false)"
    >
      <template #body>
        <div>默认点击蒙层或按ESC可关闭</div>
        <div>我是内容</div>
        <div>我是内容</div>
      </template>
    </t-dialog>
</template>

<script setup>
import { ref } from "@vue/reactivity";

const visibleModal = ref(false);

</script>

<style scoped lang="less">
.mar{
  margin: 100px;
}
</style>