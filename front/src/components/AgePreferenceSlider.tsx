import { useState, useEffect, useRef } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { useRanger } from 'react-ranger';
import { useAppDispatch, useAppSelector } from 'store/hook';
import { userInfoUpdated } from 'store/actions';
import { UserInterface } from 'interfaces';
import { updateUserAgePreferences, getUser } from 'api/user';
import { CREATED, SUCCESS } from 'utils/const';

interface HandleProps {
  active: boolean;
}

interface SegmentProps {
  index: number;
}

export const SliderWrapper = styled.div`
  height: 70px;
  background-color: #fff;
`;

export const FlexSlider = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 40px;
`;

export const Title = styled.span`
  margin-left: 0.5em;
  color: var(--primary-gray-color);
`;

export const Track = styled.div`
  display: inline-block;
  height: 1px;
  width: 100%;
  margin: 0 4%;
`;

export const Tick = styled.div`
  display: none;
  :before {
    content: '';
    position: absolute;
    left: 0;
    background: rgba(0, 0, 0, 0.2);
    height: 5px;
    width: 2px;
    transform: translate(-50%, 0.7rem);
  }
`;

export const TickLabel = styled.div`
  display: none;
  position: absolute;
  font-size: 0.6rem;
  color: rgba(0, 0, 0, 0.5);
  top: 100%;
  transform: translate(-50%, 1.2rem);
  white-space: nowrap;
`;

const Segment = styled.div<SegmentProps>`
  background: ${(p) =>
    p.index === 0 ? '#ccd0d3' : p.index === 1 ? '#ff655b' : '#ccd0d3'};
  height: 100%;
`;

export const Handle = styled.div<HandleProps>`
  background: #fff;
  box-shadow: 0 0 1px 1px #ced4da;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.6rem;
  height: 1.6rem;
  border-radius: 100%;
  font-size: 0.7rem;
  white-space: nowrap;
  color: var(--primary-color);
  font-weight: ${(p) => (p.active ? 'bold' : 'normal')};
  transform: ${(p) =>
    p.active ? 'translateY(-100%) scale(1.3)' : 'translateY(0) scale(0.9)'};
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
`;

const AgePreferenceSlider = () => {
  const user: UserInterface = useAppSelector((state) => state.user);
  const [values, setValues] = useState([0, 0]);
  const minRef = useRef(0);
  const maxRef = useRef(0);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const agePreferencesValues: number[] = [user.age_preference_min];
    agePreferencesValues.push(user.age_preference_max);
    setValues(agePreferencesValues);
    minRef.current = user.age_preference_min;
    maxRef.current = user.age_preference_max;
  }, [user]);

  useEffect(() => {
    const [min, max] = values;
    if (min === 0 || max === 0) {
      return;
    }
    if (minRef.current >= 18 && maxRef.current >= 18) {
      if (min !== user.age_preference_min || max !== user.age_preference_max) {
        (async () => {
          const res = await updateUserAgePreferences(min, max);
          if (res.status === CREATED) {
            const response = await getUser();
            if (response.status === SUCCESS) {
              const user: UserInterface = await response.json();
              dispatch(userInfoUpdated(user));
              const agePreferencesValuesUpdated: number[] = [
                user.age_preference_min,
              ];
              agePreferencesValuesUpdated.push(user.age_preference_max);
              setValues(agePreferencesValuesUpdated);
            }
          }
        })();
      }
    }
  }, [values]);

  useEffect(() => {
    minRef.current = user.age_preference_min;
    maxRef.current = user.age_preference_max;
  }, []);

  const { getTrackProps, ticks, segments, handles } = useRanger({
    min: 18,
    max: 100,
    stepSize: 1,
    values,
    onChange: setValues,
  });

  return (
    <>
      <SliderWrapper>
        <Title>Age preference</Title>
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

export default AgePreferenceSlider;
