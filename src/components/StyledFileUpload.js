import React from 'react';
import styled from 'styled-components';

import { BiHide, BiImageAdd, BiShow } from 'react-icons/bi'
const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  padding-top: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const InnerContainer = styled.div`
  display: flex;
  width: 40vw;
  height: 40vh;
  justify-content: center;
  align-items: center;
  border-radius: 0.375rem; /* rounded-md */
  border: 2px dashed #D1D5DB; /* border-dashed border-gray-300 */
  padding: 1.5rem 2.5rem; /* px-6 pt-5 pb-6 */
`;

const StyledLabel = styled.label`
  position: relative;
  cursor: pointer;
  border-radius: 0.375rem; /* rounded-md */
  font-medium;
  background-color: transparent;
  color: #4F46E5; /* text-indigo-500 */
  outline: none;
  transition: color 0.3s;

  &:hover {
    color: #2563EB; /* hover:text-indigo-500 */
  }
`;

const StyledInput = styled.input`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
`;

const UploadContainer = styled.div`
  display: flex;
  align-items: center;
  font-size: 1rem; /* text-md */
  color: #4B5563
`;

const Text = styled.p`
  font-size: 0.875rem; /* text-sm */
`;





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

const StyledFileUpload = ({ getInputProps }) => {
  return (
    
    <Container>
      <InnerContainer>
        <div className="space-y-1 text-center">
          <UploadContainer>
            <StyledLabel>
              <span>Upload a file</span>
              <input type="file" accept="application/pdf" {...getInputProps()} />
            </StyledLabel>
          </UploadContainer>
          <Text>PDF</Text>
        </div>
      </InnerContainer>
    </Container>
  );
}

export default StyledFileUpload;
