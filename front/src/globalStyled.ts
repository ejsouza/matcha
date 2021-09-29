import styled from 'styled-components';

interface IFlexBox {
  alignItems?: string;
  justifyContent?: string;
  flexWrap?: string;
  gap?: string;
}

interface IFlexItem {
  marginLeft?: string;
  alignItems?: string;
  alignSelf?: string;
}

interface IGap {
  top?: string;
  right?: string;
  bottom?: string;
  left?: string;
}

const FlexBox = styled.div<IFlexBox>`
  width: 100%;
  display: flex;
  flex-wrap: ${(p) => (p.flexWrap ? p.flexWrap : '')};
  align-items: ${(p) => (p.alignItems ? p.alignItems : '')};
  justify-content: ${(p) => (p.alignItems ? p.alignItems : '')};
  gap: ${(p) => (p.gap ? p.gap : '')};
`;

const FlexItem = styled.div<IFlexItem>`
  width: 100%;
  margin-left: ${(p) => (p.marginLeft ? p.marginLeft : '')};
  align-items: ${(p) => (p.alignItems ? p.alignItems : '')};
  align-self: ${(p) => (p.alignSelf ? p.alignSelf : '')};
`;

const Gap = styled.div<IGap>`
  margin-top: ${(p) => (p.top ? p.top : '0')}
  margin-right: ${(p) => (p.right ? p.right : '0')}
  margin-bottom: ${(p) => (p.bottom ? p.bottom : '0')}
  margin-left: ${(p) => (p.left ? p.left : '0')}
`;

export { FlexBox, FlexItem, Gap };
