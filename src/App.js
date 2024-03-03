import React, { useEffect, useRef } from 'react';
import { pdfjs } from "react-pdf";
import FileUpload from "./components/FileUpload";
import Example from "./example"
import SideBar from './components/SideBar';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.js",
  import.meta.url
).toString();



function App() {
  return (
    <div>
      <FileUpload/>
      {/* <Example/> */}
      
    </div>
  );
}

export default App;

