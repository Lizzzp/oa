import { http } from '@/utils/http';
import { AxiosError } from 'axios';

export type LinkType = {
  id: number;
  shop: string | null;
  promotion_intensity: string | null;
  primary_image_url: string | null;
  url: string | null;
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
export const LinkUrl = '/api/items/link';
export const queryLink = async ({ filter, limit, sort, page }: QueryParams) => {
  try {
    const { data } = await http.request<{
      data: LinkType[];
    }>('get', LinkUrl, {
      params: {
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

export const queryLinkTotal = async ({ filter }: QueryParams) => {
  try {
    const response = await http.request<{
      data: TotalType;
    }>('get', LinkUrl, {
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
