import { paths } from "@/options/zeus/ruoyiStoreCenter";
import { handleError } from "@/utils/tools";
import { clientPost, clientGet } from "../../apollo";

export async function ruoyiStoreCenterGet<T extends keyof paths>(
  url: T,
  // @ts-ignore
  data?: paths[T]["get"]["parameters"]["query"]
  // @ts-ignore
): Promise<paths[T]["get"]["responses"][200]["content"]["*/*"]> {
  try {
    return await clientGet("/storeCenter" + url, data);
  } catch (error: any) {
    handleError(error);
    throw error; // 改为抛出错误而不是返回
  }
}

export async function ruoyiStoreCenterPost<T extends keyof paths>(
  url: T,
  // @ts-ignore
  data: paths[T]["post"]["requestBody"]["content"]["application/json"]
  // @ts-ignore
): Promise<paths[T]["post"]["responses"][200]["content"]["*/*"]> {
  try {
    return await clientPost("/storeCenter" + url, data);
  } catch (error: any) {
    handleError(error);
    throw error; // 改为抛出错误而不是返回
  }
}
