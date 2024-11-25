
import { http } from '@/utils/http';

export interface RoleType {
  id: string;
  name: string;
  parent: string;
  children: string[];
}
export const permissionAPI = async () => {
  const { data } = await http.request<{
    data: RoleType;
  }>('get', '/api/permissions/me');
  return data;
};
