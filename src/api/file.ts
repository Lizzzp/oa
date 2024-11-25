import { http } from '@/utils/http';
import type { UploadFile } from 'element-plus';

export interface File {
  id: string;
  title: string;
}

export function uploadFileAPI(file: UploadFile) {
  const data = new FormData();
  data.append('title', file.name);
  data.append('file', file.raw);
  return http.post<
    {
      data: File;
    },
    FormData
  >(
    '/api/files',
    {
      data
    },
    {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }
  );
}

export const getFile = (id: String): Promise<Blob> => {
  return http.get(`/api/assets/${id}?key=small&download=true`, {
    responseType: 'blob'
  });
};
export const getFileByID = (
  id: String
): Promise<{
  data: File;
}> => {
  return http.get(`/api/files/${id}`);
};
