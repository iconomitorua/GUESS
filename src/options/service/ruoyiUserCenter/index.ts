import { paths } from "@/options/zeus/ruoyiUserCenter";
import { handleError } from "@/utils/tools";
import { clientPost, clientGet } from "../../apollo";

export async function ruoyiUserCenterGet<T extends keyof paths>(
  url: T,
  // @ts-ignore
  data?: paths[T]["get"]["parameters"]["query"]
  // @ts-ignore
): Promise<paths[T]["get"]["responses"][200]["content"]["*/*"]> {
  try {
    return await clientGet("/userCenter" + url, data);
  } catch (error: any) {
    handleError(error);
    throw error; // 改为抛出错误而不是返回
  }
}

export async function ruoyiUserCenterPost<T extends keyof paths>(
  url: T,
  // @ts-ignore
  data: paths[T]["post"]["requestBody"]["content"]["application/json"]
  // @ts-ignore
): Promise<paths[T]["post"]["responses"][200]["content"]["*/*"]> {
  try {
    return await clientPost("/userCenter" + url, data);
  } catch (error: any) {
    handleError(error);
    throw error; // 改为抛出错误而不是返回
  }
}
