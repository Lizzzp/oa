import { http } from "@/utils/http";
export function useDirectusApi<T>(url: string, fields: string) {
  return {
    query_by_ids: async (ids: number[]) => {
      const { data = [] } = await http.request<{
        data: T[];
      }>("get", url, {
        params: {
          fields,
          filter: {
            _or: ids.map(id => {
              return {
                id: {
                  _eq: id
                }
              };
            })
          }
        }
      });
      return data;
    },
    query: async (params: {
      page?: number;
      limit?: number;
      fields?: string;
      sort?: string;
      filter?: object;
    }) => {
      params.fields = fields;
      const { data = [] } = await http.request<{
        data: T[];
      }>("get", url, {
        params
      });
      return data;
    },
    pager: async (params: {
      filter?: object;
      "aggregate[countDistinct]"?: string;
    }) => {
      params["aggregate[countDistinct]"] = "id";
      const response = await http.request<{
        data: Array<{
          countDistinct: {
            id: number;
          };
        }>;
      }>("get", url, {
        params
      });
      return response.data[0].countDistinct.id;
    },
    // 删除
    remove: (ids: number[]) => {
      return http.request("delete", url, {
        data: ids
      });
    },
    // 修改
    update: (id: number, data: T) => {
      return http.request<{
        data: T;
      }>("patch", url + "/" + id, {
        data
      });
    },

    // 创建
    create: (data: T) => {
      return http.request<{
        data: T;
      }>("post", url, {
        data
      });
    }
  };
}
