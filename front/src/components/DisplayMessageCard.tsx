import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Accordion } from 'react-bootstrap';
import { getUserById, UpdateUserInfoInterface } from '../api/user';
import { updateSeenMessage } from 'api/message';
import { CREATED } from 'utils/const';
import SendMessage from './SendMessage';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import { useAppSelector } from 'store/hook';
import { UserInterface } from 'interfaces';
import socket from 'socket/socket.io';

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

const MessagesWrapper = styled.div`
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
  padding: 8px;
  background-color: #fff;
  border: 0.1em dotted var(--primary-gray-color);
  p {
    text-align: end;
    margin-top: 0.5em;
    margin-bottom: 0.1em;
    font-size: 0.6em;
  }
`;

const ReplayMessageLink = styled.div`
  text-align: center;
  font-size: 0.8em;
  a {
    color: var(--primary-color);
  }
`;

const DisplayMessageCard = (props: { userMessages: MessageInterface[] }) => {
  const { userMessages } = props;
  const [users, setUsers] = useState<UpdateUserInfoInterface[]>([]);
  const user: UserInterface = useAppSelector((state) => state.user);
  const [showModal, setShowModal] = useState(false);
  const [sendTo, setSentTo] = useState<UpdateUserInfoInterface>();

  userMessages.sort((a, b) => {
    return +new Date(b.sent_at) - +new Date(a.sent_at);
  });
  const uniqueSenders: MessageInterface[] = [];
  props.userMessages.forEach((userMessage) => {
    const includes = uniqueSenders.find(
      (sender) => sender.sender_id === userMessage.sender_id
    );
    if (!includes) {
      uniqueSenders.push(userMessage);
    }
  });

  useEffect(() => {
    (async () => {
      const users = (await Promise.all(
        uniqueSenders.map((sender) => {
          return new Promise(async (resolve) => {
            const res = await getUserById(sender.sender_id);
            const data: UpdateUserInfoInterface = await res.json();
            resolve(data);
          });
        })
      )) as UpdateUserInfoInterface[];
      setUsers(users);
    })();
  }, []);

  const handleShowMessageModal = (toId: number) => {
    const usr = users.find((user) => user.id === toId);
    setSentTo(usr);
    setShowModal(true);
  };

  const toggleSendMessage = () => {
    setShowModal(!showModal);
  };

  const handleSawMessage = (senderId: number) => {
    if (user.id && senderId) {
      userMessages.forEach(async (message) => {
        if (message.sender_id === senderId && !message.seen) {
          try {
            const res = await updateSeenMessage(message.id);
            if (res.status === CREATED) {
              socket.emit('direct message', user.username);
            }
          } catch (err) {
            console.log(`catch() ${err}`);
          }
        }
      });
    }
  };
  return (
    <>
      <MessagesWrapper>
        <Accordion flush>
          {users.map((user, i) => {
            return (
              <Accordion.Item key={user.id?.toString()} eventKey={i.toString()}>
                <Accordion.Header>
                  <UserName onClick={() => handleSawMessage(user.id!)}>
                    <ImgContainer
                      src={`${process.env.REACT_APP_API_URL}/uploads/${user.default_picture}`}
                    />
                    &nbsp;&nbsp; {`${user.firstname} ${user.lastname}`}
                  </UserName>
                </Accordion.Header>
                {userMessages.map((message) => {
                  if (message.sender_id === user.id) {
                    return (
                      <Accordion.Body key={message.id}>
                        <StyledMessage>
                          {message.message}
                          <p>
                            {formatDistanceToNow(new Date(message.sent_at), {
                              addSuffix: true,
                            })}
                          </p>
                          <ReplayMessageLink
                            onClick={() =>
                              handleShowMessageModal(message.sender_id)
                            }
                          >
                            <a href="#">replay</a>
                          </ReplayMessageLink>
                        </StyledMessage>
                      </Accordion.Body>
                    );
                  }
                })}
              </Accordion.Item>
            );
          })}
        </Accordion>
      </MessagesWrapper>
      <SendMessage
        receiver={sendTo}
        callback={toggleSendMessage}
        showMessageModal={showModal}
      />
    </>
  );
};

export default DisplayMessageCard;
