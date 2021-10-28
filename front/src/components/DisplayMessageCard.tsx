import { getMessages } from 'api/message';
import styled from 'styled-components';
import { Accordion } from 'react-bootstrap';
import { UpdateUserInfoInterface } from '../api/user';

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

const DisplayMessageCard = (props: { userMessages: UserReceivedMessage[] }) => {
  const { userMessages } = props;

  return (
    <MessagesWrappe>
      <Accordion flush>
        {userMessages.map((userMessage, index) => (
          <Accordion.Item
            key={userMessage.message.id}
            eventKey={index.toString()}
          >
            <Accordion.Header>
              <ImgContainer src={userMessage.user.default_picture} />
              <UserName>
                &nbsp;&nbsp;
                {userMessage.user.firstname}
              </UserName>
            </Accordion.Header>
            <Accordion.Body>
              <StyledMessage>{userMessage.message.message}</StyledMessage>
            </Accordion.Body>
          </Accordion.Item>
        ))}
      </Accordion>
    </MessagesWrappe>
  );
};

export default DisplayMessageCard;
