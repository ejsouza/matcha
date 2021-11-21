import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Form, Container, Alert, Modal } from 'react-bootstrap';
import styled from 'styled-components';
import Card from 'components/Card';
import 'index.css';
import { useAppDispatch, useAppSelector } from 'store/hook';
import {
  showLoginCardUpdated,
  isLoggedUpdated,
  userInfoUpdated,
} from 'store/actions';
import Button from 'components/Button';
import { login } from 'api/auth';
import { LOGGED_USER, CREATED, USER_TOKEN } from 'utils/const';
import { UserInterface, ApiResponse } from 'interfaces';
import socket, { SessionInterface } from 'socket/socket.io';
import { getSessionFromLocalStorage } from 'utils/session';

/************************* STYLED COMPONENTS *************************/

export const CardHeader = styled.div`
  display: flex;
  width: 316px;
  height: 40px;
  align-items: center;
  svg {
    cursor: pointer;
  }
`;
export const CrossCard = styled.div`
  margin-left: auto;
`;

const ForgotPasswordLink = styled.div`
  padding2-top: 20px;
  a {
    text-decoration: none;
    cursor: pointer;
    color: #fd546c;
    :hover {
      color: #fd297b;
    }
  }
`;

const LinkWrapper = styled.div`
  margin-top: 2vh;
  text-align: center;
`;

const LoginDesktop = () => {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [showError, setShowError] = useState(false);
  const dispatch = useAppDispatch();
  const showLoginCard = useAppSelector((state) => state.showLoginCard);

  const handleClose = () => setShow(false);

  const closeCard = () => {
    dispatch(showLoginCardUpdated(false));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length <= 5 || userName.length <= 3) {
      return;
    }
    try {
      const res = await login(userName, password);
      const data: ApiResponse = await res.json();
      const user: UserInterface = data.user;

      if (!user.activated) {
        setShow(true);
        return;
      }
      const token = data.token;
      if (res.status === CREATED) {
        localStorage.setItem(LOGGED_USER, JSON.stringify(user));
        localStorage.setItem(USER_TOKEN, token);

        dispatch(showLoginCardUpdated(false));
        dispatch(isLoggedUpdated(true));
        dispatch(userInfoUpdated({ ...user }));

        const session = getSessionFromLocalStorage();
        if (!session) {
          const loginSession: SessionInterface = {
            userID: '',
            sessionID: '',
            username: userName,
            connected: true,
          };
          socket.emit('login', loginSession);
        } else {
          socket.emit('login', session);
        }
      } else {
        setShowError(true);
        setTimeout(() => {
          setShowError(false);
        }, 2000);
      }
    } catch (error) {
      console.log(`error occurred := ${error}`);
    }
  };

  return (
    <>
      {showLoginCard && (
        <>
          <Card>
            <Alert
              show={showError}
              variant="danger"
              onClose={() => setShowError(false)}
            >
              <Alert.Heading>Error!</Alert.Heading>
              <p>Your password or username is incorrect!</p>
            </Alert>
            <Container>
              <CardHeader>
                <CrossCard>
                  <svg
                    onClick={closeCard}
                    width="24"
                    height="24"
                    viewBox="0 0 512 512"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g id="closeButton">
                      <g id="circle">
                        <g id="Group">
                          <path
                            id="Vector"
                            d="M437.126 74.939C337.3 -24.887 174.819 -24.887 74.993 74.939C26.637 123.314 0 187.617 0 256.005C0 324.393 26.637 388.696 74.993 437.052C124.916 486.975 190.488 511.926 256.059 511.926C321.63 511.926 387.203 486.975 437.125 437.052C536.951 337.226 536.951 174.784 437.126 74.939ZM409.08 409.006C324.705 493.381 187.413 493.381 103.038 409.006C62.18 368.148 39.668 313.802 39.668 256.005C39.668 198.208 62.18 143.862 103.038 102.984C187.413 18.609 324.705 18.629 409.08 102.984C493.435 187.359 493.435 324.651 409.08 409.006Z"
                            fill="#E0E4EC"
                          />
                        </g>
                      </g>
                      <g id="cross">
                        <g id="Group_2">
                          <path
                            id="Vector_2"
                            d="M341.525 310.827L285.374 254.756L341.525 198.685C349.26 190.95 349.26 178.395 341.545 170.639C333.79 162.864 321.235 162.884 313.48 170.619L257.29 226.73L201.1 170.619C193.345 162.884 180.79 162.864 173.035 170.639C165.3 178.394 165.3 190.949 173.055 198.685L229.206 254.756L173.055 310.827C165.3 318.562 165.3 331.117 173.035 338.873C176.903 342.76 182 344.684 187.078 344.684C192.156 344.684 197.233 342.74 201.101 338.892L257.291 282.781L313.481 338.892C317.349 342.76 322.426 344.684 327.504 344.684C332.582 344.684 337.679 342.74 341.547 338.873C349.28 331.117 349.28 318.562 341.525 310.827Z"
                            fill="#E0E4EC"
                          />
                        </g>
                      </g>
                    </g>
                  </svg>
                </CrossCard>
              </CardHeader>
            </Container>

            <Container>
              <Form onSubmit={(e) => handleLogin(e)}>
                <Form.Group
                  className="mb-3 gray-one"
                  controlId="formBasicEmail"
                >
                  <Form.Label>User Name</Form.Label>
                  <Form.Control
                    onChange={(e) => setUserName(e.target.value)}
                    isValid={userName.length > 3}
                    isInvalid={userName.length <= 3}
                    type="text"
                    placeholder="Enter user name"
                  />
                  <Form.Text className="text-muted">
                    We'll never share your email with anyone else.
                  </Form.Text>
                </Form.Group>

                <Form.Group
                  className="mb-3 gray-one"
                  controlId="formBasicPassword"
                >
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    onChange={(e) => setPassword(e.target.value)}
                    isValid={password.length > 5}
                    isInvalid={password.length <= 5}
                    type="password"
                    placeholder="Password"
                  />
                </Form.Group>
                <Button text="Start flirting" />
              </Form>
            </Container>
            <br />
            <LinkWrapper>
              <ForgotPasswordLink>
                <Link to={'/forgot-password'}>Forgot password</Link>
              </ForgotPasswordLink>
            </LinkWrapper>
          </Card>
        </>
      )}
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title className="error-message">
            Account not activated!
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="error-message">
          <p>You first need to activate your account.</p>
          <p>
            Please check your email box, we have sent you a confirmation link.
          </p>
        </Modal.Body>
        <Modal.Footer></Modal.Footer>
      </Modal>
    </>
  );
};

export default LoginDesktop;
