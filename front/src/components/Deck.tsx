import React, { useState, useEffect } from 'react';
import { useSprings, animated, to as interpolate } from 'react-spring';
import { useDrag, useGesture, usePinch } from 'react-use-gesture';
import { Modal } from 'react-bootstrap';
import styled from 'styled-components';
import { useAppDispatch, useAppSelector } from 'store/hook';
import LikeButton from './LikeButton';
import InfoButton from './InfoButton';
import DislikeButton from './DislikeButton';
import { getUsers, UpdateUserInfoInterface } from 'api/user';
import { CREATED, SUCCESS } from 'utils/const';
import { aHundredLengthBio } from 'utils/user';
import { likeProfile, getAllLikes, getLikedBy } from 'api/like';
import { UserInterface } from 'interfaces';
import { FlexBox, Gap } from 'globalStyled';
import Button from './Button';
import MessageCard from './MessageCard';
import manProfile from 'assets/img/man-profile.png';
import womanProfile from 'assets/img/woman-profile.png';

const ButtonsContainer = styled.div`
  position: relative;
  display: flex;
  justify-content: space-between;
  width: 100%;
  max-width: 320px;
  margin: auto;
  // margin-top: 500px;
  padding: 0 16px;
  z-index: 1;
`;

const ButtonItem = styled.div``;

const InfoContainer = styled.div`
  color: #fff;
  padding: 0 24px;
  margin: 420px 0 20px 0;
  p {
    height: 100px;
  }
`;

const TitleItsAMatch = styled.div`
  font-family: 'Bad Script', cursive;
  font-size: 40px;
  font-weight: bold;
  text-align: center;
  color: #fff;
`;

const StyledP = styled.p`
  text-align: center;
  color: #fff;
`;

const RoundedImg = styled.img`
  border-radius: 50%;
  width: 150px;
  height: 150px;
`;

const ButtonWrapper = styled.div`
  width: 200px;
  margin: auto;
`;

export const StyledButtonWhite = styled.button`
  border: 1px solid #ff655b;
  width: 200px;
  border-radius: 20px;
  padding: 8px 8px;
  letter-spacing: 0.02em;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: '3vh 0 0 0';
  cursor: pointer;
  color: #fff;
  background-color: rgba(255, 0, 0, 0);
  :hover {
    color: white;
    background-color: red; /* For browsers that do not support gradients */
    background-image: linear-gradient(to right, #ff655b, #fd297b);
  }
`;

const cards = [
  'https://upload.wikimedia.org/wikipedia/en/f/f5/RWS_Tarot_08_Strength.jpg',
  'https://upload.wikimedia.org/wikipedia/en/5/53/RWS_Tarot_16_Tower.jpg',
  'https://upload.wikimedia.org/wikipedia/en/9/9b/RWS_Tarot_07_Chariot.jpg',
  'https://upload.wikimedia.org/wikipedia/en/d/db/RWS_Tarot_06_Lovers.jpg',
  'https://upload.wikimedia.org/wikipedia/en/thumb/8/88/RWS_Tarot_02_High_Priestess.jpg/690px-RWS_Tarot_02_High_Priestess.jpg',
  'https://upload.wikimedia.org/wikipedia/en/d/de/RWS_Tarot_01_Magician.jpg',
];

// These two are just helpers, they curate spring data, values that are later being interpolated into css
const to = (i: number) => ({
  x: 0,
  y: 0,
  scale: 1,
  delay: i * 5,
});
const from = (i: number) => ({ x: 0, rot: 0, scale: 1.5, y: -1000 });
// This is being used down there in the view, it interpolates rotation and scale into a css transform
const trans = (r: number, s: any) =>
  `perspective(2500px) rotateX(0deg) rotateY(${
    r / 10
  }deg) rotateZ(${r}deg) scale(${s})`;

