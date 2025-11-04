// 宝可梦数据类型定义
export interface Pokemon {
  id: number;
  name: string; // 名称
  generation: string; // 世代 (G1-G9)
  types: string[]; // 属性 (火、水、草等)
  abilities: string[]; // 特性
  evolutionStage: number; // 进化阶段 (0=未进化, 1=1阶, 2=2阶)
  evolutionLevel?: string; // 进化条件
  bodyShape: string; // 体形
  color: string; // 颜色
  eggGroups: string[]; // 蛋群
  baseStats: number; // 种族值
  image?: string; // 图片URL
}

// 猜测记录
export interface GuessRecord {
  pokemon: Pokemon;
  matches: {
    generation: MatchType;
    types: MatchType;
    abilities: MatchType;
    evolutionStage: MatchType;
    evolutionLevel: MatchType;
    bodyShape: MatchType;
    color: MatchType;
    eggGroups: MatchType;
    baseStats: MatchType;
  };
}

// 匹配类型
export type MatchType = 'exact' | 'partial' | 'none';
