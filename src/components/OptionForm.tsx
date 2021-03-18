import React from 'react'
import { 
  Stack,
  ButtonGroup,
  Button,
  FormControl,
  Checkbox
} from "@chakra-ui/react"
import TextInput from './TextInput'
import { Option } from '../interface/store'

interface Props {
  firstFieldRef: React.Ref<HTMLInputElement>,
  onCancel: () => void;
  handleSubmit: (e) => void;
  optionData: Option;
}

const OptionForm = ({ firstFieldRef, onCancel, handleSubmit, optionData }: Props) => {
  return (
    <Stack as="form" onSubmit={handleSubmit} spacing={4}>
      <TextInput
        label="Label"
        id="label"
        ref={firstFieldRef}
        placeholder="Option Label"
        value={optionData.label}
        required
      />
      <TextInput 
        label="Value" 
        id="value" 
        placeholder="Option Value" 
        value={optionData.value}
        required />
      <FormControl>
        <Checkbox checked={optionData.selected}>
          Selected
        </Checkbox>
      </FormControl>
      <ButtonGroup d="flex" justifyContent="flex-end">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" colorScheme="teal">
          Submit
        </Button>
      </ButtonGroup>
    </Stack>
  )
}

export default OptionForm