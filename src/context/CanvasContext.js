
import React, { useEffect, useRef, useState } from 'react'
import { fabric } from 'fabric'
import { v4 as uuidv4 } from 'uuid';

const funButtons = React.createContext()


export const useButtons = () => {
    return React.useContext(funButtons)
}


export const CanvasProvider = ({ children }) => { 

    // file
    const [numPages, setNumPages] = React.useState(null);
    const [currPage, setCurrPage] = React.useState(1);
    const [selectedFile, setFile] = React.useState(null);
    const [strokeWidth, setStrokeWidth] = React.useState(1);
    const [canvas, setCanvas] = React.useState('');
    const [hideCanvas, setHiddenCanvas] = React.useState(false);
    const [data, setData] = useState([])
    const [dataPdf, setDataPdf] = useState([])

    console.log("numPages", numPages);
    console.log("img1", data);
    console.log("dataPdf", dataPdf);
    console.log("canvas", canvas);
    
    

    // canvas edits
    const [edits, setEdits] = React.useState({});
    // uploaded image

    const addImage = (e, canvi) => {
        var file = e.target.files[0];
        var reader = new FileReader();
        reader.onload = function (f) {
            var data = f.target.result;
            fabric.Image.fromURL(data, function (img) {
                const id = uuidv4()
                var img1 = img.set({ id });
                setData(old => [...old, {
                    id: id,
                    file: file,
                    width: img1.width,
                    height: img1.height,
                    x: 0,
                    y: 0,
                    currPage
                }])
                img.scaleToWidth(300);

                canvi.add(img1).renderAll();
                
                var dataURL = canvi.toDataURL({ format: 'png', quality: 0.8 });
            });
        }
        reader.readAsDataURL(file);
        canvi.isDrawingMode = false
    }



    const deleteBtn = () => {
        var activeObject = canvas.getActiveObject();
        if (activeObject) {
            canvas.remove(activeObject);
        }
    }



    // add text
    const addText = canvi => {
        const id = uuidv4()
        const text = new fabric.Textbox("Type Here ...", {
            editable: true,
            id,
        });

        setData(old => [...old, {
            id: id,
            file: text.text,
            width: text.width,
            height: text.height,
            x: 0,
            y: 0,
            currPage
        }])
        // text.set({ fill: color })
        text.set({ fill: '#000' })
        canvi.add(text);
        canvi.renderAll();
        canvi.isDrawingMode = false
        canvas.setActiveObject(text);
    }

    const values = {
        addText, 
        addImage, 
        canvas,
        setCanvas, 
        numPages, 
        setNumPages, 
        currPage, 
        setCurrPage, 
        selectedFile, 
        setFile, 
        edits, 
        setEdits, 
        deleteBtn, 
        strokeWidth, 
        setStrokeWidth, 
        hideCanvas, 
        setHiddenCanvas,
        setData,
        data,
        setDataPdf,
        dataPdf
    }

    return (
        <funButtons.Provider value={values}>
            {children}
        </funButtons.Provider>
    )
}