import { clientPost, clientGet } from "../../apollo";

export async function ruoyiCardCenterGet<T>(
  url: T,
  // @ts-ignore
  data?: paths[T]["get"]["parameters"]["query"]
  // @ts-ignore
): Promise<paths[T]["get"]["responses"][200]["content"]["*/*"]> {
  try {
    return await clientGet(url, data);
  } catch (error: any) {
    // clientGet 内部已经处理了 handleError，这里直接抛出
    throw error;
  }
}

export async function ruoyiCardCenterPost<T>(
  url: T,
  // @ts-ignore
  data: paths[T]["post"]["requestBody"]["content"]["application/json"]
  // @ts-ignore
): Promise<paths[T]["post"]["responses"][200]["content"]["*/*"]> {
  try {
    return await clientPost(url, data);
  } catch (error: any) {
    // clientPost 内部已经处理了 handleError，这里直接抛出
    throw error;
  }
}
