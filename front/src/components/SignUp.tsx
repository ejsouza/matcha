import { useState } from 'react';
import { Form, Container, Modal } from 'react-bootstrap';
import Card from './Card';
import Button from './Button';
import { useAppDispatch, useAppSelector } from 'store/hook';
import { showSignupCardUpdated } from 'store/actions';
import styled from 'styled-components';
import { CardHeader, CrossCard } from 'components/desktop/LoginDesktop';
import { PASS_REGEX, EMAIL_REGEX, BAD_REQUEST, CREATED } from 'utils/const';
import { Gap } from 'globalStyled';
import { signup } from 'api/auth';

const SignUpButton = styled.button`
  border: none;
  border-radius: 30px;
  color: #fd546c;
  padding: 8px 30px;
  letter-spacing: 0.02em;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 0px;
  cursor: pointer;
  color: white;
  background-color: red; /* For browsers that do not support gradients */
  background-image: linear-gradient(to right, #fd297b, #ff655b);
  :hover {
    color: white;
    background-color: red; /* For browsers that do not support gradients */
    background-image: linear-gradient(to right, #ff655b, #fd297b);
  }
`;

const Outer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`;

const Inner = styled.div`
  margin: 40vh 0 0 0;
`;

const StyledContainer = styled.div`
  display: block;
`;
const SignUp = () => {
  const [userName, setUserName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string[]>([]);
  const dispatch = useAppDispatch();
  const showSignupCard = useAppSelector((state) => state.showSignupCard);
  const showLoginCard = useAppSelector((state) => state.showLoginCard);
  console.log(showSignupCard);

  const closeCard = () => {
    dispatch(showSignupCardUpdated(false));
  };

  const handleCreateAccount = async (e: React.FormEvent) => {
    console.log(`enters handleCreateAccount()`);
    e.preventDefault();
    if (
      !(userName.length > 3) ||
      !(firstName.length > 2) ||
      !EMAIL_REGEX.test(email) ||
      !PASS_REGEX.test(password)
    ) {
      return;
    }
    const res = await signup({
      userName,
      firstName,
      lastName,
      email,
      password,
    });
    console.log(`API RESPONSE ${res.status}`);
    if (res.status === CREATED) {
      // tell user to confirm his account before trying to login
      closeCard();
      setShowSuccess(true);
      setUserName('');
      setFirstName('');
      setLastName('');
      setEmail('');
      setPassword('');
    }
    if (res.status === BAD_REQUEST) {
      const err = await res.json();
      let erro: string[];
      erro = [];
      for (let key in err) {
        erro.push(`${err[key]}`);
      }
      setErrorMsg(Array.from(erro));
      setShowError(true);
      setTimeout(() => {
        setShowError(false);
      }, 2000);
    }
  };

  return (
    <>
      <Modal
        show={showSuccess}
        onHide={() => setShowSuccess(false)}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title className="text-success">
            Account created successfully!
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="text-info">
            Please verify your email and validate your account before preceeding
            to login.
          </p>
        </Modal.Body>
      </Modal>
      {!showSignupCard && !showLoginCard && (
        <StyledContainer>
          <Outer>
            <Inner>
              <SignUpButton
                onClick={() => dispatch(showSignupCardUpdated(true))}
              >
                CREATE ACCOUNT
              </SignUpButton>
            </Inner>
          </Outer>
        </StyledContainer>
      )}
      {showSignupCard && (
        <>
          <Modal
            show={showError}
            onHide={() => setShowError(false)}
            dialogClassName="modal-90w"
            aria-labelledby="example-custom-modal-styling-title"
            style={{ backgroundColor: 'text-danger' }}
            className="text-danger"
          >
            <Modal.Header className="text-danger">
              <Modal.Title id="example-custom-modal-styling-title">
                Error
              </Modal.Title>
            </Modal.Header>
            <Modal.Body
              className="text-danger"
              style={{ backgroundColor: 'text-danger' }}
            >
              {errorMsg.map((msg) => (
                <p key={msg}>{msg}</p>
              ))}
            </Modal.Body>
          </Modal>
          <Card>
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
              <Form onSubmit={(e) => handleCreateAccount(e)}>
                <Form.Group className="mb-3" controlId="formUserName">
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    isInvalid={userName.length <= 3}
                    isValid={userName.length > 3}
                    onChange={(e) => setUserName(e.target.value)}
                    type="text"
                    placeholder="Enter a username"
                  />
                  <Form.Text className="text-muted">
                    Username should be at least 4 characters long.
                  </Form.Text>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formFirstName">
                  <Form.Label>First name</Form.Label>
                  <Form.Control
                    isInvalid={firstName.length < 3}
                    isValid={firstName.length >= 3}
                    onChange={(e) => setFirstName(e.target.value)}
                    type="text"
                    placeholder="Enter your first name"
                  />
                  <Form.Text className="text-muted">
                    First name should be at least 3 characters long.
                  </Form.Text>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formLastName">
                  <Form.Label>Last name</Form.Label>
                  <Form.Control
                    isInvalid={lastName.length < 3}
                    isValid={lastName.length >= 3}
                    onChange={(e) => setLastName(e.target.value)}
                    type="text"
                    placeholder="Enter your last name"
                  />
                  <Form.Text className="text-muted">
                    Last name should be at least 3 characters long.
                  </Form.Text>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formEmail">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    onChange={(e) => setEmail(e.target.value)}
                    isInvalid={!EMAIL_REGEX.test(email)}
                    isValid={EMAIL_REGEX.test(email)}
                    type="email"
                    placeholder="Enter a valid email"
                  />
                  <Form.Text className="text-muted">
                    We'll never share your email with anyone else.
                  </Form.Text>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    onChange={(e) => setPassword(e.target.value)}
                    isInvalid={!PASS_REGEX.test(password)}
                    isValid={PASS_REGEX.test(password)}
                    type="password"
                    placeholder="Password"
                  />
                  <Form.Text className="text-muted">
                    Password should be at least 6 characters long composed with
                    letters, numbers and symbols.
                  </Form.Text>
                </Form.Group>

                <Button text="Create account" />
              </Form>
              <Gap bottom="2vh">&nbsp;</Gap>
            </Container>{' '}
          </Card>
        </>
      )}
    </>
  );
};

export default SignUp;
