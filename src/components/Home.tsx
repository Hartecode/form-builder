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

interface Props {
  rootNode: Root;
  curNode: Root;
  setCurNode: (node: Root) => void;
};

const Home = (props) => {
  const [ titleVal, setTitleVal ] = useState(null)
  const [ descVal,  setDescVal ] = useState(null)
  const [ groupList, setGroupList ] = useState([])

  // did mount
  useEffect(() => {
    if (props.curNode 
        && titleVal === null 
        && descVal === null) {
      console.log('once',{ props })
      setTitleVal(props.curNode.titleVal)
      setDescVal(props.curNode.descriptionVal)
    }
  }, [props, titleVal, descVal])

  useEffect(() => {
    if (props.curNode && titleVal !== null ) {
      props.curNode.titleVal = titleVal
      console.log('title:', titleVal, props.curNode )
    }
  }, [titleVal, props.curNode])

  useEffect(() => {
    if (props.curNode && descVal !== null ) {
      props.curNode.descriptionVal = descVal
      console.log('desc:', descVal, props.curNode )
    }
  }, [descVal, props.curNode])

  useEffect(() => {
    if (props.curNode && descVal !== null ) {
      props.curNode.descriptionVal = descVal
      console.log('desc:', descVal, props.curNode )
    }
  }, [descVal, props.curNode])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const target = e.target;
    if(target.name === 'title') {
      setTitleVal(target.value)
    }

    if (target.name === 'description') {
      setDescVal(target.value)
    }
  }

  const onDelete = (id: string) => {
    console.log('on del')
    const [ group ] = props.curNode.removeGroup(id);
    setGroupList(group)
  }

  const onAdd = () => {
    console.log('run add')
    const [ group ] = props.curNode.createNewGroup();
    console.log(group)
    setGroupList(group)
  }

  const handleOnDragEnd = (result: DropResult) => {
        if (!result.destination) return
        const items = [...groupList]
        const [reorderedItem] = items.splice(result.source.index, 1)
        items.splice(result.destination.index, 0, reorderedItem)
        const [newGroup] = props.curNode.updateGroupOrder(items)
        console.log(props.curNode)
        setGroupList(newGroup)
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
                onChange={handleChange}
                placeholder="Form Title"
            />
        </FormControl>
        <FormControl>
            <FormLabel htmlFor="description">Description</FormLabel>
            <Textarea name="description"
                value={descVal || ''}
                placeholder="Details about the form"
                onChange={handleChange}
            />
        </FormControl>
        <DynamicList 
            label="Groups"
            value={groupList}
            onDelete={onDelete}
            onAdd={onAdd}
            handleOnDragEnd={handleOnDragEnd} />
    </Stack>
  </Stack>)
}

export default Home;