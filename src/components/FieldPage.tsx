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
import { FieldType, Group, Option } from '../interface/store'
import { FieldNode } from '../scripts/fieldNode'
import { selectTypes } from '../data/selectTypes'
import DynamicFormList from './DynamicFormList'

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
  const [typeVal, setTypeVal] = useState<FieldType>('')
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

  const onSetLabelVal = (val: string) => {
    curNode.title = val;
    setLabelVal(curNode.title);

    const item = {
      key: curNode.id,
      label: curNode.title
    }
    if (curNode.fieldType === 'field') {
      (curNode.parent as FormGroup).updateFieldItem(item)
    } else if (curNode.fieldType === 'subField') {
      (curNode.parent as FormGroup | FieldNode).updateSubFieldItem(item)
    }
  }

  const onSetFieldType = (val: FieldType) => {
    curNode.type = val;
    setTypeVal(curNode.type);
  }

  const onSetRequiredVal = (val: boolean) => {
    curNode.required = val;
    setRequiredVal(curNode.required);
  }

  const onSetPlaceholderVal = (val: string) => {
    curNode.placeholder = val;
    setPlaceholderVal(curNode.placeholder);
  }

  const onSetCheckVal = (val: boolean) => {
    curNode.checked = val;
    setCheckVal(curNode.checked)
  }

  const onSetPatternVal = (val: string) => {
    curNode.pattern = val;
    setPatternVal(curNode.pattern);
  }

  const onSetMinLengthVal = (val: string) => {
    curNode.minLength = val;
    setMinLengthVal(curNode.minLength);
  }

  const onSetMaxLengthVal = (val: string) => {
    curNode.maxLength = val;
    setMaxLengthVal(curNode.maxLength)
  }
      
  const onDelete = (id: string, type: 'subG' | 'subF') => {
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

  const handleOnDragEnd = (result: DropResult,
    type: 'subG' | 'subF' | 'opt',
    curList: Group[] | Option[]) => {
    if (!result.destination) return
    const items = [...curList]
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    switch (type) {
      case 'opt':
        curNode.options = items as Option[];
        setOptionsVal(curNode.options)
        break;
      case 'subG':
        const [group] = curNode.updateSubGroupOrder(items as Group[])
        setSubGroup(group as Group[])
        break;
      case 'subF':
        const [subFieldArr] = curNode.updateSubFieldOrder(items as Group[])
        setSubField(subFieldArr as Group[])
        break;
    }
  }

  const onGoToSubGroup = (id: string) => {
    const node: FormGroup = curNode.getSubGroupData(id)
    nextNode(node);
  }

  const onGoToSubField = (id: string) => {
    const node: FieldNode = curNode.getSubFieldData(id)
    nextNode(node);
  }

  const onRemoveOption = (id: string) => {
    const updatedOpt = curNode.removeOption(id);
    setOptionsVal(updatedOpt);
  }

  const onAddOption = () => {
    const updatedOpt = curNode.addOption();
    setOptionsVal(updatedOpt);
  }

  const updateOption = (e: Option) => {
    const updatedOpt = curNode.updateOption(e);
    setOptionsVal(updatedOpt);
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
                  onChange={e => onSetLabelVal(e.target.value)}
                  placeholder="Form Title"
              />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="type">Type</FormLabel>
            <Select 
              name="type"
              onChange={(e) => onSetFieldType(e.target.value as FieldType)}
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
              onChange={(e) => onSetRequiredVal(e.target.checked)}>
              Required Field
            </Checkbox>
          </FormControl>
          {(placeholderReqTypes.includes(typeVal)) && <FormControl>
              <FormLabel htmlFor="placeholder">Placeholder Text</FormLabel>
              <Input name="placeholder" 
                  value={placeholderVal || ''}
                  onChange={(e) => onSetPlaceholderVal(e.target.value)}
                  placeholder="Enter Placeholder"
              />
          </FormControl>}
          {(typeVal === 'checkbox') && <Checkbox
              checked={checkedVal}
              onChange={(e) => onSetCheckVal(e.target.checked)}>
              Checked
            </Checkbox>
          }
          {(patternReqTypes.includes(typeVal)) && <FormControl>
              <FormLabel htmlFor="pattern">Pattern</FormLabel>
              <Input name="pattern" 
                  value={patternVal || ''}
                  onChange={(e) => onSetPatternVal(e.target.value)}
                  placeholder="Pattern which will be matched with value"
              />
          </FormControl>}
          {(lengthReqTypes.includes(typeVal)) && <>
                <FormControl>
                  <FormLabel htmlFor="minLength">Value Min Length</FormLabel>
                  <NumberInput
                    name="minLength"
                    onChange={(val) => onSetMinLengthVal(val)}
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
                  <NumberInput 
                    name="maxLength"
                    onChange={(val) => onSetMaxLengthVal(val)}
                    value={maxLengthVal}>
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
              </FormControl>
            </>}
          {(typeVal === 'select') && <DynamicFormList 
            label="Options List"
            value={optionsVal}
            onDelete={onRemoveOption}
            onAdd={onAddOption}
            handleOnDragEnd={(v: DropResult) => handleOnDragEnd(v, 'opt', optionsVal)}
            handleSubmit={updateOption} />}
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