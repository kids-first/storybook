/* eslint no-underscore-dangle: 0 */
/* eslint-ignore jsx-a11y/label-has-associated-control prefer-destructuring no-undef   */
import React, { Component, createElement } from 'react';
import ReactDOMServer from 'react-dom/server';
import { polyfill } from 'react-lifecycles-compat';
import PropTypes from 'prop-types';
import global from 'global';
import { baseFonts } from '@storybook/components';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { mapKeys } from 'lodash';
import marksy from 'marksy';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/styles/hljs';

import Node from './Node';
import { Pre } from './markdown';

global.STORYBOOK_REACT_CLASSES = global.STORYBOOK_REACT_CLASSES || [];
const { STORYBOOK_REACT_CLASSES } = global;

const getName = type => type.displayName || type.name;

const stylesheetBase = {
  button: {
    base: {
      fontFamily: 'sans-serif',
      fontSize: '12px',
      display: 'block',
      position: 'fixed',
      border: 'none',
      background: '#28c',
      color: '#fff',
      padding: '5px 15px',
      cursor: 'pointer',
    },
    topRight: {
      top: 0,
      right: 0,
      borderRadius: '0 0 0 5px',
    },
  },
  info: {
    position: 'fixed',
    background: 'white',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    padding: '0 40px',
    overflow: 'auto',
    zIndex: 99999,
  },
  children: {
    position: 'relative',
    zIndex: 0,
  },
  infoBody: {
    ...baseFonts,
    fontWeight: 300,
    lineHeight: 1.45,
    fontSize: '15px',
    border: '1px solid #eee',
    padding: '20px 40px 40px',
    borderRadius: '2px',
    backgroundColor: '#fff',
    marginTop: '20px',
    marginBottom: '20px',
  },
  infoContent: {
    marginBottom: 0,
  },
  infoStory: {},
  jsxInfoContent: {
    borderTop: '1px solid #eee',
    margin: '20px 0 0 0',
  },
  header: {
    h1: {
      margin: 0,
      padding: 0,
      fontSize: '35px',
    },
    h2: {
      margin: '0 0 10px 0',
      padding: 0,
      fontWeight: 400,
      fontSize: '22px',
    },
    body: {
      borderBottom: '1px solid #eee',
      paddingTop: 10,
      marginBottom: 10,
    },
  },
  source: {
    h1: {
      margin: '20px 0 0 0',
      padding: '0 0 5px 0',
      fontSize: '25px',
      borderBottom: '1px solid #EEE',
    },
  },
  propTableHead: {
    margin: '20px 0 0 0',
  },
};

class Story extends Component {
  constructor(props, ...args) {
    super(props, ...args);
    this.state = {
      open: false,
    };
    this.marksy = marksy({
      createElement,
      elements: props.components,
    });
  }

