import React, { useState, useEffect } from 'react';
import { 
  Heading,
  Stack,
  Input,
  FormControl,
  FormLabel,
  Textarea
} from "@chakra-ui/react"
import DynamicList from './DynamicList'
import { Root } from '../scripts/store'
import { DropResult } from "react-beautiful-dnd";
import { Group } from '../interface/store'
import { FormGroup } from '../scripts/formGroup';

interface Props {
  rootNode: Root;
  curNode: Root;
  nextNode: (node: Root | FormGroup) => void;
};

const Home = (props: Props) => {
  const [ titleVal, setTitleVal ] = useState(null)
  const [ descVal,  setDescVal ] = useState(null)
  const [ groupList, setGroupList ] = useState([])

  // did mount
  useEffect(() => {
    if (props.curNode 
        && titleVal === null 
        && descVal === null) {
      setTitleVal(props.curNode.titleVal)
      setDescVal(props.curNode.descriptionVal)
      setGroupList(props.curNode.groupList)
    }
  }, [props, titleVal, descVal])

  const onUpdateTitle = (val: string) => {
    props.curNode.titleVal = val
    setTitleVal(props.curNode.titleVal)
  }

  const onUpdateDesc = (val: string) => {
    props.curNode.descriptionVal = val
    setDescVal(props.curNode.descriptionVal)
  }

  const onDelete = (id: string) => {
    const [ group ] = props.curNode.removeGroup(id);
    setGroupList(group as Group[])
  }

  const onAdd = () => {
    const [ group ] = props.curNode.createNewGroup();
    setGroupList(group as Group[])
  }

  const handleOnDragEnd = (result: DropResult) => {
    if (!result.destination) return
    const items = [...groupList]
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)
    const [newGroup] = props.curNode.updateGroupOrder(items)
    setGroupList(newGroup as Group[])
  }

  const onGoToGroup = (id: string) => {
    console.log('got  to ', id)
    const node: FormGroup = props.curNode.getGroupData(id)
    props.nextNode(node);
  }

  return (
  <Stack as="main" spacing={6}>
    <Heading as="h1">
        Form Builder
    </Heading>
    <Stack as="form" spacing={6}>
        <FormControl>
            <FormLabel htmlFor="title">Title</FormLabel>
            <Input name="title" 
                value={titleVal || ''}
                onChange={(e) => onUpdateTitle(e.target.value)}
                placeholder="Form Title"
            />
        </FormControl>
        <FormControl>
            <FormLabel htmlFor="description">Description</FormLabel>
            <Textarea name="description"
                value={descVal || ''}
                placeholder="Details about the form"
                onChange={(e) => onUpdateDesc(e.target.value)}
            />
        </FormControl>
        <DynamicList 
            label="Groups"
            value={groupList}
            onDelete={onDelete}
            onAdd={onAdd}
            onGoToGroup={onGoToGroup}
            handleOnDragEnd={handleOnDragEnd} />
    </Stack>
  </Stack>)
}

export default Home;