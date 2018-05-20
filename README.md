# sqip.macro

[![Build Status](https://travis-ci.org/stereobooster/sqip.macro.svg?branch=master)](https://travis-ci.org/stereobooster/sqip.macro) [![Babel Macro](https://img.shields.io/badge/babel--macro-%F0%9F%8E%A3-f5da55.svg?style=flat-square)](https://github.com/kentcdodds/babel-plugin-macros)

> Webpack [`sqip-loader`](https://github.com/EmilTholin/sqip-loader) implemented as [`babel-plugin-macros`](https://github.com/kentcdodds/babel-plugin-macros)

## Usage

Similar to nodejs `require` call:

```js
import sqip from "sqip.macro";

const preview = sqip("./image.jpg");
```

### Example of usage in create-react-app

```js
import coverImage from "./cover-image.jpg";
import sqip from "sqip.macro";
const coversqip = sqip("./cover-image.jpg");

const SomeComponent = () => (
  <div
    style={{
      backgroundImage: `url(${coversqip}`,
      backgroundSize: "cover",
      backgroundRepeat: "no-repeat",
    }}
  >
    <img src={coverImage} alt="" width="100%" height="100%" />
  </div>
);
```

## Credits

Based on [pveyes/raw.macro](https://github.com/pveyes/raw.macro).

## License

MIT
