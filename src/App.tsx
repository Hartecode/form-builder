import React from 'react';
// import logo from './logo.svg';
import './App.css';
import { ChakraProvider } from "@chakra-ui/react"
import { Container, Button } from "@chakra-ui/react"
import StoreWrapper from './components/StoreWrapper'


function App() {
  return (
    <ChakraProvider resetCSS={true}>
        <Container className="" maxW="xl" >
            <header className="">
            </header>
            <StoreWrapper />
            <footer>
                <Button colorScheme="teal" w="100%">Save</Button>
            </footer>
        </Container>
    </ChakraProvider>
  );
}

export default App;
