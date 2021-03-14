import React from 'react';
// import logo from './logo.svg';
import './App.css';
import { ChakraProvider } from "@chakra-ui/react"
import { Container, Button } from "@chakra-ui/react"
import Home from './components/Home'


function App() {
  return (
    <ChakraProvider resetCSS={true}>
        <Container className="" maxW="xl" >
            <header className="">
            </header>
            <Home />
            <footer>
                <Button colorScheme="teal" w="100%">Save</Button>
            </footer>
        </Container>
    </ChakraProvider>
  );
}

export default App;
