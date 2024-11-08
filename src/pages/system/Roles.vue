<script setup lang="ts">
import { type ApiResp, API_SUCCESS_CODE } from '@/lib/consts'
import { reactive, ref } from '@vue/reactivity'
import { onMounted } from '@vue/runtime-core'
import { datetime, debounce } from '@/lib/utils'
import { MessagePlugin } from 'tdesign-vue-next'
import ScrollArea from '@/components/ScrollArea.vue'
import {AddIcon,SearchIcon} from 'tdesign-icons-vue-next';
import { ApiAddRole, ApiDelSys, ApiPermissionAll, ApiRoleList } from '@/lib/api'

const columns = [
  { colKey: 'id', title: 'ID', width: 80, align: 'center' },
  { colKey: 'name', title: '角色名' },
  { colKey: 'permission', title: '权限' },
  { colKey: 'router', title: 'RouterName' },
  { colKey: 'status', title: '状态', width: 120 },
  { colKey: 'creator', title: '编辑' },
  { colKey: 'created_at', title: '创建时间' },
  { colKey: 'op', title: '操作', cell: 'op-col' }
]

const pagination = reactive({
  defaultCurrent: 1,
  defaultPageSize: 20,
  total: 0
})
const list = ref([])
const keyword = ref('')

onMounted(() => {
  loadRoleList(pagination.defaultCurrent, pagination.defaultPageSize)
})

// 加载列表
const loadRoleList = (page: number, size: number): void => {
  const param: any = { page: page, size: size }
  if (keyword.value) {
    param.keyword = keyword.value
  }
  ApiRoleList(param).then(({code,msg,data}: ApiResp) => {
    if (code !== API_SUCCESS_CODE) {
      MessagePlugin.error(msg)
      return
    }
    pagination.total = data.total
    list.value = data.list
  })
}

// 搜索
const doSearch = debounce(()=> {
  pagination.defaultCurrent = 1
  loadRoleList(1, pagination.defaultPageSize)
}, 800)

// 分页改变时
const pageChange = ({ pagination }:any): void => {
  loadRoleList(pagination.current, pagination.pageSize)
}

const showEdit = ref(false)
const role = reactive({
  id: 0,
  name: '',
  key: '',
  desc: '',
  roles: [],
  // redirect: '',
  permissions: [] as number[],
  status: 1
})
const editRole = (row: any): void => {
  role.id = row.id
  role.name = row.name
  role.key = row.key
  role.desc = row.desc
  role.roles = row.roles
  // role.redirect = row.redirect
  role.status = row.status === 1 ? 0 : 1
  row.permission.map((v:any) => {
    role.permissions.push(v.id)
  })
  showEdit.value = true
}

const allPerms = ref<any>([])
const loadPermission = ():void => {
  if(allPerms.value.length < 1){
    ApiPermissionAll().then(({ code, msg, data }: ApiResp) => {
      if (code !== API_SUCCESS_CODE) {
        MessagePlugin.error(msg)
        return
      }
      allPerms.value = data
  })
  }
}
const clearaForm = ():void => {
  role.id = 0
  role.name = ''
  role.key = ''
  // role.redirect = ''
  role.desc = ''
  role.roles = []
  role.permissions = []
  role.status = 1
}

// 添加|修改角色
const editSubmit = () => {
  if (!role.name) {
    MessagePlugin.error('请填写角色名')
    return false
  } else if (!role.roles) {
    MessagePlugin.error('请填写路由name')
    return false
  } else if (!role.permissions) {
    MessagePlugin.error('请分配权限')
    return false
  }
  const ePerm = { ...role }
  ePerm.status = ePerm.status === 1 ? 0 : 1
  ApiAddRole(ePerm).then(({ code, msg }: ApiResp) => {
    if (code !== API_SUCCESS_CODE) {
      MessagePlugin.error(msg)
      return
    }
    MessagePlugin.success(msg)
    loadRoleList(pagination.defaultCurrent, pagination.defaultPageSize)
    showEdit.value = false
  })
}

