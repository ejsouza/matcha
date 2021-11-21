import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Row } from 'react-bootstrap';
import defaultProfilePicture from 'assets/icons/profile-picture-default.svg';
import { getVisits } from 'api/visit';
import { getMessages, updateSeenMessage } from 'api/message';
import { getLikesLikedBy } from 'api/like';
import { getUnseenMatches } from 'api/match';
import briefcase from 'assets/icons/brief_case.svg';
import { MessageInterface } from 'components/DisplayMessageCard';
import { getUserIdFromLocalStorage } from 'utils/user';
import socket from 'socket/socket.io';
import { SUCCESS } from 'utils/const';

interface ProfileHeaderProps {
  cbSettings: () => void;
  cbNotification: () => void;
}

interface VisitInterface {
  id: number;
  visitee_id: number;
  visitor_id: number;
  seen: boolean;
  visited_at: Date;
}

interface LikesInterface {
  id: number;
  user_id: number;
  liked_id: number;
  seen: boolean;
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
  const [visits, setVisits] = useState(0);
  const [likes, setLikes] = useState(0);
  const [matches, setMatches] = useState(0);
  const currentUserId = getUserIdFromLocalStorage();

  useEffect(() => {
    let isMounted = true;
    getUserMessages().then((count) => {
      if (isMounted) {
        setMessages(count);
      }
    });

    socket.on('direct message', () => {
      getUserMessages().then((count) => {
        if (isMounted) {
          setMessages(count);
        }
      });
    });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;
    getUserVisits().then((count) => {
      if (isMounted) {
        setVisits(count);
      }
    });

    socket.on('visit', () => {
      getUserVisits().then((count) => {
        if (isMounted) {
          setVisits(count);
        }
      });
    });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;
    getUserLikes().then((count) => {
      if (isMounted) {
        setLikes(count);
      }
    });

    socket.on('like', () => {
      getUserLikes().then((count) => {
        if (isMounted) {
          setLikes(count);
        }
      });
    });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;
    getUserUnseenMatches().then((count) => {
      if (isMounted) {
        setMatches(count);
      }
    });
    socket.on('match', () => {
      getUserUnseenMatches().then((count) => {
        if (isMounted) {
          setMatches(count);
        }
      });
    });
    return () => {
      isMounted = false;
    };
  }, []);

  async function getUserMessages() {
    let msgCount = 0;

    const msgRes = await getMessages();

    if (msgRes.status === SUCCESS) {
      const msgJson = await msgRes.json();
      const msgs: MessageInterface[] = msgJson.messages;
      msgs.forEach((msg) => {
        if (msg.receiver_id === currentUserId && !msg.seen) {
          msgCount++;
        }
      });
    }
    return msgCount;
  }

  async function getUserVisits() {
    let visitCount = 0;
    const visitsRes = await getVisits();

    if (visitsRes.status === SUCCESS) {
      const visitsJson = await visitsRes.json();
      const vsts: VisitInterface[] = visitsJson.visits;
      vsts.forEach((visit) => {
        if (visit.visitee_id === currentUserId && !visit.seen) {
          visitCount++;
        }
      });
    }
    return visitCount;
  }

  async function getUserLikes() {
    let likesCount = 0;
    const res = await getLikesLikedBy(currentUserId || 0);
    if (res.status === SUCCESS) {
      const json = await res.json();
      const likes: LikesInterface[] = json.likes;

      likes.forEach((like) => {
        if (!like.seen) {
          likesCount++;
        }
      });
    }
    return likesCount;
  }

  async function getUserUnseenMatches() {
    let unseenMatchesCount = 0;
    const res = await getUnseenMatches();
    if (res.status === SUCCESS) {
      const json = await res.json();
      const matches: LikesInterface[] = json.matches;

      unseenMatchesCount = matches.length;
    }
    return unseenMatchesCount;
  }

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
            <Notification
              display={
                messages + visits + likes + matches > 0 ? 'auto' : 'none'
              }
            >
              <span>{messages + visits + likes + matches}</span>
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
