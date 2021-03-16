import React, { Children, isValidElement, cloneElement, useState, useEffect } from 'react';
import { Root } from '../scripts/store'


interface Props {
  rootNode: Root;
  curNode: Root;
  setCurNode: (node: Root) => void;
};

const StoreWrapper = ({ children }) => {
  const [rootNode, setRootNode] = useState(null)
  const [curNode, setCurNode] = useState(null)
  useEffect(() => {
    const node = new Root();
    setRootNode(node);
    setCurNode(node);
  }, []);
  return (<>
    {Children.map(children,
      (child: React.ReactElement<Props>, i: number) => {
        if (isValidElement(child)) {
          const props = {
            rootNode,
            curNode,
            setCurNode
          };
          return cloneElement(child, props);
        };
      })}
  </>)
}

export default StoreWrapper