// import { mutation, query } from "@/util/graphql";
// import { ValueTypes, $ } from "@/util/graphql/zeus";

// // 微信登录s
// export const updateLoginWithWechatCode = (
//   input: ValueTypes["LoginWithWechatCodeInput"]
// ) => {
//   return mutation(
//     {
//       loginWithWechatCode: [
//         {
//           input: $`input`,
//         },
//         {
//           // refreshToken: true,
//           accessToken: true,
//         },
//       ],
//     },
//     { variables: { input } }
//   );
// };

// // 微信登录 botton
// export const pdateLoginWithWechatPhoneCode = (
//   input: ValueTypes["LoginWithWechatPhoneCodeInput"]
// ) => {
//   return mutation(
//     {
//       loginWithWechatPhoneCode: [
//         {
//           input: $`input`,
//         },
//         {
//           accessToken: true,
//         },
//       ],
//     },
//     { variables: { input } }
//   );
// };

// // 获取sotreId
// export const queryMpConfig = (params: any) => {
//   return query(
//     {
//       queryMpConfig: [
//         {
//           appId: $`appId`,
//         },
//         {
//           storeId: true,
//           tenantId: true,
//         },
//       ],
//     },
//     {
//       variables: params,
//     }
//   );
// };
