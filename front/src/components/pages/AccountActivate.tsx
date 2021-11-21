import { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import styled from 'styled-components';
import Card from 'components/Card';
import Loading from 'components/Loading';
import { verifyAccount } from 'api/account';
import { SUCCESS } from 'utils/const';
import tinderLogo from 'assets/icons/tinder-logo.svg';

const Container = styled.div`
  padding: 1em;
`;

const LoadingWrapper = styled.div`
  padding: 100px;
  text-align: center;
`;

const MessageWrapper = styled.div`
  position: relative;
  text-align: center;
  color: var(--primary-gray-color);
  min-height: 150px;
  margin-top: 20px;
`;

const LogoWrapper = styled.div`
  margin-top: 120px;
`;
export const LinkWrapper = styled.div`
  height: 180px;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  a {
    color: var(--primary-color);
  }
`;

interface ApiResponse {
  success: boolean;
  message: string;
}

const AccountActivate = () => {
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [className, setClassName] = useState('none');

  const useQuery = () => {
    return new URLSearchParams(useLocation().search);
  };

  const query = useQuery();
  const token = query.get('token');
  useEffect(() => {
    (async () => {
      if (token) {
        const res = await verifyAccount(token);
        const data: ApiResponse = await res?.json();
        setMessage(data.message);
        setLoading(false);
        if (res?.status === SUCCESS) {
          setClassName('text-success-styled');
        } else {
          setClassName('text-error-styled');
        }
      }
    })();
  }, []);
  return (
    <>
      <Card>
        <Container>
          {loading ? (
            <LoadingWrapper>
              <Loading />
            </LoadingWrapper>
          ) : (
            <MessageWrapper>
              <p className={className}>{message}</p>
              <LogoWrapper>
                <img
                  src={tinderLogo}
                  alt="tinder-logo"
                  width={64}
                  height={64}
                />
              </LogoWrapper>
            </MessageWrapper>
          )}
          <LinkWrapper>
            <Link to={'/'}>Start swipping!</Link>
          </LinkWrapper>
        </Container>
      </Card>
    </>
  );
};

export default AccountActivate;
