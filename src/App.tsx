import React from 'react';
// import logo from './logo.svg';
import './App.css';
import { ChakraProvider } from "@chakra-ui/react"
import { Container } from "@chakra-ui/react"
import StoreWrapper from './components/StoreWrapper'


function App() {
  return (
    <ChakraProvider resetCSS={true}>
        <Container className="" maxW="xl" position="relative">
            <StoreWrapper />
        </Container>
    </ChakraProvider>
  );
}

export default App;
