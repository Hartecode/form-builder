import React from 'react'
import { 
    Text,
    Box,
    Stack,
    Flex,
    IconButton,
  } from "@chakra-ui/react"
import { AddIcon } from "@chakra-ui/icons"
import FormListItem from "./FormListItem"
import { DragDropContext, Droppable,  DroppableProvided, DropResult } from "react-beautiful-dnd";
import { uuID } from '../scripts/helpers'
import { Option } from '../interface/store'

interface Props {
    label: string;
    value: Option[];
    onDelete: (id: string) => void;
    onAdd: (id?: string) => void;
    handleOnDragEnd: (result: DropResult) => void;
    handleSubmit: (e) => void;
}

export interface ComponentOption {
    val: string;
    content: string;
}

const DynamicFormList = ({ 
    label,
    value = [],
    onDelete,
    onAdd,
    handleOnDragEnd,
    handleSubmit,
}: Props) => {

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
                onClick={() => onAdd()} />
        </Flex>
        <DragDropContext onDragEnd={handleOnDragEnd}>
            <Droppable droppableId={`droppable-${uuID()}`}>
                {(provided: DroppableProvided) => ( 
                    <Stack as="ol" 
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        spacing="1.5"
                        border="1px dashed"
                        borderColor="gray.200"
                        padding="2"
                        minHeight="24">             
                        {value.map((v: Option, i) => ( 
                            <FormListItem
                                key={v.id}
                                id={v.id}
                                index={i}
                                optionData={v}
                                onDelete={onDelete}
                                handleSubmit={handleSubmit}
                                label={v.label} />
                        ))}
                        {provided.placeholder}
                    </Stack>
                )}
            </Droppable>
        </DragDropContext>

    </Box>)
}

export default DynamicFormList