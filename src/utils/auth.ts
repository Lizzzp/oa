import Cookies from 'js-cookie';
import { storageLocal } from '@pureadmin/utils';
import { useUserStoreHook } from '@/store/modules/user';
import type { AuthToken } from '@/api/auth';

export const userKey = 'user-info';
export const multipleTabsKey = 'multiple-tabs';

export function getToken(): [string, string] {
  return [
    Cookies.get('directus_access_token') || '',
    Cookies.get('directus_refresh_token') || ''
  ];
}

export function setToken(data: AuthToken) {
  // access_token保存1d
  Cookies.set('directus_access_token', data.access_token, {
    expires: (data.expires - 300000) / 86400000
  });
  Cookies.set('directus_refresh_token', data.refresh_token, {
    expires: 6.75
  });
  Cookies.set(multipleTabsKey, 'true');
}

export function setUserKey({
  avatar,
  first_name,
  role,
  email,
  id,
  expires,
  refresh_token
}) {
  useUserStoreHook().SET_AVATAR(avatar);
  useUserStoreHook().SET_FIRSTNAME(first_name);
  useUserStoreHook().SET_ROLE(role);
  useUserStoreHook().SET_EMAIL(email);
  useUserStoreHook().SET_ID(id);
  storageLocal().setItem(userKey, {
    avatar,
    first_name,
    role,
    email,
    id,
    expires,
    refresh_token
  });
}

export function removeToken() {
  Cookies.remove('directus_access_token');
  Cookies.remove('directus_refresh_token');
  Cookies.remove(multipleTabsKey);
  storageLocal().removeItem(userKey);
}
export function removeAccessToken() {
  Cookies.remove('directus_access_token');
}
