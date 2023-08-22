<script setup lang="ts">
import { ApiRes, API_RES } from '@/lib/consts'
import api from '@/lib/api'
import { reactive, ref } from '@vue/reactivity'
import { onMounted } from '@vue/runtime-core'
import { datetime, Toast } from '@/lib/utils'
import md5 from 'js-md5'

const columns = [
  { colKey: 'idx', title: '序号', width: 80, align: 'center' },
  { colKey: 'nickname', title: '成员昵称' },
  { colKey: 'phone', title: '手机' },
  { colKey: 'roles', title: '角色' },
  { colKey: 'status', title: '状态', cell: 'status' },
  { colKey: 'last_login_at', title: '最近登入时间' },
  { colKey: 'create_at', title: '创建时间' },
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
  loadMembersList(pagination.defaultCurrent, pagination.defaultPageSize)
})

// 加载列表
const loadMembersList = (page: number, size: number, keyword = ''): void => {
  const param: any = { page: page, size: size }
  if (keyword) {
    param.keyword = keyword
  }
  api.memberList(param).then((res: ApiRes) => {
    if(res.code === API_RES.SUCCESS){
      pagination.total = res.data.total
      list.value = res.data.list
    }else{
      Toast(res.msg, 101)
    }
  })
}

// 搜索
const doSearch = (): void => {
  pagination.defaultCurrent = 1
  loadMembersList(1, pagination.defaultPageSize, keyword.value)
}

// 分页改变时
const pageChange = ({ pagination }:any): void => {
  loadMembersList(pagination.current, pagination.pageSize, keyword.value)
}

const showEdit = ref(false)
const member = reactive<any>({
  id: 0,
  nickname: '',
  phone: '',
  password:'',
  password1:'',
  roles: [],
  status: 1
})
const editMember = (row: any): void => {
  member.id = row.id
  member.nickname = row.nickname
  member.phone = row.phone
  member.status = row.status === 1 ? 0 : 1
  row.roles.map((v:any) => {
    member.roles.push(v.id)
  })
  showEdit.value = true
}

const allRoles = ref<any>([])
const loadRoles = ():void => {
  if(allRoles.value.length < 1){
    api.roleAll().then((res: ApiRes) => {
      if(res.code === API_RES.SUCCESS){
        allRoles.value = res.data
      }else{
        Toast(res.msg, 101)
      }
    })
  }
}
const clearaForm = ():void => {
  member.id = 0
  member.nickname = ''
  member.phone = ''
  member.password = ''
  member.roles = []
  member.status = 1
}

// 添加|修改成员
const editSubmit = () => {
  if (!member.nickname) {
    Toast('请填写成员名', 101)
    return false
  } else if (!member.phone) {
    Toast('请填写手机号', 101)
    return false
  } else if (!member.roles) {
    Toast('请分配角色', 101)
    return false
  }else if(member.id === 0 && member.password.length <8){
    Toast('密码最低8位', 101)
    return false
  }else if(member.id === 0 && member.password !== member.password1){
    Toast('两次密码不一致', 101)
    return false
  }
  member.password = ''
  const eMember = { ...member }
  eMember.status = eMember.status === 1 ? 0 : 1
  eMember.password = md5(eMember.password)
  api.addMember(eMember).then((res: ApiRes) => {
    Toast(res.msg, res.code)
    if (res.code === API_RES.SUCCESS) {
      loadMembersList(pagination.defaultCurrent, pagination.defaultPageSize, keyword.value)
      showEdit.value = false
    }
  })
}

// 删除成员
const delMember = (idx: number, id: number) => {
  api.delSys({ id: id,body:'member' }).then((res: ApiRes) => {
    Toast(res.msg, res.code)
    if (res.code === API_RES.SUCCESS) {
      list.value.splice(idx, 1)
      pagination.total -= 1
    }
  })
}
</script>

<template>
  <div class="container">
    <div class="operation">
      <div class="op-btn">
        <t-button theme="primary" @click="showEdit = true">
          <template #icon>
            <t-icon name="add" />
          </template>
          添加成员
        </t-button>
      </div>
      <div class="op-search">
        <t-input placeholder="搜索成员名" clearable v-model="keyword" @enter="doSearch">
          <template #prefix-icon>
            <t-icon name="search" />
          </template>
        </t-input>
      </div>
    </div>
    <div class="main">
      <t-table row-key="id" :columns="columns" :data="list" :pagination="pagination" size="small" @change="pageChange">
        <template #idx="{ rowIndex }">
          <b>{{rowIndex + 1}}</b>
        </template>
        <template #name="{row}">
          <p class="role-name">· {{row.name}}</p>
          <p class="role-desc">- {{row.desc}}</p>
        </template>
        <template #roles="{ row }">
          <span v-for="(v,i) in row.roles" :key="i">{{v.name}}</span>
        </template>
        <template #status="{ row }">
          <t-tag v-if="row.status === 0" theme="success" variant="light">正常</t-tag>
          <t-tag v-else-if="row.status === 1" theme="danger" variant="light">已停用</t-tag>
        </template>
        <template #last_login_at="{ row }">
          {{datetime(row.last_login_at)}}
        </template>
        <template #create_at="{ row }">
          {{datetime(row.create_at)}}
        </template>
        <template #op-col="{rowIndex, row}">
          <a class="op op-edit" @click="editMember(row)">编辑</a>
          <t-popconfirm theme="warning" content="您确定删除此成员吗？" @confirm="delMember(rowIndex, row.id)">
            <a class="op op-del">删除</a>
          </t-popconfirm>
        </template>
      </t-table>
    </div>
  </div>
  <t-dialog v-model:visible="showEdit" header="编辑成员" mode="modal" draggable width="850"
    :on-confirm="editSubmit" @opened="loadRoles" @closed="clearaForm">
    <template #body>
      <div class="edit-box">
        <t-form ref="form" :data="member" :colon="true" :label-width="80">
          <t-form-item label="成员名" required-mark>
            <t-input v-model="member.nickname" clearable placeholder="请输入成员名" />
          </t-form-item>
          <t-form-item label="手机号" required-mark>
            <t-input v-model="member.phone" clearable placeholder="+86 手机号" />
          </t-form-item>
          <t-form-item label="密码" :required-mark="member.id === 0">
            <t-input type="password" v-model="member.password" clearable placeholder="密码，最低8位数" />
          </t-form-item>
          <t-form-item label="确认密码" :required-mark="member.id === 0">
            <t-input type="password" v-model="member.password1" clearable placeholder="重复输入密码" />
          </t-form-item>
          <t-form-item label="角色" required-mark>
            <t-select v-model="member.roles" placeholder="请选择角色" multiple>
              <t-option v-for="(v, i) in allRoles" :key="i" :value="v.id" :label="v.name" />
            </t-select>
          </t-form-item>
          <t-form-item label="状态">
            <t-switch v-model="member.status" :customValue="[1,0]" size="large" :label="['正常','禁用']" />
          </t-form-item>
        </t-form>
      </div>
    </template>
  </t-dialog>
</template>

<style scoped lang="less">
@import url('./common.less');

</style>@/common/consts@/lib/consts@/lib/api@/lib/utils