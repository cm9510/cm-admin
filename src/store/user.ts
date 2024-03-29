import { defineStore } from 'pinia'
import { TOKEN_NAME } from '@/lib/consts'
import { store } from '@/store'
import api from '@/lib/api';

export const useUserStore = defineStore('user', {
  state: () => {
    const _state = localStorage.getItem(TOKEN_NAME)
    if (_state) {
      return { ...JSON.parse(_state) }
    }
    return {
      nickname: '',
      roles: [],
      menus: [],
      token: ''
    }
  },
  actions: {
    setLogin(data: any) {
      this.$patch({ ...data });
      localStorage.setItem(TOKEN_NAME, JSON.stringify(data));
    },

    async logout() {
      await api.logout()
      this.$patch({
        nickname: '',
        roles: [],
        menus: [],
        token: ''
      });
      localStorage.removeItem(TOKEN_NAME);
    }
  },
});

export function getUserStore() {
  return useUserStore(store);
}
