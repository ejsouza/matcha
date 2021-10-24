import React, { useState, useEffect, useCallback } from 'react';
import { Carousel } from 'react-bootstrap';
import styled from 'styled-components';
import Bell from './Bell';
import Loading from './Loading';
import { getVisits } from 'api/visit';
import VisitCard from './VisitCard';

const Container = styled.div`
  padding-left: 16px;
  padding-right: 24px;
`;

const TitlePrev = styled.div`
  top: 100px;
  display: flex;
  position: fixed;
  color: #868e96;
  margin-left: -20px;
`;

const TitleNext = styled.div`
  top: 100px;
  display: flex;
  position: fixed;
  color: #868e96;
  margin-left: -50px;
`;

const WrapTitle = styled.div`
  position: relative;
  margin-top: -100px;
  text-align: center;
`;

const Wrapper = styled.div`
  position: relative;
  padding-top: 50px;

  h6 {
    text-align: center;
  }
`;

const ActiveTitle = styled.div`
  color: var(--primary-color);
`;

export interface VisitInterface {
  id: number;
  visitee_id: number;
  visitor_id: number;
  seen_visit: boolean;
  visited_at: Date;
}

const Notifications = (props: { notif: boolean }) => {
  const [index, setIndex] = useState(0);
  const [visits, setVisits] = useState<VisitInterface[]>();
  const [unseenVisits, setUnseenVisits] = useState(0);

  const handleSelect = (selectedIndex: number) => {
    setIndex(selectedIndex);
  };
  const notificatons = ['Match', 'Msg', 'Visits'];
  const prev = index - 1 === -1 ? 2 : index - 1;
  const next = index + 1 === 3 ? 0 : index + 1;

  const getUserVisits = useCallback(async () => {
    const res = await getVisits();
    const v = await res.json();
    const visitors: VisitInterface[] = v.visits;
    let unseenV = 0;
    visitors.forEach((visitor) => {
      if (!visitor.seen_visit) {
        unseenV++;
      }
    });
    setUnseenVisits(unseenV);
    setVisits(visitors);
  }, [props.notif]);
  useEffect(() => {
    getUserVisits();
    console.log(`HERE >>> ${props.notif}`);
  }, [getUserVisits]);

  return !visits ? (
    <Loading />
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
                {prev === 0 && <Bell width="16" height="20" count={3} />}
                {prev === 1 && <Bell width="16" height="20" count={2} />}
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
                {next === 0 && <Bell width="16" height="20" count={1} />}
                {next === 1 && <Bell width="16" height="20" count={2} />}
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
              <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
            </Wrapper>
          </Carousel.Item>
          <Carousel.Item>
            <Wrapper>
              <ActiveTitle>
                <hr />

                <h6>Messages</h6>
              </ActiveTitle>
              <div>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
              </div>
            </Wrapper>
          </Carousel.Item>
          <Carousel.Item>
            <Wrapper>
              <ActiveTitle>
                <hr />

                <h6>Visits</h6>
              </ActiveTitle>
              {visits?.length === 0 ? (
                <p>you don't have any visitor</p>
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
