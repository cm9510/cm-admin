<script lang="ts" setup>
const props = defineProps(['mw','mh'])
const styles:any = {}

if (props['mw']) {
    styles.maxWidth = props['mw']+'px'
}
if (props['mh']) {
    styles.maxHeight = props['mh']+'px'
}

</script>
<template>
    <div class="out-box" :style="styles"><slot></slot></div>
</template>
<style scoped lang="less">
.out-box{
    overflow-y: scroll;
    // overflow-x: hidden;

    &::-webkit-scrollbar{
        width: 4px;
        background-color: var(--td-bg-color-container);
    }

    &::-webkit-scrollbar-thumb{
        background-color: var(--td-gray-color-5);border-radius: 2px;
    }
}
</style>