import React, { useState, useEffect, useCallback } from 'react';
import { Carousel } from 'react-bootstrap';
import styled from 'styled-components';
import Bell from './Bell';
import Loading from './Loading';
import { getVisits } from 'api/visit';
import { getUserMatches, UpdateUserInfoInterface } from 'api/user';
import { getMessages } from 'api/message';
import VisitCard from './VisitCard';
import MatchesCard from './MatchesCard';
import { SUCCESS } from 'utils/const';
import DisplayMessageCard, { UserReceivedMessage } from './DisplayMessageCard';

const Container = styled.div`
  padding-left: 16px;
  padding-right: 24px;
`;

const LoadingContainer = styled.div`
  margin-top: 100px;
  margin-left: 25%;
`;

const TitlePrev = styled.div`
  top: 70px;
  display: flex;
  align-items: center;
  position: absolute;
  color: #868e96;
  margin-left: -32px;
  height: 70px;
  width: 20%;
`;

const TitleNext = styled.div`
  top: 70px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  color: #868e96;
  margin-left: -10px;
  height: 70px;
  width: 5.6%;
`;

const WrapTitle = styled.div`
  // position: relative;
  // margin-top: -100px;
  // text-align: center;
`;

const Wrapper = styled.div`
  position: relative;
  padding-top: 100px;

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

const Notifications = (props: { notif: boolean }) => {
  const [index, setIndex] = useState(0);
  const [visits, setVisits] = useState<VisitInterface[]>();
  const [matches, setMatches] = useState<UpdateUserInfoInterface[]>();
  const [messages, setMessages] = useState<UserReceivedMessage[]>();
  const [unseenVisits, setUnseenVisits] = useState(0);
  const [unseenMessages, setUnseenMessages] = useState(0);

  const handleSelect = (selectedIndex: number) => {
    setIndex(selectedIndex);
  };
  const notificatons = ['Match', 'Msg', 'Visits'];
  const prev = index - 1 === -1 ? 2 : index - 1;
  const next = index + 1 === 3 ? 0 : index + 1;

  const getUserVisits = useCallback(async () => {
    const res = await getVisits();
    console.log(res.status);
    if (res.status !== SUCCESS) {
      console.log(`session experied, need to logout user`);
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
  }, [props.notif]);

  const getMatches = useCallback(async () => {
    const res = await getUserMatches();
    const m = await res.json();
    const matchedUsers: UpdateUserInfoInterface[] = m.matches;
    setMatches(matchedUsers);
  }, [props.notif]);

  const getUserMessages = useCallback(async () => {
    const res = await getMessages();
    const m = await res.json();
    const msgs: UserReceivedMessage[] = m.messages;
    let unseenM = 0;
    msgs.forEach((msg) => {
      if (!msg.message.seen) {
        unseenM++;
      }
    });
    setUnseenMessages(unseenM);
    setMessages(msgs);
  }, [props.notif]);

  useEffect(() => {
    getUserVisits();
    getMatches();
    getUserMessages();
  }, [getUserVisits, getMatches, getUserMatches]);

  return !visits || !matches || !messages ? (
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
              <TitlePrev>
                {notificatons[prev]}&nbsp;
                {prev === 0 && matches.length > 0 && (
                  <Bell width="16" height="20" count={matches.length} />
                )}
                {prev === 1 && unseenMessages > 0 && (
                  <Bell width="16" height="20" count={unseenMessages} />
                )}
                {prev === 2 && unseenVisits > 0 && (
                  <Bell width="16" height="20" count={unseenVisits} />
                )}
              </TitlePrev>
            </WrapTitle>
          }
          nextIcon={
            <WrapTitle>
              <TitleNext>
                {notificatons[next]}&nbsp;
                {next === 0 && matches.length > 0 && (
                  <Bell width="16" height="20" count={matches.length} />
                )}
                {next === 1 && unseenMessages > 0 && (
                  <Bell width="16" height="20" count={unseenMessages} />
                )}
                {next === 2 && unseenVisits > 0 && (
                  <Bell width="16" height="20" count={unseenVisits} />
                )}
              </TitleNext>
            </WrapTitle>
          }
        >
          <Carousel.Item>
            <Wrapper>
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
            <Wrapper>
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
            <Wrapper>
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
        </Carousel>
      </Container>
    </>
  );
};

export default Notifications;
