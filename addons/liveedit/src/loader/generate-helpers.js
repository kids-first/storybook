import prettier from 'prettier';
import { splitSTORYOF, findAddsMap } from './traverse-helpers';
import getParser from './parsers';

function prettifyCode(source, { prettierConfig, parser, filepath }) {
  let config = prettierConfig;

  if (!config.parser) {
    if (parser) {
      config = {
        ...prettierConfig,
        parser: parser === 'javascript' ? 'babylon' : parser,
      };
    } else if (filepath) {
      config = {
        ...prettierConfig,
        filepath,
      };
    } else {
      config = {
        ...prettierConfig,
        parser: 'babylon',
      };
    }
  }

  return prettier.format(source, config);
}

export function generateSourceWithDecorators(source, decorator, parserType) {
  const parser = getParser(parserType);
  const ast = parser.parse(source);

  const { comments = [] } = ast;

  const parts = splitSTORYOF(ast, source);

  const newSource = parts.join(decorator);

  return {
    changed: parts.length > 1,
    source: newSource,
    comments,
  };
}

export function generateSourceWithoutDecorators(source, parserType) {
  const parser = getParser(parserType);
  const ast = parser.parse(source);

  const { comments = [] } = ast;

  return {
    changed: true,
    source,
    comments,
  };
}

export function generateAddsMap(source, parserType) {
  const parser = getParser(parserType);
  const ast = parser.parse(source);

  return findAddsMap(ast);
}

export function generateStorySource({ source, ...options }) {
  let storySource = source;

  storySource = prettifyCode(storySource, options);

  return storySource;
}
