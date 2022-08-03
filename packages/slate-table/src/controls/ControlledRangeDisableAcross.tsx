import React, { useState, useCallback } from 'react';
import Slider, { Range } from 'rc-slider';

const ControlledRangeDisableAcross = ({ initialValue = [], onChange }) => {
  const [value, setValue] = useState(initialValue);

  const handleChange = useCallback(
    value => {
      setValue(value);
      onChange(value);
    },
    [onChange]
  );

  // @ts-ignore
  // https://github.com/react-component/slider/blob/b95928199b109403e2817bc24021ce4c884c6376/src/Range.tsx#L21
  return <Range value={value} onChange={handleChange} allowCross={false} pushable={value.length} />;
};

export default React.memo(ControlledRangeDisableAcross);
