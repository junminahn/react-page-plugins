import React, { useState } from 'react';
import { Container } from 'semantic-ui-react';
import throttle from 'lodash/throttle';
import noop from 'lodash/noop';
import styled from 'styled-components';
import Editor, { ValueWithLegacy } from '@react-page/editor';
import { cellPlugins } from 'pagePlugins/cellPlugins';

import '@react-page/editor/lib/index.css';

const PaddedContainer = styled(Container)`
  padding-top: 1rem;
  padding-bottom: 1rem;

  .react-page-cell-inner-leaf {
    padding: 20px;

    & p {
      margin: 0 0 20px;
    }
  }
`;

const PaddedContainerReadOnly = styled(Container)``;

export default function ReactPage({ initialValue = {}, onChange = noop, readOnly = false }) {
  const [value, setValue] = useState<ValueWithLegacy>(initialValue as ValueWithLegacy);

  const throttleUpdate = throttle(
    val => {
      onChange(val);
    },
    3000,
    { trailing: true }
  );

  const handleChange = (val: any) => {
    setValue(val);
    throttleUpdate(val);
  };

  const MainContainer = readOnly ? PaddedContainerReadOnly : PaddedContainer;

  return (
    <MainContainer>
      <Editor cellPlugins={cellPlugins} value={value} onChange={handleChange} readOnly={readOnly} />
    </MainContainer>
  );
}
