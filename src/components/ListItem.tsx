import React from 'react'
import {
  Link,
  IconButton,
  Flex,
} from "@chakra-ui/react"
import { UpDownIcon, DeleteIcon } from "@chakra-ui/icons"
import { DraggableProvided, Draggable } from "react-beautiful-dnd";


interface Props {   
    id: string;
    index: number;
    label: string;
    onDelete: (id: string) => void,
    onGoToGroup: (id: string) => void,
}

const ListItem = ({ id, index, label, onGoToGroup, onDelete }: Props) => (
    <Draggable draggableId={id} index={index}>
        {(provided: DraggableProvided) => (
            <Flex 
                {...provided.dragHandleProps}
                {...provided.draggableProps}
                ref={provided.innerRef}
                background="white"
                border="1px solid"
                borderColor="gray.200"
                borderRadius="6"
                w="100%">
                <Link flex="1"
                    alignItems="center"
                    d="flex"
                    onClick={() => onGoToGroup(id)}
                    _hover={{
                        color: "blue",
                    }}
                    justifyContent="flex-start">
                     <UpDownIcon  color="gray.300" w="10" /> {label}
                </Link>
                <IconButton 
                    onClick={() => onDelete(id)}
                    background="white"
                    aria-label="Remove item"
                    _hover={{
                        background: "red",
                    }}
                    icon={<DeleteIcon />} />
            </Flex>
        )}
    </Draggable>

)

export default ListItem