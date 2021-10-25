import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { VisitInterface } from './Notifications';
import Loading from './Loading';
import { getUserById, UpdateUserInfoInterface } from 'api/user';

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: 30% auto;
  grid-template-rows: 35px 35px;
`;

const GridItemPicture = styled.div`
  align-self: center;
  justify-self: left;
  // use this trick to hide cursor because it inherits from bootstrap
  cursor: none;
  z-index: 1024;
`;

const GridItem = styled.div`
  align-self: center;
  justify-self: right;
  color: var(--primary-gray-color);
  p:hover {
    color: var(--primary-color);
    text-decoration: underline;
    cursor: pointer;
  }
`;

const ImgContainer = styled.img`
  width: 50px;
  height: 50px;
  display: contain;
  border-radius: 50%;
  cursor: none;
`;

const NotificationCard = (props: { users: UpdateUserInfoInterface[] }) => {
  return (
    <>
      {props.users.map((user) => (
        <GridContainer key={user.id}>
          <GridItemPicture>
            <ImgContainer src={user.default_picture} alt="user-picture" />
          </GridItemPicture>
          <GridItem>
            <p>{`${user?.firstname} ${user.lastname}`}&nbsp;&#10095;</p>
          </GridItem>
        </GridContainer>
      ))}
    </>
  );
};

export default NotificationCard;
