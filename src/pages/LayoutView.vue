<script setup lang="ts">
import { businessRoutes } from '@/router/business'
import { useUserStore } from '@/store'
import { ref } from '@vue/reactivity'
import { onMounted } from 'vue'
import { RouteRecordRaw, useRouter } from 'vue-router'


const router = useRouter()
const userStore = useUserStore()
const menuList = ref<any>([])

onMounted(()=>{
  const {menus, token} = userStore
  
  if(token && menus.length){
    businessRoutes.map((item:RouteRecordRaw, _) => {
      if(item.children?.length){ //有二级的
        let _sub:any = []
        item.children.map(sub => {
          if(menus.indexOf(sub.name) >= 0 && !sub.meta?.hide){
            _sub.push({
              path: sub.path,
              title: sub.meta?.title
            })
          }
        })
        if(_sub.length > 0){
          menuList.value.push({
            path: item.path,
            title: item.meta?.title,
            icon: item.meta?.icon,
            sub:_sub
          })
        }
      }else if((!item.children || !item.children.length) && !item.meta?.hide){ //没有二级的
        menuList.value.push({
          path: item.path,
          title: item.meta?.title,
          icon: item.meta?.icon,
          sub:[]
        })
      }
    })    
  }else{
    router.push({path: '/login'})
  }
})

const collapsed = ref(false)
const iconUrl = ref('https://www.tencent.com/img/index/menu_logo_hover.png')
const changeCollapsed = () => {
  collapsed.value = !collapsed.value
  iconUrl.value = collapsed.value
    ? 'https://oteam-tdesign-1258344706.cos.ap-guangzhou.myqcloud.com/site/logo%402x.png'
    : 'https://www.tencent.com/img/index/menu_logo_hover.png'
}

const account = [
  { content: '账号信息', value: 'account' },
  { content: '退出', value: 'logout' }
]
const clickHandler = ({ value }:any) => {
  if(value === 'logout'){
    userStore.logout()
    router.push({path: '/login'})
  }
}

const showSetting = ref(false)
const themeMode = ref('light')
const setMode = (mode: string) => {
  themeMode.value = mode
  if (mode === 'dark') {
    document.documentElement.setAttribute('theme-mode', 'dark')
  } else {
    document.documentElement.removeAttribute('theme-mode')
  }
}

const colorOptions = [
  { type: 'default', value: '#0052D9' },
  { type: 'cyan', value: '#0594FA' },
  { type: 'green', value: '#00A870' },
  { type: 'yellow', value: '#EBB105' },
  { type: 'orange', value: '#ED7B2F' },
  { type: 'red', value: '#E34D59' },
  { type: 'pink', value: '#ED49B4' },
  { type: 'purple', value: '#834EC2' }
]
const themeColor = ref('default')
const checkColor = (color: string) => {
  themeColor.value = color
  document.documentElement.setAttribute('theme-color', color)
}

const navTo = (path:string) => {
  router.push({path: path})
}
</script>

