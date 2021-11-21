import styled from 'styled-components';
import { LinkWrapper, LinkTo } from './desktop/UpdateLink';

const CenterText = styled.div`
  text-align: center;
  color: #868e96;
  :hover {
    color: red;
  }
`;

interface Props {
  text: string;
  onClick: () => void;
}

const CenteredTextLink = (props: Props) => {
  return (
    <>
      <LinkWrapper onClick={props.onClick}>
        <LinkTo href="#">
          <CenterText>{props.text}</CenterText>
        </LinkTo>
      </LinkWrapper>
    </>
  );
};

export default CenteredTextLink;
