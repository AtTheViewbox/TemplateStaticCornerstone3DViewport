import React, { useRef, useContext, useEffect } from 'react';
import { DataContext } from '../context/DataContext.js';

import * as cornerstone from '@cornerstonejs/core';
import * as cornerstoneTools from '@cornerstonejs/tools';
import cornerstoneDICOMImageLoader from '@cornerstonejs/dicom-image-loader';
import dicomParser from 'dicom-parser';
// import makeVolumeMetadata from "../context/makeVolumeMetadata";
// import createImageIdsAndCacheMetaData from "../context/createImageIdsAndCacheMetaData";
import { mat4, vec3 } from 'gl-matrix';

export default function Viewport(props) {
  const elementRef = useRef(null);

  const { vd } = useContext(DataContext).data;
  const { viewport_idx, rendering_engine } = props;
  const viewport_data = vd[viewport_idx];
  var timer = null;

  useEffect(() => {

    const loadImagesAndDisplay = async () => {

      const viewportId = `${viewport_idx}-vp`;
      const viewportInput = {
        viewportId,
        type: cornerstone.Enums.ViewportType.VOLUME_3D,
        element: elementRef.current,
        defaultOptions: {
          orientation: cornerstone.Enums.OrientationAxis.CORONAL,
          background: [0.2, 0, 0.2],
        },
      };

      rendering_engine.enableElement(viewportInput);

      const viewport = (
        rendering_engine.getViewport(viewportId)
      );

      const { s, ww, wc } = viewport_data;

      rendering_engine.setViewports([viewportInput]);

      const volume = await cornerstone.volumeLoader.createAndCacheVolume('cornerstoneStreamingImageVolume:CT_VOLUME_ID', { imageIds: s } );
      volume.load();
      
      cornerstone.setVolumesForViewports(rendering_engine, [{ volumeId: "cornerstoneStreamingImageVolume:CT_VOLUME_ID" }], [viewportId]).then(
        () => {
          const volumeActor = rendering_engine
            .getViewport(viewportId)
            .getDefaultActor().actor
    
          cornerstone.utilities.applyPreset(
            volumeActor,
            cornerstone.CONSTANTS.VIEWPORT_PRESETS.find((preset) => preset.name === 'DTI-FA-Brain')
          );
    
          viewport.render();
        }
      );

      viewport.render();
    };

    // const addCornerstoneTools = () => {

    //   const userAgent = typeof window.navigator === 'undefined' ? '' : navigator.userAgent;
    //   const mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);

    //   const {
    //     PanTool,
    //     WindowLevelTool,
    //     StackScrollTool,
    //     StackScrollMouseWheelTool,
    //     ZoomTool,
    //     PlanarRotateTool,
    //     ToolGroupManager,
    //     Enums: csToolsEnums,
    //   } = cornerstoneTools;
      
    //   const { MouseBindings } = csToolsEnums;
      
    //   const toolGroupId = `${viewport_idx}-tl`;

    //   // Define a tool group, which defines how mouse events map to tool commands for
    //   // Any viewport using the group
    //   ToolGroupManager.createToolGroup(toolGroupId);
    //   const toolGroup = ToolGroupManager.getToolGroup(toolGroupId);

    //   if (mobile) {
    //     toolGroup.addTool(WindowLevelTool.toolName);
    //     toolGroup.addTool(ZoomTool.toolName);
    //     toolGroup.addTool(StackScrollTool.toolName);

    //     toolGroup.setToolActive(ZoomTool.toolName, { bindings: [{ numTouchPoints: 2 }], });
    //     toolGroup.setToolActive(StackScrollTool.toolName, { bindings: [{ mouseButton: MouseBindings.Primary }], });
    //     toolGroup.setToolActive(WindowLevelTool.toolName, { bindings: [{ numTouchPoints: 3 }], });

    //   } else {
    //     toolGroup.addTool(WindowLevelTool.toolName);
    //     toolGroup.addTool(PanTool.toolName);
    //     toolGroup.addTool(ZoomTool.toolName);
    //     toolGroup.addTool(StackScrollMouseWheelTool.toolName, { loop: true });

    //     toolGroup.setToolActive(WindowLevelTool.toolName, { bindings: [{ mouseButton: MouseBindings.Primary }], });
    //     toolGroup.setToolActive(PanTool.toolName, { bindings: [{ mouseButton: MouseBindings.Auxiliary }], });
    //     toolGroup.setToolActive(ZoomTool.toolName, { bindings: [{ mouseButton: MouseBindings.Secondary }], });
    //     toolGroup.setToolActive(StackScrollMouseWheelTool.toolName);
    //   }

    //   toolGroup.addViewport(`${viewport_idx}-vp`, 'myRenderingEngine');
    // };

    function myTimer() {

      const viewportId = `${viewport_idx}-vp`;
      const viewport = (
        rendering_engine.getViewport(viewportId)
      );

      const camera = viewport.getCamera();
      const { viewUp, position, focalPoint } = camera;
  
      const [cx, cy, cz] = focalPoint;
      const [ax, ay, az] = [0, 0, 1];
  
      const angle = 0.1 * 0.5;
  
      const newPosition = [0, 0, 0];
      const newFocalPoint = [0, 0, 0];
      const newViewUp = [0, 0, 0];
  
      const transform = mat4.identity(new Float32Array(16));
      mat4.translate(transform, transform, [cx, cy, cz]);
      mat4.rotate(transform, transform, angle, [ax, ay, az]);
      mat4.translate(transform, transform, [-cx, -cy, -cz]);
      vec3.transformMat4(newPosition, position, transform);
      vec3.transformMat4(newFocalPoint, focalPoint, transform);
  
      mat4.identity(transform);
      mat4.rotate(transform, transform, angle, [ax, ay, az]);
      vec3.transformMat4(newViewUp, viewUp, transform);
  
      viewport.setCamera({
        position: newPosition,
        viewUp: newViewUp,
        focalPoint: newFocalPoint,
      });
  
      viewport.render();

    }

    console.log("mounting viewport");
    if (viewport_data) {
      loadImagesAndDisplay().then(() => {
        // addCornerstoneTools();

        
        timer = setInterval(myTimer, 10);
      });
    }
    return () => { clearInterval(timer); console.log("unmounting viewport"); };
  }, []);


  return (
    <>
      <div ref={elementRef} id={viewport_idx} style={{ width: '100%', height: '100%' }} />
    </>
  );
}