  componentDidMount() {
    // TODO: better way to add stylesheets into preview area
    this._appendStylesheet(
      'reactTabs',
      `.react-tabs{-webkit-tap-highlight-color:transparent; width: 100%;}.react-tabs__tab-list{border-bottom:1px solid #aaa;margin:0 0 10px;padding:0}.react-tabs__tab{display:inline-block;border:1px solid transparent;border-bottom:none;bottom:-1px;position:relative;list-style:none;padding:6px 12px;cursor:pointer}.react-tabs__tab--selected{background:#fff;border-color:#aaa;color:#000;border-radius:5px 5px 0 0}.react-tabs__tab--disabled{color:GrayText;cursor:default}.react-tabs__tab:focus{box-shadow:0 0 5px #0187fd;border-color:#0187fd;outline:0}.react-tabs__tab:focus:after{content:"";position:absolute;height:5px;left:-4px;right:-4px;bottom:-5px;background:#fff}.react-tabs__tab-panel{display:none}.react-tabs__tab-panel--selected{display:block}`
    );
    this._appendStylesheet(
      'prismjs',
      `code[class*=language-],pre[class*=language-]{color:#000;background:0 0;text-shadow:0 1px #fff;font-family:Consolas,Monaco,'Andale Mono','Ubuntu Mono',monospace;text-align:left;white-space:pre;word-spacing:normal;word-break:normal;word-wrap:normal;line-height:1.5;-moz-tab-size:4;-o-tab-size:4;tab-size:4;-webkit-hyphens:none;-moz-hyphens:none;-ms-hyphens:none;hyphens:none}code[class*=language-] ::-moz-selection,code[class*=language-]::-moz-selection,pre[class*=language-] ::-moz-selection,pre[class*=language-]::-moz-selection{text-shadow:none;background:#b3d4fc}code[class*=language-] ::selection,code[class*=language-]::selection,pre[class*=language-] ::selection,pre[class*=language-]::selection{text-shadow:none;background:#b3d4fc}@media print{code[class*=language-],pre[class*=language-]{text-shadow:none}}pre[class*=language-]{padding:1em;margin:.5em 0;overflow:auto}:not(pre)>code[class*=language-],pre[class*=language-]{background:#f5f2f0}:not(pre)>code[class*=language-]{padding:.1em;border-radius:.3em;white-space:normal}.token.cdata,.token.comment,.token.doctype,.token.prolog{color:#708090}.token.punctuation{color:#999}.namespace{opacity:.7}.token.boolean,.token.constant,.token.deleted,.token.number,.token.property,.token.symbol,.token.tag{color:#905}.token.attr-name,.token.builtin,.token.char,.token.inserted,.token.selector,.token.string{color:#690}.language-css .token.string,.style .token.string,.token.entity,.token.operator,.token.url{color:#9a6e3a;background:hsla(0,0%,100%,.5)}.token.atrule,.token.attr-value,.token.keyword{color:#07a}.token.class-name,.token.function{color:#DD4A68}.token.important,.token.regex,.token.variable{color:#e90}.token.bold,.token.important{font-weight:700}.token.italic{font-style:italic}.token.entity{cursor:help}`
    );
  }

  _appendStylesheet(title, miniCss) {
    if (!miniCss) return;
    /* eslint-disable prefer-destructuring, no-undef */
    const head = window.document.head;
    const link = window.document.createElement('style');
    link.title = title;
    link.type = 'text/css';
    link.rel = 'stylesheet';
    link.innerText = miniCss;

    head.appendChild(link);
  }

  _renderStory() {
    const { stylesheet } = this.state;
    const { children } = this.props;

    return <div style={stylesheet.infoStory}>{children}</div>;
  }

  _renderInline() {
    const { stylesheet } = this.state;

    return (
      <div>
        {this._renderInlineHeader()}
        {this._renderStory()}
        <div style={stylesheet.infoPage}>
          <div style={stylesheet.infoBody}>
            {this._getInfoContent()}
            {this._getComponentDescription()}
            {this._getSourceCode()}
            {this._getPropTables()}
          </div>
        </div>
      </div>
    );
  }

  _renderInlineHeader() {
    const { stylesheet } = this.state;

    const infoHeader = this._getInfoHeader();

    return (
      infoHeader && (
        <div style={stylesheet.infoPage}>
          <div style={stylesheet.infoBody}>{infoHeader}</div>
        </div>
      )
    );
  }

  _renderOverlay() {
    const { stylesheet, open } = this.state;
    const { children } = this.props;

    const buttonStyle = {
      ...stylesheet.button.base,
      ...stylesheet.button.topRight,
    };

    const infoStyle = Object.assign({}, stylesheet.info);
    if (!open) {
      infoStyle.display = 'none';
    }

    const openOverlay = () => {
      this.setState({ open: true });
      return false;
    };

    const closeOverlay = () => {
      this.setState({ open: false });
      return false;
    };

    return (
      <div>
        <div style={stylesheet.children}>{children}</div>
        <button type="button" style={buttonStyle} onClick={openOverlay}>
          Show Info
        </button>
        <div style={infoStyle}>
          <button type="button" style={buttonStyle} onClick={closeOverlay}>
            ×
          </button>
          <div style={stylesheet.infoPage}>
            <div style={stylesheet.infoBody}>
              {this._getInfoHeader()}
              {this._getInfoContent()}
              {this._getComponentDescription()}
              {this._getSourceCode()}
              {this._getPropTables()}
            </div>
          </div>
        </div>
      </div>
    );
  }

