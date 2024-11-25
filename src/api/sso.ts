import { http } from "@/utils/http/index";

export function sso() {
  return http.request("post", "/api/auth/refresh", {
    data: {
      mode: "cookie"
    }
  });
}
