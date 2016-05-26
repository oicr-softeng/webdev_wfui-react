import React, { Component } from 'react';

/**
 * Input field
 */
class InputField extends Component {
  constructor(){
    super();
  }
  onHandleChange(e){
    const {onHandleChange, preview} = this.props;
    if(onHandleChange && !preview){
      onHandleChange(e);
    }
  }
  render() {
    var {label, type, defaultValue, placeholder, postfix, prefix, name, className, errors, description, preview} = this.props;
    if(prefix){
      var prefixField = <span className="wfui-input-field__prefix">{prefix}</span>
    }
    if(postfix){
      var postfixField = <span className="wfui-input-field__postfix">{postfix}</span>
    }
    //check error flag
    var errorClassName = '';
    if(errors) {
      errorClassName += ' wfui-input-field__input--theme-error';
    }

    return (
      <div className={"wfui-input-field"}>
        {description}
        <div className={"wfui-input-field--"+ type + ' ' + className}>
            <label className="wfui-input-field__label">{label}</label>
            {prefixField}
            <input className={"wfui-input-field__input"+ errorClassName} type={type} defaultValue={defaultValue} placeholder={placeholder} name={name} onChange={this.onHandleChange.bind(this)} disabled={preview} />
            {postfixField}
        </div>
      </div>
    )
  }
}

/**
 * Property types
 */
InputField.propTypes = {
  label: React.PropTypes.string,
  type: React.PropTypes.oneOf(['text','number','email']),
  name: React.PropTypes.string,
  placeholder: React.PropTypes.string,
  defaultValue: React.PropTypes.string,
  postfix: React.PropTypes.string,
  prefix: React.PropTypes.string,
  className: React.PropTypes.string,
  errors: React.PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.number,
    React.PropTypes.bool
  ])
}
InputField.defaultProps = {
  label: '',
  type: 'text',
  name: '',
  placeholder: '',
  defaultValue: '',
  postfix: '',
  prefix: '',
  className: '',
  errors: ''
}

export default InputField