import { FC, ReactNode } from 'react';
import styled from 'styled-components';

const StyledCard = styled.div`
  display: 'block';
  width: 340px;
  height: 520px;
  overflow-x: hidden;
  overflow-y: auto;
  position: absolute;
  top: 50%;
  left: 50%;
  border-radius: 1%;
  -webkit-box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.1);
  box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.2);
  background-color: white;
  transform: translateX(-50%) translateY(-50%);
  z-index: 1;
`;

const Card: FC<{ children?: ReactNode }> = ({ children }) => {
  return (
    <>
      <StyledCard>{children}</StyledCard>
    </>
  );
};

export default Card;
