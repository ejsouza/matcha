import { useState, useEffect } from 'react';
import { Modal, Carousel } from 'react-bootstrap';
import styled from 'styled-components';
import Button from './Button';
import Loading from './Loading';
import { useAppSelector } from 'store/hook';
import { UserInterface } from 'interfaces';
import { getUserAllDetails, UpdateUserInfoInterface } from 'api/user';
import { visitUserProfile } from 'api/visit';
import { likeProfile, getLikesByUserId } from 'api/like';
import {
  ProfileWrapper,
  CarouselWrapper,
  ProfileInfo,
  TagsGridContainer,
  TagsItem,
  StyledTags,
  LikesInterface,
} from './InfoButton';
import { FlexBox, Gap } from 'globalStyled';
import {
  getUserCity,
  aHundredLengthBio,
  calculateAge,
  popularity,
  capitalize,
} from 'utils/user';
import location from 'assets/icons/location.svg';
import sexualOrientation from 'assets/icons/sexualOrientation.svg';
import gender from 'assets/icons/gender.svg';
import agePlus18 from 'assets/icons/age-plus-18.svg';
import userNameIcon from 'assets/icons/usernameicon.svg';
import userDescription from 'assets/icons/user-description.svg';
import tagIcon from 'assets/icons/tag-icon.svg';
import connected from 'assets/icons/online.svg';
import { CREATED, SUCCESS } from 'utils/const';
import MessageCard from './MessageCard';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import socket from 'socket/socket.io';
import { getUserIdFromLocalStorage } from 'utils/user';
import { getUserLikedBy } from 'api/user';

export const GridContainer = styled.div`
  display: grid;
  grid-template-columns: 30% auto;
  grid-template-rows: 35px 35px;
`;

export const GridItemPicture = styled.div`
  align-self: center;
  justify-self: left;
  // use this trick to hide cursor because it inherits from bootstrap
  cursor: none;
  z-index: 5;
`;

export const GridItem = styled.div`
  align-self: center;
  justify-self: right;
  color: var(--primary-gray-color);
  p:hover {
    color: var(--primary-color);
    text-decoration: underline;
    cursor: pointer;
  }
  z-index: 5;
`;

export const ImgContainer = styled.img`
  width: 50px;
  height: 50px;
  display: contain;
  border-radius: 50%;
  cursor: none;
`;

