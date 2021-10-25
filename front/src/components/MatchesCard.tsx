import NotificationCard from './NotificationCard';
import { UpdateUserInfoInterface } from 'api/user';

const MatchesCard = (props: { matches: UpdateUserInfoInterface[] }) => {
  return <NotificationCard users={props.matches} />;
};

export default MatchesCard;
