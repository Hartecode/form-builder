import React, { useState, useEffect } from 'react';
import { Root } from '../scripts/store'
import Home from './Home'
import GroupPage from './GroupPage'
import { FormGroup } from '../scripts/formGroup'
import { Box, Link, Button, Spacer } from "@chakra-ui/react"
import { ChevronLeftIcon } from "@chakra-ui/icons"
import { FieldNode } from '../scripts/fieldNode';
import { AnimatePresence, motion, MotionStyle } from "framer-motion"
import FieldPage from './FieldPage'

const variants = {
  enter: {
    x:  1000,
    opacity: 1
  },
  initial: {
    opacity: 0,
  },
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1
  },
  exit: {
    x: -1000,
    opacity: 1
  }
};

const pageTransition = {
  x: {  stiffness: 300, damping: 30 },
  opacity: { duration: 0.2 }
}

const pageStyle: MotionStyle = {
  position: "absolute",
  width: "100%"
};


export interface Props {
  rootNode: Root;
  curNode: Root | FormGroup;
  nextNode: (node: Root | FormGroup) => void;
};

const StoreWrapper = (props) => {
  const [page, setPage] = useState('root')
  const [rootNode, setRootNode] = useState<Root>(null)
  const [curNode, setCurNode] = useState<Root | FormGroup | FieldNode>(null)

  useEffect(() => {
    const defaultData = window.frameElement?.getAttribute('formData');
    console.log(window.frameElement)
    if (!rootNode) {
      let node: Root; 
      
      if (defaultData) {
        node = new Root(JSON.parse(defaultData)) 
      } else {
        node = new Root()
      } 

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

  const getFullStore = () => {
    console.log(JSON.stringify(rootNode.getStoreData()));
  }

  return (
  <>
    <Box as="header" d="flex" >
      {(page !== 'root') && (
        <Link d="flex" alignItems="center" onClick={prevPage}>
          <ChevronLeftIcon mx="2px" />
          {((curNode as FormGroup)?.parent as FormGroup)?.label || 
          ((curNode as FieldNode)?.parent as FieldNode)?.title || 'Root Page'}
        </Link>)}
        <Spacer transition="flex 0.2s" flex={page !== 'root' ? '1' : '0'} />
        <Button onClick={getFullStore}>PRINT DATA</Button>
    </Box>
    <Box position="relative">
      { curNode ? (
        <AnimatePresence initial={false}>
          {(page === 'root') && (<motion.div key={curNode.id}
              style={pageStyle}
              initial="enter"
              animate="center"
              exit="exit"
              variants={variants}
              transition={pageTransition}>
              <Home rootNode={rootNode} curNode={curNode as Root} nextNode={nextNode} />
            </motion.div>)}
          {(page === 'group') && <motion.div key={curNode.id}
              style={pageStyle}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={pageTransition}>
              <GroupPage
                  rootNode={rootNode} curNode={curNode as FormGroup} nextNode={nextNode} />
            </motion.div>}
            {(page === 'field') && <motion.div key={curNode.id}
                style={pageStyle}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={pageTransition}>
                <FieldPage rootNode={rootNode} curNode={curNode as FieldNode} nextNode={nextNode}/>
              </motion.div>}
        </AnimatePresence>) 
        : <h1>Loading...</h1>
      }
    </Box>
    
    
  </>)
}

export default StoreWrapper