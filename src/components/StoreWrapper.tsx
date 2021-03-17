import React, { useState, useEffect } from 'react';
import { Root } from '../scripts/store'
import Home from './Home'
import GroupPage from './GroupPage'
import { FormGroup } from '../scripts/formGroup'
import { Box, Link } from "@chakra-ui/react"
import { ChevronLeftIcon } from "@chakra-ui/icons"
import { FieldNode } from '../scripts/fieldNode';


export interface Props {
  rootNode: Root;
  curNode: Root | FormGroup;
  nextNode: (node: Root | FormGroup) => void;
};

const StoreWrapper = (props) => {
  const [page, setPage] = useState('root')
  const [rootNode, setRootNode] = useState(null)
  const [curNode, setCurNode] = useState<Root | FormGroup | FieldNode>(null)
  useEffect(() => {
    const node = new Root()
    if (!rootNode) {
      setRootNode(node)
      setCurNode(node)
    }
  }, [rootNode])

  const nextNode = (node: Root | FormGroup | FieldNode) => {
    setCurNode(node)
    setPage(node.position)
  }

  const prevPage = () => {
    const prevNode: FormGroup | FieldNode = curNode as FormGroup | FieldNode
    nextNode(prevNode.parent)
  }

  return (
  <>
    <Box as="header">
      {(page !== 'root') && (
        <Link onClick={prevPage}>
          <ChevronLeftIcon mx="2px" />
        </Link>)}
    </Box>
    {console.log({rootNode, curNode, page})}
    {(page === 'root') && <Home 
            rootNode={rootNode} curNode={curNode as Root} nextNode={nextNode} />}
    {(page === 'group') && <GroupPage
            rootNode={rootNode} curNode={curNode as FormGroup} nextNode={nextNode} />}
    
  </>)
}

export default StoreWrapper