import { http } from '@/utils/http';
export interface AuthToken {
  access_token: string;
  expires: number;
  refresh_token: string;
}

export const loginAPI = async ({
  email,
  password
}: {
  email: string;
  password: string;
}) => {
  try {
    const data = await http.request<{
      data: AuthToken;
    }>('post', '/api/auth/login', {
      data: {
        email,
        password,
        mode: 'json'
      }
    });
    return data.data;
  } catch (e) {
    throw e;
  }
};
/** 刷新`token` */
export const refreshAPI = async (refresh_token: string) => {
  const { data } = await http.request<{
    data: AuthToken;
  }>('post', '/api/auth/refresh', {
    data: {
      refresh_token,
      mode: 'json'
    }
  });
  return data;
};
