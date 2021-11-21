import { Link } from 'react-router-dom';
import styled from 'styled-components';
import Card from 'components/Card';
import tinderLogo from 'assets/icons/tinder-logo.svg';
import { LinkWrapper } from './AccountActivate';

const Container = styled.div`
  padding: 1em;
`;

const LogoWrapper = styled.div`
  position: relative;
  text-align: center;
  margin-top: 120px;
`;

const Title = styled.div`
  margin-top: 20px;
  text-align: center;
  color: var(--primary-gray-color);
`;
const NoMatch = () => {
  return (
    <>
      <Card>
        <Container>
          <Title>
            <h2>Nothing to see here!</h2>
          </Title>
          <LogoWrapper>
            <img src={tinderLogo} alt="tinder-logo" width={64} height={64} />
          </LogoWrapper>
          <LinkWrapper>
            <Link to="/">Back to action!</Link>
          </LinkWrapper>
        </Container>
      </Card>
    </>
  );
};

export default NoMatch;
