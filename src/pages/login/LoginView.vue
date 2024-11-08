<script setup lang="ts">
import { onMounted,reactive, ref } from '@vue/runtime-core'
import { useRouter } from 'vue-router'
import md5 from 'js-md5'
import { type ApiResp,API_SUCCESS_CODE } from '@/lib/consts'
import { MessagePlugin } from 'tdesign-vue-next'
import { DesktopIcon,LockOnIcon,ImageIcon,RefreshIcon} from 'tdesign-icons-vue-next'
import { useUserStore } from '@/store/user'
import { ApiGetCaptch, ApiLogin } from '@/lib/api'

const router = useRouter()
const captcha = ref('')
const { setLogin } = useUserStore()

onMounted(() => {
  refreshCaptch()
})

const refreshCaptch = ():void => {
    ApiGetCaptch({kw:'admin'}).then(({code,data}:  ApiResp) => {
      if (code === API_SUCCESS_CODE) {
        captcha.value = data.src
      }
    })
}
const formData = reactive({
  account: '',
  password: '',
  captcha: ''
})

const onSubmit = () => {
  if (!formData.account) {
    MessagePlugin.error('请填写用户名或手机号')
    return false
  } else if(!formData.password) {
    MessagePlugin.error('请填写密码')
    return false
  } else if(!formData.captcha) {
    MessagePlugin.error('请填写验证码')
    return false
  }
  ApiLogin({ account: formData.account, password: md5(formData.password), captcha: formData.captcha }).then(({ code, msg, data }: ApiResp) => {
    if (code !== API_SUCCESS_CODE) {
      MessagePlugin.error(msg)
      refreshCaptch()
      return
    }
    const menus: Array<string> = []
    const roles: Array<string> = []
    data.roles.map((item: any) => {
      menus.push(...item.roles.split(','))
      roles.push(item.key)
    })
    // 存入缓存
    setLogin({ nickname: data.nickname, role: roles, menus: menus, token: data.token})
    // 页面跳转
    setTimeout(() => router.push({ name: 'home' }), 300);
  })
}
</script>

<template>
<div class="login">
  <div class="login-form">
    <div class="title">后台管理系统</div>
    <div class="form">
      <t-form ref="form" :data="formData" :label-width="0" @submit="onSubmit">
        <t-form-item name="account">
          <t-input v-model="formData.account" clearable placeholder="用户名/手机号">
            <template #prefix-icon>
              <DesktopIcon />
            </template>
          </t-input>
        </t-form-item>
        <t-form-item name="password">
          <t-input v-model="formData.password" type="password" placeholder="请输入密码">
            <template #prefix-icon>
              <LockOnIcon />
            </template>
          </t-input>
        </t-form-item>
        <t-form-item name="captcha">
          <t-input-group separate>
            <t-input style="width:200px;" v-model="formData.captcha" clearable placeholder="图片验证码">
              <template #prefix-icon>
                <ImageIcon />
              </template>
            </t-input>
            <div class="captcha"><img :src="captcha" class="img" alt="captcha" /></div>
            <div class="refresh" @click="refreshCaptch"><RefreshIcon /></div>
          </t-input-group>
        </t-form-item>
        <t-form-item style="padding-top: 8px">
          <t-button theme="primary" type="submit" block>登录</t-button>
        </t-form-item>
      </t-form>
    </div>
  </div>
</div>
</template>

<style lang="less" scoped>
.login {
  background-color: var(--td-bg-color-page);
  height: 100%;
  overflow: hidden;

  &-form {
    background-color: var(--td-bg-color-container);
    width: 500px;
    border-radius: 5px;
    overflow: hidden;
    margin: 200px auto 0 auto;

    .title {
      text-align: center;
      font-weight: bold;
      font-size: 26px;
      background-color: var(--td-brand-color);
      color: white;
      padding: 16px 0;
    }
    .form {
      padding: 30px 50px;

      .captcha {
        width: 120px;
        height: 32px;
        background-color: #f3d10d;
        margin-left: 12px;
        .img {
          width: 100%;
        }
      }
      .refresh{
        padding:1px 5px;
        margin-left:8px;font-size:18px;cursor: pointer;
      }
    }
  }
}
</style>