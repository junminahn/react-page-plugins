import React from 'react';
import styled from 'styled-components';

interface Props {
  height?: string;
  width?: string;
}

const Spacer = styled.div`
  ${(props: Props) => {
    let style = '';
    if (props.height) style += `height:${props.height}`;
    if (props.width) style += `width:${props.width}`;
    return style;
  }}
`;

export default Spacer;
