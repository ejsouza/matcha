import { useState, useEffect } from 'react';
import { VisitInterface } from './Notifications';
import Loading from './Loading';
import { getUserById, UpdateUserInfoInterface } from 'api/user';
import NotificationCard from './NotificationCard';

const VisitCard = (props: { visitors: VisitInterface[] }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState<UpdateUserInfoInterface[]>([]);

  useEffect(() => {
    (async () => {
      const usrs: UpdateUserInfoInterface[] = [];
      for (let i = 0; i < props.visitors.length; i++) {
        const res = await getUserById(props.visitors[i].visitor_id);
        const user: UpdateUserInfoInterface = await res.json();
        usrs.push(user);
      }
      setUsers(usrs);
      setIsLoading(false);
    })();
  }, []);

  return isLoading || !users.length ? (
    <Loading />
  ) : (
    <NotificationCard users={users} />
  );
};

export default VisitCard;
