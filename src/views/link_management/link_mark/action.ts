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
export const LinkMarkUrl = '/api/items/link_mark';
export const queryLinkMark = async ({
  filter,
  limit,
  sort,
  page
}: QueryParams) => {
  try {
    const { data } = await http.request<{
      data: LinkMarkType[];
    }>('get', LinkMarkUrl, {
      params: {
        fields: '*,head.first_name,link_id.*',
        filter,
        limit,
        sort,
        page
      }
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

export const queryLinkMarkTotal = async ({ filter }: QueryParams) => {
  try {
    const response = await http.request<{
      data: TotalType;
    }>('get', LinkMarkUrl, {
      params: {
        'aggregate[countDistinct]': 'id',
        filter
      }
    });
    return response.data[0].countDistinct.id;
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
    const responseData = await http.request<{
      data: LinkMarkType[];
    }>('patch', LinkMarkUrl, {
      data: {
        data: updateData,
        keys
      }
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
