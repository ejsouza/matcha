import { useState } from 'react';
import { Modal, Form, Alert } from 'react-bootstrap';
import styled from 'styled-components';
import Button from './Button';
import { sendMessage } from 'api/message';
import { CREATED } from 'utils/const';
import { UpdateUserInfoInterface } from 'api/user';
import socket from 'socket/socket.io';

const MessageUserName = styled.div`
  span {
    color: var(--primary-gray-color);
    font-size: 0.8em;
  }
`;

const TextArea = styled.div`
  textarea {
    font-size: 0.9em;
    color: var(--primary-gray-color);
    letter-spacing: 0.1em;
  }
`;

const ImgContainer = styled.img`
  width: 30px;
  height: 30px;
  display: contain;
  border-radius: 50%;
  cursor: none;
`;

interface SendMessageInterface {
  receiver: UpdateUserInfoInterface | undefined;
  showMessageModal: boolean;
  callback: () => void;
}

const SendMessage = (props: SendMessageInterface) => {
  const [message, setMessage] = useState('');
  const [variant, setVariant] = useState('success');
  const [show, setShow] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const handleSuccessMessage = () => {
    setAlertMessage('Message sent!');
    setVariant('success');
    setShow(true);
    setTimeout(() => {
      setAlertMessage('');
      setVariant('');
      setShow(false);
      props.callback();
    }, 1000);
  };

  const handleErrorMessage = () => {
    setAlertMessage('We could not sent teh message!');
    setVariant('danger');
    setShow(true);
    setTimeout(() => {
      setAlertMessage('');
      setVariant('');
      setShow(false);
      props.callback();
    }, 1000);
  };

  const handleMinLenMessage = () => {
    setAlertMessage('Message too short!');
    setVariant('danger');
    setShow(true);
    setTimeout(() => {
      setAlertMessage('');
      setVariant('');
      setShow(false);
    }, 1000);
  };

  const handleSendMessage = async () => {
    if (message.length < 2) {
      handleMinLenMessage();
    } else {
      try {
        const id = props.receiver?.id || 0;
        const res = await sendMessage(id.toString(), message);
        if (res.status === CREATED) {
          handleSuccessMessage();
          socket.emit('direct message', props.receiver?.username);
        } else {
          handleErrorMessage();
        }
      } catch (err) {
        handleErrorMessage();
      }
    }
  };

  return (
    <>
      <Modal
        show={props.showMessageModal}
        size="sm"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        onHide={props.callback}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            <MessageUserName>
              <ImgContainer
                src={props.receiver?.default_picture}
                alt="send-to"
              />
              &nbsp;
              <span>{`${props.receiver?.firstname} ${props.receiver?.lastname}`}</span>
            </MessageUserName>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group
              className="mb-3"
              controlId="messageControlInput"
            ></Form.Group>
            <Form.Group className="mb-3" controlId="messageControlTextarea">
              <Alert show={show} variant={variant}>
                {alertMessage}
              </Alert>
              <Form.Label className="gray-one">Message</Form.Label>
              <TextArea>
                <Form.Control
                  as="textarea"
                  rows={11}
                  maxLength={250}
                  onChange={(e) => setMessage(e.target.value)}
                  style={{ color: '#868e96' }}
                />
              </TextArea>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button callBack={handleSendMessage} text="Send Message" />
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default SendMessage;
