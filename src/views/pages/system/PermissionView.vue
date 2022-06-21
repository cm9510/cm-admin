<template>
  <div class="container">
    <div class="operation">
      <div class="op-btn">
        <t-button theme="primary" @click="showEdit = true">
          <template #icon>
            <t-icon name="add" />
          </template>
          添加权限
        </t-button>
      </div>
      <div class="op-search">
        <t-input placeholder="名称/api" clearable v-model="keyword" @enter="doSearch">
          <template #prefix-icon>
            <t-icon name="search" />
          </template>
        </t-input>
      </div>
    </div>
    <div class="main">
      <t-table row-key="id" :columns="columns" :data="list" :pagination="pagination" size="small" stripe
        @change="pageChange">
        <template #idx="{ rowIndex }">
          <b>{{rowIndex + 1}}</b>
        </template>
        <template #status="{ row }">
          <t-tag v-if="row.status === 0" theme="success" variant="light">正常</t-tag>
          <t-tag v-else-if="row.status === 1" theme="danger" variant="light">已停用</t-tag>
        </template>
        <template #creator="{ row }">
          <div class="edit-info">创建人：{{row.creator?.nickname || '-'}}</div>
          <div class="edit-info">修改人：{{row.updator?.nickname || '-'}}</div>
        </template>
        <template #create_at="{ row }">
          {{datetime(row.create_at)}}
        </template>
        <template #op-col="{rowIndex, row}">
          <a class="op op-edit" @click="editPerm(row)">编辑</a>
          <t-popconfirm theme="warning" content="您确定删除此权限吗？" @confirm="delPerm(rowIndex, row.id)">
            <a class="op op-del">删除</a>
          </t-popconfirm>
        </template>
        <template #name="{row}">
          {{row.name}}
        </template>
      </t-table>
    </div>
  </div>

  <t-dialog v-model:visible="showEdit" header="编辑权限" mode="modal" draggable :on-confirm="editSubmit" @closed="clearaForm">
    <template #body>
      <div class="edit-box">
        <t-form ref="form" :data="permission" :colon="true" :label-width="80">
          <t-form-item label="权限名" required-mark>
            <t-input v-model="permission.name" clearable placeholder="请输入权限名" />
          </t-form-item>
          <t-form-item label="URL" required-mark>
            <t-input v-model="permission.url" clearable placeholder="请输入url" />
          </t-form-item>
          <t-form-item label="状态">
            <t-switch v-model="permission.status" :customValue="[1,0]" size="large" :label="['正常','禁用']" />
          </t-form-item>
        </t-form>
      </div>
    </template>
  </t-dialog>
</template>

<script setup lang="ts">
import api from '@/common/api'
import { ApiRes, API_RES } from '@/common/common'
import { reactive, ref } from '@vue/reactivity'
import { onMounted } from '@vue/runtime-core'
import { datetime, Toast } from '@/common/utils'

const columns = [
  { colKey: 'idx', title: '序号',width:80, align:'center'},
  { colKey: 'name', title: '权限名'},
  { colKey: 'url', title: 'API' },
  { colKey: 'status', title: '状态', cell: 'status' },
  { colKey: 'creator', title: '编辑' },
  { colKey: 'create_at', title: '创建时间' },
  { colKey: 'op', title: '操作', cell: 'op-col' }
]

const pagination = reactive({
  defaultCurrent: 1,
  defaultPageSize: 20,
  total:0
})
const list = ref([])
const keyword = ref('')

onMounted(()=>{
  loadPermissionList(pagination.defaultCurrent, pagination.defaultPageSize)
})

// 加载列表
const loadPermissionList = (page:number, size:number, keyword=''):void => {
  const param:any = {page:page, size:size}
  if(keyword){
    param.keyword = keyword
  }
  api.permissionList(param).then((res:ApiRes) => {
    pagination.total = res.data.total
    list.value = res.data.list
  })
}

// 搜索
const doSearch = ():void => {
  pagination.defaultCurrent = 1
  loadPermissionList(1, pagination.defaultPageSize, keyword.value)
}

// 分页改变时
const pageChange = ({ pagination }):void => {
  loadPermissionList(pagination.current, pagination.pageSize, keyword.value)
}

const showEdit = ref(false)
const permission = reactive({
  id:0,
  name:'',
  url:'',
  status:1
})
const editPerm = (row:any):void => {
  permission.id = row.id
  permission.name = row.name
  permission.url = row.url
  permission.status = row.status === 1 ? 0 : 1
  showEdit.value = true
}
const clearaForm = ():void => {
  permission.id = 0
  permission.name = ''
  permission.url = ''
  permission.status = 1
}

// 添加|修改权限
const editSubmit = () => {
  if(!permission.name){
    Toast('请填写权限名', 101)
    return false
  }else if(!permission.url){
    Toast('请填写权限url', 101)
    return false
  }
  const ePerm = {...permission}
  ePerm.status = ePerm.status === 1 ? 0 : 1
  api.addPermission(ePerm).then((res:ApiRes)=>{
    Toast(res.msg, res.code)
    if(res.code === API_RES.SUCCESS){
      loadPermissionList(pagination.defaultCurrent, pagination.defaultPageSize, keyword.value)
      showEdit.value = false
    }
  })
}

// 删除权限
const delPerm = (idx:number, id:number) => {
  api.delSys({id:id,body:'permission'}).then((res:ApiRes)=>{
    Toast(res.msg, res.code)
    if(res.code === API_RES.SUCCESS){
      list.value.splice(idx,1)
      pagination.total -= 1
    }
  })
}
</script>

<style scoped lang="less">
@import url('./common.less');
</style>