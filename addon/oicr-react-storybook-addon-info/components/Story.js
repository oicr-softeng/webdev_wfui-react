import html from 'html';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import MTRC from 'markdown-to-react-components';
import PropTable from './PropTable';
import { baseFonts } from './theme';
import { Pre } from './markdown';
import { transform } from 'babel-standalone';
import CodeMirror from 'react-codemirror';
import { ButtonGroup, Button, Glyphicon, Row, Col  } from 'react-bootstrap';

const stylesheet = {
  link: {
    base: {
      fontFamily: 'sans-serif',
      fontSize: 12,
      display: 'block',
      position: 'fixed',
      textDecoration: 'none',
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
    position: 'absolute',
    background: 'white',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    padding: '0 40px',
    overflow: 'auto',
  },
  children: {
    position: 'relative',
    zIndex: 0,
  },
  infoBody: {
    ...baseFonts,
    fontWeight: 300,
    lineHeight: 1.45,
    fontSize: 15,
  },
  infoContent: {
    marginBottom: 0,
  },
  header: {
    div: {
      position: 'relative',
      borderBottom: '1px solid #ddd'
    },
    h1: {
      margin: '20px 0 0 0',
      padding: 0,
      fontSize: 35,
    },
    h2: {
      margin: '0 0 10px 0',
      padding: 0,
      fontWeight: 400,
      fontSize: 22,
    },
    body: {
      borderBottom: '1px solid #eee',
      marginBottom: 10,
    },
    btnmenu: {
      position: 'absolute',
      right: 0,
      bottom: 10
    }
  },
  source: {
    h1: {
      margin: '20px 0 0 0',
      padding: '0 0 5px 0',
      fontSize: 25,
      borderBottom: '1px solid #EEE',
    },
  },
  preview: {
    code: {
      border: '1px solid #ddd'
    },
    codeMirror: {
      marginTop: 20
    }
  },
  propTableHead: {
    margin: '20px 0 0 0',
  },
};

export default class Story extends React.Component {
  constructor(...args) {
    super(...args);
    this.state = { open: false, code: "", activeTab: 1};

    MTRC.configure(this.props.mtrcConf);
  }

  componentDidMount() {
    this.setState({ code: this.props.storyCode });
  }

  _compileCode(scope, code) {
    if(!code) return;

    try {
      var compiledCode = transform(`
        ((${Object.keys(scope).join(",")}) => {${code}});
      `, { presets: ["es2015", "react", "stage-1"] }).code;
      const tempScope = [];
      Object.keys(scope).forEach(s => tempScope.push(scope[s]));
      let comp = eval(compiledCode).apply(null, tempScope);
      return comp;
    } catch (err) {
      return <p>{err.toString()}</p>;
    }
  }

  _getInfoHeader() {
    if (!this.props.context || !this.props.showHeader) {
      return null;
    }

    return (
      <div style={stylesheet.header.div}>
        <h2>{this.props.context.kind}</h2>
        <h2 style={stylesheet.header.h2}>{this.props.context.story}</h2>
        { this._getButtonMenu() }
      </div>
    );
  }

  _onTabChange(activeTab, proxy, e) {
    this.setState({activeTab:activeTab});
  }
  _getButtonMenu() {
    const { activeTab } = this.state;
    return (
      <ButtonGroup style={stylesheet.header.btnmenu}>
        <Button className={ activeTab==1 ? 'btn-primary':'' } onClick={this._onTabChange.bind(this, 1)} ><Glyphicon glyph="eye-open" /></Button>
        <Button className={ activeTab==2 ? 'btn-primary':'' } onClick={this._onTabChange.bind(this, 2)} ><Glyphicon glyph="info-sign" /></Button>
        <Button className={ activeTab==3 ? 'btn-primary':'' } onClick={this._onTabChange.bind(this, 3)} ><Glyphicon glyph="pencil" /></Button>
      </ButtonGroup>
    )
  }

  _getInfoContent() {
    if (!this.props.info) {
      return '';
    }
    const lines = this.props.info.split('\n');
    while (lines[0].trim() === '') {
      lines.shift();
    }
    let padding = 0;
    const matches = lines[0].match(/^ */);
    if (matches) {
      padding = matches[0].length;
    }
    const source = lines.map(s => s.slice(padding)).join('\n');
    return (
      <div style={stylesheet.infoContent}>
        {MTRC(source).tree}
      </div>
    );
  }

  _getSourceCode(source) {
    if (!source) {
      return null;
    }
    return (
      <div>
        <h1 style={stylesheet.source.h1}>Story Source</h1>
        <Pre>{source}</Pre>
      </div>
    )
  }

  _getStatic(component) {
    if (!component) {
      return null;
    }
    return (
      <div>
        <h1 style={stylesheet.source.h1}>Story Static</h1>
        <Pre>
        {html.prettyPrint(ReactDOMServer.renderToStaticMarkup(component))}
        </Pre>
      </div>
    );
  }

  _getPropTables(component) {
    const { editorScope } = this.props;
    const types = new Map();
    const children = component;

    if (this.props.editorScope === null) {
      return null;
    }

    let components = (
      <div>
        {Object.keys(editorScope).map((key,i)=>{
          if(key=='React') return;
          let Comp = editorScope[key];
          return <Comp key={i}/>;
        })}
      </div>
    );

    if (components.props.children.propTables) {
      components.props.children.propTables.forEach(function (type) {
        types.set(type, true);
      });
    }

    // depth-first traverse and collect types
    function extract(children) {
      if (!children) {
        return;
      }
      if (Array.isArray(children)) {
        children.forEach(extract);
        return;
      }
      if (children.props && children.props.children) {
        extract(children.props.children);
      }
      if (typeof children === 'string' || typeof children.type === 'string') {
        return;
      }
      if (children.type && !types.has(children.type)) {
        types.set(children.type, true);
      }
    }

    // extract components from children
    extract(components.props.children);

    const array = Array.from(types.keys());
    array.sort(function (a, b) {
      return (a.displayName || a.name) > (b.displayName || b.name);
    });

    const propTables = array.map(function (type, idx) {
      return (
        <div key={idx}>
          <h2 style={stylesheet.propTableHead}>"{type.displayName || type.name}" Component</h2>
          <PropTable type={type} />
        </div>
      );
    });

    if (!propTables || propTables.length === 0) {
      return null;
    }

    return (
      <div>
        <h1 style={stylesheet.source.h1}>Prop Types</h1>
        {propTables}
      </div>
    );

    return;
  }

  render() {
    
    const { showEditor, storyCode, editorScope } = this.props;
    const { code, activeTab } = this.state;

    let contents;
    if(activeTab == 1){
      contents = (
        <div style={{marginTop: 20}}>
          {this._compileCode(editorScope, storyCode)}
        </div>
      )
    }else if(activeTab == 2){
      contents = (
        <div>
          { this._getInfoContent() }
          { this._getPropTables() }
        </div>
      )
    } else if(activeTab == 3) {
      const editableComp = this._compileCode(editorScope, code);
      contents = (
        <Row>
          <Col md={6}>
            <style>{".CodeMirror{height: auto !important;}"}</style>
            <h3>Source</h3>
            <div style={stylesheet.preview.code} >
              <CodeMirror value={this.state.code} onChange={(code)=>{this.setState({code:code})}} options={{lineNumbers: true, mode: 'jsx'}} />
            </div>
            <h3>Static HTML</h3>
            <div style={stylesheet.preview.code} >
              <CodeMirror value={html.prettyPrint(ReactDOMServer.renderToStaticMarkup(editableComp))} options={{lineNumbers: true, readOnly:true }} />
            </div>
          </Col>
          <Col md={6} style={stylesheet.preview.codeMirror} >
            {editableComp}
          </Col>
        </Row>
      )
    }

    return (
      <div>
        { this._getInfoHeader() }  
        { contents }
      </div>
    )

  }
}

Story.displayName = 'Story';
Story.propTypes = {
  context: React.PropTypes.object,
  info: React.PropTypes.string,
  propTables: React.PropTypes.arrayOf(React.PropTypes.func),
  showInline: React.PropTypes.bool,
  showHeader: React.PropTypes.bool,
  showSource: React.PropTypes.bool,
  showStatic: React.PropTypes.bool,
  children: React.PropTypes.oneOfType([
    React.PropTypes.object,
    React.PropTypes.array,
  ]),
  mtrcConf: React.PropTypes.object
};

Story.defaultProps = {
  showInline: false,
  showHeader: true,
  showSource: true,
  showStatic: true,
  mtrcConf: {}
};
