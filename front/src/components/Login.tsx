import styled from 'styled-components';
import { useAppSelector, useAppDispatch } from 'store/hook';
import { showLoginCardUpdated } from 'store/actions';

const LoginButton = styled.button`
  border: none;
  aria-disabled="true";
  border-radius: 4px;
  color: #fd546c;
  padding: 4px 14px;
  letter-spacing: 0.02em;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 0px;
  cursor: pointer;
  :hover {
    color: white;
    background-color: red; /* For browsers that do not support gradients */
    background-image: linear-gradient(to right, #fd297b, #ff655b);
  }
`;

const Login = () => {
  const showLoginCard = useAppSelector((state) => state.showLoginCard);
  const showSignupCard = useAppSelector((state) => state.showSignupCard);
  const dispatch = useAppDispatch();
  console.log(`testing redux ${showLoginCard} - ${showSignupCard}`);
  const handleClick = () => {
    dispatch(showLoginCardUpdated(true));
  };
  return (
    <>
      <LoginButton disabled={showSignupCard} onClick={handleClick}>
        LOG IN
      </LoginButton>
    </>
  );
};

export default Login;
