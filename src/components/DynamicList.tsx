import React from 'react'
import { 
    Text,
    Box,
    Stack,
    Flex,
    IconButton,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    Button
  } from "@chakra-ui/react"
import { ChevronDownIcon, AddIcon } from "@chakra-ui/icons"
import ListItem from "./ListItem"
import { DragDropContext, Droppable,  DroppableProvided, DropResult } from "react-beautiful-dnd";
import { uuID } from '../scripts/helpers';

interface Props {
    label: string;
    value: GroupItem[];
    onDelete: (id: string) => void;
    onAdd: (id?: string) => void;
    handleOnDragEnd: (result: DropResult) => void;
    components?: ComponentOption[];
    onGoToGroup: (id: string) => void;
}

export interface ComponentOption {
    val: string;
    content: string;
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
    handleOnDragEnd,
    components,
    onGoToGroup
}: Props) => {

    return (
    <Box>
        <Flex justifyContent="space-between" 
            alignItems="center" 
            mb={2}>
            <Text fontWeight="semibold">{label}</Text>
            {components ? 
                <Menu>
                    <MenuButton as={Button} colorScheme="teal" rightIcon={<ChevronDownIcon />}>
                        Component
                    </MenuButton>
                    <MenuList>
                        {components.map((v, i)=> (
                            <MenuItem
                                key={`${v}${i}`}
                                onClick={() => onAdd(v.val)}
                                icon={<AddIcon />}
                                >
                                {v.content}
                            </MenuItem>))}
                    </MenuList>
                </Menu> :
                <IconButton aria-label="Add Group" 
                    isRound={true} 
                    colorScheme="teal"
                    size="sm"
                    icon={<AddIcon />} 
                    onClick={() => onAdd()} />
            }
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