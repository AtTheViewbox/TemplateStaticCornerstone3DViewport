import React, { useEffect } from 'react';
import * as cornerstone from '@cornerstonejs/core';
import * as cornerstoneTools from '@cornerstonejs/tools';
import cornerstoneDICOMImageLoader from '@cornerstonejs/dicom-image-loader';
import dicomParser from 'dicom-parser';

export default function Viewport() {

  const imageIds = [
    "dicomweb:https://ohif-dicom-json-example.s3.amazonaws.com/LIDC-IDRI-0001/01-01-2000-30178/3000566.000000-03192/1-002.dcm"
  ];

  useEffect(() => {

    const setupCornerstone = async () => {
      window.cornerstone = cornerstone;
      window.cornerstoneTools = cornerstoneTools;
      cornerstoneDICOMImageLoader.external.cornerstone = cornerstone;
      cornerstoneDICOMImageLoader.external.dicomParser = dicomParser;
      await cornerstone.init();
      await cornerstoneTools.init();
    };

    const loadImagesAndDisplay = () => {
      imageIds.map((imageId) => {
        cornerstone.imageLoader.loadAndCacheImage(imageId);
      });
  
      const renderingEngineId = 'myRenderingEngine';
      const renderingEngine = new cornerstone.RenderingEngine(renderingEngineId);
  
      const element = document.getElementById('viewport-container');
  
      const viewportId = 'CT_STACK';
      const viewportInput = {
        viewportId,
        type: cornerstone.Enums.ViewportType.STACK,
        element,
        defaultOptions: {
          background: [0.1, 0.1, 0.1],
        },
      };
    
      renderingEngine.enableElement(viewportInput);
  
      const viewport = (
        renderingEngine.getViewport(viewportId)
      );
    
      // Define a stack containing a single image
      const stack = imageIds;
    
      // Set the stack on the viewport
      viewport.setStack(stack);
    
      // Render the image
      viewport.render();
    };

    setupCornerstone().then(() => {
      loadImagesAndDisplay();
    });
  }, []);

  return (
    <div id="viewport-container" style={{ width: '100%', height: '100%' }} />
  );
}
