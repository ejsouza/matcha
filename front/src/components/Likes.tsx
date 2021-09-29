import React, { useState } from 'react';
import { Carousel } from 'react-bootstrap';
import styled from 'styled-components';

const Container = styled.div`
  padding-left: 16px;
  padding-right: 24px;
`;

const Title = styled.span``;

const Wrapper = styled.div`
  padding-top: 60px;
`;

const Likes = () => {
  const [index, setIndex] = useState(0);

  const handleSelect = (selectedIndex: number) => {
    setIndex(selectedIndex);
  };
  return (
    <>
      <Container>
        <Carousel
          activeIndex={index}
          onSelect={handleSelect}
          interval={null}
          indicators={false}
          prevIcon={
            <Title className={index === 0 ? 'is-active' : 'gray-one'}>
              Matches
            </Title>
          }
          nextIcon={
            <Title className={index === 1 ? 'is-active' : 'gray-one'}>
              Messages
            </Title>
          }
        >
          <Carousel.Item>
            <Wrapper>
              <p>One</p>
            </Wrapper>
          </Carousel.Item>
          <Carousel.Item>
            <Wrapper>
              <p>Two</p>
            </Wrapper>
          </Carousel.Item>
        </Carousel>
      </Container>
    </>
  );
};

export default Likes;
