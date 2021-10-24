import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { VisitInterface } from './Notifications';
import Loading from './Loading';
import { getUserById, UpdateUserInfoInterface } from 'api/user';

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: 30% auto;
  grid-template-rows: 70px 70px;
`;

const GridItemPicture = styled.div`
  align-self: center;
  justify-self: left;
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
`;

const VisitCard = (props: { visitors: VisitInterface[] }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState<UpdateUserInfoInterface[]>([]);

  useEffect(() => {
    (async () => {
      const usrs: UpdateUserInfoInterface[] = [];
      for (let i = 0; i < props.visitors.length; i++) {
        const res = await getUserById(props.visitors[i].visitor_id);
        const user: UpdateUserInfoInterface = await res.json();
        console.log(user.firstname);
        usrs.push(user);
      }
      setUsers(usrs);
      setIsLoading(false);
    })();
  }, []);

  return isLoading || !users.length ? (
    <Loading />
  ) : (
    <>
      <GridContainer>
        {users.map((user) => (
          <>
            <GridItemPicture key={user.default_picture}>
              <ImgContainer src={user.default_picture} alt="user-picture" />
            </GridItemPicture>
            <GridItem key={user.id}>
              <p>{`${user?.firstname} ${user.lastname}`}&nbsp;&#10095;</p>
            </GridItem>
          </>
        ))}
      </GridContainer>
    </>
  );
};

export default VisitCard;
