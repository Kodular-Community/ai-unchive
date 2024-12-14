import { useCallback, useRef } from 'react';
import { getDescriptor } from "aia-kit/utils/utils.js";
import { useProject } from '../hooks/useProject.js';

declare global {
  const Blockly: any
  const BlocklyWorkspace: any
}

function BlocklyComponent({ blocksXml }: { blocksXml: string }) {
  const project = useProject();
  const wsRef = useRef<typeof BlocklyWorkspace | null>(null);

  const blocklyDivRef = useCallback((blocklyDiv: HTMLDivElement) => {
    if (!wsRef.current) {
      const ws = Blockly.inject(blocklyDiv, {
        readOnly: true,
        trashcan: false,
        toolbox: false,
        scrollbars: true,
        grid: {
          spacing: 20,
          length: 3,
          colour: '#ccc',
          snap: true,
        },
        // zoom: {
        //   controls: true,
        //   // wheel: true,
        //   startScale: 1.0,
        //   maxScale: 3,
        //   minScale: 0.3,
        //   scaleSpeed: 1.2,
        //   pinch: true,
        // },
      });

      ws.getDescriptor = (componentType: string) => getDescriptor(componentType, project)

      const block = Blockly.Xml.domToWorkspace(Blockly.Xml.textToDom(blocksXml), ws)

      wsRef.current = ws;

      console.log('created new workspace...');
    }

    // return () => {
    //     wsRef.current?.dispose();
    // }
  }, [wsRef, blocksXml]);

  return (
    <div ref={blocklyDivRef} className="blocklyDiv" style={{
      height: "calc(100dvh - var(--app-shell-header-height) - 80px)",
      width: '100%'
    }} />
  );
}

export default BlocklyComponent;
