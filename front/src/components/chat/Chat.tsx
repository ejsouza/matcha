import { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { Offcanvas, Form, FloatingLabel } from 'react-bootstrap';
import { useAppSelector } from 'store/hook';
import { UserInterface } from 'interfaces';
import Button from 'components/Button';
import { getUserMatches, UpdateUserInfoInterface } from 'api/user';
import { getUserChats, postMessage, ChatMessageInterface } from 'api/chat';
import socket from 'socket/socket.io';
import { CREATED } from 'utils/const';
import { getUserIdFromLocalStorage } from 'utils/user';
import MatchProfile from './MatchProfile';

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

// interface OnlineInterface {
//   color: string;
// }

interface MessageBoxInterface {
  alignDirection: string;
}

interface MessageWrapperInterface {
  backgroundColor: string;
}

// interface UnreadMessagesInterface {
//   display: string;
// }

const ButtonWrapper = styled.div`
  position: fixed;
  top: 0;
  right: 10px;
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

// const OnlineProfileWrapper = styled.div`
//   display: flex;
//   align-items: center;
//   justify-content: start;
//   align-content: space-between;
//   padding: 0.5em 0.2em;
//   cursor: pointer;
//   border-radius: 10px;
//   :hover {
//     background-color: var(--primary-color);
//   }
//   :hover > div > span {
//     color: #fff;
//   }
// `;

// const ImageWrapper = styled.div`
//   position: relative;
// `;

const ImageMessageWrapper = styled.div`
  padding-left: 0.3em;
`;

const OnlineProfileImg = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
`;

// const OnlineUserName = styled.div`
//   span {
//     font-size: 0.6em;
//     margin-left: 0.5em;
//     color: var(--primary-gray-color);
//   }
// `;

// const UnreadMessages = styled.div<UnreadMessagesInterface>`
//   position: relative;

//   span {
//     width: 16px;
//     height: 16px;
//     border-radius: 50%;
//     text-align: center;
//     border: 1px solid var(--secondary-color);
//     position: absolute;
//     display: ${(p) => p.display};
//     top: -20px;
//     right: -10px;
//     font-size: 0.6em;
//     margin-left: 0.5em;
//     color: #fff;
//     background-color: var(--secondary-color);
//   }
// `;

// const OnlineBadge = styled.div<OnlineInterface>`
//   position: absolute;
//   width: 12px;
//   height: 12px;
//   border-radius: 50%;
//   border: 1px solid white;
//   background-color: ${(p) => p.color};
//   top: 0;
//   left: 25px;
// `;

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

const Chat = () => {
  const [show, setShow] = useState(false);
  const [users, setUsers] = useState<UpdateUserInfoInterface[]>();
  const [chatWithUser, setChatWithUser] = useState<UpdateUserInfoInterface>();
  const [chats, setChats] = useState<ChatInterface[]>();
  const [messageText, setMessageText] = useState('');
  const [globalMessageNotificationCount, setGlobalMessageNotificationCount] =
    useState(0);
  const user: UserInterface = useAppSelector((state) => state.user);
  const scrollRef = useRef<null | HTMLDivElement>(null);
  // const unreadMessages = useRef(0);

  const handleClose = () => {
    setShow(false);
    /**
     * Reset the last user conversation was made.
     */
    setChats(undefined);
    setChatWithUser(undefined);
  };
  const handleShow = () => {
    setShow(true);
    // unreadMessages.current = 0;
    // setGlobalMessageNotificationCount(0);
  };

  const updateChatDisplay = async (userId: number) => {
    const res = await getUserChats(userId);
    const json = await res.json();
    const chats: ChatInterface[] = json.chats;

    chats.sort((a, b) => {
      return +new Date(a.sent_at) - +new Date(b.sent_at);
    });
    setChats(chats);
    console.log(`updateChatDisplay()`);
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
    console.log(`Component did mount!`);
    let isMounted = true;
    socket.on('private message', (message: NewMessage) => {
      console.log(
        `Got new message from ${message.from} is online ${user.is_connected}`
      );
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
    console.log(`unseen messages ${unread}`);
    return () => {
      isMounted = false;
    };
    /**
     * 'chats' shall be in the dependencies array, otherwise when a message
     * is sent it won't update the component on 'real' time.
     */
  }, [chats]);

  useEffect(() => {
    console.log(`Mounted`);
    (async () => {
      /**
       * We get the userID here from local storage
       * taking it from the global user doesn't work
       * because it will be 0 when this function will run
       * when we login
       */
      const userId = getUserIdFromLocalStorage() || 0;
      const res = await getUserChats(userId);
      const json = await res.json();
      const chats: ChatInterface[] = json.chats;
      let unread = 0;
      chats?.forEach((chat) => {
        if (!chat.seen && chat.sender_id !== userId) {
          unread += 1;
        }
      });
      setGlobalMessageNotificationCount(unread);
    })();
  }, [chats]);

  // useEffect(() => {
  //   socket.on('new message', () => {
  //     console.log(`got new message`);
  //   });
  // }, []);

  const initiateChat = (userId: number) => {
    const currentChatUser = users?.find((user) => user.id === userId);
    setChatWithUser(currentChatUser);
    updateChatDisplay(userId);
  };

  const currentChatUserMessagesSentToCurrentUser = (
    currentChatUserId: number
  ) => {
    const getData = async () => {
      let unread = 0;
      const res = await getUserChats(currentChatUserId);
      const json = await res.json();
      const chats: ChatInterface[] = json.chats;

      chats?.forEach((chat) => {
        if (!chat.seen && chat.receiver_id === user.id) {
          unread += 1;
        }
      });
      return unread;
    };
    return getData();
  };

  const handleSendMessage = async () => {
    console.log(`sending message := ${messageText}`);
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
        console.log(
          `receiverName := ${privateMessage.to} senderName := ${privateMessage.from}`
        );
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
      <ButtonWrapper>
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
                      <MessageTextWrapper>{chat.text}</MessageTextWrapper>
                    </MessageWrapper>
                  </MessageBox>
                ))
              )}
            </GridItemMain>
            <GridItemOnline className="vertical-line">
              {users?.map((user) => (
                // <OnlineProfileWrapper
                //   key={user.id}
                //   // onClick={() => initiateChat(user.id || 0)}
                // >
                //   <ImageWrapper>
                //     <OnlineBadge
                //       color={user.is_connected ? 'limegreen' : 'grey'}
                //     />
                //     <OnlineProfileImg
                //       src={
                //         user.default_picture?.startsWith('https')
                //           ? user.default_picture
                //           : `${process.env.REACT_APP_API_URL}/uploads/${user.default_picture}`
                //       }
                //     />
                //   </ImageWrapper>
                //   <OnlineUserName>
                //     <span>{user.firstname}</span>
                //   </OnlineUserName>
                //   {/* <UnreadMessages display="inline-block">
                //     <span>
                //       {currentChatUserMessagesSentToCurrentUser(user.id || 0)}
                //     </span>
                //   </UnreadMessages> */}
                <MatchProfile
                  cb={() => initiateChat(user.id || 0)}
                  user={user}
                  key={user.id}
                />
                // </OnlineProfileWrapper>
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
