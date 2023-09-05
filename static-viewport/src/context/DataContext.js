import { createContext, useReducer } from "react";

export const DataContext = createContext({});    

export const DataProvider = ({ children }) => {
    const [data, dispatch] = useReducer(dataReducer, initialData);

    return (
        <DataContext.Provider value={{
            data,
        }}>
            {children}
        </DataContext.Provider>
    );
};

function dataReducer(tasks, action) {
    switch (action.type) {
        default: {
            throw Error('Unknown action: ' + action.type);
        }
    }
}

const initialData = {
    layout_data : {
        rows: 2,
        cols: 2,
    },
    viewport_data : [
        {
            imageIds: ["dicomweb:https://ohif-dicom-json-example.s3.amazonaws.com/LIDC-IDRI-0001/01-01-2000-30178/3000566.000000-03192/1-002.dcm"],
            ww: 300,
            wc: 300,
            currentImageIdIndex: 0,
            zoom: 1,
            pan_x: 0,
            pan_y: 0,
            rotation: 0,
        }, {
            imageIds: ["dicomweb:https://ohif-dicom-json-example.s3.amazonaws.com/LIDC-IDRI-0001/01-01-2000-30178/3000566.000000-03192/1-002.dcm"],
            ww: 1800,
            wc: 200,
            currentImageIdIndex: 0,
            zoom: 1,
            pan_x: 0,
            pan_y: 0,
            rotation: 0,
        }, {
            imageIds: ["dicomweb:https://ohif-dicom-json-example.s3.amazonaws.com/LIDC-IDRI-0001/01-01-2000-30178/3000566.000000-03192/1-002.dcm"],
            ww: 300,
            wc: 100,
            currentImageIdIndex: 0,
            zoom: 1,
            pan_x: 0,
            pan_y: 0,
            rotation: 0,
        }, {
            imageIds: ["dicomweb:https://ohif-dicom-json-example.s3.amazonaws.com/LIDC-IDRI-0001/01-01-2000-30178/3000566.000000-03192/1-002.dcm"],
            ww: 1800,
            wc: 200,
            currentImageIdIndex: 0,
            zoom: 1,
            pan_x: 0,
            pan_y: 0,
            rotation: 0,
        }
    ]
};