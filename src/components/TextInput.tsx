import React from 'react'
import { 
  FormControl,
  FormLabel,
  Input
} from "@chakra-ui/react"

interface Props {
  id: string;
  label: string;
  [key: string]: unknown;
}

const TextInput = React.forwardRef((props: Props, ref: React.LegacyRef<HTMLInputElement>) => {
  return (
    <FormControl>
      <FormLabel htmlFor={props.id}>{props.label}</FormLabel>
      <Input ref={ref} id={props.id} {...props} />
    </FormControl>
  )
})

export default TextInput