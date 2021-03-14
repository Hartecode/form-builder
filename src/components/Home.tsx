import React from 'react';
import { 
  Heading,
  Stack,
  Input,
  FormControl,
  FormLabel,
  Textarea
} from "@chakra-ui/react"

const Home = () => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value)
  }

  return (
  <Stack as="main" spacing={6}>
    <Heading as="h1">
        Form Builder
    </Heading>
    <Stack as="form" spacing={6}>
        <FormControl>
            <FormLabel htmlFor="title">Title</FormLabel>
            <Input name="title" onChange={handleChange}
                placeholder="Form Title"
            />
        </FormControl>
        <FormControl>
            <FormLabel htmlFor="description">Description</FormLabel>
            <Textarea name="description"
                placeholder="Details about the form"
            />
        </FormControl>
    </Stack>
  </Stack>)
}

export default Home;