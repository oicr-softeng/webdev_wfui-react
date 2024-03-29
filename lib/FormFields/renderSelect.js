'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; /* global FileReader */
/* eslint react/prop-types : 0 */


var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _index = require('../index');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var renderSelect = function renderSelect(_ref) {
    var className = _ref.className,
        label = _ref.label,
        options = _ref.options,
        input = _ref.input,
        help = _ref.help,
        required = _ref.required,
        disabled = _ref.disabled,
        preview = _ref.preview,
        globalError = _ref.globalError,
        descDisplay = _ref.descDisplay,
        fullWidth = _ref.fullWidth,
        _ref$meta = _ref.meta,
        touched = _ref$meta.touched,
        error = _ref$meta.error,
        showErrors = _ref.showErrors;
    return _react2.default.createElement(
        'div',
        {
            className: (0, _classnames2.default)(className, 'wfui-form-item', { 'wfui-form-item-error': (touched || showErrors) && (error || globalError) }, { 'wfui-form-disabled': disabled }, { 'wfui-form-preview': preview }, { answered: input.value }, { 'wfui-form-item-full-width': fullWidth })
        },
        label && _react2.default.createElement(
            'div',
            { className: 'wfui-form-label' },
            _react2.default.createElement(
                _index.ControlLabel,
                null,
                label,
                required && _react2.default.createElement(
                    'b',
                    { className: 'required' },
                    ' *'
                )
            )
        ),
        _react2.default.createElement(
            _index.FormGroup,
            {
                className: 'wfui-form-field ' + (descDisplay ? 'wfui-form-field-with-description' : 'wfui-form-field-no-description') + ' wfui-form-select',
                validationState: (touched || showErrors) && (error || globalError) ? 'error' : null
            },
            _react2.default.createElement(
                _index.FormControl,
                _extends({}, input, {
                    onChange: input.onChange,
                    componentClass: 'select'
                }),
                options.map(function (option, i) {
                    var _key = typeof option === 'string' ? option : option.key;
                    var _option = typeof option === 'string' ? option : option.value;
                    return _react2.default.createElement(
                        'option',
                        {
                            key: i,
                            name: input.name,
                            value: _key,
                            disabled: disabled,
                            onChange: function onChange(e) {
                                return input.onChange(e.target.value);
                            }
                        },
                        _option
                    );
                })
            ),
            (touched || showErrors) && error && _react2.default.createElement(
                _index.HelpBlock,
                { className: 'wfui-form-error' },
                _react2.default.createElement(
                    'span',
                    null,
                    error
                )
            ),
            (touched || showErrors) && globalError && _react2.default.createElement(
                _index.HelpBlock,
                { className: 'wfui-form-error' },
                _react2.default.createElement(
                    'span',
                    null,
                    globalError
                )
            ),
            help && !preview && _react2.default.createElement('div', {
                className: 'wfui-form-help',
                dangerouslySetInnerHTML: { __html: help }
            })
        ),
        descDisplay && !preview ? (0, _react.cloneElement)(descDisplay) : ''
    );
};

exports.default = renderSelect;