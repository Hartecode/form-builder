import React, { useState, useEffect } from 'react'
import { 
  Heading,
  Stack,
  Input,
  FormControl,
  FormLabel,
} from "@chakra-ui/react"
import DynamicList, { ComponentOption } from './DynamicList'
import { DropResult } from "react-beautiful-dnd";
import { FormGroup } from '../scripts/formGroup'
import { Root } from '../scripts/store'
import { Group } from '../interface/store'
import { FieldNode } from '../scripts/fieldNode';

interface Props {
  rootNode: Root;
  curNode: FormGroup;
  nextNode: (node: Root | FormGroup | FieldNode) => void;
};

type ListType = 'field' | 'subG' | 'subF';

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

const GroupPage = ({ rootNode, curNode, nextNode }: Props) => {
  const [labelVal, setLabelVal] = useState(null)
  const [fieldList, setFieldList] = useState<Group[]>([])
  const [subGroup, setSubGroup] = useState<Group[]>([])
  const [subField, setSubField] = useState<Group[]>([])

  // did mount
  useEffect(() => {
    if (curNode 
        && labelVal === null ) {
      setLabelVal(curNode.label)
      setFieldList(curNode.gFields)
      setSubGroup(curNode.gSubGroups)
      setSubField(curNode.gSubFields)
    }
  }, [curNode, labelVal, rootNode])

  const onUpdateLabel = (val: string) => {
    curNode.label = val;
    setLabelVal(curNode.label);
  
    const gItem = {
      key: curNode.id,
      label: curNode.label
    }
    if (curNode.groupType === 'group') {
      (curNode.parent as Root).updateGroupItem(gItem)
    } else if (curNode.groupType === 'subGroup') {
      (curNode.parent as FormGroup | FieldNode).updateSubGroupItem(gItem)
    }
  }

  const onDelete = (id: string, type: ListType) => {
    switch (type) {
      case 'field':
        const [fields] = curNode.removeField(id)
        setFieldList(fields as Group[])
        break;
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

  const onAdd = (type: ListType, id?: string) => {
    switch (type) {
      case 'field':
        const [fields] = curNode.creatNewField()
        setFieldList(fields as Group[])
        break;
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

  const handleOnDragEnd = (result: DropResult, type: ListType, curList: Group[]) => {
    if (!result.destination) return
    const items = [...curList]
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    switch (type) {
      case 'field':
        const [fields] = curNode.updateFieldOrder(items)
        setFieldList(fields as Group[])
        break;
      case 'subG':
        const [group] = curNode.updateSubGroupOrder(items)
        setSubGroup(group as Group[])
        break;
      case 'subF':
        const [subFieldArr] = curNode.updateSubFieldOrder(items)
        setSubField(subFieldArr as Group[])
        break;
    }
  }

  const onGoToSubGroup = (id: string) => {
    const node: FormGroup = curNode.getSubGroupData(id)
    nextNode(node);
  }

  const onGoToField = (id: string) => {
    const node: FieldNode = curNode.getFieldData(id)
    nextNode(node);
  }

  const onGoToSubField = (id: string) => {
    const node: FieldNode = curNode.getSubFieldData(id)
    nextNode(node);
  }

  return (
  <Stack as="main" spacing={6}>
    <Heading as="h1">
        Group
    </Heading>
    <Stack as="form" spacing={6}>
        <FormControl>
            <FormLabel htmlFor="title">Title</FormLabel>
            <Input name="Label" 
                value={labelVal || ''}
                onChange={(e) => onUpdateLabel(e.target.value)}
                placeholder="Form Title"
            />
        </FormControl>
        <DynamicList 
            label="Fields"
            value={fieldList}
            components={fieldComponents}
            onDelete={(id: string) => onDelete(id, 'field')}
            onAdd={(id) => onAdd('field', id)}
            onGoToGroup={onGoToField}
            handleOnDragEnd={(v: DropResult) => handleOnDragEnd(v, 'field', fieldList)} />
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
  </Stack>)
}

export default GroupPage