/* eslint-disable @typescript-eslint/no-explicit-any */
export const searchPokemonByName = async (_query: string) => {
  try {
    const response = await fetch(
      `https://vzfpdngnx5.us-east-1.awsapprunner.com/search/name/${_query}`
    );
    const data = await response.json();
    const pokemonDetails = await Promise.all(
      data.map(async (pokemon: any) => {
        const spriteResponse = await fetch(pokemon.url);
        const spriteData = await spriteResponse.json();
        return {
          ...pokemon,
          sprite: spriteData.sprites.front_default,
          ...spriteData,
        };
      })
    );
    return pokemonDetails;
  } catch (err) {
    return [];
  }
};

export const searchPokemonByType = async (_type: string) => {
  try {
    const response = await fetch(
      `https://vzfpdngnx5.us-east-1.awsapprunner.com/search/type/${_type}`
    );
    const data = await response.json();
    const pokemonDetails = await Promise.all(
      data.map(async (pokemon: any) => {
        const spriteResponse = await fetch(pokemon.url);
        const spriteData = await spriteResponse.json();
        return {
          ...pokemon,
          sprite: spriteData.sprites.front_default,
          ...spriteData,
        };
      })
    );
    return pokemonDetails;
  } catch (err) {
    return [];
  }
};

export const searchPokemonByNameAndType = async ({
  query,
  type,
}: {
  query?: string;
  type?: string;
}) => {
  try {
    const response = await fetch(
      `https://vzfpdngnx5.us-east-1.awsapprunner.com/search/nameAndType/${query}/${type ?? ""}`
    );
    const data = await response.json();
    const pokemonDetails = await Promise.all(
      data.map(async (pokemon: any) => {
        const spriteResponse = await fetch(pokemon.url);
        const spriteData = await spriteResponse.json();
        return {
          ...pokemon,
          sprite: spriteData.sprites.front_default,
          ...spriteData,
        };
      })
    );
    return pokemonDetails;
  } catch (err) {
    return [];
  }
};

export const findAllPokemons = async () => {
  try {
    const response = await fetch("https://vzfpdngnx5.us-east-1.awsapprunner.com/pokemons");
    const data = await response.json();
    const pokemonDetails = await Promise.all(
      data.slice(0, 30).map(async (pokemon: any) => {
        const spriteResponse = await fetch(pokemon.url);
        const spriteData = await spriteResponse.json();
        return {
          ...pokemon,
          sprite: spriteData.sprites.front_default,
          ...spriteData
        };
      })
    );
    return pokemonDetails;
  } catch (error) {
    return []
  } 
};