  _getInfoHeader() {
    const { stylesheet } = this.state;
    const { context, showHeader } = this.props;

    if (!context || !showHeader) {
      return null;
    }

    return (
      <div style={stylesheet.header.body}>
        <h1 style={stylesheet.header.h1}>{context.kind}</h1>
        <h2 style={stylesheet.header.h2}>{context.story}</h2>
      </div>
    );
  }

  _getInfoContent() {
    const { info, showInline } = this.props;
    const { stylesheet } = this.state;

    if (!info) {
      return '';
    }

    if (React.isValidElement(info)) {
      return (
        <div style={showInline ? stylesheet.jsxInfoContent : stylesheet.infoContent}>{info}</div>
      );
    }

    const lines = info.split('\n');
    while (lines[0].trim() === '') {
      lines.shift();
    }
    let padding = 0;
    const matches = lines[0].match(/^ */);
    if (matches) {
      padding = matches[0].length;
    }
    const source = lines.map(s => s.slice(padding)).join('\n');
    return <div style={stylesheet.infoContent}>{this.marksy(source).tree}</div>;
  }

  _getComponentDescription() {
    const { context } = this.props;
    let retDiv = null;

    if (Object.keys(STORYBOOK_REACT_CLASSES).length) {
      Object.keys(STORYBOOK_REACT_CLASSES).forEach(key => {
        if (STORYBOOK_REACT_CLASSES[key].name === context.story) {
          retDiv = <div>{STORYBOOK_REACT_CLASSES[key].docgenInfo.description}</div>;
        }
      });
    }

    return retDiv;
  }

