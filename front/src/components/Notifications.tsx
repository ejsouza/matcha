import { useState, useEffect, useCallback } from 'react';
import { Carousel } from 'react-bootstrap';
import styled from 'styled-components';
import Bell from './Bell';
import Loading from './Loading';
import { useAppSelector } from 'store/hook';
import { UserInterface } from 'interfaces';
import { getVisits, setVisitToSeen } from 'api/visit';
import {
  getUserMatches,
  UpdateUserInfoInterface,
  getUserLikedBy,
} from 'api/user';
import { getMessages } from 'api/message';
import { getLikesLikedBy, setLikeToSeen } from 'api/like';
import {
  getUnseenMatches,
  deleteUnseenMatches,
  MatchesInterface,
} from 'api/match';
import VisitCard from './VisitCard';
import MatchesCard from './MatchesCard';
import LikesMe from './LikesMe';
import { CREATED, SUCCESS } from 'utils/const';
import DisplayMessageCard, { MessageInterface } from './DisplayMessageCard';
import socket from 'socket/socket.io';

interface TitleProps {
  topTitle: string;
}

const Container = styled.div`
  padding-left: 16px;
  padding-right: 24px;
`;

const LoadingContainer = styled.div`
  margin-top: 100px;
  margin-left: 25%;
`;

const TitlePrev = styled.div<TitleProps>`
  // top: 70px;
  top: ${(p) => p.topTitle};
  display: flex;
  align-items: center;
  position: absolute;
  color: #868e96;
  margin-left: -32px;
  height: 70px;
  width: 20%;
`;

const TitleNext = styled.div<TitleProps>`
  // top: 70px;
  top: ${(p) => p.topTitle};
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  color: #868e96;
  margin-left: -10px;
  height: 70px;
  width: 5.6%;
`;

const WrapTitle = styled.div``;

const Wrapper = styled.div<{ wrapperpaddingtop: string }>`
  position: relative;
  padding-top: ${(p) => p.wrapperpaddingtop};
  // padding-top: 100px;

  h6 {
    text-align: center;
  }
`;

const ActiveTitle = styled.div`
  color: var(--primary-color);
  margin-top: 40px;
`;

export interface VisitInterface {
  id: number;
  visitee_id: number;
  visitor_id: number;
  seen: boolean;
  visited_at: Date;
}

interface LikeInterface {
  id: number;
  user_id: number;
  liked_id: number;
  seen: boolean;
}

interface NotificationsProps {
  notif: boolean;
  topTitle: string;
  wrapperpaddingtop: string;
}

