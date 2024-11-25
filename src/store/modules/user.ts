import { defineStore } from 'pinia';
import {
  store,
  router,
  resetRouter,
  routerArrays,
  storageLocal
} from '../utils';

import { type AuthToken, loginAPI, refreshAPI } from '@/api/auth';
import { useMultiTagsStoreHook } from './multiTags';
import {
  setToken,
  setUserKey,
  removeToken,
  userKey,
  getToken
} from '@/utils/auth';

import { meAPI, type Profile } from '@/api/me';
import { roleAPI } from '@/api/role';

export const useUserStore = defineStore({
  id: 'pure-user',
  state: (): {
    role: { id: string; name: string; admin_access: boolean } | {};
    id: string;
    avatar: string;
    first_name: string;
    email: string;
  } => ({
    //ID
    id: storageLocal().getItem<Profile>(userKey)?.id,
    // 头像
    avatar: storageLocal().getItem<Profile>(userKey)?.avatar ?? '',
    // 用户名
    first_name: storageLocal().getItem<Profile>(userKey)?.first_name ?? '',
    // 页面级别权限
    role: storageLocal().getItem<Profile>(userKey)?.role ?? {},
    email: storageLocal().getItem<Profile>(userKey)?.email ?? ''
  }),
  actions: {
    /** 存储头像 */
    SET_AVATAR(avatar: string) {
      this.avatar = avatar;
    },
    /** 存储用户名 */
    SET_FIRSTNAME(first_name: string) {
      this.first_name = first_name;
    },
    SET_ID(id: string) {
      this.id = id;
    },
    SET_EMAIL(email: string) {
      this.email = email;
    },
    /** 存储角色 */
    SET_ROLE(role: object) {
      this.role = role;
    },

    /** 登入 */
    async loginByEmail({
      email,
      password
    }: {
      email: string;
      password: string;
    }) {
      try {
        const authToken: AuthToken = await loginAPI({ email, password });
        setToken(authToken);
        const userInfo = await meAPI();
        const role = await roleAPI(userInfo.role);

        let data = { ...authToken, ...userInfo, role };
        setUserKey(data);
        return data;
      } catch (error) {
        throw error;
      }
    },
    /** 前端登出（不调用接口） */
    logOut() {
      this.first_name = '';
      this.id = '';
      this.role = {};
      this.email = {};
      removeToken();
      useMultiTagsStoreHook().handleTags('equal', [...routerArrays]);
      resetRouter();
      router.push('/login').then(r => console.log(r));
    },
    /** 刷新`token` */
    async refreshToken() {
      try {
        const authToken = await refreshAPI(getToken()[1]);
        setToken(authToken);
        const userInfo = await meAPI();
        const role = await roleAPI(userInfo.role);
        const data = { ...authToken, ...userInfo, role };
        setUserKey(data);
        return data;
      } catch (error) {
        throw error;
      }
    }
  }
});
export function useUserStoreHook() {
  return useUserStore(store);
}
