import { http } from '@/utils/http';
export interface Profile {
  first_name: string;
  email: string;
  id: string;
  role: string;
  avatar: string;
}
export async function meAPI() {
  const { data } = await http.request<{
    data: Profile;
  }>('get', '/api/users/me');
  console.log(data);
  return data;
}