  _getSourceCode() {
    const {
      showSource,
      maxPropsIntoLine,
      maxPropObjectKeys,
      maxPropArrayLength,
      maxPropStringLength,
      children,
    } = this.props;
    const { stylesheet } = this.state;
    const allCSS = [];

    // get all non-external stylesheets css rules
    /* eslint-disable no-plusplus, no-undef */
    for (let i = 0; i < window.document.styleSheets.length; i++) {
      const ss = window.document.styleSheets[i];
      if (ss && !ss.href) allCSS.push(ss.cssRules);
    }
    const rulesArr = allCSS.map(rules => mapKeys(rules, val => val.selectorText));
    const styleRules = rulesArr.reduce((acc, rules) => ({ ...acc, ...rules }));

    if (!showSource) {
      return null;
    }

    return (
      <div>
        <h1 style={stylesheet.source.h1}>Story Source</h1>

        {React.Children.map(children, (root, idx) => {
          const markup = ReactDOMServer.renderToString(root);
          const styles = [];
          // TODO: better regex matching
          let classes = markup
            .match(/class=".*?"/g)[0]
            .replace(`class="`, '')
            .replace(`"`, '');

          classes = classes.split(' ').map(x => `.${x}`);

          classes.forEach(cls => {
            styles.push(styleRules[cls].cssText);
          });

          return (
            <Tabs>
              <TabList>
                <Tab>JSX</Tab>
                <Tab>HTML</Tab>
                <Tab>CSS</Tab>
              </TabList>
              <TabPanel>
                <Pre>
                  <Node
                    key={idx}
                    node={root}
                    depth={0}
                    maxPropsIntoLine={maxPropsIntoLine}
                    maxPropObjectKeys={maxPropObjectKeys}
                    maxPropArrayLength={maxPropArrayLength}
                    maxPropStringLength={maxPropStringLength}
                  />
                </Pre>
              </TabPanel>
              <TabPanel>
                <Pre>
                  <SyntaxHighlighter language="markup" style={docco}>
                    {ReactDOMServer.renderToString(root)
                      .replace(`data-reactroot=""`, '')
                      .replace(/>/gi, '>\n')
                      .replace(/<\//, '\n<')}
                  </SyntaxHighlighter>
                </Pre>
              </TabPanel>
              <TabPanel>
                <Pre>
                  <SyntaxHighlighter language="css" style={docco}>
                    {// TODO: much better means of adding indentation
                    styles
                      .map(styl =>
                        styl
                          .split(';')
                          .map((decl, index, arr) => {
                            if (index === 0) {
                              const _decl = decl.split('{');
                              return `${_decl[0]}{ \n ${_decl[1]}`;
                            }
                            if (index === arr.length - 1) {
                              const _decl = decl.split('}');
                              return `${_decl[0]}}`;
                            }
                            return ` ${decl}`;
                          })
                          .join(';\n')
                          .trim()
                      )
                      .join('\n\n')}
                  </SyntaxHighlighter>
                </Pre>
              </TabPanel>
            </Tabs>
          );
        })}
      </div>
    );
  }

  _getPropTables() {
    const {
      children,
      propTablesExclude,
      maxPropObjectKeys,
      maxPropArrayLength,
      maxPropStringLength,
      excludedPropTypes,
    } = this.props;
    let { propTables } = this.props;
    const { stylesheet } = this.state;
    const types = new Map();

    if (propTables === null) {
      return null;
    }

    if (!children) {
      return null;
    }

    if (propTables) {
      propTables.forEach(type => {
        types.set(type, true);
      });
    }

    // depth-first traverse and collect types
    const extract = innerChildren => {
      if (!innerChildren) {
        return;
      }
      if (Array.isArray(innerChildren)) {
        innerChildren.forEach(extract);
        return;
      }
      if (innerChildren.props && innerChildren.props.children) {
        extract(innerChildren.props.children);
      }
      if (
        typeof innerChildren === 'string' ||
        typeof innerChildren.type === 'string' ||
        (Array.isArray(propTablesExclude) && // also ignore excluded types
          ~propTablesExclude.indexOf(innerChildren.type)) // eslint-disable-line no-bitwise
      ) {
        return;
      }
      if (innerChildren.type && !types.has(innerChildren.type)) {
        types.set(innerChildren.type, true);
      }
    };

    // extract components from children
    extract(children);

    const array = Array.from(types.keys());
    array.sort((a, b) => getName(a) > getName(b));

    propTables = array.map((type, i) => (
      // eslint-disable-next-line react/no-array-index-key
      <div key={`${getName(type)}_${i}`}>
        <h2 style={stylesheet.propTableHead}>"{getName(type)}" Component</h2>
        <this.props.PropTable
          type={type}
          maxPropObjectKeys={maxPropObjectKeys}
          maxPropArrayLength={maxPropArrayLength}
          maxPropStringLength={maxPropStringLength}
          excludedPropTypes={excludedPropTypes}
        />
      </div>
    ));

    if (!propTables || propTables.length === 0) {
      return null;
    }

    return (
      <div>
        <h1 style={stylesheet.source.h1}>Prop Types</h1>
        {propTables}
      </div>
    );
  }

  render() {
    const { showInline } = this.props;
    // <ThemeProvider theme={stylesheet}></ThemeProvider>
    return showInline ? this._renderInline() : this._renderOverlay();
  }
}

Story.getDerivedStateFromProps = ({ styles }) => ({
  stylesheet: styles(stylesheetBase),
});

Story.displayName = 'Story';

Story.propTypes = {
  context: PropTypes.shape({
    kind: PropTypes.string,
    story: PropTypes.string,
  }),
  info: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  propTables: PropTypes.arrayOf(PropTypes.func),
  propTablesExclude: PropTypes.arrayOf(PropTypes.func),
  showInline: PropTypes.bool,
  showHeader: PropTypes.bool,
  showSource: PropTypes.bool,
  // eslint-disable-next-line react/no-unused-prop-types
  styles: PropTypes.func.isRequired,
  children: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  components: PropTypes.shape({}),
  maxPropsIntoLine: PropTypes.number.isRequired,
  maxPropObjectKeys: PropTypes.number.isRequired,
  maxPropArrayLength: PropTypes.number.isRequired,
  maxPropStringLength: PropTypes.number.isRequired,
  excludedPropTypes: PropTypes.arrayOf(PropTypes.string),
};

Story.defaultProps = {
  context: null,
  info: '',
  children: null,
  propTables: null,
  propTablesExclude: [],
  showInline: false,
  showHeader: true,
  showSource: true,
  components: {},
  excludedPropTypes: [],
};

polyfill(Story);

export default Story;
