import React, { useEffect, useRef } from 'react';
import { pdfjs } from "react-pdf";
import FileUpload from "./components/FileUpload";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.js",
  import.meta.url
).toString();



function App() {
  return (
    <div>
      <FileUpload/>
    </div>
  );
}

export default App;

