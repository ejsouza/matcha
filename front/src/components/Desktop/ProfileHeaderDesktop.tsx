import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Row } from 'react-bootstrap';
import defaultProfilePicture from 'assets/icons/profile-picture-default.svg';
import { getUserChats, setChatToSeen } from 'api/chat';
import { getMessages, updateSeenMessage } from 'api/message';
import briefcase from 'assets/icons/brief_case.svg';
import { MessageInterface } from 'components/DisplayMessageCard';
import { getUserIdFromLocalStorage } from 'utils/user';

interface ProfileHeaderProps {
  cbSettings: () => void;
  cbNotification: () => void;
}

interface NotificationInterface {
  display: string;
}

const ProfileHeader = styled(Row)`
  height: 74px;
  // width is test and position
  position: fixed;
  width: 25.4vw;
  background-color: red; /* For browsers that do not support gradients */
  background-image: linear-gradient(to right, #fd297b, #ff655b);
  -webkit-box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.2);
  box-shadow: 0px 1px 4px rgba(0, 0, 0.5, 0.5);
  position: -webkit-sticky;
  top: -1px;
  z-index: 6;
`;

const BoxHeader = styled.div`
  display: grid;
  align-items: center;
  grid-template-columns: auto 80% auto;
`;
const BoxHeaderItemStart = styled.div`
  text-align: center;
  cursor: pointer;
`;

const BoxHeaderItemEnd = styled.div`
  text-align: end;
  cursor: pointer;
`;

const BoxProfileHeaderItem = styled.div`
  text-align: left;
  padding-left: 0.3em;
  color: #fff;
`;

const Notification = styled.div<NotificationInterface>`
  position: absolute;
  display: ${(p) => p.display};
  top: 15px;
  right: 6px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: red;
  border: 1px solid #fff;
  text-align: center;
  span {
    position: relative;
    color: #fff;
    font-size: 0.7em;
    top: -5px;
    left: 0;
  }
`;

const ProfileHeaderDesktop = (props: ProfileHeaderProps) => {
  const [messages, setMessages] = useState(0);
  const [chats, setChats] = useState(0);

  useEffect(() => {
    (async () => {
      const currentUserId = getUserIdFromLocalStorage();
      const msgRes = await getMessages();
      const msgJson = await msgRes.json();
      const msgs: MessageInterface[] = msgJson.messages;
      let msgCount = 0;
      msgs.forEach((msg) => {
        if (msg.receiver_id === currentUserId && !msg.seen) {
          msgCount++;
        }
      });
      setMessages(msgCount);
    })();
  }, []);

  return (
    <>
      <ProfileHeader>
        <BoxHeader>
          <BoxHeaderItemStart>
            <img
              alt="profile"
              src={defaultProfilePicture}
              height="32px"
              width="32px"
              onClick={props.cbSettings}
            />
          </BoxHeaderItemStart>
          <BoxProfileHeaderItem>My Profile</BoxProfileHeaderItem>
          <BoxHeaderItemEnd>
            <Notification display="auto">
              <span>{messages}</span>
            </Notification>

            <img
              alt="briefcase"
              src={briefcase}
              height="32px"
              width="32px"
              onClick={props.cbNotification}
            />
          </BoxHeaderItemEnd>
        </BoxHeader>
      </ProfileHeader>
    </>
  );
};

export default ProfileHeaderDesktop;
