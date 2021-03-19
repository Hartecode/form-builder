import React, { useState, useEffect } from 'react';
import { Root } from '../scripts/store'
import Home from './Home'
import GroupPage from './GroupPage'
import { FormGroup } from '../scripts/formGroup'
import { Box, Link, Button } from "@chakra-ui/react"
import { ChevronLeftIcon } from "@chakra-ui/icons"
import { FieldNode } from '../scripts/fieldNode';
import { AnimatePresence, motion, MotionStyle } from "framer-motion"
import FieldPage from './FieldPage'

const pageVariants = {
  initial: {
    opacity: 0,
  },
  in: {
    opacity: 1,
  },
  out: {
    opacity: 0,
  },
}

const pageTransition = {
  type: "tween",
  ease: "anticipate",
  duration: 0.5
};

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

  const getFullStore = () => {
    console.log(rootNode.getStoreData());
  }

  return (
  <>
    <Box as="header" d="flex" justifyContent="space-between">
      {(page !== 'root') && (
        <Link onClick={prevPage}>
          <ChevronLeftIcon mx="2px" />
        </Link>)}
        <Button onClick={getFullStore}>PRINT DATA</Button>
    </Box>
    {console.log({rootNode, curNode, page})}
    { curNode ? (
      <AnimatePresence>
        {(page === 'root') && (<motion.div key={curNode.id}
            style={pageStyle}
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}>
            <Home rootNode={rootNode} curNode={curNode as Root} nextNode={nextNode} />
          </motion.div>)}
        {(page === 'group') && <motion.div key={curNode.id}
            style={pageStyle}
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}>
            <GroupPage
                rootNode={rootNode} curNode={curNode as FormGroup} nextNode={nextNode} />
          </motion.div>}
          {(page === 'field') && <motion.div key={curNode.id}
              style={pageStyle}
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}>
              <FieldPage rootNode={rootNode} curNode={curNode as FieldNode} nextNode={nextNode}/>
            </motion.div>}
      </AnimatePresence>) 
      : <h1>Loading...</h1>
    }
    
  </>)
}

export default StoreWrapper