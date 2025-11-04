import { PokemonImage, pokemonImages } from "./data";

// 随机获取一个宝可梦
export const getRandomPokemon = (): PokemonImage => {
  const randomIndex = Math.floor(Math.random() * pokemonImages.length);
  return pokemonImages[randomIndex];
};

// 根据名称搜索宝可梦
export const searchPokemonByName = (name: string): PokemonImage | undefined => {
  return pokemonImages.find(
    (p) => p.name.toLowerCase() === name.toLowerCase()
  );
};

// 导出宝可梦列表供搜索使用
export { pokemonImages };
