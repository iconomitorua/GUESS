
# 定义变量后粘贴原命令
# 服务器地址
BASE_URL="http://192.168.0.39:8080"
# 下载目录
OUTPUT_DIR="./src/options/zeus"
# 各种模块，后端新增模块此处相对应新增 node版本要在18以上
npx openapi-typescript "$BASE_URL/ruoyi-system/v3/api-docs" --output "$OUTPUT_DIR/ruoyiSystem.d.ts"
npx openapi-typescript "$BASE_URL/ruoyi-device-center/v3/api-docs" --output "$OUTPUT_DIR/ruoyiDeviceCenter.d.ts"
npx openapi-typescript "$BASE_URL/ruoyi-operation-center/v3/api-docs" --output "$OUTPUT_DIR/ruoyiOperationCenter.d.ts"
npx openapi-typescript "$BASE_URL/ruoyi-order-center/v3/api-docs" --output "$OUTPUT_DIR/ruoyiCardCenter.d.ts"
npx openapi-typescript "$BASE_URL/ruoyi-store-center/v3/api-docs" --output "$OUTPUT_DIR/ruoyiStoreCenter.d.ts"
npx openapi-typescript "$BASE_URL/ruoyi-gen/v3/api-docs" --output "$OUTPUT_DIR/ruoyiGen.d.ts"
npx openapi-typescript "$BASE_URL/ruoyi-file/v3/api-docs" --output "$OUTPUT_DIR/ruoyiFile.d.ts"
npx openapi-typescript "$BASE_URL/ruoyi-cash-center/v3/api-docs" --output "$OUTPUT_DIR/ruoyiCashCenter.d.ts"
npx openapi-typescript "$BASE_URL/ruoyi-shop-center/v3/api-docs" --output "$OUTPUT_DIR/ruoyiShopCenter.d.ts"
npx openapi-typescript "$BASE_URL/ruoyi-pay-center/v3/api-docs" --output "$OUTPUT_DIR/ruoyiPayCenter.d.ts"
npx openapi-typescript "$BASE_URL/ruoyi-admin/v3/api-docs" --output "$OUTPUT_DIR/ruoyiAdmin.d.ts"
npx openapi-typescript "$BASE_URL/ruoyi-user-center/v3/api-docs" --output "$OUTPUT_DIR/ruoyiUserCenter.d.ts"

