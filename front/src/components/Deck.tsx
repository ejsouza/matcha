import { useState, useEffect } from 'react';
import { useSprings, animated, to as interpolate } from 'react-spring';
import { useGesture } from 'react-use-gesture';
import { Modal } from 'react-bootstrap';
import styled from 'styled-components';
import { useAppSelector } from 'store/hook';
import LikeButton from './LikeButton';
import InfoButton from './InfoButton';
import DislikeButton from './DislikeButton';
import { getUsers, UpdateUserInfoInterface } from 'api/user';
import Loading from './Loading';
import { CREATED, SUCCESS } from 'utils/const';
import { aHundredLengthBio } from 'utils/user';
import { likeProfile, getLikesByUserId, dislikeProfile } from 'api/like';
import { createUnseenMatch } from 'api/match';
import { UserInterface } from 'interfaces';
import { FlexBox, Gap } from 'globalStyled';
import Button from './Button';
import MessageCard from './MessageCard';
import Card from './Card';
import socket from 'socket/socket.io';

interface LikesInterface {
  user_id: number;
  liked_id: number;
}

const ButtonsContainer = styled.div`
  position: relative;
  display: flex;
  justify-content: space-between;
  width: 100%;
  max-width: 360px;
  margin: auto;
  padding: 0 16px;
  z-index: 1;
`;

const ButtonItem = styled.div``;

const InfoContainer = styled.div`
  color: #fff;
  padding: 0 24px;
  margin: 450px 0 20px 0;
  p {
    height: 30px;
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
  object-fit: cover;
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

const TagContainer = styled.div`
  position: relative;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  width: 330px;
  max-width: 400px;
  z-index: 1;
`;

const TagWrapper = styled.div`
  text-align: center;
  border-radius: 20px;
  padding: 0.2em 0.8em;
  width: 100px;
  height: auto;
  background: var(--primary-gradient-color);
  color: #fff;
`;

const LoadingWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  min-height: 100vh;
`;

const CardWrapper = styled.div`
  position: relative;
  top: 40%;
  left: 50%;
  margin-top: -50px;
  margin-left: -50px;
  width: 100px;
  height: 100px;
`;

const NoUsersContainer = styled.div`
  margin-top: 50%;
  padding: 1em;
  text-align: center;
  color: var(--primary-gray-color);
`;

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