interface LikesInterface {
  id: number;
  from_user_id: number;
  to_user_id: number;
  created: string;
}
const Deck = () => {
  const [users, setUsers] = useState<UpdateUserInfoInterface[]>([]);
  const [matchedProfile, setMatchedProfile] =
    useState<UpdateUserInfoInterface>();
  const [showMatch, setShowMatch] = useState(false);
  const [showMessageCard, setShowMessageCard] = useState(false);
  const dispatch = useAppDispatch();
  const currentUser: UserInterface = useAppSelector((state) => state.user);
  const [gone] = useState(() => new Set()); // The set flags all the cards that are flicked out
  const [props, set] = useSprings(users.length, (i) => ({
    ...to(i),
    from: from(i),
  }));

  useEffect(() => {
    getUsers().then((res) => {
      if (res?.status === SUCCESS) {
        res.json().then((usrs) => {
          console.log(usrs);
          setUsers(usrs);
        });
      }
    });
  }, []);

  const handleCloseShowMatch = () => {
    setShowMessageCard(false);
    setShowMatch(false);
  };

  const handleShowMatch = () => {
    setShowMatch(true);
    const changeBackgroundColor = document.querySelector('.modal-content');
    changeBackgroundColor?.setAttribute('style', 'background-color:  #252932');
  };

  const handleCloseSendMessage = () => {
    setShowMessageCard(true);
  };
  const isMatch = (index: number, direction: number) => {
    const user = users[index];
    if (direction < 0) {
      console.log(`You disliked := ${user.username}`);
    } else if (direction > 0) {
      console.log(`You liked ${user.username} with id ${user.id}`);
      if (user.id) {
        likeProfile(user.id)?.then((res) => {
          console.log(`gets here 1 ${res.status}`);
          if (res.status === CREATED) {
            console.log(`gets here 2`);

            getLikedBy()
              ?.then((res) => {
                if (!res || res.status !== SUCCESS) {
                  return;
                }
                res.json().then((likes: LikesInterface[]) => {
                  const usersMatched = likes.find(
                    (like) => like.from_user_id === user.id
                  );
                  if (usersMatched) {
                    setMatchedProfile(user);
                    handleShowMatch();
                  } else {
                    console.log(
                      `usersMatched is ${usersMatched} -- id ${user.id}`
                    );
                  }
                });
              })
              .catch((err) => {});
          }
        });
      }
    }
  };

  const bind = useGesture({
    onDrag: ({
      args: [index],
      down,
      movement: [mx],
      direction: [xDir],
      velocity,
      tap,
    }) => {
      const trigger = velocity > 0.2; // If you flick hard enough it should trigger the card to fly out
      const dir = xDir < 0 ? -1 : 1; // Direction should either point left or right
      if (!down && trigger) gone.add(index); // If button/finger's up and trigger velocity is reached, we flag the card ready to fly out
      set((i) => {
        if (index !== i) return; // We're only interested in changing spring-data for the current spring
        const isGone = gone.has(index);
        const x = isGone ? (200 + window.innerWidth) * dir : down ? mx : 0; // When a card is gone it flys out left or right, otherwise goes back to zero
        const rot = mx / 100 + (isGone ? dir * 10 * velocity : 0); // How much the card tilts, flicking it harder makes it rotate faster

        /* Only call if card is gone, it can move and go back to it's initial position */
        if (isGone) {
          isMatch(index, x);
        }
        const scale = down ? 1.1 : 1; // Active cards lift up a bit
        return {
          x,
          rot,
          scale,
          delay: undefined,
          config: { friction: 50, tension: down ? 800 : isGone ? 200 : 500 },
        };
      });
    },
  });

  // const bind = useGesture({});
  const dislike = (index: number) => {
    isMatch(index, -1);
    set((i) => {
      if (index !== i) return;
      return {
        x: -1493,
        rot: -21,
        scale: 1.1,
        delay: 50,
        config: { friction: 50, tension: 200 },
      };
    });
  };

  const like = (index: number) => {
    isMatch(index, 1);
    set((i) => {
      if (index !== i) return;
      return {
        x: 1493,
        rot: 21,
        scale: 1,
        delay: 50,
        config: { friction: 50, tension: 200 },
      };
    });
  };
  // Now we're just mapping the animated values to our view, that's it. Btw, this component only renders once. :-)
  return (
    <>
      <div id="root-deck">
        {props.map(({ x, y, rot, scale }, i) => (
          <animated.div key={i} style={{ x, y }}>
            {/* This is the card itself, we're binding our gesture to it (and inject its index so we know which is which) */}
            <animated.div
              {...bind(i)}
              style={{
                transform: interpolate([rot, scale], trans),
                // backgroundImage: `url(${users[i]})`,
                backgroundImage: `url(https://images-ssl.gotinder.com/u/eJS9fZtU4ZoWYv5MxuQnqD/wycGLpSGGd8VkwEYiwhJ8e.jpg?Policy=eyJTdGF0ZW1lbnQiOiBbeyJSZXNvdXJjZSI6IiovdS9lSlM5Zlp0VTRab1dZdjVNeHVRbnFELyoiLCJDb25kaXRpb24iOnsiRGF0ZUxlc3NUaGFuIjp7IkFXUzpFcG9jaFRpbWUiOjE2MzA1NzAwNDV9fX1dfQ__&Signature=sspQA5wseaM~Uzt5Ag6JKq2krwiZugIrAi7077L~nnQ6WreUGBNCum1YhbYazdxsj1FHCrZfpI5bbLrp-K14beg9Ef9JmddCtjU3~kwFAdAXKGOD87NO2qVRJJUfy1eT-gGotFebp5Km2e2OxjBi~-MQSSFnN4twHmrgTj96WOntnzKq8i-WCqMjkvtPXtkQ8XlzbeYFNCnRUsg26BJ7qfAOpeb2lae78YvYtoZsccZXGpgZhsgVlWxa4v3NtE-BLz1LzAeQyJ1AYeWn2qMzIa6BdE-dKusE6XkNsCt~dPJ7Xptj3vtkowiKcpQGgPfhzNQwE7Y4ElwJ2xJT7XLaVg__&Key-Pair-Id=K368TLDEUPA6OI)`,
                // backgroundImage: `url(https://randomuser.me/api/portraits/${
                //   users[i].gender === 'M' ? 'men' : 'women'
                // }/${i}.jpg)`,
              }}
            >
              <InfoContainer>
                <h3>
                  {users[i]?.firstname}&nbsp;{users[i]?.age}
                </h3>
                <p>{aHundredLengthBio(users[i]?.description)}</p>
              </InfoContainer>
              <ButtonsContainer>
                <ButtonItem onClick={() => dislike(i)}>
                  <DislikeButton />
                </ButtonItem>
                <ButtonItem>
                  <InfoButton id={users[i].id} />
                </ButtonItem>
                <ButtonItem onClick={() => like(i)}>
                  <LikeButton />
                </ButtonItem>
              </ButtonsContainer>
            </animated.div>
          </animated.div>
        ))}
      </div>
      {/* Show match modal */}
      <Modal
        show={showMatch}
        backdrop="static"
        keyboard={false}
        className="modal-background-white"
      >
        <Modal.Body>
          <TitleItsAMatch>It's a Match!</TitleItsAMatch>
          <StyledP>
            You and {matchedProfile?.firstname} have liked each other.
          </StyledP>
          <FlexBox alignItems="center" justifyContent="center">
            <RoundedImg src={manProfile} alt="avatarOne" />
            <Gap>&nbsp;&nbsp;&nbsp;</Gap>
            <RoundedImg src={womanProfile} alt="avatarTwo" />
          </FlexBox>
          {!showMessageCard && (
            <>
              <ButtonWrapper onClick={handleCloseSendMessage}>
                <Button text="Send Message" wid="200px" borderRadius="20px" />
              </ButtonWrapper>
              <Gap>&nbsp;</Gap>
              <ButtonWrapper onClick={handleCloseShowMatch}>
                <StyledButtonWhite>Keep Swiping</StyledButtonWhite>
              </ButtonWrapper>
            </>
          )}
        </Modal.Body>
        {showMessageCard && (
          <MessageCard
            callBack={handleCloseShowMatch}
            sendTo={matchedProfile?.id}
          />
        )}
      </Modal>
    </>
  );
};

export default Deck;
