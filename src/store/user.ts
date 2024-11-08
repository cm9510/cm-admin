import { defineStore } from 'pinia'
import { TOKEN_NAME } from '@/lib/consts'
import { ref } from 'vue';
import { ApiLogout } from '@/lib/api';

export const useUserStore = defineStore('user', () => {
  const nickname = ref('')
  const roles = ref([])
  const menus = ref<any>([])
  const token = ref('')

  const setLogin = (data: any) => {
    if (data.nickname) {
      nickname.value = data.nickname
    }
    if (data.roles) {
      roles.value = data.roles
    }
    if (data.menus) {
      menus.value = data.menus
    }
    if (data.token) {
      token.value = data.token
    }
    localStorage.setItem(TOKEN_NAME, JSON.stringify({
      nickname: nickname.value,
      roles: roles.value,
      menus: menus.value,
      token: token.value
    }));
  }

  const logout = ()=>{
    ApiLogout().then(()=>{
      nickname.value = ''
      menus.value = []
      roles.value = []
      token.value = ''
      localStorage.removeItem(TOKEN_NAME);
    })
  }

  return { nickname, roles, menus, token, setLogin, logout }
});
