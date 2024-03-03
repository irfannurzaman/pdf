import React from 'react'
import { CgFormatText } from 'react-icons/cg'
import { AiOutlineDelete } from 'react-icons/ai'
import { BiHide, BiImageAdd, BiShow } from 'react-icons/bi'
import { useButtons } from '../context/CanvasContext';
import styled  from 'styled-components';

const StyledContainer = styled.div`
    position: fixed;
    z-index: 50;
    top: 85%; 
    left: 0;
    height: 15vh;
    width: 100vw;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    @media (min-width: 768px) {
        top: 0;
        height: 100vh;
        width: max-content;
        flex-direction: column;
    }
`;

const StyledContent = styled.div`
    border: 1px solid rgb(229, 231, 235);
    background-color: #fff;
    max-height: 68vh;
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
    border-radius: 0.375rem;
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
    padding-left: 1rem;
    padding-right: 1rem;
    font-size: 1.2rem;
    min-width: 8vw;
    gap: 8px;
    @media (min-width: 768px) {
        margin-left: 2.5rem; 
        flex-direction: column;
        padding-top: 2rem;
        padding-bottom: 2rem;
        font-size: 1.5rem;
    }
`;






export default function SideBar({getRootProps}) {
    const contextValues = useButtons();
    const fileInputRef = React.useRef(null);

    const handleText = () => {
        contextValues.addText(contextValues.canvas)
    }
    const handleImageChange = (e) => {
        contextValues.addImage(e, contextValues.canvas)
    }

    const handleUploadClick = () => {
        fileInputRef.current.click();
    };

    return (
        <StyledContainer {...getRootProps}>
            <StyledContent>
                <CgFormatText style={{ fontSize: '1.8rem', cursor: 'pointer' }} onClick={handleText} />
                <div>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                    />
                    <div style={{ cursor: 'pointer' }} onClick={handleUploadClick}>
                        <BiImageAdd size={32} /> 
                    </div>
                </div>
                <AiOutlineDelete style={{ cursor: 'pointer' }} onClick={() => contextValues.deleteBtn()} />
            </StyledContent>
        </StyledContainer>
    )
}