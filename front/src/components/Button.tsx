import styled from 'styled-components';

interface IButton {
  width: string;
  padding: string;
  margin: string;
  borderRadius: string;
}

const StyledButton = styled.button<IButton>`
  border: none;
  width: ${(p) => p.width};
  border-radius: ${(p) => p.borderRadius};
  padding: ${(p) => p.padding};
  letter-spacing: 0.02em;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: ${(p) => p.margin};
  cursor: pointer;
  color: white;
  background-color: red; /* For browsers that do not support gradients */
  background-image: linear-gradient(to right, #fd297b, #ff655b);
  :hover {
    color: white;
    background-color: red; /* For browsers that do not support gradients */
    background-image: linear-gradient(to right, #ff655b, #fd297b);
  }
`;

interface IProps {
  text: string;
  wid?: string;
  borderRadius?: string;
  margin?: string;
  padd?: string;
  callBack?: () => void;
}

const Button = ({
  text,
  wid,
  borderRadius,
  margin,
  padd,
  callBack,
}: IProps) => {
  return (
    <>
      <StyledButton
        margin={margin ? margin : '3vh 0 0 0'}
        padding={padd ? padd : '8px 8px'}
        width={wid ? wid : '100%'}
        borderRadius={borderRadius ? borderRadius : '4px'}
        onClick={callBack}
      >
        {text}
      </StyledButton>
    </>
  );
};

export default Button;
