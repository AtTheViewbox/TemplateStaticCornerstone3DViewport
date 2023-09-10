import { createContext, useState, useEffect, useReducer } from "react";
import { unflatten, flatten } from "flat";

import { recreateList } from '../utils/inputParser.js';

import * as cornerstone from '@cornerstonejs/core';
import * as cornerstoneTools from '@cornerstonejs/tools';
import cornerstoneDICOMImageLoader from '@cornerstonejs/dicom-image-loader';
import {
    cornerstoneStreamingImageVolumeLoader,
} from '@cornerstonejs/streaming-image-volume-loader';

import dicomParser from 'dicom-parser';

export const DataContext = createContext({});    
export const DataDispatchContext = createContext({});

// create initial data object from URL query string
const urlData = unflatten(Object.fromEntries(new URLSearchParams(window.location.search)));
urlData.vd.forEach((vdItem) => {
    if (vdItem.s && vdItem.s.pf && vdItem.s.sf && vdItem.s.s && vdItem.s.e) {
        vdItem.s = recreateList(vdItem.s.pf, vdItem.s.sf, vdItem.s.s, vdItem.s.e);
    }
});

console.log("urlData", urlData);



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

            cornerstone.volumeLoader.registerVolumeLoader(
                'cornerstoneStreamingImageVolume',
                cornerstoneStreamingImageVolumeLoader
            );

            const renderingEngineId = 'myRenderingEngine';
            const re = new cornerstone.RenderingEngine(renderingEngineId);
            dispatch({type: 'cornerstone_initialized', payload: {renderingEngine: re}})

            const {
                PanTool,
                WindowLevelTool,
                StackScrollTool,
                StackScrollMouseWheelTool,
                ZoomTool,
                PlanarRotateTool,
            } = cornerstoneTools;

            cornerstoneTools.addTool(PanTool);
            cornerstoneTools.addTool(WindowLevelTool);
            cornerstoneTools.addTool(StackScrollTool);
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

const dataToCreateQueryString = {
    ld : {
        r: 2,
        c: 1,
    },
    vd : [
        {
            s: {pf: "dicomweb:https://s3.amazonaws.com/elasticbeanstalk-us-east-1-843279806438/dicom/production/-ywXf2R16d_1.3.12.2.1107.5.1.4.73513.30000019073110243989500020904/", sf: ".dcm.gz", s: "002", e: "541"},
            ww: 600,
            wc: 200,
            ci: 0,
            z: 1,
            px: 0,
            py: 0,
            r: 0,
        }, {
            s: {pf: "dicomweb:https://s3.amazonaws.com/elasticbeanstalk-us-east-1-843279806438/dicom/production/-ywXf2R16d_1.3.12.2.1107.5.1.4.73513.30000019073110243989500021446/", sf: ".dcm.gz", s: "002", e: "148"},
            ww: 600,
            wc: 200,
            ci: 0,
            z: 1,
            px: 0,
            py: 0,
            r: 0,
        }
        // }, {
        //     s: {pf: "dicomweb:https://s3.amazonaws.com/elasticbeanstalk-us-east-1-843279806438/dicom/production/-ywXf2R16d_1.3.12.2.1107.5.1.4.73513.30000019073110243989500021595/", sf: ".dcm.gz", s: "002", e: "215"},
        //     ww: 600,
        //     wc: 200,
        //     ci: 0,
        //     z: 1,
        //     px: 0,
        //     py: 0,
        //     r: 0,
        // }, {
        //     s: {pf: "dicomweb:https://s3.amazonaws.com/elasticbeanstalk-us-east-1-843279806438/dicom/production/-ywXf2R16d_1.3.12.2.1107.5.1.4.73513.30000019073110243989500021595/", sf: ".dcm.gz", s: "002", e: "541"},
        //     ww: 600,
        //     wc: 200,
        //     ci: 0,
        //     z: 1,
        //     px: 0,
        //     py: 0,
        //     r: 0,
        // },
    ]
};

const a = {
    ld : {
        r: 1,
        c: 1,
    },
    vd : [
        {
            s: {pf: 'dicomweb:https://s3.amazonaws.com/elasticbeanstalk-us-east-1-843279806438/dicom/production/-ywXf2R16d_1.3.12.2.1107.5.1.4.73513.30000019073110243989500020904/', sf: '.dcm.gz', s: '001', e: '100'},
            ww: 600,
            wc: 200,
            ci: 0,
            z: 1,
            px: 0,
            py: 0,
            r: 0,
        }
    ]
}

let queryString = new URLSearchParams(flatten(a)).toString()
console.log(queryString)


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
