import { ChakraProvider } from "@chakra-ui/react";
import Pokedex from "./pages/Pokedex";

function App() {

  return (
    <ChakraProvider>
      <Pokedex />
    </ChakraProvider>
  )
}

export default App
