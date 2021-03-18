import React from 'react'
import {
  Link,
  IconButton,
  Flex,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
  useDisclosure
} from "@chakra-ui/react"
import { UpDownIcon, DeleteIcon } from "@chakra-ui/icons"
import { DraggableProvided, Draggable } from "react-beautiful-dnd"
import OptionForm from './OptionForm'
import FocusLock from 'react-focus-lock'
import { Option } from '../interface/store'

interface Props {   
    id: string;
    index: number;
    label: string;
    onDelete: (id: string) => void;
    handleSubmit: (e) => void;
    optionData: Option;
}

const FormListItem = ({ id, index, label, handleSubmit, onDelete, optionData }: Props) => {
  const { onOpen, onClose, isOpen } = useDisclosure()
  const firstFieldRef = React.useRef(null)
  
  return (
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
                  <Popover
                    isOpen={isOpen}
                    initialFocusRef={firstFieldRef}
                    onOpen={onOpen}
                    onClose={onClose}
                    placement="bottom"
                    closeOnBlur={false}>
                      <PopoverTrigger>
                        <Link flex="1"
                            alignItems="center"
                            d="flex"
                            _hover={{
                                color: "blue",
                            }}
                            justifyContent="flex-start">
                            <UpDownIcon  color="gray.300" w="10" /> {label}
                        </Link>
                      </PopoverTrigger>
                      <PopoverContent p={5}>
                        <FocusLock returnFocus persistentFocus={false}>
                          <PopoverArrow />
                          <PopoverCloseButton />
                          <OptionForm
                            optionData={optionData}
                            firstFieldRef={firstFieldRef}
                            handleSubmit={handleSubmit}
                            onCancel={onClose} />
                        </FocusLock>
                      </PopoverContent>
                  </Popover>
                
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

)}

export default FormListItem