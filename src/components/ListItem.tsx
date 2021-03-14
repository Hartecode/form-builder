import React from 'react'
import {
  Button,
  ButtonGroup,
  IconButton
} from "@chakra-ui/react"
import { UpDownIcon, DeleteIcon } from "@chakra-ui/icons"

interface Props {   
    id: string;
    label: string;
    onDelete: (id: string) => void,
    onGoToGroup: (id: string) => void
}

const ListItem = ({ id, label, onGoToGroup, onDelete }: Props) => (
    <ButtonGroup isAttached variant="outline">
        <Button flex="1"
            onClick={() => onGoToGroup(id)}
            justifyContent="flex-start"
            leftIcon={<UpDownIcon color="gray.300" />} >
            {label}
        </Button>
        <IconButton 
            onClick={() => onDelete(id)}
            aria-label="Remove item" 
            icon={<DeleteIcon />} />
    </ButtonGroup>
)

export default ListItem