// 删除角色
const delRole = (idx: number, id: number) => {
  ApiDelSys({ id: id,body:'role'}).then(({ code, msg }: ApiResp) => {
    if (code !== API_SUCCESS_CODE) {
      MessagePlugin.error(msg)
      return
    }
    MessagePlugin.success(msg)
    list.value.splice(idx, 1)
    pagination.total -= 1
  })
}

</script>

<template>
  <div class="container">
    <div class="operation">
      <div class="op-btn">
        <t-button theme="primary" @click="showEdit = true">
          <template #icon><AddIcon /></template>
          添加角色
        </t-button>
      </div>
      <div class="op-search">
        <t-input placeholder="搜索角色名" clearable v-model="keyword" @change="doSearch">
          <template #suffix-icon><SearchIcon /></template>
        </t-input>
      </div>
    </div>
    <div class="main">
      <t-table row-key="id" :columns="columns" :data="list" :pagination="pagination" size="small" @change="pageChange">
        <template #name="{row}">
          <p class="role-name">· {{row.name}}</p>
          <p class="role-desc">- {{row.desc}}</p>
        </template>
        <template #permission="{ row }">
          <ScrollArea :mh="200">
            <t-tag class="per-tag" v-for="(v,i) in row.permission" :key="i">{{v.name}}</t-tag>
          </ScrollArea>
        </template>
        <template #router="{ row }">
          <ScrollArea :mh="200">{{row.roles.join('、')}}</ScrollArea>
        </template>
        <template #status="{ row }">
          <t-tag v-if="row.status === 0" theme="success" variant="light">正常</t-tag>
          <t-tag v-else-if="row.status === 1" theme="danger" variant="light">已停用</t-tag>
        </template>
        <template #creator="{ row }">
          <div class="edit-info">创建人：{{row.creator?.nickname || '-'}}</div>
          <div class="edit-info">修改人：{{row.updator?.nickname || '-'}}</div>
        </template>
        <template #created_at="{ row }">
          {{datetime(row.created_at)}}
        </template>
        <template #op-col="{rowIndex, row}">
          <a class="op op-edit" @click="editRole(row)">编辑</a>
          <t-popconfirm theme="warning" content="确定删除此角色吗？" @confirm="delRole(rowIndex, row.id)">
            <a class="op op-del">删除</a>
          </t-popconfirm>
        </template>
      </t-table>
    </div>
  </div>
  <t-dialog v-model:visible="showEdit" header="编辑角色" mode="modal" width="800" placement="center" :on-confirm="editSubmit"
   @opened="loadPermission" @closed="clearaForm">
    <template #body>
      <div class="edit-box">
        <t-form ref="form" :data="role" :colon="true" :label-width="80">
          <t-form-item label="角色名" required-mark>
            <t-input v-model="role.name" clearable placeholder="请输入角色名" />
          </t-form-item>
          <t-form-item label="角色标识" required-mark>
            <t-input v-model="role.key" clearable placeholder="不超过8位字母,下划线等常规字符" />
          </t-form-item>
          <!-- <t-form-item label="首页跳转" required-mark>
            <t-input v-model="role.redirect" placeholder="登入后跳转页面，路由name值" />
          </t-form-item> -->
          <t-form-item label="路由name" required-mark>
            <t-tag-input v-model="role.roles" excess-tags-display-type="break-line" placeholder="路由name值" />
          </t-form-item>
          <t-form-item label="权限" required-mark>
            <t-tree-select v-model="role.permissions" :data="allPerms"  multiple clearable placeholder="请选择" />
          </t-form-item>
          <t-form-item label="状态">
            <t-switch v-model="role.status" :customValue="[1,0]" size="large" :label="['正常','禁用']" />
          </t-form-item>
          <t-form-item label="简单介绍" required-mark>
            <t-textarea v-model="role.desc" placeholder="角色介绍，不超过30字" :maxlength="30"></t-textarea>
          </t-form-item>
        </t-form>
      </div>
    </template>
  </t-dialog>
</template>

<style scoped lang="less">
@import url('./common.less');

.per-tag{
  margin-bottom:3px; margin-right:3px;
}
</style>