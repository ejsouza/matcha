import styled from 'styled-components';
import { Row, Col } from 'react-bootstrap';
import 'index.css';

interface Props {
  title: string;
  link: string;
  value?: string;
  symbol?: string;
  setEvent?: () => void;
}

export const LinkTo = styled.a`
  text-decoration: none;
  color: #252932;
  :hover {
    color: red;
  }
`;

export const LinkWrapper = styled.div`
  padding: 1.2vh 1vh;
  background-color: #fff;
  :hover {
    color: red;
  }
`;

const UpdateLink = (props: Props) => {
  return (
    <>
      <LinkWrapper onClick={props.setEvent}>
        <LinkTo href={props.link}>
          <Col>
            <Row className="update-link">
              <Col md={4}>{props.title}</Col>
              <Col className="text-end">
                {props.value}
                <span>
                  &nbsp;&nbsp;
                  <svg
                    width="8"
                    height="8"
                    viewBox="0 0 24 24"
                    fill="#E0E5EC"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g id="arrow">
                      <g id="arrowChildOne">
                        <path
                          id="innerArrow"
                          d="M23.5259 11.0263L3.18713 0.46018C2.34463 0.0225213 1.20869 0.202633 0.649872 0.862383C0.090946 1.52213 0.321027 2.41187 1.16342 2.84953L19.2025 12.2211L1.16331 21.5926C0.320809 22.0303 0.0908373 22.9199 0.649763 23.5798C1.20869 24.2396 2.34452 24.4197 3.18702 23.982L23.5258 13.4157C24.0357 13.1507 24.3444 12.7003 24.3444 12.221C24.3444 11.7417 24.0359 11.2912 23.5259 11.0263Z"
                        />
                      </g>
                    </g>
                  </svg>
                </span>
              </Col>
            </Row>
          </Col>
        </LinkTo>
        {/* <Hr /> */}
      </LinkWrapper>
    </>
  );
};

export default UpdateLink;
