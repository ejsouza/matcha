import { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useRanger } from 'react-ranger';
import { useAppDispatch, useAppSelector } from 'store/hook';
import { userInfoUpdated } from 'store/actions';
import { UserInterface } from 'interfaces';
import { updateUserDistancePreferences, getUser } from 'api/user';
import { CREATED, SUCCESS } from 'utils/const';
import {
  SliderWrapper,
  FlexSlider,
  Title,
  Track,
  Tick,
  TickLabel,
  Handle,
} from './AgePreferenceSlider';

interface SegmentProps {
  index: number;
}

const Segment = styled.div<SegmentProps>`
  background: ${(p) => (p.index === 0 ? '#ff655b' : '#ccd0d3')};
  height: 100%;
`;

const DistancePreference = () => {
  const user: UserInterface = useAppSelector((state) => state.user);
  const [values, setValues] = useState([0]);
  const distanceRef = useRef(0);
  const dispatch = useAppDispatch();

  const { getTrackProps, ticks, segments, handles } = useRanger({
    values,
    onChange: setValues,
    min: 5,
    max: 999,
    stepSize: 5,
  });

  useEffect(() => {
    const distancePreferencesValues = [user.distance_preference];
    setValues(distancePreferencesValues);
    distanceRef.current = user.distance_preference;
  }, [user]);

  useEffect(() => {
    /**
     * Check for the value of 100 is done here because
     * 100 is the default value set when user is created.
     */
    if (distanceRef.current > 0 && values[0] !== 100) {
      console.log(`Distance changed ${values[0]} - ${distanceRef.current}`);
      (async () => {
        const res = await updateUserDistancePreferences(values[0]);
        if (res.status === CREATED) {
          const response = await getUser();
          if (response.status === SUCCESS) {
            const user: UserInterface = await response.json();
            const userDistanceUpdated = [user.distance_preference];
            setValues(userDistanceUpdated);

            dispatch(userInfoUpdated(user));
          }
        } else {
          console.log(`SOMETHING WENT WRONG ${res.status}`);
        }
      })();
    }
  }, []);

  useEffect(() => {
    console.log(`changed ${values[0]}`);
  }, [values]);

  return (
    <>
      <SliderWrapper>
        <Title>Distance preference</Title>
        <Title>km</Title>
        <FlexSlider>
          <Track {...getTrackProps()}>
            {ticks.map(({ value, getTickProps }) => (
              <Tick {...getTickProps()}>
                <TickLabel>{value}</TickLabel>
              </Tick>
            ))}
            {segments.map(({ getSegmentProps }, i) => (
              <Segment {...getSegmentProps()} index={i} />
            ))}
            {handles.map(({ value, active, getHandleProps }) => (
              <button
                {...getHandleProps({
                  style: {
                    appearance: 'none',
                    border: 'none',
                    background: 'transparent',
                    outline: 'none',
                  },
                })}
              >
                <Handle active={active}>{value}</Handle>
              </button>
            ))}
          </Track>
        </FlexSlider>
      </SliderWrapper>
    </>
  );
};

export default DistancePreference;
