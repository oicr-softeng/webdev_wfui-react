import React, { Component } from 'react';

/**
 * Selection
 */
class Selection extends Component {
  onHandleClick(e) {
    var {type} = this.props;
    if(type=="radio"){
      this.refs.selection.checked = true;
    }else{
      this.refs.selection.checked = !this.refs.selection.checked;
    }
    //Pass data to a callback.
    if(this.props.onHandleChange){
      var res = {
        checked: this.refs.selection.checked,
        value: this.refs.selection.value,
        name: this.refs.selection.name
      }
      this.props.onHandleChange(res);
    }
  }
  render() {
    var {label, name, value, defaultChecked, children, type, className} = this.props;
    return (
      <div className={"wfui-selection "+className}>
        <label className="wfui-selection__label" onClick={this.onHandleClick.bind(this)}>
          <input className={"wfui-selection__input-"+type} ref="selection" data-ref="selection" type={type} name={name} value={value} defaultChecked={defaultChecked} />
          <span>{label}</span>
          {children}
        </label>
      </div>
    )
  }
}

/**
 * Property types
 */
Selection.propTypes = {
  label: React.PropTypes.string,
  name: React.PropTypes.string,
  value: React.PropTypes.string,
  type: React.PropTypes.oneOf(['radio','checkbox']),
  defaultChecked: React.PropTypes.bool,
  className: React.PropTypes.string,
}
Selection.defaultProps = {
  label: '',
  name: '',
  value: '',
  type: 'radio',
  defaultChecked: false,
  className: ''
}

export default Selection