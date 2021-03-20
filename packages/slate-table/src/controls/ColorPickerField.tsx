import React, { useState, useCallback } from 'react';
import noop from 'lodash/noop';
import { SketchPicker } from 'react-color';

export const ColorPickerField = ({ label, initialValue = '#ffffff', onChange = noop, onBlur = noop }) => {
  const [value, setValue] = useState(initialValue);

  const handleChange = useCallback(
    event => {
      const newval = event.target.value;
      setValue(newval);
      onChange(newval);
    },
    [onChange]
  );

  const handleBlur = useCallback(
    event => {
      const newval = event.target.value;
      setValue(newval);
      onBlur(newval);
    },
    [onBlur]
  );

  return (
    <>
      {label && <div>{label}</div>}
      <input type="color" value={value} style={{ width: '100%' }} onChange={handleChange} onBlur={handleBlur} />
      {/* <SketchPicker color={value} onChangeComplete={color => onChange(color.hex)} /> */}
    </>
  );
};

export default React.memo(ColorPickerField);
