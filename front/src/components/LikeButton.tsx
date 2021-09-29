import styled from 'styled-components';

export const Wrapper = styled.div`
  cursor: pointer;
`;

const LikeButton = () => {
  const handleClick = () => {
    const changeColor = document.querySelector('#like-button');
    changeColor?.setAttribute('transform', 'scale(0.6)');
    setTimeout(() => {
      changeColor?.setAttribute('transform', 'scale(1)');
      changeColor?.setAttribute('transition', 'all 1s');
      changeColor?.setAttribute('transform-origin', '50% 50%');
    }, 100);
  };
  return (
    <Wrapper>
      <svg
        width="48"
        height="48"
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        onClick={handleClick}
      >
        <g id="like-button">
          <path
            id="circle-vector"
            d="M24 48C19.2532 48 14.6131 46.5925 10.6664 43.9553C6.71954 41.3182 3.6434 37.5698 1.82691 33.1844C0.0103969 28.7989 -0.46488 23.9734 0.461163 19.3178C1.38721 14.6623 3.67298 10.3859 7.02944 7.02945C10.3859 3.67299 14.6623 1.38721 19.3178 0.461164C23.9734 -0.464881 28.799 0.0103993 33.1844 1.8269C37.5698 3.64341 41.3181 6.71954 43.9553 10.6663C46.5924 14.6131 48 19.2533 48 24.0001C47.9927 30.363 45.4618 36.4633 40.9625 40.9626C36.4633 45.4619 30.3629 47.9928 24 48ZM24 1.37144C19.5245 1.37144 15.1495 2.69858 11.4283 5.18505C7.707 7.6715 4.80664 11.2056 3.09393 15.3404C1.38124 19.4752 0.933113 24.0252 1.80624 28.4146C2.67938 32.8041 4.83453 36.8362 7.99919 40.0008C11.1639 43.1655 15.1959 45.3207 19.5854 46.1938C23.975 47.0669 28.5248 46.6188 32.6596 44.9061C36.7944 43.1933 40.3285 40.293 42.8149 36.5717C45.3014 32.8506 46.6286 28.4755 46.6286 24.0001C46.6219 18.0006 44.2356 12.2489 39.9934 8.00661C35.7512 3.76439 29.9994 1.37816 24 1.37144Z"
            fill="url(#paint0_linear_like)"
            fillOpacity="0.76"
          />
          <g id="heart">
            <path
              id="heart-vector"
              d="M36 18.9616C36 23.341 33.2073 28.4724 29.003 32.6467C27.3268 34.3128 25.4809 35.7731 23.5 37C16.7073 32.7151 11 25.1057 11 18.9616C10.9996 17.4048 11.4879 15.8928 12.3869 14.6673C13.2859 13.4418 14.5437 12.5737 15.9593 12.2017C17.3747 11.8296 18.8662 11.9752 20.195 12.6151C21.5239 13.2551 22.6135 14.3524 23.2896 15.7316C23.3659 15.8836 23.4359 16.0399 23.5 16.2005C23.6785 15.7612 23.8981 15.3423 24.1555 14.9502C24.9532 13.7418 26.0904 12.8362 27.4024 12.3643C28.7143 11.8925 30.1329 11.8791 31.4525 12.326C32.7721 12.773 33.9241 13.657 34.7418 14.8501C35.5594 16.0431 36.0001 17.4831 36 18.9616Z"
              fill="url(#paint1_linear_like)"
            />
          </g>
        </g>
        <defs>
          <linearGradient
            id="paint0_linear_like"
            x1="24"
            y1="4.46263e-07"
            x2="24"
            y2="48"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0.0625" stopColor="#0DFFE2" />
            <stop offset="0.135417" stopColor="#1FF7B6" />
            <stop offset="0.677083" stopColor="#1FEFB9" />
            <stop offset="0.84375" stopColor="#34F9E1" stopOpacity="0.78" />
          </linearGradient>
          <linearGradient
            id="paint1_linear_like"
            x1="23.5"
            y1="12"
            x2="23.5"
            y2="37"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0.270833" stopColor="#1FF7B6" />
            <stop offset="0.536458" stopColor="#34F9E1" stopOpacity="0.78" />
            <stop offset="1" stopColor="#76EECA" />
          </linearGradient>
        </defs>
      </svg>
    </Wrapper>
  );
};

export default LikeButton;
