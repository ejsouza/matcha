import { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { Offcanvas, Form, FloatingLabel } from 'react-bootstrap';
import { useAppSelector } from 'store/hook';
import { UserInterface } from 'interfaces';
import Button from 'components/Button';
import { getUserMatches, UpdateUserInfoInterface } from 'api/user';
import {
  getUserChats,
  postMessage,
  setChatToSeen,
  ChatMessageInterface,
} from 'api/chat';
import socket from 'socket/socket.io';
import { CREATED, SUCCESS } from 'utils/const';
import { getUserIdFromLocalStorage } from 'utils/user';
import MatchProfile from './MatchProfile';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';

export interface ChatInterface {
  id: number;
  sender_id: number;
  receiver_id: number;
  text: string;
  sent_at: Date;
  seen: boolean;
}

interface NewMessage {
  to: string;
  from: string;
  content: string;
  sent_at: Date;
}

interface MessageBoxInterface {
  alignDirection: string;
}

interface MessageWrapperInterface {
  backgroundColor: string;
}

interface ButtonProps {
  top: string;
  position: string;
  marginRight: string;
}

const ButtonWrapper = styled.div<ButtonProps>`
  position: ${(p) => p.position};
  top: ${(p) => p.top};
  right: ${(p) => p.marginRight};
`;

const MessageNotification = styled.div`
  position: absolute;
  right: 0;
  top: 15px;
  width: 25px;
  height: 25px;
  border-radius: 50%;
  text-align: center;
  background: red;
  border: 1px solid #fff;
  padding: 1px;

  span {
    position: relative;
    color: #fff;
  }
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: 70% auto;
  position: relative;
  padding: 0 0.5em 0 0.3em;
`;

const GridItemMain = styled.div`
  grid-row-start: 1;
  grid-row-end: 7;
  height: 70vh;
  overflow-y: scroll;
`;

const GridItemOnline = styled.div`
  height: 70vh;
  grid-row-start: 1;
  grid-row-end: 8;
  overflow-y: scroll;
  padding: 0.1em;
`;

const GridItemInput = styled.div`
  grid-column-start: 1;
  grid-column-end: 3;
  height: 15vh;
`;

const ImageMessageWrapper = styled.div`
  padding-left: 0.3em;
`;

const OnlineProfileImg = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
`;

const MessageBox = styled.div<MessageBoxInterface>`
  display: flex;
  flex-direction: column;
  align-items: ${(p) => p.alignDirection};
`;
const MessageWrapper = styled.div<MessageWrapperInterface>`
  display: flex;
  align-items: center;
  margin: 0.5em 0.3em 0.5em 0;
  background-color: ${(p) => p.backgroundColor};
  border-radius: 20px;
  min-height: 40px;
  width: 200px;
`;

const MessageTextWrapper = styled.div`
  color: #fff;
  padding: 0.5em;
  font-size: 0.8em;
`;

const DateWrapper = styled.div`
  width: 100px;
  color: #fff;
  text-align: right;
  margin-right: 1em;
  font-size: 0.59em;
`;

const NoChatWrapper = styled.div`
  color: var(--primary-gray-color);
  text-align: center;
  font-size: 1em;
  // margin-top: 100%;
  margin-top: 30vh;
  margin-right: 0.5em;
`;

const NoMatchWrapper = styled.div`
  color: var(--primary-gray-color);
  text-align: center;
  font-size: 0.8em;
  margin-top: 30vh;
  margin-left: 0.5em;
`;

const HR = styled.hr`
  padding: 0;
  margin: 0;
`;

const SelectUserToChatMessage = styled.div`
  font-size: 1.5em;
  text-align: center;
  color: var(--primary-gray-color);
  p {
    padding-top: 2em;
  }
`;

const Chat = (props: ButtonProps) => {
  const [show, setShow] = useState(false);
  const [users, setUsers] = useState<UpdateUserInfoInterface[]>();
  const [chatWithUser, setChatWithUser] = useState<UpdateUserInfoInterface>();
  const [chats, setChats] = useState<ChatInterface[]>();
  const [messageText, setMessageText] = useState('');
  const [globalMessageNotificationCount, setGlobalMessageNotificationCount] =
    useState(0);
  const user: UserInterface = useAppSelector((state) => state.user);
  const scrollRef = useRef<null | HTMLDivElement>(null);

  const handleShow = () => setShow(true);

  const handleClose = () => {
    setShow(false);
    /**
     * Reset the last user conversation was made.
     */
    setChats(undefined);
    setChatWithUser(undefined);
  };

  const updateChatDisplay = async (userId: number) => {
    const res = await getUserChats(userId);
    const json = await res.json();
    const chats: ChatInterface[] = json.chats;

    chats.sort((a, b) => {
      return +new Date(a.sent_at) - +new Date(b.sent_at);
    });
    setChats(chats);
    /**
     * Set chat received during live conversation to seen
     */
    chats.forEach((chat) => {
      if (chat.receiver_id === user.id && !chat.seen) {
        setChatToSeen(chat.id);
      }
    });
  };

  useEffect(() => {
    const getUsrs = async () => {
      const res = await getUserMatches();
      const data = await res.json();
      const usrs: UpdateUserInfoInterface[] = data.matches;
      setUsers(usrs);
    };
    getUsrs();
    /**
     * Add 'show' to dependencies to fetch matched users every time
     * the offCanvas (side online users content) is opened.
     */
  }, [show]);

  /**
   * If there is a lot of message and scrolling is needed the useRef
   * will set the positon of scroll to the end (last message in the chat)
   */
  useEffect(() => {
    scrollRef!.current?.scrollIntoView({
      block: 'end',
      behavior: 'smooth',
    });
  }, [chats]);

  useEffect(() => {
    let isMounted = true;
    socket.on('private message', (message: NewMessage) => {
      const id = chatWithUser?.id || 0;
      if (isMounted) {
        updateChatDisplay(id);
      }
    });
    let unread = 0;
    chats?.forEach((chat) => {
      if (!chat.seen && chat.sender_id !== user.id) {
        unread += 1;
      }
    });
    if (isMounted) {
      setGlobalMessageNotificationCount(unread);
    }
    return () => {
      isMounted = false;
    };
    /**
     * 'chats' shall be in the dependencies array, otherwise when a message
     * is sent it won't update the component on 'real' time.
     */
  }, [chats]);

  useEffect(() => {
    (async () => {
      /**
       * We get the userID here from local storage
       * taking it from the global user doesn't work
       * because it will be 0 when this function will run
       * when we login
       */
      const userId = getUserIdFromLocalStorage() || 0;
      const res = await getUserChats(userId);
      if (res.status === SUCCESS) {
        const json = await res.json();
        const chats: ChatInterface[] = json.chats;
        let unread = 0;
        chats?.forEach((chat) => {
          if (!chat.seen && chat.sender_id !== userId) {
            unread += 1;
          }
        });
        setGlobalMessageNotificationCount(unread);
      }
    })();
  }, [chats]);

  const initiateChat = (userId: number) => {
    const currentChatUser = users?.find((user) => user.id === userId);
    setChatWithUser(currentChatUser);
    updateChatDisplay(userId);
  };

  const handleSendMessage = async () => {
    if (!chatWithUser?.id || messageText.length < 2) {
      /**
       * WARNING:: think better strategy here.
       * Could be confusing to the user returning without
       * telling what is happening.
       */
      return;
    }
    const resource: ChatMessageInterface = {
      sender_id: user.id,
      receiver_id: chatWithUser?.id,
      text: messageText,
    };
    try {
      const res = await postMessage(resource);
      if (res.status === CREATED) {
        const privateMessage: NewMessage = {
          to: chatWithUser.username || '',
          from: user.username,
          content: messageText,
          sent_at: new Date(),
        };
        socket.emit('private message', privateMessage);
        updateChatDisplay(chatWithUser.id);
        setMessageText('');
      }
    } catch (err) {
      console.log(`something when wrong posting chat message := ${err}`);
    }
  };

  return (
    <>
      <ButtonWrapper
        top={props.top}
        position={props.position}
        marginRight={props.marginRight}
      >
        {!show && globalMessageNotificationCount > 0 && (
          <MessageNotification>
            <span>{globalMessageNotificationCount}</span>
          </MessageNotification>
        )}
        <Button text="chat" wid="100px" callBack={handleShow} />
      </ButtonWrapper>
      <Offcanvas show={show} onHide={handleClose} placement="end">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title className="gray-one">Chat</Offcanvas.Title>
        </Offcanvas.Header>

        <Offcanvas.Body>
          <HR />

          <GridContainer>
            <GridItemMain>
              {!chats?.length ? (
                <NoChatWrapper>
                  💬<p>No conversations...</p>
                </NoChatWrapper>
              ) : (
                chats.map((chat) => (
                  <MessageBox
                    alignDirection={
                      chat.sender_id === user.id ? 'end' : 'start'
                    }
                    key={chat.id}
                    ref={scrollRef}
                  >
                    <MessageWrapper
                      backgroundColor={
                        chat.sender_id === user.id ? '#fd297b' : '#ff655b'
                      }
                    >
                      <ImageMessageWrapper>
                        <OnlineProfileImg
                          src={
                            chat.sender_id === user.id
                              ? user.default_picture?.startsWith('https')
                                ? user.default_picture
                                : `${process.env.REACT_APP_API_URL}/uploads/${user.default_picture}`
                              : chatWithUser?.default_picture?.startsWith(
                                  'https'
                                )
                              ? chatWithUser.default_picture
                              : `${process.env.REACT_APP_API_URL}/uploads/${chatWithUser?.default_picture}`
                          }
                          alt="message-pic"
                        />
                      </ImageMessageWrapper>
                      <MessageTextWrapper>
                        {chat.text}

                        <DateWrapper>
                          {formatDistanceToNow(new Date(chat.sent_at), {
                            addSuffix: true,
                          })}
                        </DateWrapper>
                      </MessageTextWrapper>
                    </MessageWrapper>
                  </MessageBox>
                ))
              )}
            </GridItemMain>
            <GridItemOnline className="vertical-line">
              {users?.map((user) => (
                <MatchProfile
                  cb={() => initiateChat(user.id || 0)}
                  user={user}
                  key={user.id}
                />
              ))}
              {!users?.length && (
                <NoMatchWrapper>
                  👀 <p>No matches...</p>
                </NoMatchWrapper>
              )}
            </GridItemOnline>
            {chatWithUser && <br />}
            {chatWithUser && (
              <GridItemInput>
                <FloatingLabel
                  className="gray-one"
                  controlId="floatingTextarea2"
                  label="write message..."
                >
                  <Form.Control
                    onChange={(e) => setMessageText(e.target.value)}
                    as="textarea"
                    className="chat-message"
                    placeholder="Leave a comment here"
                    style={{ height: '75px' }}
                    value={messageText}
                  />
                </FloatingLabel>
                <Button text="Send" callBack={handleSendMessage} />
              </GridItemInput>
            )}
          </GridContainer>
          {!chatWithUser && (
            <SelectUserToChatMessage>
              <HR />
              <p>Select a user from matches to start chating!</p>
            </SelectUserToChatMessage>
          )}
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default Chat;
