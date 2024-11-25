import { http } from '@/utils/http';
import { useUserStoreHook } from '@/store/modules/user';
import type { RoleType } from '@/api/role';
type Collection = {
  meta: {
    hidden: boolean;
    collection: string;
    note: string;
    icon: string;
    sort: number;
    system?: boolean;
    group: string | null;
  };
};
type UniformMenu = {
  name: string;
  path: string;
  meta: {
    title: string;
    icon: string;
    rank: number;
    group: string;
    roles: string[];
    showLink: boolean;
  };
  children: UniformMenu[];
};
function uniformCollection(data: Collection[]): UniformMenu[] {
  const role = useUserStoreHook().role;
  return data
    .filter(item => {
      return !item.meta.hidden && !item.meta?.system;
    })
    .map(
      (item): UniformMenu => ({
        name: item.meta.collection,
        path: '/' + item.meta.collection,
        meta: {
          title: item.meta.note,
          icon: item.meta.icon ? 'el:' + item.meta.icon : 'el:folder',
          rank: item.meta.sort,
          group: item.meta.group,
          showLink: true,
          roles: [(role as RoleType).name]
        },
        children: []
      })
    );
}
function productMenuList(data: UniformMenu[], parent: UniformMenu[]) {
  const current: UniformMenu[] = [];
  const residue: UniformMenu[] = [];
  for (const item of data) {
    const parentRoute = parent.find(t => t.name === item.meta.group);
    if (parentRoute) {
      parentRoute.children.push(item);
      current.push(item);
      item.path = parentRoute.path + item.path;
    } else {
      residue.push(item);
    }
  }
  if (residue.length) {
    productMenuList(residue, current);
  }
}
async function collectionAPI() {
  let { data } = await http.request<{
    data: Collection[];
  }>('get', '/api/collections');
  const uniform = uniformCollection(data);

  const routes = uniform.filter(item => !item.meta.group);
  const residueRoutes = uniform.filter(item => item.meta.group);
  productMenuList(residueRoutes, routes);

  return { data: routes };
}
export const getAsyncRoutes = () => {
  return collectionAPI();
};
