import React, { useState, useEffect } from 'react'
import { 
  Heading,
  Stack,
  Input,
  FormControl,
  FormLabel,
  Select,
  Checkbox,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from "@chakra-ui/react"
import DynamicList, { ComponentOption } from './DynamicList'
import { DropResult } from "react-beautiful-dnd"
import { FormGroup } from '../scripts/formGroup'
import { Root } from '../scripts/store'
import { Group, Option } from '../interface/store'
import { FieldNode } from '../scripts/fieldNode'
import { selectTypes } from '../data/selectTypes'

interface Props {
  rootNode: Root;
  curNode: FieldNode;
  nextNode: (node: Root | FormGroup | FieldNode) => void;
};

const fieldComponents: ComponentOption[] = [
  {
    val: 'customField',
    content: 'Custom'
  },
  {
    val: 'customField',
    content: 'Custom Long Name Here Boy'
  }
]

const placeholderReqTypes = ['tel', 'text', 'textarea', 'email']
const patternReqTypes = ['tel', 'text', 'textarea']
const lengthReqTypes = ['tel', 'text', 'textarea', 'email']

const FieldPage = ({ rootNode, curNode, nextNode }: Props) => {
  const [labelVal, setLabelVal] = useState(null)
  const [typeVal, setTypeVal] = useState<string>('')
  const [requiredVal, setRequiredVal] = useState<boolean>(false)
  const [placeholderVal, setPlaceholderVal] = useState<string>('')
  const [checkedVal, setCheckVal] = useState<boolean>(false)
  const [patternVal, setPatternVal] = useState<string>('')
  const [minLengthVal, setMinLengthVal] = useState<string>('')
  const [maxLengthVal, setMaxLengthVal] = useState<string>('')
  const [optionsVal, setOptionsVal] = useState<Option[]>([])
  const [subGroup, setSubGroup] = useState<Group[]>([])
  const [subField, setSubField] = useState<Group[]>([])

  // did mount
  useEffect(() => {
    if (curNode 
        && labelVal === null ) {
      console.log('once',{ rootNode, curNode })
      setLabelVal(curNode.title)
      setTypeVal(curNode.type)
      setRequiredVal(curNode.required)
      setPlaceholderVal(curNode.placeholder)
      setCheckVal(curNode.checked)
      setPatternVal(curNode.pattern)
      setMinLengthVal(curNode.minLength)
      setMaxLengthVal(curNode.maxLength)
      setOptionsVal(curNode.options)
      setSubGroup(curNode.subGroups)
      setSubField(curNode.subFields)
    }
  }, [curNode, labelVal, rootNode])

  useEffect(() => {
    if (curNode && labelVal !== null ) {
      curNode.title = labelVal
      console.log('Label:', labelVal, curNode )
    }
  }, [labelVal, curNode])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLabelVal(e.target.value)
  }

  const onDelete = (id: string, type: 'subG' | 'subF') => {
    console.log('on del')
    switch (type) {
      case 'subG':
        const [group] = curNode.removeSubGroup(id)
        setSubGroup(group as Group[])
        break;
      case 'subF':
        const [subFieldArr] = curNode.removeSubField(id)
        setSubField(subFieldArr as Group[])
        break;
    }
  }

  const onAdd = (type: 'subG' | 'subF', id?: string) => {
    console.log('run add')
    switch (type) {
      case 'subG':
        const [group] = curNode.createNewSubGroup()
        setSubGroup(group as Group[])
        break;
      case 'subF':
        const [subFieldArr] = curNode.creatNewSubField()
        setSubField(subFieldArr as Group[])
        break;
    }
    console.log({ rootNode, curNode})
  }

  const handleOnDragEnd = (result: DropResult, type: 'subG' | 'subF', curList: Group[]) => {
    if (!result.destination) return
    const items = [...curList]
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    switch (type) {
      case 'subG':
        // const [group] = curNode.updateSubGroupOrder(items)
        // setSubGroup(group as Group[])
        break;
      case 'subF':
        // const [subFieldArr] = curNode.updateSubFieldOrder(items)
        // setSubField(subFieldArr as Group[])
        break;
    }
  }

  const onGoToSubGroup = (id: string) => {
    const node: FormGroup = curNode.getSubGroupData(id)
    console.log(node)
    nextNode(node);
  }

  const onGoToSubField = (id: string) => {
    console.log('got  to ', id)
    // const node: FieldNode = curNode.getSubFieldData(id)
    // nextNode(node);
  }

  return (<>
    <Stack as="main" spacing={6}>
      <Heading as="h1">
          Field
      </Heading>
      <Stack as="form" spacing={6}>
          <FormControl>
              <FormLabel htmlFor="title">Title</FormLabel>
              <Input name="title" 
                  value={labelVal || ''}
                  onChange={handleChange}
                  placeholder="Form Title"
              />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="type">Type</FormLabel>
            <Select 
              name="type"
              onChange={(e) => setTypeVal(e.target.value)}
              value={typeVal}
              placeholder="Select option">
              {selectTypes.map(({value, label}) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </Select>
          </FormControl>
          <FormControl>
            <Checkbox
              checked={requiredVal}
              onChange={(e) => setRequiredVal(e.target.checked)}>
              Required Field
            </Checkbox>
          </FormControl>
          {(placeholderReqTypes.includes(typeVal)) && <FormControl>
              <FormLabel htmlFor="placeholder">Placeholder Text</FormLabel>
              <Input name="placeholder" 
                  value={placeholderVal || ''}
                  onChange={(e) => setPlaceholderVal(e.target.value)}
                  placeholder="Enter Placeholder"
              />
          </FormControl>}
          {(typeVal === 'checkBox') && <Checkbox
              checked={checkedVal}
              onChange={(e) => setCheckVal(e.target.checked)}>
              Checked
            </Checkbox>
          }
          {(patternReqTypes.includes(typeVal)) && <FormControl>
              <FormLabel htmlFor="pattern">Pattern</FormLabel>
              <Input name="pattern" 
                  value={patternVal || ''}
                  onChange={(e) => setPlaceholderVal(e.target.value)}
                  placeholder="Pattern which will be matched with value"
              />
          </FormControl>}
          {(lengthReqTypes.includes(typeVal)) && <>
                <FormControl>
                  <FormLabel htmlFor="minLength">Value Min Length</FormLabel>
                  <NumberInput defaultValue={15}
                    name="minLength"
                    onChange={(val) => setMinLengthVal(val)}
                    value={minLengthVal}>
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
              </FormControl>
              <FormControl>
                  <FormLabel htmlFor="maxLength">Value Max Length</FormLabel>
                  <NumberInput defaultValue={30}
                    name="maxLength"
                    onChange={(val) => setMaxLengthVal(val)}
                    value={maxLengthVal}>
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
              </FormControl>
            </>}
          <DynamicList 
            label="Sub Groups"
            value={subGroup}
            onDelete={(id: string) => onDelete(id, 'subG')}
            onAdd={() => onAdd('subG')}
            onGoToGroup={onGoToSubGroup}
            handleOnDragEnd={(v: DropResult) => handleOnDragEnd(v, 'subG', subGroup)} />
          <DynamicList 
            label="Sub Fields"
            value={subField}
            components={fieldComponents}
            onDelete={(id: string) => onDelete(id, 'subF')}
            onAdd={(id) => onAdd('subF', id)}
            onGoToGroup={onGoToSubField}
            handleOnDragEnd={(v: DropResult) => handleOnDragEnd(v, 'subF', subField)} />
      </Stack>
    </Stack>
  </>)
}

export default FieldPage