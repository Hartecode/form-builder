import React, { useState, useEffect, useCallback } from 'react';
import { Root } from '../scripts/store'
import Home from './Home'
import GroupPage from './GroupPage'
import { FormGroup } from '../scripts/formGroup'
import { Box, Link, Button, Spacer } from "@chakra-ui/react"
import { ChevronLeftIcon } from "@chakra-ui/icons"
import { FieldNode } from '../scripts/fieldNode';
import { AnimatePresence, motion, MotionStyle } from "framer-motion"
import FieldPage from './FieldPage'
import { Store } from '../interface/store';

const variants = {
  enter: {
    x:  1000,
    zIndex: 0,
  },
  center: {
    zIndex: 1,
    x: 0,
  },
  exit: {
    x: -1000,
  }
};

const pageTransition = {
  x: { 
    type: "spring",
    stiffness: 300,
    damping: 30,
    duration: 0.2 },
}

const pageStyle: MotionStyle = {
  gridRow: 1,
  gridColumn: 1
}

export interface Props {
  rootNode: Root;
  curNode: Root | FormGroup;
  nextNode: (node: Root | FormGroup) => void;
};

const StoreWrapper = (props) => {
  const [page, setPage] = useState('root')
  const [rootNode, setRootNode] = useState<Root>(null)
  const [curNode, setCurNode] = useState<Root | FormGroup | FieldNode>(null)

  const initSetUp = (data: Store = {} as Store) => {
    const node = new Root(data)
    setRootNode(node)
    setCurNode(node)
  }

  useEffect(() => {
    if (!rootNode) {
      initSetUp()
    }
  }, [rootNode])

  const onMessageReceivedFromIframe = useCallback(
    event => {
      console.log("onMessageReceivedFromIframe");
      const formData: Store = event?.data?.formData;
      console.log({ event, formData })
      if (event && typeof formData === 'object' 
        && formData !== null) {
        console.log('run on mess')
        initSetUp(formData)
      }
    },
    []
  );

  useEffect(() => {
    console.log('add')
    window.addEventListener("message", onMessageReceivedFromIframe);
    return () => {
      window.removeEventListener("message", onMessageReceivedFromIframe);
      console.log('removed')
    }
    
  }, [onMessageReceivedFromIframe]);

  const nextNode = (node: Root | FormGroup | FieldNode) => {
    setCurNode(node)
    setPage(node.position)
  }

  const prevPage = () => {
    const prevNode: FormGroup | FieldNode = curNode as FormGroup | FieldNode
    nextNode(prevNode.parent)
  }

  const getFullStore = () => {
    const formData = rootNode.getStoreData()
    console.log(JSON.stringify(formData));
    window.parent.postMessage({ formData }, '*')
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
    <Box d="grid" position="relative" >
      { curNode ? (
        <AnimatePresence initial={false}>
          {(page === 'root') && (<motion.div key={curNode.id}
              style={{
                ...pageStyle,
  
              }}
              initial="enter"
              animate="center"
              exit="exit"
              variants={variants}
              transition={pageTransition}>
              <Home rootNode={rootNode} curNode={curNode as Root} nextNode={nextNode} />
            </motion.div>)}
          {(page === 'group') && <motion.div key={curNode.id}
              style={{ ...pageStyle,
 
              }}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={pageTransition}>
              <GroupPage
                  rootNode={rootNode} curNode={curNode as FormGroup} nextNode={nextNode} />
            </motion.div>}
            {(page === 'field') && <motion.div key={curNode.id}
                style={{
                  ...pageStyle,
              
                }}
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
    <footer>
    </footer>
    
  </>)
}

export default StoreWrapper