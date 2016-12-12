import React from 'react';
import _Story from './components/Story';
import { H1, H2, H3, H4, H5, H6, Code, P, UL, A, LI } from './components/markdown';
import Playground from 'component-playground';
export const Story = _Story;

const defaultOptions = {
  inline: false,
  header: true,
  source: true,
  edirot: true,
  scope: {},
  propTables: [],
};

const defaultMtrcConf = {
  h1: H1,
  h2: H2,
  h3: H3,
  h4: H4,
  h5: H5,
  h6: H6,
  code: Code,
  p: P,
  a: A,
  li: LI,
  ul: UL,
};

export default {
  addWithInfo(storyName, info, storyCode, _options) {
    if (typeof storyCode !== 'function') {
      if (typeof info === 'function') {
        _options = storyCode;
        storyCode = info;
        info = '';
      } else {
        throw new Error('No story defining function has been specified');
      }
    }

    const options = {
      ...defaultOptions,
      ..._options
    };

    // props.propTables can only be either an array of components or null
    // propTables option is allowed to be set to 'false' (a boolean)
    // if the option is false, replace it with null to avoid react warnings
    if (!options.propTables) {
      options.propTables = null;
    }

    const mtrcConf = { ...defaultMtrcConf };
    if (_options && _options.mtrcConf) {
      Object.assign(mtrcConf, _options.mtrcConf);
    }

    if(options.editor && options.editor.show && !options.editor.editorScope){
      console.error('Story [' + storyName + ']: Editor feature is enabled but "editorScope is missing.');
    }
    this.add(storyName, (context) => {
      const props = {
        info,
        context,
        storyCode: storyCode(),
        showHeader: Boolean(options.header),
        showSource: Boolean(options.source),
        showStatic: Boolean(options.static),
        showEditor: Boolean(options.editor),
        editorScope: Object.assign({}, { React }, options.scope),
        propTables: options.propTables,
        mtrcConf
      };
      return (
        <Story {...props}></Story>
      );
    });
  }
};

export function setDefaults(newDefaults) {
  return Object.assign(defaultOptions, newDefaults);
};
