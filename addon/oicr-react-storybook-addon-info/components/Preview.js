import React, { Component, PropTypes } from "react";
import { render } from "react-dom";
import ReactDOMServer from "react-dom/server";
import { transform } from "babel-standalone";

class Preview extends Component {
  constructor() {
    super();
    this.state = {
      error: null
    };
  }
  _compileCode() {
    const { code, context, noRender, scope } = this.props;
    const generateContextTypes = (c) => {
      return `{ ${Object.keys(c).map(val =>
        `${val}: React.PropTypes.any.isRequired`).join(", ")} }`;
    };

    if (noRender) {
      return transform(`
        ((${Object.keys(scope).join(", ")}, mountNode) => {
          class Comp extends React.Component {
            getChildContext() {
              return ${JSON.stringify(context)};
            }
            render() {
              return (
                ${code}
              );
            }
          }
          Comp.childContextTypes = ${generateContextTypes(context)};
          return Comp;
        });
      `, { presets: ["es2015", "react", "stage-1"] }).code;
    } else {
      return transform(`
        ((${Object.keys(scope).join(",")}, mountNode) => {
          ${code}
        });
      `, { presets: ["es2015", "react", "stage-1"] }).code;
    }

  }
  _setTimeout(...args) {
    clearTimeout(this.timeoutID); //eslint-disable-line no-undef
    this.timeoutID = setTimeout.apply(null, args); //eslint-disable-line no-undef
  }

  _compileCode2() {
    const { scope, code } = this.props;
    try {
      var compiledCode = transform(`
        ((${Object.keys(scope).join(",")}) => (${code}));
      `, { presets: ["es2015", "react", "stage-1"] }).code;
      const tempScope = [];
      Object.keys(scope).forEach(s => tempScope.push(scope[s]));
      return eval(compiledCode).apply(null, tempScope)
    } catch (err) {
      console.error(err);
    }
  }

  _renderCode() {
    const mountNode = this.refs.mount;
    const { scope, noRender, previewComponent } = this.props;
    const tempScope = [];

    try {
      Object.keys(scope).forEach(s => tempScope.push(scope[s]));
      tempScope.push(mountNode);
      const compiledCode = this._compileCode();
      const Comp = React.createElement(
        eval(compiledCode).apply(null, tempScope)
      );
      console.log(Comp);
      return Comp;
      this.setState({ error: null });
    } catch (err) {
      this._setTimeout(() => {
        this.setState({ error: err.toString() });
      }, 500);
    }
  }
  _executeCode() {  
    const mountNode = this.refs.mount;
    const { scope, noRender, previewComponent } = this.props;
    const tempScope = [];

    try {
      Object.keys(scope).forEach(s => tempScope.push(scope[s]));
      tempScope.push(mountNode);
      const compiledCode = this._compileCode();
      
      if (noRender) {
        /* eslint-disable no-eval, max-len */
        const Comp = React.createElement(
          eval(compiledCode).apply(null, tempScope)
        );
        ReactDOMServer.renderToString(React.createElement(previewComponent, {}, Comp));
        render(
          React.createElement(previewComponent, {}, Comp),
          mountNode
        );
      } else {
        eval(compiledCode).apply(null, tempScope);
      }
      /* eslint-enable no-eval, max-len */

      this.setState({ error: null });
    } catch (err) {
      this._setTimeout(() => {
        this.setState({ error: err.toString() });
      }, 500);
    }
  };
  componentDidMount() {
    this._executeCode();
  }
  componentDidUpdate(prevProps) {
    clearTimeout(this.timeoutID); //eslint-disable-line
    if (this.props.code !== prevProps.code) {
      this._executeCode();
    }
  }
  render() {
    const { error } = this.state;
    return (
      <div>
        {error !== null ?
          <div className="playgroundError">{error}</div> :
          null}
        <div ref="mount" className="previewArea"/>
        {this._compileCode2()}
      </div>
    );
  }

}

Preview.defaultProps = {
    previewComponent: "div"
};

Preview.propTypes = {
  code: PropTypes.string.isRequired,
  scope: PropTypes.object.isRequired,
  previewComponent: PropTypes.node,
  noRender: PropTypes.bool,
  context: PropTypes.object
};

export default Preview;