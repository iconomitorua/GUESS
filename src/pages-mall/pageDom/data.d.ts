import {
  RuoyiSystemRequest,
  RuoyiSystemResponse,
  ruoyiSystemGetRequest,
  RuoyiSystemGetResponse,
} from "@/options/service/ruoyiSystem/data";
// 创建的类型定义
export type UserInput = RuoyiSystemRequest<"">;
// 创建成功后的返回参数类型定义
export type UserResult = RuoyiSystemResponse<"/banner-img/list">;
// 获取列表后的类型定义
export type UserList = ruoyiSystemGetRequest<"/user/list", "get", "user">;
// 获取列表需要的参数类型定义
export type Admin = RuoyiSystemRequest<"/admin/list", "post",>;
