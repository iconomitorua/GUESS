// 游戏王卡片数据类型定义
export interface YugiohCard {
  id: number;
  cardId: number; // 卡片ID
  cardName: string; // 卡片名称
  cardType: string; // 卡片类型（怪兽、魔法、陷阱）
  attributeName: string; // 属性（光属性、暗属性、水属性等 / 魔法陷阱的速攻、永续等）
  speciesName: string[]; // 种族（龙族、战士族等）
  starchip: number; // 星级/等级
  atk: number; // 攻击力
  def: number; // 防御力
  effectName: string; // 效果名称
  otherItemNameList: string[]; // 类型列表（融合、同步、超量、连接等）
  penScale: number; // 灵摆刻度
  linkMarkerCount: number; // Link数量
  cardText?: string; // 卡片效果描述
  imageKey?: string; // 图片密钥
}

// 为了兼容性，保留 Pokemon 别名
export type Pokemon = YugiohCard;

// 猜测记录
export interface GuessRecord {
  cardInfo: YugiohCard;
  matches: {
    attributeName: MatchType; // 属性匹配
    speciesName: MatchType; // 种族匹配
    starchip: MatchType; // 星级匹配
    atk: MatchType; // 攻击力匹配
    def: MatchType; // 防御力匹配
    otherItemNameList: MatchType; // 类型匹配
    penScale: MatchType; // 灵摆刻度匹配
    linkMarkerCount: MatchType; // Link数量匹配
  };
}

// 匹配类型
export type MatchType = 'exact' | 'partial' | 'none';