const Notifications = ({
  notif,
  topTitle,
  wrapperpaddingtop,
}: NotificationsProps) => {
  const user: UserInterface = useAppSelector((state) => state.user);
  const [index, setIndex] = useState(0);
  const [visits, setVisits] = useState<VisitInterface[]>();
  const [matches, setMatches] = useState<UpdateUserInfoInterface[]>();
  const [messages, setMessages] = useState<MessageInterface[]>();
  const [likes, setLikes] = useState<LikeInterface[]>();
  const [unseenVisits, setUnseenVisits] = useState(0);
  const [unseenMessages, setUnseenMessages] = useState(0);
  const [unseenLikes, setUnseenLikes] = useState(0);
  const [unseenMatches, setUnseenMatches] = useState(0);
  const [likedBy, setLikedBy] = useState<UpdateUserInfoInterface[]>();

  const handleSelect = (selectedIndex: number) => {
    setIndex(selectedIndex);
  };
  const notificatons = ['Match', 'Msg', 'Visits', 'Likes'];
  const prev = index - 1 === -1 ? 3 : index - 1;
  const next = index + 1 === 4 ? 0 : index + 1;

  const getUserVisits = useCallback(async () => {
    const res = await getVisits();
    if (res.status !== SUCCESS) {
      localStorage.clear();
      window.history.pushState({}, '/');
      window.location.reload();
      return;
    }
    const v = await res.json();
    const visitors: VisitInterface[] = v.visits;
    let unseenV = 0;
    visitors.forEach((visitor) => {
      if (!visitor.seen) {
        unseenV++;
      }
    });
    setUnseenVisits(unseenV);
    setVisits(visitors);
  }, [notif]);

  const getMatches = useCallback(async () => {
    const res = await getUserMatches();
    const m = await res.json();
    const matchedUsers: UpdateUserInfoInterface[] = m.matches;
    setMatches(matchedUsers);
  }, [notif]);

  const getUserUnseenMatches = useCallback(async () => {
    const res = await getUnseenMatches();
    if (res.status === SUCCESS) {
      const json = await res.json();
      const matches: MatchesInterface[] = json.matches;
      setUnseenMatches(matches.length);
    }
  }, [notif]);

  const getUserMessages = useCallback(async () => {
    const res = await getMessages();
    const m = await res.json();
    const msgs: MessageInterface[] = m.messages;
    let unseenM = 0;
    msgs.forEach((msg) => {
      if (!msg.seen) {
        unseenM++;
      }
    });
    setUnseenMessages(unseenM);
    setMessages(msgs);
  }, [notif]);

  const getLikedByUser = useCallback(async () => {
    const res = await getUserLikedBy(user.id.toString());
    const json = await res.json();
    const likedBy: UpdateUserInfoInterface[] = json.users;
    setLikedBy(likedBy);
  }, [notif]);

  const getLikesLikedCurrentUser = useCallback(async () => {
    const res = await getLikesLikedBy(user.id);
    const json = await res.json();
    const likes: LikeInterface[] = json.likes;
    setLikes(likes);
    let count = 0;
    likes.forEach((like) => {
      if (!like.seen) {
        count++;
      }
    });
    setUnseenLikes(count);
  }, [notif]);

  useEffect(() => {
    getUserVisits();
    getMatches();
    getUserMessages();
    getLikedByUser();
    getLikesLikedCurrentUser();
    getUserUnseenMatches();
  }, []);

  useEffect(() => {
    let isMounted = true;
    socket.on('direct message', () => {
      if (isMounted) {
        getUserMessages();
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;
    socket.on('visit', () => {
      if (isMounted) {
        getUserVisits();
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;
    socket.on('like', () => {
      if (isMounted) {
        getLikesLikedCurrentUser();
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;
    socket.on('match', () => {
      if (isMounted) {
        getUserUnseenMatches();
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleClick = async (index: number) => {
    if (index === 0 && unseenMatches > 0) {
      const res = await deleteUnseenMatches();
      if (res.status === SUCCESS) {
        socket.emit('match', user.username);
      }
    } else if (index === 2) {
      let sawUnseenMessages = false;
      if (visits) {
        for (let visit of visits) {
          if (!visit.seen) {
            const res = await setVisitToSeen(
              visit.visitor_id,
              visit.visitee_id
            );
            if (res.status === CREATED) {
              sawUnseenMessages = true;
            }
          }
        }
        if (sawUnseenMessages) {
          socket.emit('visit', user.username);
        }
      }
    } else if (index === 3) {
      if (likes) {
        let sawUnseenLikes = false;
        for (let like of likes) {
          if (!like.seen) {
            const res = await setLikeToSeen(like.id);
            if (res.status === CREATED) {
              sawUnseenLikes = true;
            }
          }
        }
        if (sawUnseenLikes) {
          socket.emit('like', user.username);
        }
      }
    }
  };

  return !visits || !matches || !messages || !likedBy ? (
    <LoadingContainer>
      <Loading />
    </LoadingContainer>
  ) : (
    <>
      <Container>
        <Carousel
          activeIndex={index}
          onSelect={handleSelect}
          interval={null}
          indicators={false}
          prevIcon={
            <WrapTitle>
              <TitlePrev topTitle={topTitle} onClick={() => handleClick(prev)}>
                {notificatons[prev]}&nbsp;
                {prev === 0 && unseenMatches > 0 && (
                  <Bell width="16" height="20" count={unseenMatches} />
                )}
                {prev === 1 && unseenMessages > 0 && (
                  <Bell width="16" height="20" count={unseenMessages} />
                )}
                {prev === 2 && unseenVisits > 0 && (
                  <Bell width="16" height="20" count={unseenVisits} />
                )}
                {prev === 3 && unseenLikes > 0 && (
                  <Bell width="16" height="20" count={unseenLikes} />
                )}
              </TitlePrev>
            </WrapTitle>
          }
          nextIcon={
            <WrapTitle>
              <TitleNext topTitle={topTitle} onClick={() => handleClick(next)}>
                {notificatons[next]}&nbsp;
                {next === 0 && unseenMatches > 0 && (
                  <Bell width="16" height="20" count={unseenMatches} />
                )}
                {next === 1 && unseenMessages > 0 && (
                  <Bell width="16" height="20" count={unseenMessages} />
                )}
                {next === 2 && unseenVisits > 0 && (
                  <Bell width="16" height="20" count={unseenVisits} />
                )}
                {next === 3 && unseenLikes > 0 && (
                  <Bell width="16" height="20" count={unseenLikes} />
                )}
              </TitleNext>
            </WrapTitle>
          }
        >
          <Carousel.Item>
            <Wrapper wrapperpaddingtop={wrapperpaddingtop}>
              <ActiveTitle>
                <hr />
                <h6>Matches</h6>
              </ActiveTitle>
              {matches.length === 0 ? (
                <p>You didn't match anyone yet, start swapping!</p>
              ) : (
                <MatchesCard matches={matches} />
              )}
            </Wrapper>
          </Carousel.Item>
          <Carousel.Item>
            <Wrapper wrapperpaddingtop={wrapperpaddingtop}>
              <ActiveTitle>
                <hr />
                <h6>Messages</h6>
              </ActiveTitle>
              {messages.length === 0 ? (
                <p>You don't have any message!</p>
              ) : (
                <DisplayMessageCard userMessages={messages} />
              )}
            </Wrapper>
          </Carousel.Item>
          <Carousel.Item>
            <Wrapper wrapperpaddingtop={wrapperpaddingtop}>
              <ActiveTitle>
                <hr />

                <h6>Visits</h6>
              </ActiveTitle>
              {visits?.length === 0 ? (
                <p>You don't have any visitor!</p>
              ) : (
                <>
                  <VisitCard visitors={visits} />
                </>
              )}
            </Wrapper>
          </Carousel.Item>
          <Carousel.Item>
            <Wrapper wrapperpaddingtop={wrapperpaddingtop}>
              <ActiveTitle>
                <hr />

                <h6>Liked you</h6>
              </ActiveTitle>
              {likedBy?.length === 0 ? (
                <p>No likes here!</p>
              ) : (
                <>
                  <LikesMe users={likedBy} />
                </>
              )}
            </Wrapper>
          </Carousel.Item>
        </Carousel>
      </Container>
    </>
  );
};

export default Notifications;
