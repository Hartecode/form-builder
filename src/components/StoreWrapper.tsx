import React, { useState, useEffect } from 'react';
import { Root } from '../scripts/store'
import Home from './Home'
import GroupPage from './GroupPage'


export interface Props {
  rootNode: Root;
  curNode: Root;
  nextNode: (node: Root) => void;
};

const StoreWrapper = (props) => {
  const [page, setPage] = useState('group')
  const [rootNode, setRootNode] = useState(null)
  const [curNode, setCurNode] = useState(null)
  useEffect(() => {
    const node = new Root()
    if (!rootNode) {
      setRootNode(node)
      setCurNode(node)
    }
  }, [rootNode])

  const nextNode = (node: Root) => {
    setCurNode(node)
    setPage(node.position)
  }

  return (
  <>
    {(page === 'root') && <Home 
            rootNode={rootNode} curNode={curNode} nextNode={nextNode} />}
    {(page === 'group') && <GroupPage
            rootNode={rootNode} curNode={curNode} nextNode={nextNode} />}
    
  </>)
}

export default StoreWrapper