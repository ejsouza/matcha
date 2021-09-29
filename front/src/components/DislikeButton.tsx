import { Wrapper } from './LikeButton';

const DislikeButton = () => {
  const handleClick = () => {
    const changeColor = document.querySelector('#dislike-button');
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
        xmlns="http://www.w3.org/2000/svg"
        onClick={handleClick}
      >
        <g id="dislike-button">
          <g id="Group">
            <g id="cross-outer">
              <g id="cross-inner">
                <path
                  id="cross-vector"
                  d="M29.3626 24.8884L35.0262 19.2249C36.5901 17.661 36.5901 15.1252 35.0262 13.5613C33.4623 11.9974 30.9266 11.9974 29.3626 13.5613L23.6991 19.2249L18.0356 13.5614C16.4717 11.9975 13.9359 11.9975 12.372 13.5614C10.8081 15.1252 10.8081 17.661 12.372 19.2249L18.0356 24.8884L12.3721 30.5519C10.8082 32.1158 10.8082 34.6516 12.3721 36.2155C13.9359 37.7794 16.4717 37.7794 18.0356 36.2155L23.6991 30.5519L29.3626 36.2155C30.9265 37.7794 33.4623 37.7794 35.0262 36.2155C36.5901 34.6516 36.5901 32.1158 35.0262 30.5519L29.3626 24.8884Z"
                  fill="url(#paint0_linear_dislike)"
                />
              </g>
            </g>
            <path
              id="dislike-circle"
              d="M24 48C19.2533 48 14.6131 46.5924 10.6663 43.9553C6.71954 41.3181 3.6434 37.5698 1.8269 33.1844C0.0103989 28.799 -0.464881 23.9734 0.461164 19.3178C1.38721 14.6623 3.67299 10.3859 7.02945 7.02945C10.3859 3.67299 14.6623 1.38721 19.3178 0.461164C23.9734 -0.464881 28.799 0.0103989 33.1844 1.8269C37.5698 3.6434 41.3181 6.71954 43.9553 10.6663C46.5924 14.6131 48 19.2533 48 24C47.9927 30.363 45.4618 36.4632 40.9625 40.9625C36.4632 45.4618 30.363 47.9927 24 48ZM24 1.37144C19.5245 1.37144 15.1495 2.69858 11.4282 5.18504C7.707 7.6715 4.80664 11.2056 3.09394 15.3404C1.38123 19.4753 0.933112 24.0251 1.80624 28.4146C2.67937 32.8041 4.83453 36.8362 7.99919 40.0008C11.1639 43.1655 15.1959 45.3206 19.5854 46.1938C23.9749 47.0669 28.5248 46.6188 32.6596 44.9061C36.7944 43.1934 40.3285 40.293 42.815 36.5718C45.3014 32.8505 46.6286 28.4755 46.6286 24C46.6219 18.0006 44.2356 12.2488 39.9934 8.00661C35.7512 3.76438 29.9994 1.37815 24 1.37144Z"
              fill="url(#paint1_linear_dislike)"
            />
          </g>
        </g>
        <defs>
          <linearGradient
            id="paint0_linear_dislike"
            x1="23.6991"
            y1="12.3884"
            x2="23.6991"
            y2="37.3884"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0.0625" stopColor="#EF255C" />
            <stop offset="0.385417" stopColor="#F05249" />
            <stop offset="0.671875" stopColor="#F05249" stopOpacity="0.9" />
            <stop offset="0.90625" stopColor="#EF255C" stopOpacity="0.58" />
          </linearGradient>
          <linearGradient
            id="paint1_linear_dislike"
            x1="24"
            y1="0"
            x2="24"
            y2="48"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0.135417" stopColor="#EF255C" stopOpacity="0.92" />
            <stop offset="0.390625" stopColor="#F05249" stopOpacity="0.85" />
            <stop offset="0.682292" stopColor="#F05249" stopOpacity="0.88" />
            <stop offset="1" stopColor="#EF255C" stopOpacity="0.9" />
          </linearGradient>
        </defs>
      </svg>
    </Wrapper>
  );
};

export default DislikeButton;
