<script setup lang="ts">
import { onMounted } from '@vue/runtime-core'
import { reactive, ref } from '@vue/reactivity'
import { calculateDays, datetime } from '@/lib/utils'
import { API_SUCCESS_CODE, type ApiResp } from '@/lib/consts';
import { MessagePlugin } from 'tdesign-vue-next';
import md5 from 'js-md5'
import dayjs from 'dayjs';
import { ApiUpdateInfo, ApiUserInfo, ApiUserLogs } from '@/lib/api';

const showEdit = ref(false)
const greet = ref('你好')
const days = ref(0)
const baseInfo = reactive({
    nick: '',
    roles: [],
    phone: '',
})

onMounted(() => {
    //加载个人资料
    ApiUserInfo().then(({ code, msg, data }: ApiResp) => {
        if (code !== API_SUCCESS_CODE) {
            MessagePlugin.error(msg)
            return
        }
        baseInfo.nick = data.nickname
        baseInfo.phone = data.phone
        baseInfo.roles = data.roles
        days.value = calculateDays(data.created_at)
    })
    //加载日志
    loadLogs(pagination.defaultCurrent, pagination.defaultPageSize)
})

const member = reactive<any>({
    nickname: '',
    phone: '',
    password: '',
    password1: ''
})

// 添加|修改成员
const editSubmit = () => {
    const param: any = { nick: member.nickname }
    if (!member.nickname) {
        MessagePlugin.error('请填写昵称')
        return false
    }
    if (!(/^\d{3}\*{4}\d{4}$/).test(member.phone)) {
        if (!(/^1[3456789]\d{9}$/).test(member.phone)) {
            MessagePlugin.error('请填写正确的手机号')
            return false
        } else {
            param.phone = member.phone
        }
    }
    if (member.password.length) {
        if (member.password.length < 8 || member.password.length > 16) {
            MessagePlugin.error('密码长度为8~16位')
            return false
        } else if (member.password !== member.password1) {
            MessagePlugin.error('两次密码不一致')
            return false
        }
        param.password = md5(member.password)
    }
    ApiUpdateInfo(param).then(({code,msg,data}: ApiResp) => {
        if (code !== API_SUCCESS_CODE) {
            MessagePlugin.error(msg)
            return
        }
        baseInfo.nick = data.nickname
        baseInfo.phone = data.phone
        showEdit.value = false
    })
}
const loadInfo = () => {
    member.nickname = baseInfo.nick
    member.phone = baseInfo.phone
}

const columns = [
    { colKey: 'title', title: '标题' },
    { colKey: 'detail', title: '详情' },
    { colKey: 'ip', title: 'IP', },
    { colKey: 'created_at', title: '时间' },
]

const pagination = reactive({
    defaultCurrent: 1,
    defaultPageSize: 10,
    total: 0
})
// 日期时间选择器快捷
const presets = ref({
    最近7天: [dayjs().subtract(6, 'day'), dayjs()],
    最近3天: [dayjs().subtract(2, 'day'), dayjs()],
    今天: [dayjs(), dayjs()],
});
const list = ref([])
const range2 = ref([])

// 加载日志列表
const loadLogs = (page: number, size: number): void => {
    const param: any = { page: page, size: size }
    if (range2.value.length === 2) {
        param.range = range2.value
    }
    ApiUserLogs(param).then(({code,msg,data}: ApiResp) => {
        if (code !== API_SUCCESS_CODE) {
            MessagePlugin.error(msg)
            return
        }
        pagination.total = data.total
        list.value = data.list
    })
}

// 日志分页改变时
const pageChange = ({ pagination }: any): void => loadLogs(pagination.current, pagination.pageSize)
//时间日期范围改变
const rangeChange = (value: any) => {
    if (value.length === 2) {
        range2.value = value
        pagination.defaultCurrent = 1
    }
    loadLogs(pagination.defaultCurrent, pagination.defaultPageSize)
}
</script>
<template>
<div class="greet">
    <span class="greet-txt">Hi~ {{baseInfo.nick}}</span>{{greet}}，您已加入系统{{days}}天！
</div>
<div class="detail">
    <div class="info">
        <t-card title="账户信息" shadow>
            <template #actions>
                <a href="javascript:void(0)" @click="()=>showEdit=true">修改</a>
            </template>
            <div class="info-item">
                <p class="info-item-t">昵称</p>
                <p class="info-item-c">{{baseInfo.nick}}</p>
            </div>
            <div class="info-item">
                <p class="info-item-t">角色</p>
                <p class="info-item-c">
                    <t-tag v-for="(v) in baseInfo.roles" :key="v">{{ v }}</t-tag>
                </p>
            </div>
            <div class="info-item">
                <p class="info-item-t">手机号</p>
                <p class="info-item-c">{{baseInfo.phone}}</p>
            </div>
            <div class="info-item">
                <p class="info-item-t">密码</p>
                <p class="info-item-c">********</p>
            </div>
        </t-card>
    </div>
    <div class="log">
        <t-card title="日志" shadow>
            <t-date-range-picker v-model="range2" :presets="presets" enable-time-picker clearable @change="rangeChange"/>
            <t-table row-key="id" :columns="columns" :data="list" :pagination="pagination" size="small" @change="pageChange">
                <template #created_at="{ row }">
                {{ datetime(row.created_at) }}
                </template>
            </t-table>
        </t-card>
    </div>
</div>
<t-dialog v-model:visible="showEdit" header="修改资料" mode="modal" placement="center"
    :on-confirm="editSubmit" @opened="loadInfo">
    <template #body>
        <div class="edit-box">
        <t-form ref="form" :data="member" :colon="true" :label-width="80">
            <t-form-item label="昵称" required-mark>
                <t-input v-model="member.nickname" clearable placeholder="请输入成员名" />
            </t-form-item>
            <t-form-item label="手机号" required-mark>
                <t-input v-model="member.phone" clearable placeholder="+86 手机号" />
            </t-form-item>
            <t-divider>
                <span style="color:grey;font-size:13px;">不改密码请留空</span>
            </t-divider>
            <t-form-item label="新密码" :required-mark="member.id === 0">
                <t-input type="password" v-model="member.password" clearable placeholder="密码，最低8位数" autocomplete="off" />
            </t-form-item>
            <t-form-item label="确认密码" :required-mark="member.id === 0">
                <t-input type="password" v-model="member.password1" clearable placeholder="重复输入密码" autocomplete="off" />
            </t-form-item>
        </t-form>
        </div>
    </template>
</t-dialog>

</template>
<style scoped lang="less">
.greet{
    color: var(--td-text-color-secondary);
    background-color: var(--td-brand-color-5);
    border-radius: var(--td-radius-medium);
    padding: var(--td-size-10);
    &-txt{
        font-size: var(--td-size-8);margin-right: var(--td-size-10);
    }
}
.detail{
    margin-top: var(--td-size-6);padding: var(--td-size-4);
    background-color: var(--td-bg-color-container);
    border-radius: var(--td-radius-medium);
    display: flex; gap: var(--td-size-4);
    .info{
        width: 35%;
        &-item{
            margin-bottom: var(--td-size-5);
        }
        &-item-t{
            color: var(--td-text-color-placeholder);
        }
        &-item-c{
            padding: var(--td-size-1) 0;
        }
    }
   .log{
        width: 65%;
    }
}
</style>