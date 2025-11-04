import { paths } from "@/options/zeus/ruoyiSystem";
import { extend } from "lodash";
// post接口入参的类型定义
export type RuoyiSystemRequest<
  Path extends keyof paths,
  Method extends keyof paths[Path] = "post"
> = paths[Path][Method] extends {
  requestBody: {
    content: {
      "application/json": infer Body;
    };
  };
}
  ? Body
  : never;

// post接口返回参数的类型定义
export type RuoyiSystemResponse<
  Path extends keyof paths,
  Method extends keyof paths[Path] = "post"
> = paths[Path][Method] extends {
  responses: {
    "200": {
      content: {
        "*/*": infer Body;
      };
    };
  };
}
  ? Body
  : never;

// get接口返回列表类型定义
export type ruoyiSystemGetRequest<
  Path extends keyof paths,
  Method extends keyof paths[Path] = "get",
  ParamName extends GetQueryKeys<Path, Method> = GetQueryKeys<Path, Method>
> = paths[Path][Method] extends {
  parameters: {
    query: {
      [K in ParamName]: infer ParamType;
    };
  };
}
  ? ParamType
  : never;

// get接口返回参数的类型定义
export type RuoyiSystemGetResponse<
  Path extends keyof paths,
  Method extends keyof paths[Path] = "get"
> = paths[Path][Method] extends {
  responses: {
    "200": {
      content: {
        "*/*": infer Body;
      };
    };
  };
}
  ? Body
  : never;

// 辅助类型：获取query的所有键
type GetQueryKeys<
  Path extends keyof paths,
  Method extends keyof paths[Path]
> = paths[Path][Method] extends {
  parameters: {
    query: infer Query;
  };
}
  ? keyof Query
  : never;
