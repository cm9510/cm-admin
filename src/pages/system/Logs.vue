<script lang="ts" setup>
import { API_SUCCESS_CODE, type ApiResp } from '@/lib/consts';
import { datetime,debounce } from '@/lib/utils';
import { reactive, ref } from '@vue/reactivity'
import { onMounted } from '@vue/runtime-core'
import { MessagePlugin } from 'tdesign-vue-next';
import { SearchIcon } from 'tdesign-icons-vue-next'
import dayjs from 'dayjs';
import { ApiMemberLogs } from '@/lib/api';

const columns = [
  { colKey: 'member', title: '成员' },
  { colKey: 'title', title: '操作' },
  { colKey: 'detail', title: '详情' },
  { colKey: 'ip', title: 'IP',},
  { colKey: 'created_at', title: '时间' },
]

const pagination = reactive({
  defaultCurrent: 1,
  defaultPageSize: 20,
  total: 0
})

// 日期时间选择器快捷
const presets = ref({
  最近7天: [dayjs().subtract(6, 'day'), dayjs()],
  最近3天: [dayjs().subtract(2, 'day'), dayjs()],
  今天: [dayjs(), dayjs()],
});
const list = ref([])
const keyword = ref('')
const range2 = ref([])

onMounted(() => {
  loadLogs(pagination.defaultCurrent, pagination.defaultPageSize)
})
// 加载列表
const loadLogs = (page: number, size: number): void => {  
  const param: any = { page: page, size: size }
  if(keyword.value){
    param.keyword = keyword.value
  }
  if(range2.value.length === 2){
    param.range = range2.value
  }
  ApiMemberLogs(param).then((res: type ApiResp) => {
    if(res.code == API_SUCCESS_CODE){
      pagination.total = res.data.total
      list.value = res.data.list
    }else{
      MessagePlugin.error(res.msg)
    }
  })
}
// 分页改变时
const pageChange = ({ pagination }:any): void => loadLogs(pagination.current, pagination.pageSize)

// 搜索
const doSearch = debounce(()=> {
  pagination.defaultCurrent = 1
  loadLogs(1, pagination.defaultPageSize)
}, 800)

</script>

<template>
  <div class="container">
    <div class="header-op">
      <t-space align="end">
        <t-input placeholder="搜成员名/手机号" clearable v-model="keyword" @change="doSearch">
          <template #suffix-icon>
            <SearchIcon />
          </template>
        </t-input>
        <t-date-range-picker v-model="range2" :presets="presets" enable-time-picker clearable @change="doSearch" />
      </t-space>
    </div>

    <div class="main">
      <t-table row-key="id" :columns="columns" :data="list" :pagination="pagination" size="small" @change="pageChange">
        <template #member="{ row }">
          {{ row.nickname }}
        </template>
        <template #created_at="{ row }">
          {{ datetime(row.created_at) }}
        </template>
      </t-table>
    </div>
  </div>
</template>
<style scoped lang="less">
@import url('./common.less');

</style>