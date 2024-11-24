<script setup lang="ts">
import { type ApiResp, API_SUCCESS_CODE } from '@/lib/consts'
import { reactive, ref } from '@vue/reactivity'
import { onMounted } from '@vue/runtime-core'
import { datetime,debounce } from '@/lib/utils'
import {AddIcon,EditIcon,MinusCircleIcon,SearchIcon} from 'tdesign-icons-vue-next';
import { MessagePlugin } from 'tdesign-vue-next'
import { ApiAddPermission, ApiAddPermissionGroup, ApiDelSys, ApiPermissionGroups, ApiPermissionList } from '@/lib/api';

const columns = [
  { colKey: 'id', title: 'ID', width: 80, align: 'center' },
  { colKey: 'name', title: '权限信息' },
  { colKey: 'status', title: '状态', width:100, cell: 'status' },
  { colKey: 'creator', title: '编辑' },
  { colKey: 'created_at', title: '创建时间' },
  { colKey: 'op', title: '操作', cell: 'op-col' }
]
const options = ref<any>([]);
const pagination = reactive({
  defaultCurrent: 1,
  defaultPageSize: 20,
  total: 0
})
const groupList = ref<any>([])
const list = ref([])
const keyword = ref('')
const groupId = ref(0)

onMounted(() => {
  loadGroupList(true)
})

//加载分组列表
const loadGroupList = (first=false)=>{
  const query:any = {}
  if(first){
    query.lp = 'load'
  }
  ApiPermissionGroups(query).then(({code, msg, data}: ApiResp)=>{
    if (code !== API_SUCCESS_CODE) {
      MessagePlugin.error(msg)
      return
    }
    if (data.group?.length) {
      groupList.value = data.group
      options.value = data.group.map((v:any) => ({label:v.name,value:v.id}))
      if (first) {
        groupId.value = data.group[0]?.id
        pagination.total = data.permissions.total
        list.value = data.permissions.list
      }
    }
  })
}
// 加载权限列表
const loadPermissionList = (page: number, size: number): void => {
  const param: any = { group_id:groupId.value,page: page, size: size }
  if (keyword.value) {
    param.keyword = keyword.value
  }
  ApiPermissionList(param).then(({code, msg, data}: ApiResp) => {
    if (code !== API_SUCCESS_CODE) {
      MessagePlugin.error(msg)
      return
    }
    pagination.total = data.total
    list.value = data.list || []
  })
}

// 搜索
const doSearch = debounce(()=>{
  pagination.defaultCurrent = 1
  loadPermissionList(1, pagination.defaultPageSize)
}, 800)

//切换分组
const switchGroup = (gid:number)=>{
  if (groupId.value !== gid) {
    groupId.value = gid
    loadPermissionList(pagination.defaultCurrent, pagination.defaultPageSize)
  }
}

// 分页改变时
const pageChange = ({ pagination }: any): void => {
  loadPermissionList(pagination.current, pagination.pageSize)
}

const showEdit = ref(false)
const showGroupEdit = ref(false)
const group = reactive({ id: 0, name: '', flag: '',sort:'' })
const permission = reactive({ id: 0, group_id:'', name: '', url: '', status: 1, log: 0 })

//编辑分组
const editGroup = (row: any): void => {
  group.id = row.id
  group.name = row.name
  group.flag = row.flag
  group.sort = row.sort
  showGroupEdit.value = true
}
const clearGroupForm = (): void => {
  group.id = 0
  group.sort = ''
  group.name = ''
  group.flag = ''
}
const editPerm = (row: any): void => {
  permission.id = row.id
  permission.group_id = row.group_id
  permission.name = row.name ? row.name : ''
  permission.log = row.log
  permission.url = row.url
  permission.status = row.status === 1 ? 0 : 1
  showEdit.value = true
}
const clearForm = (): void => {
  permission.id = 0
  permission.group_id = ''
  permission.name = ''
  permission.url = ''
  permission.status = 1
  permission.log = 0
}

