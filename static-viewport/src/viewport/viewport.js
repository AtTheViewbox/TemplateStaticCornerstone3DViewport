import React, { useEffect, useRef } from 'react';
import * as cornerstone from '@cornerstonejs/core';
import * as cornerstoneTools from '@cornerstonejs/tools';
import cornerstoneDICOMImageLoader from '@cornerstonejs/dicom-image-loader';
import dicomParser from 'dicom-parser';

export default function Viewport() {

  useEffect(() => {
    window.cornerstone = cornerstone;
    window.cornerstoneTools = cornerstoneTools;
    cornerstoneDICOMImageLoader.external.cornerstone = cornerstone;
    cornerstoneDICOMImageLoader.external.dicomParser = dicomParser;
    cornerstone.init();
    cornerstoneTools.init();
  }, []);

  return (
    <div id="viewport-container" style={{ width: '100%', height: '100%' }} />
  );
}
