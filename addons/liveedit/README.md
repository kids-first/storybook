# Storybook Live Edit Addon

This addon is used to live edit the stories source in the addon panel. 

[Framework Support](https://github.com/storybooks/storybook/blob/master/ADDONS_SUPPORT.md)

![Live Edit Demo](demo.gif)

## Getting Started

First, install the addon

```sh
npm install -D @storybook/addon-liveedit
```

Add this line to your `addons.js` file

```js
import '@storybook/addon-liveedit/register';
```

Use this hook to a custom webpack.config. This will generate a decorator call in every story:

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.stories\.jsx?$/,
        loaders: [require.resolve('@storybook/addon-liveedit/loader')],
        enforce: 'pre',
      },
    ],
  },
};
```


### prettierConfig

The prettier configuration that will be used to format the live edition in the addon panel.

Defaults:
```js
{
  printWidth: 120,
  tabWidth: 2,
  bracketSpacing: true,
  trailingComma: 'es5',
  singleQuote: true,
}
```

Usage: 

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.stories\.jsx?$/,
        loaders: [
          {
            loader: require.resolve('@storybook/addon-liveedit/loader'),
            options: {
              prettierConfig: {
                printWidth: 80,
                singleQuote: false,
              }
            }
          }
        ],
        enforce: 'pre',
      },
    ],
  },
};
```