const ButtonWarapper = styled.div`
  width: 100%;
  position: absolute;
  bottom: 0;
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

interface MessageInterface {
  id: number;
  sender_id: number;
  receiver_id: number;
  message: string;
  seen: boolean;
  sent_at: Date;
}

interface TagsInterface {
  id: number;
  user_id?: number;
  name: string;
}

interface PicturesInterface {
  id: number;
  user_id: number;
  file_path: string;
}

export interface ProfileInterface {
  user: UpdateUserInfoInterface;
  messages: MessageInterface[];
  tags: TagsInterface[];
  likes: LikesInterface[];
  pictures: PicturesInterface[];
}

const LikesMe = (props: { users: UpdateUserInfoInterface[] }) => {
  const [profiles, setProfiles] = useState<ProfileInterface[]>([]);
  const [profile, setProfile] = useState<ProfileInterface>();
  const [show, setShow] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showMatch, setShowMatch] = useState(false);
  const [showMessageCard, setShowMessageCard] = useState(false);
  const [likesCurrentUser, setLikesCurrentUser] = useState(false);
  const currentUser: UserInterface = useAppSelector((state) => state.user);
  const [userCity, setUserCity] = useState('');
  const [birthDate, setBirthDate] = useState('');

  useEffect(() => {
    getLikedCurrentUser(props.users);
  }, []);

  const getLikedCurrentUser = async (users: UpdateUserInfoInterface[]) => {
    const usrs = (await Promise.all(
      users.map((user) => {
        return new Promise(async (resolve) => {
          /**
           * userId could be undefined and getUserAllDetails() expects a number
           * so we do this trick, in any case we will not find any user with
           * id 0 so the api will handle id=0 correctly.
           */
          const userId = user.id || 0;
          const res = await getUserAllDetails(userId);
          const data = await res.json();
          const usr: ProfileInterface = data.user;

          resolve(usr);
        });
      })
    )) as ProfileInterface[];
    setProfiles(usrs);
  };

  const handleClose = async () => {
    setShow(false);
    if (profile?.user.id) {
      const visited = await visitUserProfile(profile?.user.id, currentUser.id);
      if (visited.status === CREATED) {
        socket.emit('visit', profile.user.username);
      }
    }
  };

  const handleShowProfile = async (userId: number | undefined) => {
    const userProfile = profiles?.find((profile) => profile.user.id === userId);
    if (userProfile?.user && userProfile.user.id) {
      const alreadyLiked = userProfile.likes.find(
        (like) => like.liked_id === currentUser.id
      );

      if (alreadyLiked) {
        setLikesCurrentUser(true);
      }
      if (userProfile.user.birthdate === 'string') {
        setBirthDate(userProfile.user.birthdate);
      }
      const city = await getUserCity({
        longitude: userProfile.user.localisation?.x,
        latitude: userProfile.user.localisation?.y,
      });
      setUserCity(city);
      setProfile(userProfile);
      setShow(true);
    }
  };

  const handleShowMatch = () => {
    handleClose();
    setShowMatch(true);
  };

  const handleCloseShowMatch = () => {
    setShowMessageCard(false);
    setShowMatch(false);
  };

  const handleCloseSendMessage = () => {
    setShowMessageCard(true);
  };

  const handleLikeBack = async () => {
    if (profile) {
      const likeRes = await likeProfile(profile.user.id || 0);
      if (likeRes.status === CREATED) {
        const currentUserId = getUserIdFromLocalStorage() || 0;
        const res = await getLikesByUserId(currentUserId);
        if (res.status === SUCCESS) {
          const json = await res.json();
          const likes: LikesInterface[] = json.likes;
          const isMatch = likes.find(
            (like) => like.liked_id === profile.user.id
          );
          if (isMatch) {
            handleShowMatch();
            const res = await getUserLikedBy(currentUserId.toString());
            const json = await res.json();
            const usrs: UpdateUserInfoInterface[] = json.users;
            getLikedCurrentUser(usrs);
            /**
             * Here we sent the matched username to be notified.
             * The current user dosn't need to be notified as s/he
             * already saw the match.
             */
            socket.emit('match', profile.user.username);
          } else {
            /**
             * Emit event to inform currentUser s/he has a like
             */
            socket.emit('like', profile.user.username);
          }
        }
      }
    }
  };

  return profiles ? (
    <>
      {profiles?.map((profile) => (
        <GridContainer key={profile.user.id}>
          <GridItemPicture>
            <ImgContainer
              src={
                profile.user.default_picture?.startsWith('https')
                  ? profile.user.default_picture
                  : `${process.env.REACT_APP_API_URL}/uploads/${profile.user.default_picture}`
              }
              alt="user-picture"
            />
          </GridItemPicture>
          <GridItem onClick={() => handleShowProfile(profile.user.id)}>
            <p>
              {`${profile.user?.firstname} ${profile.user.lastname}`}
              &nbsp;&#10095;
            </p>
          </GridItem>
        </GridContainer>
      ))}
      {profile && (
        <Modal
          show={show}
          onHide={handleClose}
          backdrop="static"
          keyboard={false}
          size="lg"
          style={{ backgroundColor: '#252932' }}
        >
          <Modal.Header closeButton>
            <Modal.Title className="gray-one">
              {profile.user.username}'s profile
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <ProfileWrapper>
              <FlexBox flexWrap="wrap">
                <CarouselWrapper>
                  <Carousel>
                    <Carousel.Item>
                      {profile?.pictures?.map((picture) => (
                        <div key={picture.id}>
                          <img
                            className="d-block w-100"
                            src={
                              picture.file_path?.startsWith('https')
                                ? picture.file_path
                                : `${process.env.REACT_APP_API_URL}/uploads/${picture.file_path}`
                            }
                            alt="Profile picture"
                            width="300"
                            height="500"
                          />
                          <Carousel.Caption></Carousel.Caption>
                        </div>
                      ))}
                    </Carousel.Item>
                  </Carousel>
                </CarouselWrapper>
                <ProfileInfo>
                  <TagsGridContainer>
                    {/************  start user first and last name ************/}
                    <TagsItem marginBottom="8px">
                      <img src={userNameIcon} alt="username" />
                    </TagsItem>
                    <TagsItem>
                      {`${profile.user.firstname} ${profile.user.lastname}`}
                    </TagsItem>

                    {/************  end user first and last name ************/}

                    {/************  start birthdate ************/}
                    <TagsItem marginBottom="8px">
                      <img src={agePlus18} alt="age" />
                    </TagsItem>
                    <TagsItem>{calculateAge(birthDate)} years old</TagsItem>

                    {/************  end birthdate ************/}

                    {/************  start gender ************/}
                    <TagsItem marginBottom="8px">
                      <img src={gender} alt="gender" />
                    </TagsItem>
                    <TagsItem>
                      {profile.user.gender && capitalize(profile.user.gender)}
                    </TagsItem>
                    {/************  end gender ************/}

                    {/************  start sexual orientation ************/}
                    <TagsItem marginBottom="8px">
                      <img src={sexualOrientation} alt="sexualOrientation" />
                    </TagsItem>
                    <TagsItem>
                      {profile.user.sexual_orientation &&
                        capitalize(profile.user.sexual_orientation)}
                    </TagsItem>
                    {/************  start sexual orientation ************/}

                    {/************  start location ************/}
                    <TagsItem marginBottom="8px">
                      <img src={location} alt="location" />
                    </TagsItem>
                    <TagsItem>{capitalize(userCity)}</TagsItem>
                    {/************  end location ************/}

                    {/************  start score ************/}

                    <TagsItem marginBottom="8px">
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          id="score"
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M11.566 0.0972848C11.2338 0.279103 11.0816 0.49882 10.6481 1.42239C10.4172 1.9143 10.2093 2.32891 10.1862 2.34368C10.1631 2.3585 9.744 2.42978 9.2549 2.50212C8.76575 2.57442 8.25673 2.67529 8.12378 2.72631C7.72404 2.87961 7.40577 3.31982 7.40478 3.72087C7.40464 3.77796 7.43985 3.94195 7.48312 4.08528C7.55325 4.31792 7.6434 4.43079 8.32166 5.13528L9.08163 5.92465L8.92304 6.88446C8.83579 7.41238 8.7643 7.92241 8.76421 8.01789C8.76369 8.48536 9.10727 8.96969 9.52155 9.08552C9.8965 9.19033 10.1109 9.12366 11.0924 8.59692L12.0053 8.1071L12.5294 8.39532C13.6093 8.98917 13.8045 9.07974 14.0755 9.11273C14.5526 9.17089 15.0008 8.88038 15.1611 8.40912C15.2626 8.11084 15.2544 7.96847 15.0727 6.88237L14.9121 5.92134L15.6551 5.15797C16.1134 4.68715 16.4245 4.3275 16.4668 4.21953C16.6628 3.72019 16.6027 3.34601 16.2716 3.00312C15.9994 2.72121 15.8283 2.66601 14.706 2.49785C14.2364 2.42749 13.8336 2.35801 13.8109 2.34348C13.7882 2.32891 13.5816 1.91551 13.3518 1.42477C12.9155 0.493038 12.7634 0.275702 12.4213 0.0948068C12.1804 -0.0325436 11.8013 -0.0314747 11.566 0.0972848ZM12.3631 2.93383C12.7818 3.79467 12.8002 3.80954 13.6063 3.93607C13.9211 3.98548 14.2499 4.03932 14.337 4.05569L14.4954 4.08548L13.9553 4.65299C13.2591 5.38449 13.2648 5.36641 13.4252 6.34469C13.4915 6.74919 13.5458 7.0948 13.5458 7.11273C13.5458 7.13071 13.2374 6.98014 12.8605 6.77815C12.3633 6.51169 12.1269 6.41097 11.9987 6.41097C11.8706 6.41097 11.6342 6.51169 11.1369 6.77815C10.7601 6.98014 10.4517 7.13071 10.4517 7.11273C10.4517 7.0948 10.5059 6.74919 10.5723 6.34469C10.7327 5.36641 10.7384 5.38449 10.0422 4.65299L9.50205 4.08548L9.66046 4.05569C9.74756 4.03932 10.0768 3.98538 10.3921 3.93592C10.7241 3.88379 11.03 3.80736 11.1188 3.7543C11.2408 3.68132 11.3437 3.51704 11.6237 2.94802C11.8171 2.55494 11.9858 2.23323 11.9987 2.23304C12.0116 2.23289 12.1756 2.54823 12.3631 2.93383ZM5.92778 4.61616C5.71842 4.67986 5.45678 4.92577 5.346 5.16297C4.9937 5.91726 5.63197 6.81445 6.4272 6.68268C6.92764 6.59974 7.30793 6.14743 7.30924 5.63355C7.3099 5.39542 7.1476 4.98232 7.00012 4.84666C6.74293 4.61009 6.27699 4.50995 5.92778 4.61616ZM17.2727 4.67966C16.9971 4.81387 16.9127 4.90317 16.7841 5.19713C16.5045 5.83612 16.8931 6.57044 17.5703 6.68268C18.0021 6.7542 18.4301 6.52175 18.6293 6.10734C19.0765 5.17721 18.1828 4.23663 17.2727 4.67966ZM0.535138 7.57952C0.337679 7.63987 0.102061 7.89272 0.0385854 8.11234C-0.0646442 8.46947 0.0978417 8.86474 0.417375 9.03368C0.604098 9.13241 0.652619 9.13353 4.16618 9.12065C7.67837 9.10782 7.72755 9.10632 7.85525 9.00744C8.10517 8.81406 8.17802 8.66309 8.17802 8.33881C8.17802 8.10238 8.15486 8.00501 8.06884 7.88004C7.83125 7.53477 8.05135 7.55372 4.16979 7.54444C2.22638 7.53978 0.614177 7.55533 0.535138 7.57952ZM16.2882 7.60056C15.7056 7.81518 15.6235 8.60605 16.1422 9.00744C16.2703 9.10661 16.3086 9.10763 19.8897 9.10763H23.5078L23.6656 8.99097C23.8407 8.86153 23.9974 8.55241 23.999 8.33342C24.0005 8.11647 23.8339 7.80983 23.6409 7.67427L23.4678 7.5528L19.9718 7.54216C17.0502 7.53327 16.445 7.54289 16.2882 7.60056ZM1.59251 11.1048C0.519339 11.4037 -0.0447202 12.6935 0.432189 13.758C0.679012 14.3091 1.00225 14.6001 1.83995 15.0256C2.44034 15.3305 2.55379 15.4536 2.49842 15.7403C2.43645 16.0615 1.99085 16.048 1.36496 15.7058C1.07576 15.5477 0.914209 15.4889 0.769303 15.4889C0.133283 15.4889 -0.234021 16.2642 0.167646 16.759C0.233418 16.84 0.426517 16.987 0.596785 17.0857C1.95851 17.8749 3.32145 17.6442 3.84819 16.5353C3.97186 16.2749 3.999 16.1532 4.01818 15.7733C4.06965 14.7534 3.65551 14.1546 2.50095 13.5795C2.00557 13.3327 1.77891 13.1463 1.77891 12.9857C1.77891 12.9479 1.81112 12.8525 1.85045 12.7736C1.97009 12.5338 2.19689 12.5823 2.55955 12.9254C2.89718 13.2446 3.29913 13.2806 3.61862 13.0202C3.86511 12.8192 3.96591 12.3433 3.82273 12.0563C3.7218 11.8541 3.27583 11.4402 3.00641 11.2986C2.50635 11.036 2.05944 10.9747 1.59251 11.1048ZM6.56066 11.0589C5.51365 11.2271 4.77866 11.978 4.51323 13.1508C4.39279 13.6832 4.39425 14.9886 4.51581 15.4727C4.84434 16.7805 5.69324 17.5366 6.84194 17.5445C7.31993 17.5478 7.60229 17.4857 7.95843 17.299C8.44847 17.042 8.93794 16.4812 9.05468 16.043C9.1895 15.5369 8.68081 14.977 8.1858 15.0866C7.93753 15.1416 7.77673 15.2663 7.61232 15.5311C7.41861 15.8432 7.22945 15.9537 6.88882 15.9537C6.42874 15.9537 6.16678 15.7027 6.02093 15.1224C5.92792 14.7522 5.92938 13.8557 6.02361 13.4786C6.16115 12.9282 6.46864 12.6302 6.89867 12.6304C7.19818 12.6305 7.40103 12.7607 7.61804 13.0919C7.88741 13.5031 8.06176 13.6157 8.39203 13.5918C9.01464 13.5467 9.28889 12.9718 8.98314 12.3529C8.80645 11.9951 8.35063 11.5083 8.02275 11.3272C7.58452 11.0851 7.03059 10.9835 6.56066 11.0589ZM11.4596 11.079C10.6971 11.2116 10.1216 11.6639 9.77278 12.4046C9.56257 12.8509 9.47247 13.217 9.42409 13.8207C9.24459 16.0612 10.2112 17.5372 11.8637 17.5461C13.3329 17.5541 14.2558 16.4714 14.3743 14.6006C14.4293 13.7332 14.2381 12.7745 13.8927 12.185C13.3974 11.34 12.4459 10.9074 11.4596 11.079ZM15.5617 11.0814C15.4087 11.1447 15.2438 11.3065 15.147 11.4885C15.0782 11.6176 15.0677 11.9143 15.0547 14.0879C15.0466 15.4375 15.0532 16.6554 15.0695 16.7943C15.124 17.2611 15.43 17.5591 15.848 17.5526C16.2762 17.5458 16.5439 17.2718 16.5894 16.7936L16.6164 16.5089L17.1884 16.995C17.7995 17.5143 17.8697 17.554 18.1691 17.5495C18.5802 17.5435 18.8508 17.2621 18.8786 16.8121C18.901 16.4481 18.8225 16.3298 18.2127 15.8091C17.9406 15.5769 17.7193 15.3734 17.7207 15.3569C17.7222 15.3404 17.8745 15.2521 18.0592 15.1607C18.4858 14.9495 18.803 14.6239 18.9982 14.1968C19.1407 13.8851 19.1479 13.8412 19.1479 13.2862C19.1479 12.7525 19.1371 12.6792 19.0198 12.4196C18.7519 11.8269 18.3894 11.5154 17.6879 11.2748C17.0769 11.0653 15.867 10.9553 15.5617 11.0814ZM20.3434 11.0814C20.1904 11.1447 20.0256 11.3065 19.9287 11.4885C19.86 11.6176 19.8494 11.9143 19.8364 14.0879C19.8283 15.4375 19.835 16.6554 19.8512 16.7943C19.8862 17.0937 20.0241 17.3248 20.2497 17.4622C20.4027 17.5553 20.5018 17.5631 21.7263 17.5777C23.3274 17.5967 23.4801 17.5812 23.7048 17.3768C24.1042 17.0134 24.084 16.4332 23.6612 16.1206C23.5129 16.011 23.4723 16.0067 22.4412 15.9925L21.3747 15.9778V15.5478V15.1178L21.9959 15.1009C22.5535 15.0858 22.6325 15.0726 22.7675 14.9727C23.2797 14.5941 23.2535 13.8744 22.7177 13.6055C22.5485 13.5206 22.4278 13.5049 21.9459 13.5049H21.3747V13.0676V12.6303H22.3753C23.3293 12.6303 23.3853 12.6251 23.58 12.5184C23.8106 12.392 24 12.0821 24 11.8313C24 11.5661 23.8142 11.2586 23.5799 11.1362C23.3759 11.0296 23.3344 11.027 21.9156 11.0299C21.066 11.0317 20.4118 11.0532 20.3434 11.0814ZM12.2002 12.6959C12.4133 12.7882 12.6298 13.0622 12.7303 13.3668C12.852 13.7355 12.8531 14.8179 12.7322 15.2276C12.539 15.8824 11.922 16.1613 11.4233 15.8194C10.9836 15.5179 10.801 14.3457 11.0464 13.4006C11.2057 12.7873 11.7058 12.4819 12.2002 12.6959ZM17.3121 12.8162C17.5505 12.9255 17.6347 13.0532 17.6414 13.3153C17.6492 13.6256 17.351 13.8507 16.8391 13.921L16.593 13.9547V13.31V12.6653L16.8473 12.6925C16.9872 12.7075 17.1963 12.7631 17.3121 12.8162ZM0.372042 19.5906C0.105858 19.7784 0.0209117 19.9399 0.0209117 20.2587C0.0209117 20.5774 0.105858 20.739 0.372042 20.9268L0.527027 21.0361H11.9987H23.4704L23.6254 20.9268C23.8916 20.739 23.9766 20.5774 23.9766 20.2587C23.9766 19.9399 23.8916 19.7784 23.6254 19.5906L23.4704 19.4813H11.9987H0.527027L0.372042 19.5906ZM5.42345 22.5532C5.18469 22.6967 5.04058 23.0056 5.07307 23.3044C5.10026 23.5546 5.20954 23.7316 5.43508 23.8907L5.59006 24H11.9987H18.4074L18.5624 23.8907C18.7879 23.7316 18.8972 23.5546 18.9244 23.3044C18.9575 23.0003 18.8122 22.6939 18.5673 22.5513L18.3851 22.4452L11.9924 22.4463L5.59962 22.4474L5.42345 22.5532Z"
                          fill="url(#paint0_linear_4:17)"
                        />
                        <defs>
                          <linearGradient
                            id="paint0_linear_4:17"
                            x1="12"
                            y1="0"
                            x2="12"
                            y2="24"
                            gradientUnits="userSpaceOnUse"
                          >
                            <stop stopColor="#FD297B" stopOpacity="0.87" />
                            <stop
                              offset="0.963542"
                              stopColor="#FF655B"
                              stopOpacity="0.88"
                            />
                          </linearGradient>
                        </defs>
                      </svg>
                    </TagsItem>
                    <TagsItem>{popularity(profile.user.popularity)}</TagsItem>
                    {/************  end score ************/}

                    {/************  start last seen ************/}

                    {profile.user.is_connected ? (
                      <>
                        <TagsItem marginBottom="8px">
                          <img src={connected} alt="connected" />
                        </TagsItem>
                        <TagsItem>Online</TagsItem>
                      </>
                    ) : (
                      <>
                        <TagsItem marginBottom="8px">
                          <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              id="last-connection"
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M1.37463 0.0624668C0.836076 0.215557 0.445466 0.534318 0.189419 1.02961L0.0234185 1.35078L0.00447405 3.78632C-0.00837266 5.44098 0.0063092 6.28528 0.0502959 6.41969C0.189064 6.84369 0.707846 6.97638 1.0733 6.68133L1.26665 6.5253L1.28518 5.55842L1.30371 4.59159L7.56314 4.57703C14.607 4.56066 14.0653 4.59507 14.2112 4.15486C14.2758 3.96012 14.2708 3.91141 14.1692 3.74108C14.106 3.63488 13.9876 3.51766 13.9062 3.48062C13.79 3.42773 12.4169 3.41301 7.5272 3.41242L1.29625 3.41162V2.45534C1.29625 1.57298 1.3056 1.4883 1.41732 1.35983C1.48398 1.28328 1.63713 1.19587 1.75772 1.16558C2.06723 1.08785 22.021 1.08924 22.3306 1.16702C22.7349 1.26851 22.7859 1.41646 22.7861 2.48826L22.7864 3.41162L20.3443 3.41242C18.5005 3.41301 17.866 3.42971 17.7542 3.48062C17.6728 3.51766 17.5544 3.63488 17.4912 3.74108C17.3896 3.91141 17.3847 3.96012 17.4492 4.15486C17.587 4.57066 17.5174 4.56039 20.312 4.57859L22.7864 4.59465L22.7861 10.654C22.786 16.5679 22.7832 16.7175 22.6705 16.8846C22.4942 17.1459 22.2884 17.172 20.5307 17.1559L18.9759 17.1416L18.898 16.7134C18.4426 14.209 16.4011 12.223 13.6303 11.589C13.1785 11.4857 12.9573 11.4697 12.0117 11.4723C11.0212 11.4749 10.8611 11.4887 10.3367 11.6162C10.0177 11.6936 9.5185 11.8522 9.22717 11.9684C7.13795 12.802 5.53371 14.6525 5.20177 16.6117C5.1624 16.8443 5.12084 17.0647 5.10953 17.1015C5.08319 17.1867 2.09221 17.1967 1.75772 17.1127C1.63713 17.0824 1.48398 16.995 1.41732 16.9184C1.29862 16.7819 1.29625 16.7204 1.29613 13.7755C1.29607 10.3646 1.30916 10.4658 0.84987 10.3223C0.637633 10.2559 0.587016 10.2577 0.399644 10.3381C0.0103942 10.5051 0.0234185 10.3845 0.0234185 13.8177V16.9275L0.194215 17.2619C0.389757 17.6447 0.754378 17.9774 1.16743 18.15C1.42708 18.2585 1.5581 18.2674 3.27695 18.2925L5.10971 18.3192L5.18644 18.7669C5.47327 20.4397 6.65055 22.0433 8.29984 23.0076C11.3347 24.7822 15.4122 24.1165 17.5801 21.4924C18.2602 20.6694 18.7435 19.6503 18.8926 18.7251L18.9613 18.2992L20.7998 18.2824C22.5821 18.2662 22.6468 18.2619 22.9128 18.1422C23.3144 17.9615 23.6251 17.7 23.8243 17.3749L24 17.0881V9.13913V1.1902L23.8643 0.960295C23.655 0.605939 23.3415 0.324808 22.9735 0.161387L22.6384 0.0125786L12.1301 0.00240831C3.5964 -0.00583503 1.57538 0.00540578 1.37463 0.0624668ZM15.5868 3.46161C15.518 3.48806 15.4022 3.57798 15.3294 3.66143C15.2229 3.78348 15.2028 3.8597 15.2266 4.05219C15.2661 4.37186 15.4707 4.53571 15.8302 4.53571C16.1922 4.53571 16.3942 4.37224 16.4348 4.04646C16.4615 3.83192 16.4444 3.78064 16.2958 3.63157C16.1135 3.44866 15.8095 3.37575 15.5868 3.46161ZM4.22009 6.88988C3.88483 7.01235 3.73191 7.47457 3.93847 7.74114C4.18611 8.06086 4.75083 8.05514 4.96958 7.73075C5.03293 7.63687 5.08479 7.50465 5.0849 7.43694C5.08532 7.22989 4.91091 6.99383 4.69832 6.91349C4.47187 6.82795 4.39941 6.82436 4.22009 6.88988ZM8.00898 6.88988C7.67372 7.01235 7.52081 7.47457 7.72736 7.74114C7.975 8.06086 8.53972 8.05514 8.75847 7.73075C8.82182 7.63687 8.87368 7.50465 8.8738 7.43694C8.87421 7.22989 8.6998 6.99383 8.48721 6.91349C8.26077 6.82795 8.1883 6.82436 8.00898 6.88988ZM11.7979 6.88988C11.5905 6.96568 11.4197 7.20789 11.4197 7.42623C11.4197 8.01488 12.3046 8.20068 12.5841 7.67075C12.8301 7.2043 12.3211 6.69873 11.7979 6.88988ZM15.5232 6.9418C15.2922 7.06915 15.2086 7.20211 15.2086 7.44224C15.2086 7.82432 15.6604 8.09186 16.0542 7.94305C16.3154 7.84434 16.4518 7.66711 16.4518 7.42623C16.4518 7.20029 16.3308 7.02718 16.096 6.91739C15.8697 6.81168 15.75 6.81676 15.5232 6.9418ZM19.2935 6.95529C18.8759 7.21046 18.9293 7.76705 19.388 7.94037C19.9975 8.17065 20.5213 7.49518 20.0779 7.05052C19.8519 6.82383 19.5656 6.78903 19.2935 6.95529ZM4.27313 10.3008C4.05954 10.3382 3.84191 10.6163 3.84191 10.852C3.84191 11.1018 4.06066 11.3634 4.31096 11.4132C4.66978 11.4844 5.08514 11.1834 5.08514 10.852C5.08514 10.6547 4.90653 10.418 4.69832 10.3393C4.58755 10.2975 4.47608 10.2665 4.45062 10.2705C4.42516 10.2745 4.3453 10.2881 4.27313 10.3008ZM8.00839 10.3401C7.76253 10.4369 7.6308 10.6182 7.6308 10.8599C7.6308 11.1015 7.85352 11.3642 8.09986 11.4132C8.45868 11.4844 8.87403 11.1834 8.87403 10.852C8.87403 10.6547 8.69542 10.418 8.48721 10.3393C8.24585 10.2481 8.24224 10.2481 8.00839 10.3401ZM15.5862 10.3401C15.0503 10.551 15.0901 11.2195 15.6485 11.3861C16.0411 11.5033 16.4518 11.2302 16.4518 10.852C16.4518 10.6131 16.3158 10.434 16.0611 10.3378C15.824 10.2482 15.8197 10.2483 15.5862 10.3401ZM19.3713 10.3416C19.0139 10.4821 18.8919 10.9733 19.1501 11.2313C19.528 11.609 20.2407 11.3641 20.2407 10.8567C20.2407 10.6134 20.1061 10.4346 19.85 10.3378C19.6125 10.2481 19.609 10.2481 19.3713 10.3416ZM12.8215 12.6231C15.4242 12.9498 17.4445 14.8586 17.6888 17.2219C17.9496 19.7446 16.2006 22.022 13.4878 22.6923C13.0593 22.7981 12.8499 22.8154 12.0117 22.8146C11.1756 22.8137 10.9676 22.796 10.5675 22.6922C9.51293 22.4183 8.65463 21.9483 7.90988 21.2369C6.73343 20.1132 6.18878 18.6477 6.38763 17.1408C6.62947 15.3083 7.8161 13.8275 9.67349 13.0405C10.631 12.6348 11.7418 12.4875 12.8215 12.6231ZM4.27485 13.7517C3.84055 13.8569 3.68485 14.3894 4.00685 14.6683C4.22412 14.8565 4.48442 14.9011 4.72076 14.7906C4.91754 14.6986 5.08514 14.4628 5.08514 14.2778C5.08514 13.9203 4.67582 13.6545 4.27485 13.7517ZM11.7343 13.7912C11.6305 13.8496 11.5173 13.9453 11.4827 14.0038C11.4415 14.0733 11.4197 14.7743 11.4197 16.0252V17.9401L12.8691 19.2538L14.3186 20.5674H14.5908C14.8235 20.5674 14.8882 20.542 15.0358 20.3926C15.2292 20.1968 15.259 19.9789 15.1238 19.7484C15.0771 19.6689 14.5043 19.1224 13.8509 18.5338L12.6629 17.4638V15.8207C12.6629 14.9062 12.6378 14.1181 12.6064 14.0432C12.4844 13.7532 12.0331 13.6228 11.7343 13.7912ZM19.4098 13.763C18.9373 13.9011 18.868 14.4888 19.2935 14.7488C19.5656 14.915 19.8519 14.8802 20.0779 14.6536C20.5129 14.2173 20.0349 13.5802 19.4098 13.763Z"
                              fill="url(#paint0_linear_1:5)"
                            />
                            <defs>
                              <linearGradient
                                id="paint0_linear_1:5"
                                x1="12"
                                y1="0"
                                x2="12"
                                y2="24"
                                gradientUnits="userSpaceOnUse"
                              >
                                <stop stopColor="#FF655B" />
                                <stop
                                  offset="1"
                                  stopColor="#FD297B"
                                  stopOpacity="0.38"
                                />
                              </linearGradient>
                            </defs>
                          </svg>
                        </TagsItem>
                        <TagsItem>
                          Last seen&nbsp;
                          {formatDistanceToNow(
                            new Date(profile.user.updated_at!),
                            { addSuffix: true }
                          )}
                        </TagsItem>
                      </>
                    )}
                    {/************  end last seen ************/}

                    {/************  start liked you ************/}
                    {likesCurrentUser && (
                      <>
                        <TagsItem marginBottom="8px">
                          <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              id="liked"
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M5.74237 0.054479C1.99061 0.601239 -0.59084 4.35505 0.117043 8.2347C0.580494 10.7748 2.4035 13.9794 5.48348 17.6679C6.69777 19.1222 8.81303 21.4088 10.0851 22.6424C11.9354 24.4368 12.0058 24.4385 13.7761 22.7299C17.9723 18.6797 21.3482 14.3987 22.8374 11.239C24.2663 8.20714 24.368 6.0797 23.1981 3.68776C22.6991 2.66765 21.6522 1.51598 20.7439 0.988063C18.6356 -0.2373 16.3656 -0.324717 14.3322 0.74116C13.6106 1.11946 13.3591 1.30282 12.7239 1.91384C12.358 2.26584 12.1668 2.38638 11.9745 2.38638C11.7823 2.38638 11.5911 2.26584 11.2252 1.91384C10.5878 1.30066 10.3402 1.12062 9.59543 0.728505C8.48236 0.142524 6.96273 -0.123317 5.74237 0.054479ZM7.98853 0.87785C8.21953 0.929277 8.66228 1.07844 8.97242 1.20921C9.49045 1.42775 9.53622 1.46886 9.53622 1.71477C9.53622 1.95486 9.5097 1.98133 9.27956 1.97155C9.13839 1.96563 8.73415 1.84922 8.38123 1.71298C7.20613 1.25947 5.68736 1.31179 4.56736 1.84455C2.71278 2.72671 1.53204 4.42757 1.32525 6.5149C1.16886 8.09334 1.93321 10.2194 3.59537 12.8293C4.79699 14.716 6.09101 16.3612 8.3536 18.8787C9.43647 20.0835 9.57336 20.2695 9.4931 20.4269C9.44297 20.5252 9.33046 20.6057 9.2432 20.6057C9.15054 20.6057 8.52659 20.003 7.74427 19.1577C4.24713 15.3792 1.8515 11.7642 0.971737 8.93816C0.760416 8.25929 0.734066 8.04191 0.732355 6.96365C0.730558 5.86798 0.753144 5.68336 0.968144 5.03402C1.86468 2.32624 4.3533 0.545594 6.96957 0.739814C7.29896 0.764316 7.75745 0.826423 7.98853 0.87785ZM12.8885 4.14405C13.2137 4.35882 13.5121 4.8555 13.5632 5.26656C13.6001 5.56372 13.5469 5.88288 13.3496 6.54838C13.205 7.03572 13.0868 7.46993 13.0868 7.51319C13.0868 7.55645 14.0475 7.5919 15.2216 7.5919C16.5744 7.5919 17.4311 7.62763 17.5603 7.68928C17.8273 7.817 18.0489 8.2207 18.0489 8.57952C18.0489 8.92847 17.5733 9.47523 17.2661 9.47936C17.0883 9.48178 17.0824 9.49273 17.2148 9.5736C17.4057 9.69027 17.6213 10.1248 17.6208 10.3921C17.6203 10.7433 17.3185 11.1543 16.9734 11.2738C16.7128 11.364 16.6803 11.3993 16.7957 11.467C17.035 11.6075 17.2139 12.0713 17.1552 12.399C17.0918 12.7539 16.6731 13.1564 16.3675 13.1564H16.1536L16.4106 13.3832C16.7331 13.668 16.814 14.0277 16.6488 14.4426C16.4204 15.0162 16.2936 15.0413 13.6258 15.0403C11.2716 15.0395 11.2426 15.0372 10.7897 14.8159C10.4979 14.6735 10.1799 14.5924 9.91275 14.5924C9.53537 14.5924 9.49328 14.6126 9.49216 14.7944C9.48874 15.3122 9.22421 15.4002 7.67121 15.4002C6.46514 15.4002 6.3315 15.3841 6.12557 15.2141L5.90014 15.0282V11.4546C5.90014 8.07036 5.90878 7.86986 6.06363 7.66918C6.22379 7.4615 6.2563 7.45728 7.68002 7.45728C8.98876 7.45728 9.15088 7.47424 9.31327 7.62825C9.41602 7.72581 9.49345 7.9089 9.49345 8.05457C9.49345 8.37318 9.57763 8.37507 9.92952 8.06444C10.4189 7.63238 11.6752 5.39445 11.9703 4.42892C12.1291 3.90926 12.4042 3.82391 12.8885 4.14405ZM10.4866 21.1957C10.5539 21.4772 10.4362 21.6182 10.1673 21.5782C9.80213 21.5237 9.84687 20.9647 10.2164 20.9647C10.3759 20.9647 10.4455 21.0242 10.4866 21.1957Z"
                              fill="url(#paint0_linear_1:5)"
                            />
                            <defs>
                              <linearGradient
                                id="paint0_linear_1:5"
                                x1="10.5233"
                                y1="-1.07701"
                                x2="11.5588"
                                y2="30.7814"
                                gradientUnits="userSpaceOnUse"
                              >
                                <stop offset="0.0952381" stopColor="#FD297B" />
                                <stop
                                  offset="0.561129"
                                  stopColor="#FF655B"
                                  stopOpacity="0.59"
                                />
                              </linearGradient>
                            </defs>
                          </svg>
                        </TagsItem>
                        <TagsItem>Liked you</TagsItem>
                      </>
                    )}

                    {/************  end liked you ************/}

                    {/************  start biography ************/}
                    <TagsItem marginBottom="8px">
                      <img src={userDescription} alt="userDescription" />
                    </TagsItem>
                    <TagsItem>
                      {aHundredLengthBio(profile.user.biography)}
                    </TagsItem>
                    {/************  end biography ************/}

                    {/************  start tags ************/}
                    <TagsItem>
                      <img src={tagIcon} alt="tagIcon" width="28" height="18" />
                    </TagsItem>
                    <TagsItem marginBottom="14px">
                      {profile.tags?.map((tag) => (
                        <StyledTags key={tag.id}> #{tag.name}</StyledTags>
                      ))}
                    </TagsItem>
                    {/************  end tags ************/}
                  </TagsGridContainer>
                  x{' '}
                  <ButtonWarapper>
                    <Button text="Like back" callBack={handleLikeBack} />
                    <Button text="Not my type" />
                  </ButtonWarapper>
                </ProfileInfo>
              </FlexBox>
            </ProfileWrapper>
          </Modal.Body>
        </Modal>
      )}
      {/* Show match modal */}
      <Modal
        show={showMatch}
        backdrop="static"
        keyboard={false}
        className="modal-background-white"
      >
        <Modal.Body className="modal-background-dark">
          <TitleItsAMatch>It's a Match!</TitleItsAMatch>
          <StyledP>
            You and {profile?.user.firstname} have liked each other.
          </StyledP>
          <FlexBox alignItems="center" justifyContent="center">
            <RoundedImg
              src={`${process.env.REACT_APP_API_URL}/uploads/${currentUser.default_picture}`}
              alt="avatarOne"
            />
            <Gap>&nbsp;&nbsp;&nbsp;</Gap>
            <RoundedImg
              src={
                profile?.user.default_picture?.startsWith('https')
                  ? profile?.user.default_picture
                  : `${process.env.REACT_APP_API_URL}/uploads/${profile?.user.default_picture}`
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
            sendTo={profile?.user.id}
          />
        )}
      </Modal>
    </>
  ) : (
    <Loading />
  );
};

export default LikesMe;
