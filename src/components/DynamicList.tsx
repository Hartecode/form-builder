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
// import { uuID } from '../scripts/helpers'

interface Props {
    label: string;
    value: GroupItem[];
    onDelete: (id: string) => void;
    onAdd: () => void;
    handleOnDragEnd: (result: DropResult) => void;
}

interface GroupItem {
    key: string;
    label: string;
}

const DynamicList = ({ 
    label,
    value = [],
    onDelete,
    onAdd,
    handleOnDragEnd
}: Props) => {
    // const [list, setList] = useState(value)

    // const onAdd = () => {
    //     const item: GroupItem = {
    //         id: `${defaultName}-${uuID()}`,
    //         label: defaultName
    //     }
    //     setList(prevItems => [...prevItems, item])
    // }

    const onGoToGroup = (id: string) => {
        console.log('go to id', id)
    }
    {console.log('here',value)}

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
                           
                        {value.map((v, i) => ( 
                            <ListItem
                                key={v.key}
                                id={v.key}
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