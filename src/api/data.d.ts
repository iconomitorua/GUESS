export interface Card<T = any> {
    atkFrom?: T;
    atkTo?: T;
    attributeList?: T[];
    cardType?: T;
    defFrom?: T;
    defTo?: T;
    effectList?: T[];
    exclusionList?: T[];
    keyword?: T;
    keywordLang?: T;
    linkCondition?: T;
    linkMarkerList?: T[];
    mode?: T;
    otherCondition?: T;
    otherItemList?: T[];
    page: T;
    pageSize: T;
    penScaleList?: T[];
    searchType?: T;
    sort?: T;
    speciesList?: T[];
    starList?: T[];
    titleId?: T;
    ullist?: T;
    lang?: T;
    cardName?: T;
}

export interface CardInput {
    params: Card<string | number | string[] | number[]>;
}
