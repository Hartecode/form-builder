import React, { useState } from 'react'
import { 
    Text,
    Box,
    Stack,
    Flex,
    IconButton
  } from "@chakra-ui/react"
import { AddIcon } from "@chakra-ui/icons"
import ListItem from "./ListItem"
import { DragDropContext, Droppable,  DroppableProvided, DropResult } from "react-beautiful-dnd";

interface Props {
    label: string;
    defaultName?: string;
    value: GroupItem[]
}

interface GroupItem {
    id: string;
    label: string;
}

const uuID = () => Math.random().toString(36).substr(2, 9);

const DynamicList = ({ label, defaultName = "Group", value = [] }: Props) => {
    const [list, setList] = useState(value)

    const onAdd = () => {
        const item: GroupItem = {
            id: `${defaultName}-${uuID()}`,
            label: defaultName
        }
        setList(prevItems => [...prevItems, item])
    }

    const onDelete = (id: string) => {
        setList(prvItems => prvItems.filter(v => v.id !== id))
    }

    const onGoToGroup = (id: string) => {
        console.log('go to id', id)
    }

    const handleOnDragEnd = (result: DropResult) => {
        if (!result.destination) return
        const items = [...list]
        const [reorderedItem] = items.splice(result.source.index, 1)
        items.splice(result.destination.index, 0, reorderedItem)
        setList(items)
    }

    return (
    <Box>
        <Flex justifyContent="space-between" 
            alignItems="center" 
            mb={2}>
            <Text fontWeight="semibold">{label}</Text>
            <IconButton aria-label="Add Group" 
                isRound={true} 
                colorScheme="teal"
                size="sm"
                icon={<AddIcon />} 
                onClick={onAdd} />
        </Flex>
        <DragDropContext onDragEnd={handleOnDragEnd}>
            <Droppable droppableId="droppable">
                {(provided: DroppableProvided) => ( 
                    <Stack as="ul" 
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        spacing="1.5"
                        border="1px dashed"
                        borderColor="gray.200"
                        padding="2"
                        minHeight="24">
                        {list.map((v, i) => ( 
                            <ListItem
                                key={v.id}
                                id={v.id}
                                index={i}
                                onDelete={onDelete}
                                onGoToGroup={onGoToGroup}
                                label={v.label} />
                        ))}
                        {provided.placeholder}
                    </Stack>
                )}
            </Droppable>
        </DragDropContext>

    </Box>)
}

export default DynamicList