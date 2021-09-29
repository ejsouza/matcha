import React, { useState } from 'react';
import { Card, FloatingLabel, Form, Alert } from 'react-bootstrap';
import Button from './Button';
import { StyledButtonWhite } from './Deck';
import { FlexBox, Gap } from 'globalStyled';
import styled from 'styled-components';
import { sendMessage } from 'api/message';
// import socket from 'helpers/socket/';

const ButtonWarapper = styled.div`
  height: 60px;
`;

interface IProps {
  callBack: () => void;
  sendTo: number | undefined;
}

const MessageCard = ({ callBack, sendTo }: IProps) => {
  const [message, setMessage] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [alertMsg, setAlertMsg] = useState('');
  const [variant, setVariant] = useState('');

  const handleCloseShowAlert = () => {
    setShowAlert(false);
    setAlertMsg('');
    setVariant('');
  };

  const sendMsg = () => {
    console.log(`MESSAGE to [${sendTo}] := ${message}`);
    if (!message.length) {
      setAlertMsg('Your message is empty.');
      setVariant('danger');
      setShowAlert(true);
      return;
    }
    const id = sendTo?.toString() || '';
    sendMessage(message, id).then((res) => {
      if (!res?.ok) {
        setAlertMsg(
          "Something went wrong, your message couldn't be delivered."
        );
        setVariant('danger');
        setShowAlert(true);
      } else {
        // socket.emit('ping', 'test from client');
        setAlertMsg('Message send successfully!');
        setVariant('success');
        setShowAlert(true);
        setTimeout(() => {
          setMessage('');
          callBack();
        }, 2000);
      }
    });
  };
  return (
    <>
      {showAlert && (
        <Alert variant={variant} onClose={handleCloseShowAlert} dismissible>
          <Alert.Heading>
            {variant === 'danger'
              ? 'Error!'
              : variant === 'success'
              ? 'Success'
              : ''}
          </Alert.Heading>
          <p>{alertMsg}</p>
        </Alert>
      )}
      <Card bg="dark" text="secondary" style={{ width: '100%' }}>
        <Card.Body>
          <FloatingLabel controlId="firstMessage" label="Message 💌">
            <Form.Control
              as="textarea"
              style={{
                height: '100px',
                color: '#868e96',
                letterSpacing: '0.2em',
              }}
              maxLength={120}
              onChange={(e) => setMessage(e.target.value)}
            />
          </FloatingLabel>
        </Card.Body>
        <FlexBox alignItems="center" justifyContent="center">
          <ButtonWarapper onClick={callBack}>
            <StyledButtonWhite>Later</StyledButtonWhite>
          </ButtonWarapper>
          <Gap>&nbsp;&nbsp;&nbsp;</Gap>
          <ButtonWarapper onClick={sendMsg}>
            <StyledButtonWhite>Send</StyledButtonWhite>
          </ButtonWarapper>
        </FlexBox>
      </Card>
    </>
  );
};

export default MessageCard;
