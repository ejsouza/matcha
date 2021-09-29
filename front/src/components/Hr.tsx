import styled from 'styled-components';

const VerticalLine = styled.hr`
  display: block;
  margin-top: 0;
  margin-bottom: 0;
  margin-left: auto;
  margin-right: auto;
  border-style: inset;
  border-width: 0.5px;
  color: #e0e5ec;
`;
const Hr = () => {
  return <VerticalLine />;
};

export default Hr;
