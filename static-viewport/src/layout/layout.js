import './layout.css';
import { useContext, useEffect } from 'react';
import { DataContext } from '../context/DataContext.js';
import Viewport from '../viewport/viewport';

import * as cornerstone from '@cornerstonejs/core';
import * as cornerstoneTools from '@cornerstonejs/tools';
import cornerstoneDICOMImageLoader from '@cornerstonejs/dicom-image-loader';
import dicomParser from 'dicom-parser';

import { useState } from 'react';

export default function Layout() {
    const { layout_data } = useContext(DataContext).data;
    const { rows, cols } = layout_data;

    const [renderingEngine, setRenderingEngine] = useState(null);

    useEffect(() => {
        const setupCornerstone = async () => {
            window.cornerstone = cornerstone;
            window.cornerstoneTools = cornerstoneTools;
            cornerstoneDICOMImageLoader.external.cornerstone = cornerstone;
            cornerstoneDICOMImageLoader.external.dicomParser = dicomParser;
            await cornerstone.init();
            await cornerstoneTools.init();

            const renderingEngineId = 'myRenderingEngine';
            const re = new cornerstone.RenderingEngine(renderingEngineId);
            setRenderingEngine(re);

            const {
                PanTool,
                WindowLevelTool,
                StackScrollMouseWheelTool,
                ZoomTool,
                PlanarRotateTool,
            } = cornerstoneTools;

            cornerstoneTools.addTool(PanTool);
            cornerstoneTools.addTool(WindowLevelTool);
            cornerstoneTools.addTool(StackScrollMouseWheelTool);
            cornerstoneTools.addTool(ZoomTool);
            cornerstoneTools.addTool(PlanarRotateTool);
      
        };

        setupCornerstone();
    
    }, []);


    useEffect(() => {

        const handleResize = () => {
            console.log('resized!');
            renderingEngine.resize(true);
        };

        if (renderingEngine) window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    
    }, [renderingEngine]);
    

    const items = Array.from({ length: rows * cols }).map((_, idx) => (
        <div key={idx} className="grid-item">
            <Viewport viewport_idx={idx} rendering_engine={renderingEngine} />
        </div>
    ));

    return renderingEngine ? (
        <div className="grid-container" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)`, gridTemplateRows: `repeat(${rows}, 1fr)` }}>{items}</div>
    ) : null;
};