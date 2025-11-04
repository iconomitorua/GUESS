// 宝可梦图片数据
export interface PokemonImage {
    id: number;
    name: string;
    imageUrl: string;
}

// 宝可梦图片列表（使用在线图片）
export const pokemonImages: PokemonImage[] = [
    {
        id: 1,
        name: "胖丁",
        imageUrl: "https://img2.baidu.com/it/u=1324538537,248929789&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=1082"
    },
    {
        id: 2,
        name: "小火龙",
        imageUrl: "https://ww2.sinaimg.cn/mw690/008g8FqPly1hpzio78ucgj30j615i3zm.jpg"
    },
    {
        id: 3,
        name: "火伊布",
        imageUrl: "https://img2.baidu.com/it/u=348607952,4233938627&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=1080"
    },
    {
        id: 4,
        name: "火爆鼠",
        imageUrl: "https://img0.baidu.com/it/u=20828549,4206379660&fm=253&fmt=auto&app=120&f=JPEG?w=500&h=707"
    },
];

// 游戏模式
export type GameMode = 'mosaic' | 'partial';

// 游戏难度配置
export interface GameConfig {
    mosaicLevel: number; // 马赛克程度 (1-20)
    blockSize: number; // 局部显示块大小 (20-100)
    maxAttempts: number; // 最大尝试次数
}
