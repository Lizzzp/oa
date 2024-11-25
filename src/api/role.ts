import { http } from '@/utils/http';

export interface RoleType {
  id: string;
  name: string;
  parent: string;
  children: string[];
}
export const roleAPI = async (id: string) => {
  const { data } = await http.request<{
    data: RoleType;
  }>('get', '/api/roles' + '/' + id);
  return data;
};