// 添加|修改权限分组
const editGroupSubmit = () => {
  if (!group.name) {
    MessagePlugin.error('请填写分组名')
    return false
  } else if (group.flag && !(/^[a-z]{1,20}$/).test(group.flag)) {
    MessagePlugin.error('key只能是1~20位小写字母')
    return false
  }
  ApiAddPermissionGroup(group).then(({code,msg}: ApiResp) => {
    if (code !== API_SUCCESS_CODE) {
      MessagePlugin.error(msg)
      return
    }
    MessagePlugin.success(msg)
    loadGroupList()
    showGroupEdit.value = false
  })
}
// 删除分组
const delGroup = (idx:number,row:any)=>{
  if(row.pn > 0){
    MessagePlugin.error('该分组有权限，不可删除')
    return false
  }
  ApiDelSys({id:row.id,body:'permission_group'}).then(({code,msg}: ApiResp)=>{
    if (code !== API_SUCCESS_CODE) {
      MessagePlugin.error(msg)
      return
    }
    MessagePlugin.success(msg)
    groupList.value.splice(idx, 1)
  })
}

// 添加|修改权限
const editSubmit = () => {
  if (!permission.group_id) {
    MessagePlugin.error('请填选择分组')
    return false
  }else if (!permission.name) {
    MessagePlugin.error('请填写权限名')
    return false
  } else if (!permission.url) {
    MessagePlugin.error('请填写权限url')
    return false
  }
  const ePerm = { ...permission }
  ePerm.status = ePerm.status === 1 ? 0 : 1
  ApiAddPermission(ePerm).then(({code,msg}: ApiResp) => {
    if (code !== API_SUCCESS_CODE) {
      MessagePlugin.error(msg)
      return
    }
    MessagePlugin.success(msg)
    loadPermissionList(pagination.defaultCurrent, pagination.defaultPageSize)
    showEdit.value = false
  })
}

