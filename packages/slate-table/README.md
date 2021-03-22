# @react-page-plugins/slate-table

[ReactPage](https://github.com/react-page/react-page) plugin for slate table

## Installation

```sh
$ npm install @react-page-plugins/slate-table
```

```sh
$ yarn add @react-page-plugins/slate-table
```

## Usage

```js
import React, { useState } from 'react';
import Editor, { ValueWithLegacy } from '@react-page/editor';
import table from '@react-page-plugins/slate-table';

import '@react-page/editor/lib/index.css';
import '@react-page-plugins/slate-table/index.css';

const cellPlugins = [table()];

export default function ExamplePage() {
  const [value, setValue] = useState<ValueWithLegacy>({} as ValueWithLegacy);

  const handleChange = (val: any) => {
    setValue(val);
  };

  return (
    <Editor cellPlugins={cellPlugins} value={value} onChange={handleChange} />
  );
}
```