const Deck = () => {
  const [users, setUsers] = useState<UpdateUserInfoInterface[]>([]);
  const [matchedProfile, setMatchedProfile] =
    useState<UpdateUserInfoInterface>();
  const [showMatch, setShowMatch] = useState(false);
  const [showMessageCard, setShowMessageCard] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toggle, setToggle] = useState(false);
  const [maxSwippingReached, setMaxSwippingReached] = useState(false);
  const currentUser: UserInterface = useAppSelector((state) => state.user);
  const [gone] = useState(() => new Set()); // The set flags all the cards that are flicked out
  const [props, set] = useSprings(users.length, (i) => ({
    ...to(i),
    from: from(i),
  }));

  useEffect(() => {
    let isMounted = true;
    (async () => {
      const res = await getUsers();
      if (res.status === SUCCESS) {
        const json = await res.json();
        const matches: UpdateUserInfoInterface[] = json.users;
        if (isMounted) {
          if (maxSwippingReached && matches.length) {
            setMaxSwippingReached(false);
          }
          matches.sort((a, b) => a.rate! - b.rate!);
          setUsers(matches);
          setLoading(false);
        }
      }
    })();
    /**
     * Probably here we need to watch for user updates
     * in case user changes his preference (distance, sexuality...)
     */
    return () => {
      isMounted = false;
    };
  }, [toggle, maxSwippingReached]);

  useEffect(() => {
    /**
     * This isMounted could cause problem.
     * Was working before adding it, but we're
     * getting the 'no-op' warning.
     */
    let isMounted = true;
    socket.on('update user deck', () => {
      if (isMounted) {
        setToggle((toggle) => !toggle);
      }
    });
    return () => {
      isMounted = false;
    };
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
  const isMatch = async (index: number, direction: number) => {
    const currentUserCard = users[index];
    if (direction < 0) {
      if (currentUserCard.id) {
        await dislikeProfile(currentUserCard.id);
      }
    } else if (direction > 0) {
      if (currentUserCard.id) {
        const res = await likeProfile(currentUserCard.id);
        if (res.status === CREATED) {
          const resLikes = await getLikesByUserId(currentUserCard.id);
          const userCard = await resLikes.json();
          const likes: LikesInterface[] = userCard.likes;
          const isMatch = likes.find(
            (like: { liked_id: number }) => like.liked_id === currentUser.id
          );
          if (isMatch) {
            setMatchedProfile(currentUserCard);
            handleShowMatch();
            /**
             * Here we sent the matched username to be notified.
             * The current user dosn't need to be notified as s/he
             * already saw the match.
             */
            socket.emit('match', currentUserCard.username);

            /**
             * When received this event 'match' on the header
             * we should call to check for unseen match created right
             * below, maybe some delay need to be handled.
             */

            const resMatch = await createUnseenMatch(currentUserCard.id);
            if (resMatch.status === CREATED) {
            } else {
              /**
               * WARNING
               * Probably here we need a to emit a new event
               * not yet created for unseen matches.
               * This match here is only for showing on the header.
               */
            }
          } else {
            /**
             * Emit event to inform currentUser s/he has a like
             */
            socket.emit('like', currentUserCard.username);
          }
        }
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
    if (index === 0) {
      setMaxSwippingReached(true);
    }
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
    if (index === 0) {
      setMaxSwippingReached(true);
    }
  };

  // Now we're just mapping the animated values to our view, that's it. Btw, this component only renders once. :-)
  return loading ? (
    <LoadingWrapper>
      <Loading />
    </LoadingWrapper>
  ) : users.length === 0 ? (
    <CardWrapper>
      <Card>
        <NoUsersContainer>
          <h4>Argh no mathing found!</h4>
          💡 💡 💡
          <p>Try changing your preferences...</p>
        </NoUsersContainer>
      </Card>
    </CardWrapper>
  ) : maxSwippingReached ? (
    <CardWrapper>
      <Card>
        <NoUsersContainer>
          <h4>Argh no lucky today!</h4>
          😈 😈 😈
          <p>You can try it again tomorrow...</p>
        </NoUsersContainer>
      </Card>
    </CardWrapper>
  ) : (
    <>
      <div id="root-deck">
        {props.map(({ x, y, rot, scale }, i) => (
          <animated.div key={i} style={{ x, y }}>
            {/* This is the card itself, we're binding our gesture to it (and inject its index so we know which is which) */}
            <animated.div
              {...bind(i)}
              style={{
                transform: interpolate([rot, scale], trans),
                backgroundImage: `url(${
                  users[i]?.default_picture?.startsWith('https')
                    ? users[i]?.default_picture
                    : `${process.env.REACT_APP_API_URL}/uploads/${users[i]?.default_picture}`
                })`,
              }}
            >
              <InfoContainer>
                <h3>{users[i]?.username}</h3>
                <p>{aHundredLengthBio(users[i]?.biography)}</p>
                <TagContainer>
                  {users[i].tags?.slice(0, 3).map((tag) => (
                    <TagWrapper key={tag.id}>{tag.name}</TagWrapper>
                  ))}
                </TagContainer>
              </InfoContainer>
              <TagContainer></TagContainer>
              <ButtonsContainer>
                <ButtonItem onClick={() => dislike(i)}>
                  <DislikeButton />
                </ButtonItem>
                <ButtonItem>
                  <InfoButton
                    user={users[i]}
                    cb={dislike}
                    index={i}
                    currentUserId={currentUser.id}
                  />
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
            <RoundedImg
              src={`${process.env.REACT_APP_API_URL}/uploads/${currentUser.default_picture}`}
              alt="avatarOne"
            />
            <Gap>&nbsp;&nbsp;&nbsp;</Gap>
            <RoundedImg
              src={
                matchedProfile?.default_picture?.startsWith('https')
                  ? matchedProfile?.default_picture
                  : `${process.env.REACT_APP_API_URL}/uploads/${matchedProfile?.default_picture}`
              }
              alt="avatarTwo"
            />
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
