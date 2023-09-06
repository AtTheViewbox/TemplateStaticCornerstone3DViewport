import React, { useRef, useContext, useEffect } from 'react';
import { DataContext } from '../context/DataContext.js';

import * as cornerstone from '@cornerstonejs/core';
import * as cornerstoneTools from '@cornerstonejs/tools';
import cornerstoneDICOMImageLoader from '@cornerstonejs/dicom-image-loader';
import dicomParser from 'dicom-parser';

export default function Viewport(props) {
  const elementRef = useRef(null);

  const { viewport_data } = useContext(DataContext).data;
  const { viewport_idx, rendering_engine } = props;
  const real_viewport_data = viewport_data[viewport_idx];

  useEffect(() => {

    const loadImagesAndDisplay = async () => {

      const viewportId = `${viewport_idx}-vp`;
      const viewportInput = {
        viewportId,
        type: cornerstone.Enums.ViewportType.STACK,
        element: elementRef.current,
        defaultOptions: {

        },
      };

      rendering_engine.enableElement(viewportInput);

      const viewport = (
        rendering_engine.getViewport(viewportId)
      );

      const { imageIds, ww, wc } = real_viewport_data;

      imageIds.map((imageId) => {
        cornerstone.imageLoader.loadAndCacheImage(imageId);
      });

      const stack = imageIds;
      await viewport.setStack(stack);

      viewport.setProperties({
        voiRange: cornerstone.utilities.windowLevel.toLowHighRange(ww, wc),
        isComputedVOI: false,
      });

      viewport.render();
    };

    const addCornerstoneTools = () => {

      const {
        PanTool,
        WindowLevelTool,
        StackScrollMouseWheelTool,
        ZoomTool,
        PlanarRotateTool,
        ToolGroupManager,
        Enums: csToolsEnums,
      } = cornerstoneTools;
      
      const { MouseBindings } = csToolsEnums;
      
      const toolGroupId = `${viewport_idx}-tl`;

      // Define a tool group, which defines how mouse events map to tool commands for
      // Any viewport using the group
      ToolGroupManager.createToolGroup(toolGroupId);
      const toolGroup = ToolGroupManager.getToolGroup(toolGroupId);

      // // Add tools to the tool group
      toolGroup.addTool(WindowLevelTool.toolName);
      toolGroup.addTool(PanTool.toolName);
      toolGroup.addTool(ZoomTool.toolName);
      toolGroup.addTool(StackScrollMouseWheelTool.toolName, { loop: true });
      toolGroup.addTool(PlanarRotateTool.toolName);

      // Set the initial state of the tools, here all tools are active and bound to
      // Different mouse inputs
      toolGroup.setToolActive(WindowLevelTool.toolName, {
        bindings: [
          {
            mouseButton: MouseBindings.Primary, // Left Click
          },
        ],
      });
      toolGroup.setToolActive(PanTool.toolName, {
        bindings: [
          {
            mouseButton: MouseBindings.Auxiliary, // Middle Click
          },
        ],
      });
      toolGroup.setToolActive(ZoomTool.toolName, {
        bindings: [
          {
            mouseButton: MouseBindings.Secondary, // Right Click
          },
        ],
      });


      toolGroup.setToolActive(StackScrollMouseWheelTool.toolName);
      toolGroup.addViewport(`${viewport_idx}-vp`, 'myRenderingEngine');


    };

    console.log("mounting viewport");
    if (real_viewport_data) {
      loadImagesAndDisplay().then(addCornerstoneTools());
    }
    return () => { console.log("unmounting viewport"); };
  }, []);


  return (
    <>
      <div ref={elementRef} id={viewport_idx} style={{ width: '100%', height: '100%' }} />
    </>
  );
}