// 删除权限
const delPerm = (idx: number, id: number) => {
  ApiDelSys({ id: id, body: 'permission' }).then(({code,msg}: ApiResp) => {
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
    <div class="cate">
      <div class="add-group">
        <t-button theme="primary" @click="showGroupEdit = true">
          <template #icon><AddIcon /></template>
          添加分组
        </t-button>
      </div>
      <ul class="group">
          <li v-for="(v, i) in groupList" :class="{'group-item':true,'active':(groupId === v.id)}" :key="v.id">
            <div class="title" @click="switchGroup(v.id)">{{v.name}} <span class="group-num">({{v.pn}})</span></div>
            <div class="op">
              <span class="group-op-icon"><EditIcon style="color:var(--td-brand-color-6);" @click="editGroup(v)"/></span>
              <span class="group-op-icon">
                <t-popconfirm theme="warning" content="将删除此分组？" @confirm="delGroup(i, v)">
                  <MinusCircleIcon style="color:var(--td-error-color-6);"/>
                </t-popconfirm>
              </span>
            </div>
          </li>
      </ul>
    </div>
    <div class="permission">
      <div class="search">
        <t-button theme="primary" @click="showEdit = true">
        <template #icon><AddIcon /></template>
        添加权限
      </t-button>
      <t-input class="search-input" placeholder="搜索：名称/api" clearable v-model="keyword" @change="doSearch">
        <template #suffix-icon>
          <SearchIcon />
        </template>
      </t-input>
      </div>
      <t-table row-key="id" :columns="columns" :data="list" :pagination="pagination" size="small" stripe @change="pageChange">
        <template #status="{ row }">
          <t-tag v-if="row.status === 0" theme="success" variant="light">正常</t-tag>
          <t-tag v-else-if="row.status === 1" theme="danger" variant="light">已停用</t-tag>
        </template>
        <template #name="{ row }">
          <div class="edit-info">Name：{{ row.name }}</div>
          <div class="edit-info">Api：{{ row.url }}</div>
        </template>
        <template #creator="{ row }">
          <div class="edit-info">创建人：{{ row.creator || '-' }}</div>
          <div class="edit-info">修改人：{{ row.updater || '-' }}</div>
        </template>
        <template #created_at="{ row }">
          {{ datetime(row.created_at) }}
        </template>
        <template #op-col="{ rowIndex, row }">
          <a class="op op-edit" @click="editPerm(row)">编辑</a>
          <t-popconfirm theme="warning" content="确定删除此权限吗？" @confirm="delPerm(rowIndex, row.id)">
            <a class="op op-del">删除</a>
          </t-popconfirm>
        </template>
      </t-table>
    </div>
  </div>
  <t-dialog v-model:visible="showGroupEdit" header="编辑权限分组" mode="modal" placement="center" :on-confirm="editGroupSubmit"
    @closed="clearGroupForm">
    <template #body>
      <t-form ref="form" :data="group" :colon="true" :label-width="80">
        <t-form-item label="分组名" required-mark>
          <t-input v-model="group.name" clearable placeholder="请输入分组名" />
        </t-form-item>
        <t-form-item label="Key">
          <t-input v-model="group.flag" clearable placeholder="唯一key值，可不填" />
        </t-form-item>
        <t-form-item label="排序">
          <t-input type="number" v-model="group.sort" clearable :placeholder="`整数，数字越大越靠前，当前最大数: ${groupList[0]?.sort}`" />
        </t-form-item>
      </t-form>
    </template>
  </t-dialog>
  <t-dialog v-model:visible="showEdit" header="编辑权限" mode="modal" placement="center" :on-confirm="editSubmit" @closed="clearForm">
    <template #body>
      <t-form ref="form" :data="permission" :colon="true" :label-width="80">
        <t-form-item label="分组" required-mark>
          <t-select v-model="permission.group_id" placeholder="-请选择-" :options="options" filterable/>
        </t-form-item>
        <t-form-item label="权限名" required-mark>
          <t-input v-model="permission.name" clearable placeholder="请输入权限名" />
        </t-form-item>
        <t-form-item label="URL" required-mark>
          <t-input v-model="permission.url" clearable placeholder="请输入url" />
        </t-form-item>
        <t-form-item label="状态">
          <t-switch v-model="permission.status" :customValue="[1, 0]" size="large" :label="['正常', '禁用']" />
        </t-form-item>
        <t-form-item label="日志">
          <t-switch v-model="permission.log" :customValue="[1, 0]" size="large" :label="['开启', '关闭']" />
        </t-form-item>
      </t-form>
    </template>
  </t-dialog>
</template>

<style scoped lang="less">
.container{
  background-color: var(--td-bg-color-container); display: flex;
  gap: var(--td-size-4);
  .cate{
    flex-grow: 0;
  }
  .permission{
    flex-grow: 1;

    .search{
      padding: var(--td-size-4);display: flex;justify-content: space-between;
      &-input{
        width: 360px;
      }
    }
  }
  .add-group{
    padding: var(--td-size-4);width: 14vw;
  }
  .group{
    padding: var(--td-size-5) 0;max-height:80vh;overflow-y: scroll;
    &::-webkit-scrollbar{
        width: 6px;
        background-color: var(--td-bg-color-container);
    }
    &::-webkit-scrollbar-thumb{
        background-color:var(--td-gray-color-5);border-radius: 2px;
    }
    &-op-icon{
      padding-left: var(--td-size-3);
    }
    &-item{
      cursor: pointer;
      padding:0 var(--td-size-5);margin-bottom: var(--td-size-7);
    }
    &-num{
      font-size: var(--td-size-4);color: var(--td-gray-color-6);font-weight: normal;
    }
    .active{
      font-weight: bold;color: var(--td-brand-color-6);
    }
  }
}
.op{
  padding:0 var(--td-size-2);cursor: pointer;
  &-edit{
    color: var(--td-brand-color-6);
  }
  &-del{
    color: var(--td-error-color-6);
    }
}
</style>