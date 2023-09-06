import { createContext, useState, useEffect, useReducer } from "react";
import { unflatten, flatten } from "flat";

import * as cornerstone from '@cornerstonejs/core';
import * as cornerstoneTools from '@cornerstonejs/tools';
import cornerstoneDICOMImageLoader from '@cornerstonejs/dicom-image-loader';
import dicomParser from 'dicom-parser';

export const DataContext = createContext({});    
export const DataDispatchContext = createContext({});

// create initial data object from URL query string
const urlData = unflatten(Object.fromEntries(new URLSearchParams(window.location.search)));

export const DataProvider = ({ children }) => {
    const [data, dispatch] = useReducer(dataReducer, urlData);

    useEffect(() => {
        console.log("Data provider loaded!", data);

        const setupCornerstone = async () => {
            window.cornerstone = cornerstone;
            window.cornerstoneTools = cornerstoneTools;
            cornerstoneDICOMImageLoader.external.cornerstone = cornerstone;
            cornerstoneDICOMImageLoader.external.dicomParser = dicomParser;
            await cornerstone.init();
            await cornerstoneTools.init();

            const renderingEngineId = 'myRenderingEngine';
            const re = new cornerstone.RenderingEngine(renderingEngineId);
            dispatch({type: 'cornerstone_initialized', payload: {renderingEngine: re}})

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

    return (
        <DataContext.Provider value={{ data }}>
            <DataDispatchContext.Provider value={{ dispatch }}>
                {children}
            </DataDispatchContext.Provider>
        </DataContext.Provider>
    );
};

export function dataReducer(data, action) {
    let new_data = {...data};
    switch (action.type) {
        case 'cornerstone_initialized':
            new_data = {...data, ...action.payload};
            break;
        case 'export_layout_to_link':
            let vp_dt = [];
            data.renderingEngine.getViewports().forEach((vp) => {
                const {imageIds, voiRange, currentImageIdIndex} = vp;
                const window = cornerstone.utilities.windowLevel.toWindowLevel(voiRange.lower, voiRange.upper);
                vp_dt.push({imageIds, ww: window.windowWidth, wc: window.windowCenter, currentImageIdIndex})
            })
            // print the query string to the console so it can be copied and pasted into the URL bar
            console.log(new URLSearchParams(flatten({layout_data: data.layout_data, viewport_data: vp_dt})).toString());
            break;
        default:
            throw Error('Unknown action: ' + action.type);
    }
    return new_data;
}




////////////////// CODE TO GENERATE URL QUERY STRINGS //////////////////

// const dataToCreateQueryString = {
//     layout_data : {
//         rows: 2,
//         cols: 2,
//     },
//     viewport_data : [
//         {
//             imageIds: ["dicomweb:https://ohif-dicom-json-example.s3.amazonaws.com/LIDC-IDRI-0001/01-01-2000-30178/3000566.000000-03192/1-002.dcm"],
//             ww: 300,
//             wc: 300,
//             currentImageIdIndex: 0,
//             zoom: 1,
//             pan_x: 0,
//             pan_y: 0,
//             rotation: 0,
//         }, {
//             imageIds: ["dicomweb:https://ohif-dicom-json-example.s3.amazonaws.com/LIDC-IDRI-0001/01-01-2000-30178/3000566.000000-03192/1-002.dcm"],
//             ww: 1800,
//             wc: 200,
//             currentImageIdIndex: 0,
//             zoom: 1,
//             pan_x: 0,
//             pan_y: 0,
//             rotation: 0,
//         }, {
//             imageIds: ["dicomweb:https://ohif-dicom-json-example.s3.amazonaws.com/LIDC-IDRI-0001/01-01-2000-30178/3000566.000000-03192/1-002.dcm"],
//             ww: 300,
//             wc: 100,
//             currentImageIdIndex: 0,
//             zoom: 1,
//             pan_x: 0,
//             pan_y: 0,
//             rotation: 0,
//         }, {
//             imageIds: ["dicomweb:https://ohif-dicom-json-example.s3.amazonaws.com/LIDC-IDRI-0001/01-01-2000-30178/3000566.000000-03192/1-002.dcm"],
//             ww: 1800,
//             wc: 200,
//             currentImageIdIndex: 0,
//             zoom: 1,
//             pan_x: 0,
//             pan_y: 0,
//             rotation: 0,
//         }
//     ]
// };

// let queryString = new URLSearchParams(flatten(dataToCreateQueryString)).toString()
// console.log(queryString)


////////////////

// const renderingEngineId = 'myRenderingEngine';
// const re = cornerstone.getRenderingEngine(renderingEngineId);
// let vp_dt = [];
// re.getViewports().forEach((vp) => {
//     const {imageIds, voiRange, currentImageIdIndex} = vp;
//     const window = cornerstone.utilities.windowLevel.toWindowLevel(voiRange.lower, voiRange.upper);
//     vp_dt.push({imageIds, ww: window.windowWidth, wc: window.windowCenter, currentImageIdIndex})
// })

// let d = {
//     layout_data: {
//         rows: 2,
//         cols: 2,
//     },
//     viewport_data: vp_dt,
// }
// console.log(new URLSearchParams(flatten(d)).toString());
