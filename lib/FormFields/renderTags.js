'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _reactTagsinput = require('react-tagsinput');

var _reactTagsinput2 = _interopRequireDefault(_reactTagsinput);

var _index = require('../index');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /* global FileReader */
/* eslint react/prop-types : 0 */


var renderTags = function (_React$Component) {
    _inherits(renderTags, _React$Component);

    function renderTags(props) {
        _classCallCheck(this, renderTags);

        var _this = _possibleConstructorReturn(this, (renderTags.__proto__ || Object.getPrototypeOf(renderTags)).call(this, props));

        _this.state = {
            tags: props.input.value || [],
            suggestions: props.suggestions || []
        };
        _this.handleChange = _this.handleChange.bind(_this);
        return _this;
    }

    _createClass(renderTags, [{
        key: 'handleChange',
        value: function handleChange(tags) {
            var input = this.props.input;

            this.setState({ tags: tags });
            input.onChange(tags);
        }
    }, {
        key: 'render',
        value: function render() {
            var _props = this.props,
                className = _props.className,
                label = _props.label,
                input = _props.input,
                placeholder = _props.placeholder,
                help = _props.help,
                globalError = _props.globalError,
                required = _props.required,
                withContext = _props.withContext,
                disabled = _props.disabled,
                preview = _props.preview,
                descDisplay = _props.descDisplay,
                fullWidth = _props.fullWidth,
                _props$meta = _props.meta,
                touched = _props$meta.touched,
                error = _props$meta.error,
                showErrors = _props.showErrors;
            var _state = this.state,
                suggestions = _state.suggestions,
                tags = _state.tags;


            return _react2.default.createElement(
                'div',
                {
                    className: (0, _classnames2.default)(className, 'wfui-form-item', { 'wfui-form-item-error': (touched || showErrors) && error }, { 'wfui-form-disabled': disabled }, { 'wfui-form-preview': preview }, { 'wfui-form-item-full-width': fullWidth })
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
                        className: 'wfui-form-field ' + (descDisplay ? 'wfui-form-field-with-description' : 'wfui-form-field-no-description') + ' wfui-form-tags',
                        validationState: (touched || showErrors) && error ? 'error' : null
                    },
                    disabled ? _react2.default.createElement(
                        'div',
                        null,
                        input.value ? _react2.default.createElement(
                            'ul',
                            null,
                            input.value.map(function (tag, i) {
                                return _react2.default.createElement(
                                    'li',
                                    { key: i },
                                    tag
                                );
                            })
                        ) : _react2.default.createElement(
                            'span',
                            { className: 'no-item' },
                            '( No Items )'
                        )
                    ) : _react2.default.createElement(_reactTagsinput2.default, { value: tags, onChange: this.handleChange }),
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
        }
    }]);

    return renderTags;
}(_react2.default.Component);

renderTags.propTypes = {
    placeholder: _propTypes2.default.string,
    withContext: _propTypes2.default.bool,
    descDisplay: _propTypes2.default.element,
    fullWidth: _propTypes2.default.bool
};
renderTags.defaultProps = {
    placeholder: 'Add keyword',
    fullWidth: false
};

exports.default = renderTags;