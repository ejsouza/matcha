import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Spinner } from 'react-bootstrap';
import { UpdateUserInfoInterface } from 'api/user';
import { ChatInterface } from './Chat';
import { getUserChats, setChatToSeen, ChatMessageInterface } from 'api/chat';
import { getUserIdFromLocalStorage } from 'utils/user';

interface MatchProfilePros {
  user: UpdateUserInfoInterface;
  cb: (userId: number) => void;
}

interface OnlineInterface {
  color: string;
}

interface UnreadMessagesInterface {
  display: string;
}

const OnlineProfileWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: start;
  align-content: space-between;
  padding: 0.5em 0.2em;
  cursor: pointer;
  border-radius: 10px;
  :hover {
    background-color: var(--primary-color);
  }
  :hover > div > span {
    color: #fff;
  }
`;

const ImageWrapper = styled.div`
  position: relative;
`;

const OnlineBadge = styled.div<OnlineInterface>`
  position: absolute;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 1px solid white;
  background-color: ${(p) => p.color};
  top: 0;
  left: 25px;
`;

const OnlineProfileImg = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
`;

const OnlineUserName = styled.div`
  span {
    font-size: 0.6em;
    margin-left: 0.5em;
    color: var(--primary-gray-color);
  }
`;

const UnreadMessages = styled.div<UnreadMessagesInterface>`
  position: relative;

  span {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    text-align: center;
    border: 1px solid var(--secondary-color);
    position: absolute;
    display: ${(p) => p.display};
    top: -20px;
    right: -10px;
    font-size: 0.6em;
    margin-left: 0.5em;
    color: #fff;
    background-color: var(--secondary-color);
  }
`;

const MatchProfile = (props: MatchProfilePros) => {
  const [chats, setChats] = useState<ChatInterface[]>();
  const [loading, setLoading] = useState(true);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const { user, cb } = props;
  const currentUserId = getUserIdFromLocalStorage();

  useEffect(() => {
    (async () => {
      let unread = 0;
      const res = await getUserChats(user.id || 0);
      const json = await res.json();
      const chats: ChatInterface[] = json.chats;
      setChats(chats);
      chats?.forEach((chat) => {
        if (!chat.seen && chat.receiver_id === currentUserId) {
          unread += 1;
        }
      });
      setUnreadMessages(unread);
      setLoading(false);
    })();
  }, []);

  const handleUnseenMessages = () => {
    cb(user.id || 0);
    chats?.forEach((chat) => {
      if (chat.receiver_id === currentUserId && !chat.seen) {
        console.log(
          `[${chat.id}] sender(${chat.sender_id}) receiver(${chat.receiver_id}) seen(${chat.seen})`
        );
        setChatToSeen(chat.id);
      }
    });
    setUnreadMessages(0);
  };

  return loading ? (
    <OnlineProfileWrapper>
      <Spinner animation="border" variant="light" />
    </OnlineProfileWrapper>
  ) : (
    <>
      <OnlineProfileWrapper key={user.id} onClick={handleUnseenMessages}>
        <ImageWrapper>
          <OnlineBadge color={user.is_connected ? 'limegreen' : 'grey'} />
          <OnlineProfileImg
            src={
              user.default_picture?.startsWith('https')
                ? user.default_picture
                : `${process.env.REACT_APP_API_URL}/uploads/${user.default_picture}`
            }
          />
        </ImageWrapper>
        <OnlineUserName>
          <span>{user.firstname}</span>
        </OnlineUserName>
        <UnreadMessages display={unreadMessages > 0 ? 'inline-block' : 'none'}>
          <span>{unreadMessages}</span>
        </UnreadMessages>
      </OnlineProfileWrapper>
    </>
  );
};

export default MatchProfile;