<template>
  <div class="layout">
    <div class="layout-left">
      <div class="brand">
        <img :width="collapsed ? 48 : 136" :src="iconUrl" alt="logo" />
      </div>
      <div class="menus">
        <t-menu :theme="themeMode" width="210px" :collapsed="collapsed">
          <template v-for="(v, i) in menuList" :key="i">
            <t-submenu v-if="v.sub && v.sub.length" :title="v.title" :value="`${i+1}`">
              <template #icon>
                <t-icon :name="v.icon" />
              </template>
              <t-menu-item v-for="(sub, j) in v.sub" :value="sub.path" :key="j" @click="navTo(v.path+'/'+sub.path)">
                {{sub.title}}
              </t-menu-item>
            </t-submenu>
            <t-menu-item v-else :value="`${i+1}`" @click="navTo(v.path)">
              <template #icon>
                <t-icon :name="v.icon" />
              </template>
              {{v.title}}
            </t-menu-item>
          </template>
        </t-menu>
      </div>
    </div>
    <div class="layout-right">
      <div class="top-col">
        <t-head-menu :theme="themeMode" expand-type="popup">
          <template #logo>
            <t-icon class="t-menu__operations-icon" name="view-list" @click="changeCollapsed" />
          </template>
          <template #operations>
            <t-dropdown :options="account" :min-column-width="112" @click="clickHandler">
              <t-button variant="text">
                <t-icon size="large" name="user" /> {{userStore.nickname}}
              </t-button>
            </t-dropdown>
            <a href="javascript:;" @click="showSetting = !showSetting">
              <t-icon class="t-menu__operations-icon" name="setting" />
            </a>
          </template>
        </t-head-menu>
      </div>
      <div class="content">
        <router-view />
      </div>
    </div>
  </div>
  <t-drawer v-model:visible="showSetting" placement="right" :footer="false" size="medium" header="页面设置">
    <p>主题模式</p>
    <div class="mode">
      <div>
        <div :class="{'mode-item':true, 'checked':(themeMode === 'light')}"
          @click="setMode('light')">
          <div class="inner light">
            <t-icon name="star-filled" size="25" />
          </div>
        </div>
        <p class="txt">明亮</p>
      </div>
      <div>
        <div :class="{'mode-item':true, 'checked':(themeMode === 'dark')}" @click="setMode('dark')">
          <div class="inner dark">
            <t-icon name="star-filled" size="25" />
          </div>
        </div>
        <p class="txt">暗黑</p>
      </div>
    </div>
    <p style="margin-top:14px;">主题色</p>
    <div class="theme-color">
      <div class="theme-item" v-for="(v, i) in colorOptions.slice(0,colorOptions.length-1)" :key="i"
        :style="`background-color:${v.value};`" @click="checkColor(v.type)">
        <t-icon v-show="themeColor === v.type" class="theme-check" name="check"></t-icon>
      </div>
    </div>
  </t-drawer>
</template>

<style scoped lang="less">
@topHeight: 65px;

.layout {
  display: flex;
  height: 100%;

  &-left {
    flex-grow: 0;
    position: relative;

    .brand {
      width: 100%;
      z-index: 99;
      background-color: var(--td-bg-color-container);
      border-bottom: 1px solid var(--td-border-level-1-color);
      height: @topHeight;
      line-height: @topHeight;
      text-align: center;
      position: sticky;
      top: 0;
      left: 0;
    }
    .menus {
      height: calc(100% - @topHeight);
    }
  }

  &-right {
    flex-grow: 1;
    background-color: var(--td-bg-color-page);

    .top-col {
      border-bottom: 1px solid var(--td-border-level-1-color);
      position: sticky;
      top: 0;
      right: 0;
      z-index: 99;
    }
    .content {
      height: calc(100% - @topHeight);
      overflow-y: scroll;
      padding: 12px;
    }
  }
}
:deep(.t-menu__logo:not(:empty)){
  margin-left: 10px;
  .t-icon {
    cursor: pointer;
  }
}

.mode {
  display: flex;
  justify-content: space-around;

  &-item {
    border: 2px solid #bbbbbb;
    padding: 6px;
    border-radius: 6px;
    cursor: pointer;

    .inner {
      display: block;
      width: 100px;
      height: 50px;
      text-align: center;
      line-height: 50px;
    }
    .light {
      background-color: #dfdfdf;
      color: #818181;
    }
    .dark {
      background-color: #141414;
      color: #dfdfdf;
    }
  }
  .txt {
    text-align: center;
  }

  .checked {
    border-color: #336bd3;
  }
}

.theme {
  &-color {
    display: flex;
    padding: 6px 0;
    justify-content: space-around;
  }
  &-item {
    cursor: pointer;
    line-height: 30px;
    text-align: center;
    border-radius: 50%;
    width: 30px;
    height: 30px;
  }
  &-check {
    color: white;
    font-size: 24px;
  }
}
</style>