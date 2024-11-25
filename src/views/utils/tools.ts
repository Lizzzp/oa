import moment from "moment";
import { getToken } from "@/utils/auth";
import defaultAvatarUrl from "@/assets/user.jpg";

export const formatDate = (date: string) => {
  const m = moment(date);
  return m.format("YYYY-MM-DD HH:mm:ss");
};
export const imgSrc = (src: string) => {
  if (!src) return "";
  return "api/assets/" + src + "?access_token=" + getToken();
};

export const getFileURL = (id: string) => {
  return id ? "api/assets/" + id + "?access_token=" + getToken() : "";
};

export const avatarImgSrc = (src: string) => {
  if (!src) return defaultAvatarUrl;
  return "api/assets/" + src + "?access_token=" + getToken();
};
