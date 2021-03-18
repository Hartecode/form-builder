import React, { useState } from 'react'
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
  handleSubmit: (e: Option) => void;
  optionData: Option;
}

const OptionForm = ({ firstFieldRef, onCancel, handleSubmit, optionData }: Props) => {
  const [label, setLabel] = useState<string>(optionData.label);
  const [value, setValue] = useState<string>(optionData.value);
  const [sel, setSel] = useState<boolean>(optionData.selected);

  return (
      <Stack spacing={4}>
        <TextInput
          label="Label"
          id="label"
          ref={firstFieldRef}
          placeholder="Option Label"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          required
        />
        <TextInput 
          label="Value" 
          id="value" 
          placeholder="Option Value" 
          value={value}
          onChange={(e) => setValue(e.target.value)}
          required />
        <FormControl>
          <Checkbox 
             onChange={(e) => setSel(e.target.checked)}
             checked={sel}>
            Selected
          </Checkbox>
        </FormControl>
        <ButtonGroup d="flex" justifyContent="flex-end">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={() => handleSubmit({
            id: optionData.id,
            label,
            value,
            selected: sel
          })} colorScheme="teal">
            Submit
          </Button>
        </ButtonGroup>
      </Stack>
  )
}

export default OptionForm