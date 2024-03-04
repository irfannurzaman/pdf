import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import { useDropzone } from 'react-dropzone';
import { fabric } from 'fabric';
import { useButtons } from '../context/CanvasContext';
import styled, { css } from 'styled-components';
import SideBar from './SideBar';
import { MdClose } from 'react-icons/md';
import PaginationBar from "./PaginationBar";
import StyledFileUpload from "./StyledFileUpload";
import Loader from './Loader';

const StyledContainer = styled.div`
    min-height: 100vh;
`

const StyledPageContainer = styled.div`
    width: 100%;
    padding-top: 2rem; 
    padding-bottom: 2rem; 
`


const StyledClose = styled.div`
    padding: 0.5rem; /* p-2 */
    z-index: 1200; /* z-[1200] */
    background-color: red; /* bg-red-500 */
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); /* shadow-sm */
    border-radius: 0.375rem; /* rounded-md */
    color: white; /* text-white */
    position: fixed; /* fixed */
    top: 5%; /* top-5 */
    right: 5%; /* right-5 */
    cursor: pointer; /* cursor-pointer */ `


const ContainerDocuments = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;   
`

const PageExport = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    `;
    
    
const StyledPage = styled.div`
    padding-left: 1rem;
    padding-right: 1rem;
    padding-top: 1rem;
    padding-bottom: 1rem;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    border-width: 1px;
    border-style: solid;
    border-color: #e5e7eb; /* You can replace this with your desired border color */
    
`;
    
    
const Canvas = styled.div`
    position: absolute;
    z-index: 9;
    padding-left: 1rem;
    padding-right: 1rem;
    padding-top: 1rem;
    padding-bottom: 1rem;
`;


const BackgroundOverlay = styled.div`
  width: 100%;
  height: 100%;
  top: 0;
  position: fixed;
  background-color: rgba(50, 50, 50, 0.2);
  z-index: 1001;
  backdrop-filter: blur(4px); /* Adjust the blur value as needed */
`;

const LoaderContainer = styled.div`
  position: fixed;
  z-index: 1100;
  display: flex;
  width: 100%;
  height: 100%;
  top: 0;
  justify-content: center;
  align-items: center;
`;

