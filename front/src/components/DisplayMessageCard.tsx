import { useState } from 'react';
import { getMessages, sendMessage } from 'api/message';
import styled from 'styled-components';
import { Accordion, Modal, Form } from 'react-bootstrap';
import { UpdateUserInfoInterface } from '../api/user';
import { updateSeenMessage } from 'api/message';
import { CREATED } from 'utils/const';
import Button from './Button';

export interface MessageInterface {
  id: number;
  sender_id: number;
  receiver_id: number;
  message: string;
  seen: boolean;
  sent_at: Date;
}

export interface UserReceivedMessage {
  message: MessageInterface;
  user: UpdateUserInfoInterface;
}

const MessagesWrappe = styled.div`
  z-index: 5;
`;

const ImgContainer = styled.img`
  width: 30px;
  height: 30px;
  display: contain;
  border-radius: 50%;
  cursor: none;
`;

const UserName = styled.div`
  color: var(--primary-gray-color);
`;

const StyledMessage = styled.div`
  color: var(--primary-gray-color);
  font-size: 0.9em;
`;

const ReplayMessageLink = styled.div`
  text-align: center;
  font-size: 0.8em;
  a {
    color: var(--primary-color);
  }
`;

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

const DisplayMessageCard = (props: { userMessages: UserReceivedMessage[] }) => {
  const { userMessages } = props;
  const [modalShow, setModalShow] = useState(false);
  const [sendTo, setSentTo] = useState<UpdateUserInfoInterface>();
  const [messageText, setMessageText] = useState('');

  const handleSawMessage = async (messageId: number) => {
    console.log(`Updading seen state of messageId := ${messageId}`);
    const msg = userMessages.find(
      (userMessage) => userMessage.message.id === messageId
    );
    /**
     * Check if message was already set to seen before updating
     */
    if (msg && !msg.message.seen) {
      console.log(`FOUND ${msg.message.seen}`);
      try {
        const res = await updateSeenMessage(messageId);
        if (res.status === CREATED) {
          console.log(`Update message seen state to true`);
        } else {
          console.log(`Something went wrong`);
        }
      } catch (err) {
        console.log(`catch() ${err}`);
      }
    } else {
      // this else is to be removed only here during development
      console.log(`Is MESSAGE already seen ? ${msg?.message.seen}`);
    }
  };

  const handleShowMessageModal = (toId: number) => {
    const usr = userMessages.find(
      (userMessage) => userMessage.user.id === toId
    );
    setSentTo(usr?.user);
    setModalShow(true);
  };

  const handleSendMessage = async () => {
    console.log(`Sending [${messageText}] to ${sendTo?.id}`);
    try {
      const receiver_id = sendTo?.id?.toString() || '';
      const res = await sendMessage(receiver_id, messageText);
      if (res.status === CREATED) {
        console.log('Message sent');
      } else {
        console.log('Could not sent message');
      }
      setMessageText('');
      setModalShow(false);
    } catch (err) {
      console.log(`catch(err) ${err}`);
    }
  };

  return (
    <>
      <MessagesWrappe>
        <Accordion flush>
          {userMessages.map((userMessage, index) => (
            <Accordion.Item
              key={userMessage.message.id}
              eventKey={index.toString()}
              onClick={() => handleSawMessage(userMessage.message.id)}
            >
              <Accordion.Header>
                <ImgContainer src={userMessage.user.default_picture} />
                <UserName>
                  &nbsp;&nbsp;
                  {`${userMessage.user.firstname} ${userMessage.user.lastname}`}
                </UserName>
              </Accordion.Header>
              <Accordion.Body>
                <StyledMessage>{userMessage.message.message}</StyledMessage>
                <ReplayMessageLink
                  onClick={() =>
                    handleShowMessageModal(userMessage.message.sender_id)
                  }
                >
                  <a href="#">replay</a>
                </ReplayMessageLink>
              </Accordion.Body>
            </Accordion.Item>
          ))}
        </Accordion>
      </MessagesWrappe>
      <Modal
        show={modalShow}
        size="sm"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        onHide={() => setModalShow(false)}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            <MessageUserName>
              <ImgContainer src={sendTo?.default_picture} alt="send-to" />
              &nbsp;
              <span>{`${sendTo?.firstname} ${sendTo?.lastname}`}</span>
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
              <Form.Label className="gray-one">Message</Form.Label>
              <TextArea>
                <Form.Control
                  as="textarea"
                  rows={11}
                  maxLength={250}
                  onChange={(e) => setMessageText(e.target.value)}
                  style={{ color: '#868e96' }}
                />
              </TextArea>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            disable={messageText.length < 2 ? 'none' : 'auto'}
            callBack={handleSendMessage}
            text="Send Message"
          />
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default DisplayMessageCard;
