/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Card,
  CardBody,
  CardHeader,
  Flex,
  Heading,
  Image,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  SimpleGrid,
  Spinner,
  theme,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import { useEffect, useState } from "react";
import {
  findAllPokemons,
  searchPokemonByName,
  searchPokemonByNameAndType,
  searchPokemonByType,
} from "../api/pokemonApi";
import Pagination from "../components/Pagination";
import { debounce } from "../utils/debounce";

interface Pokemon {
  id: number;
  name: string;
}

const Pokedex = () => {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [type, setType] = useState<string | undefined>(undefined);
  const [query, setQuery] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(9);

  const handleSearch = debounce(
    async (action: React.ChangeEvent<HTMLInputElement>) => {
      const _query = action.target.value;
      setQuery(_query);
      setIsLoading(true);

      let result;
      if (_query === "" && type === undefined) {
        result = await findAllPokemons();
      } else if (_query === "" && type !== undefined) {
        result = await searchPokemonByType(type as string);
      } else if (_query !== "" && type === undefined) {
        result = await searchPokemonByName(_query);
      } else {
        result = await searchPokemonByNameAndType({
          query: _query,
          type,
        });
      }

      setCurrentPage(1);
      setIsLoading(false);
      setPokemons(result);
    },
    500
  );

  useEffect(() => {
    const fetchPokemons = async () => {
      setIsLoading(true);
      const result: Pokemon[] = await findAllPokemons();
      setPokemons(result);
      setIsLoading(false);
    };
    fetchPokemons();
  }, []);

  const handleTypeChange = (_type: React.ChangeEvent<HTMLSelectElement>) => {
    if (_type.target.value === "") {
      setType(undefined);
      return;
    }
    setType(_type.target.value);
  };

  useEffect(() => {
    if (type && isLoading === false && query !== "") {
      setIsLoading(true);
      searchPokemonByNameAndType({
        query,
        type,
      }).then((result: Pokemon[]) => {
        setPokemons(result);
      });
      setCurrentPage(1);
      setIsLoading(false);
    }
  }, [type, query]);

  useEffect(() => {
    if (type && query === "") {
      const fetchPokemons = async () => {
        setIsLoading(true);
        const result: Pokemon[] = await searchPokemonByType(type as string);
        setCurrentPage(1);
        setPokemons(result);
        setIsLoading(false);
      };
      fetchPokemons();
    }
  }, [type]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = pokemons.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <Flex flexDirection="column" justifyContent="center" height="100%">
      <Flex justifyContent="center" mt="2rem">
        <InputGroup maxWidth="20rem">
          <InputLeftElement pointerEvents="none">
            {isLoading ? <Spinner /> : <SearchIcon color="gray.300" />}
          </InputLeftElement>
          <Input
            placeholder="Pesquisar Pokemon"
            width="20rem"
            onChange={handleSearch}
          />
        </InputGroup>
        <Select
          placeholder="Ordenar por tipo"
          width="11rem"
          ml="1rem"
          onChange={handleTypeChange}
          value={type}
        >
          <option value="bug">Bug</option>
          <option value="dark">Dark</option>
          <option value="dragon">Dragon</option>
          <option value="electric">Electric</option>
          <option value="fairy">Fairy</option>
          <option value="fighting">Fighting</option>
          <option value="fire">Fire</option>
          <option value="flying">Flying</option>
          <option value="ghost">Ghost</option>
          <option value="grass">Grass</option>
          <option value="ground">Ground</option>
          <option value="ice">Ice</option>
          <option value="normal">Normal</option>
          <option value="poison">Poison</option>
          <option value="psychic">Psychic</option>
          <option value="rock">Rock</option>
          <option value="steel">Steel</option>
          <option value="water">Water</option>
        </Select>
      </Flex>
      <Flex justifyContent="center" alignItems="center" my="3rem">
        <SimpleGrid
          width={{ base: "100%", md: "50%" }}
          justifyContent="center"
          spacing={4}
          templateColumns="repeat(auto-fill, minmax(256px, 5fr))"
        >
          {currentItems.map((pokemon: Pokemon) => (
            <Card
              key={JSON.stringify(pokemon)}
              _hover={{
                backgroundColor: theme.colors.gray[100],
                cursor: "pointer",
              }}
            >
              <CardHeader>
                <Heading size="md">{pokemon?.name}</Heading>
              </CardHeader>
              <CardBody display="flex" justifyContent="center">
                <Image
                  objectFit="cover"
                  src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${pokemon.id}.png`}
                  width="150px"
                  height="150px"
                />
              </CardBody>
            </Card>
          ))}
          {!currentItems.length && !isLoading ? (
            <Heading>Nenhum pokemon encontrado</Heading>
          ) : null}
        </SimpleGrid>
      </Flex>
      {currentItems.length ? (
        <Pagination
          itemsPerPage={itemsPerPage}
          totalItems={pokemons.length}
          paginate={paginate}
          currentPage={currentPage}
        />
      ) : null}
    </Flex>
  );
};

export default Pokedex;