export default function FileUpload() { 
    
    const canvasRef = React.useRef(null);
    const contextValues = useButtons();

    const [docIsLoading, setDocIsLoading] = React.useState(false);

    const { getRootProps, getInputProps } = useDropzone({
        onDrop: files => {
            setDocIsLoading(true);
            contextValues.setFile(files[0])
        }
    })

    async function onDocumentLoadSuccess(pageData) {        
        const { numPages } = pageData
        const dataPdf = []
        for (let pageNumber = 1; pageNumber <= numPages; pageNumber++) {
            await pageData.getPage(pageNumber).then(function(page) {
                const viewport = page.getViewport({ scale: 1 });
                dataPdf.push({
                    width: viewport.width,
                    height: viewport.height
                })
            });
        }
        contextValues.setDataPdf(dataPdf)
        contextValues.setEdits({});
        contextValues.setNumPages(numPages);
        contextValues.setCurrPage(1);
        contextValues.setCanvas(initCanvas());
        setTimeout(() => setDocIsLoading(false), 2000)
    }

    function changePage(offset) {
        const page = contextValues.currPage;
        contextValues.edits[page] = contextValues.canvas.toObject();
        contextValues.setEdits(contextValues.edits);
        contextValues.setCurrPage(page => page + offset);
        contextValues.canvas.clear()
        contextValues.edits[page + offset] && contextValues.canvas.loadFromJSON(contextValues.edits[page + offset]);
        contextValues.canvas.renderAll();
        
    }


    const initCanvas = () => {
        return (new fabric.Canvas(canvasRef.current, {
            isDrawingMode: false,
            height: 842,
            width: 595,
            backgroundColor: 'rgba(0,0,0,0)'
        }))
    }


    function getCoords(oCoords) {
        return {
            tl: new fabric.Point(oCoords.tl.x, oCoords.tl.y),
            tr: new fabric.Point(oCoords.tr.x, oCoords.tr.y),
            bl: new fabric.Point(oCoords.bl.x, oCoords.bl.y),
            br: new fabric.Point(oCoords.br.x, oCoords.br.y)
        }
    }

    const pdf = contextValues.dataPdf[contextValues.currPage - 1]
    const canvasWidth = pdf?.width;
    const canvasHeight = pdf?.height;

    React.useEffect(() => {
        const canvas = contextValues?.canvas   

        const handleObjDown = (event) => { 
            const obj = event.target;
            const objBoundingRect = obj.getBoundingRect();
            canvas.setActiveObject(obj)
            const thisCoords = getCoords(canvas.getActiveObject().oCoords);
            contextValues.setData((old) => {
                const data = []
                old.forEach(element => {
                    if (element.id === event.target.id) {
                        data.push({
                            ...element,
                            width: objBoundingRect.width,
                            height: objBoundingRect.height,
                            x: thisCoords.tl.x,
                            y: thisCoords.tl.y,
                            ...(obj.text && {file: obj.text} )
                        })
                    } else {
                        data.push(element)
                    }
                });
                return data
            })            
        }
        const handleMouseDown = (event) => {
            const obj = event.target;
            const horizontal = canvasHeight < canvasWidth
            const objBoundingRect = obj.getBoundingRect();
            obj.set({
                left: Math.min(Math.max(obj.left, 0), canvas.width - objBoundingRect.width),
                top: Math.min(Math.max(obj.top, 0), (canvasHeight) - objBoundingRect.height)
            });
        };
    
        if (canvas) {
            canvas?.on('object:moving', handleMouseDown);;
            canvas?.on('object:modified', handleObjDown);
            return () => {
                canvas?.off('object:moving', handleMouseDown);
                canvas?.off('object:modified', handleObjDown);
            };
        }

    }, [contextValues?.canvas, contextValues.currPage]);


    

    React.useEffect(() => {
        pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
    }, [])

   const handleRenderSuccess = pageData => {
        console.log(pageData);
    }

    return (
        <StyledContainer>
            {contextValues.selectedFile && <SideBar getRootProps={getRootProps} />}
            {
                contextValues.selectedFile ?
                    (
                    <StyledPageContainer>
                            <StyledClose onClick={() => {
                                contextValues.setFile(null)
                                contextValues.setData([])
                        }}>
                            <MdClose style={{ color: 'white', fontSize: '1.5rem' }} />
                        </StyledClose>
                        <ContainerDocuments>
                            <PageExport id="singlePageExport">
                                {   docIsLoading && (
                                        <>
                                            <BackgroundOverlay />
                                            <LoaderContainer>
                                                <Loader color={"#606060"} size={120} stokeWidth={'5'} />
                                            </LoaderContainer>
                                        </>
                                )
                                    
                                }
                                <Document
                                    onRenderSuccess={handleRenderSuccess}
                                    file={contextValues.selectedFile}
                                    onLoadSuccess={onDocumentLoadSuccess}
                                    style={{ display: 'flex', justifyContent: 'center' }}
                                    id="doc">
                                    <Canvas style={{ visibility: "visible" }}>
                                        <canvas ref={canvasRef}/>
                                    </Canvas>
                                    <StyledPage contextValues={contextValues}>
                                        <Page pageNumber={contextValues.currPage} id="docPage" width={canvasWidth} height={canvasHeight} />
                                    </StyledPage>
                                </Document>
                            </PageExport>
                        </ContainerDocuments>
                        <PaginationBar contextValues={contextValues} changePage={changePage} />
                    </StyledPageContainer>
                ) : (
                    <StyledFileUpload getInputProps={getInputProps} />
                    )
                }
        </StyledContainer>
    )
}