import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Form, Container, Modal } from 'react-bootstrap';
import styled from 'styled-components';
import Card from 'components/Card';
import { SUCCESS, EMAIL_REGEX, PASS_REGEX } from 'utils/const';
import Button from 'components/Button';
import { resetPassword } from 'api/password';

const ForgotPasswordLink = styled.div`
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

interface ApiResponse {
  success: boolean;
  message: string;
}

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [title, setTitle] = useState('');
  const [show, setShow] = useState(false);
  const [className, setClassName] = useState('gray-one');

  const handleClose = () => {
    setShow(false);
    setEmail('');
    setPassword('');
    setMessage('');
    setTitle('');
    setClassName('gray-one');
    return (window.location.href = '/');
  };
  const handleShow = () => setShow(true);

  const handleSumit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (EMAIL_REGEX.test(email) && PASS_REGEX.test(password)) {
      const res = await resetPassword(email, password);
      const response: ApiResponse = await res.json();

      if (res.status === SUCCESS) {
        setClassName('success-message');
        setTitle('Password reset successfully!');
      } else {
        setClassName('error-message');
        setTitle('Password reset failed!');
      }
      setMessage(response.message);
      handleShow();
    }
  };

  return (
    <>
      <Card>
        <Container>
          <Form onSubmit={(e) => handleSumit(e)}>
            <Form.Group
              className="mb-3 forgot-passord-header"
              controlId="formBasicEmail"
            >
              <Form.Label>Email registered with your account.</Form.Label>
              <Form.Control
                onChange={(e) => setEmail(e.target.value)}
                isValid={EMAIL_REGEX.test(email)}
                isInvalid={!EMAIL_REGEX.test(email)}
                type="email"
                placeholder="Email"
              />
              <Form.Text className="text-muted">
                We'll send a reset link to your email.
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3 gray-one" controlId="formBasicPassword">
              <Form.Label>New password</Form.Label>
              <Form.Control
                onChange={(e) => setPassword(e.target.value)}
                isValid={PASS_REGEX.test(password)}
                isInvalid={!PASS_REGEX.test(password)}
                type="password"
                placeholder="Password"
              />
              <Form.Text className="text-muted">
                (Eight characters, numbers, letters)
              </Form.Text>
            </Form.Group>
            <Button text="Reset password" />
          </Form>
        </Container>
        <br />
        <LinkWrapper>
          <ForgotPasswordLink>
            <Link to={'/'}>Cancel</Link>
          </ForgotPasswordLink>
        </LinkWrapper>
      </Card>
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title className={className}>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body className={className}>{message}</Modal.Body>
        <Modal.Footer></Modal.Footer>
      </Modal>
    </>
  );
};

export default ForgotPassword;
