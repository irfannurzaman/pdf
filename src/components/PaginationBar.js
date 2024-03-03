import React from 'react';
import styled from 'styled-components';

const StyledDiv = styled.div`
  position: fixed;
  bottom: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  gap: 0.75rem;
  z-index: 50;
`;

const StyledButton = styled.button`
  padding: 0.5rem 1rem;
  background-color: #4B5563; /* bg-gray-700 */
  border-radius: 0.375rem; /* rounded-md */
  color: white; /* text-white */
  cursor: pointer;
`;

const Label = styled.div`
  padding: 0.5rem 1rem; /* px-4 py-2 */
  background-color: #4B5563; /* bg-gray-700 */
  border-radius: 0.375rem; /* rounded-md */
  color: white; /* text-white */
`;

const PaginationBar = ({ contextValues, changePage }) => {
  return (
    <StyledDiv>
      {contextValues.currPage > 1 && 
        <StyledButton onClick={() => changePage(-1)}>
          {'<'}
        </StyledButton>
      }
      <Label>
        Page {contextValues.currPage} of {contextValues.numPages}
      </Label>
      {contextValues.currPage < contextValues.numPages && 
        <StyledButton onClick={() => changePage(1)}>
          {'>'}
        </StyledButton>
      }
    </StyledDiv>
  );
}

export default PaginationBar;
