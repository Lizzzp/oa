import { http } from '@/utils/http';
import { AxiosError } from 'axios';

export type LinkMarkType = {
  id: number;
  keyword: string | null;
  promotion_intensity: string | null;
  head: {
    first_name: string;
  };
  link_id: string;
  sales_rank: string | null;
};
export type QueryParams = {
  filter?: object;
  limit?: number;
  page?: number;
  sort?: string;
};
export type TotalType = {
  countDistinct: {
    id: number;
  };
}[];

export type queryDataType = {
  shop?: string;
  conversion_rate_l?: number;
  conversion_rate_h?: number;
  sales_numbers?: number;
  linkids?: string[];
  begin_date?: string;
  end_date?: string;
  promotion_intensity?: string;
  sales_rank?: string;
  sales_volume?: number;
  profit_rate_l?: number;
  profit_rate_h?: number;
  p_r_l?: number;
  p_r_h?: number;
  head?: string;
} 



export const queryLinkMark = async (filter: queryDataType) => {
  try {
    const { data } = await http.request<{
      data: LinkMarkType[];
    }>('post', '/db/link/query', {
      data: filter
    });
    return data;
  } catch (error) {
    let errorMessage = 'unknown!';
    if (error instanceof AxiosError) {
      errorMessage = error.message;
    }
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return {
      message: errorMessage
    };
  }
};



export const updateLinkMark = async (
  keys: string[],
  data: Partial<LinkMarkType>
) => {
  try {
    const updateData: Partial<LinkMarkType> = {}
    for (const keysKey in data) {
      if (data[keysKey]) {
        updateData[keysKey] = data[keysKey];
      }
    }
    await await http.request<{
      data: LinkMarkType[];
    }>('delete', '/api/items/link_mark', {
      data: {
        keys
      }
    });

    const responseData = await http.request<{
      data: LinkMarkType[];
    }>('post', '/api/items/link_mark', {
      data:  keys.map(k => ({...updateData, link_id: k}))
    });
    if (responseData.data.length === keys.length) {
      return {
        message: 'success'
      };
    }
    return {
      message: 'error'
    };
  } catch (e) {
    return {
      message: 'error'
    };
  }
};
