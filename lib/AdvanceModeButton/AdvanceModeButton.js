'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var AdvanceModeButton = function (_React$Component) {
    _inherits(AdvanceModeButton, _React$Component);

    function AdvanceModeButton(props) {
        _classCallCheck(this, AdvanceModeButton);

        var _this = _possibleConstructorReturn(this, (AdvanceModeButton.__proto__ || Object.getPrototypeOf(AdvanceModeButton)).call(this, props));

        _this.state = {
            advanced: false
        };
        return _this;
    }

    _createClass(AdvanceModeButton, [{
        key: 'render',
        value: function render() {
            var _this2 = this;

            var _props = this.props,
                _onChange = _props.onChange,
                label = _props.label;
            var advanced = this.state.advanced;

            return _react2.default.createElement(
                'div',
                { className: 'advance-mode-button' },
                _react2.default.createElement(
                    'span',
                    { className: 'title' },
                    label
                ),
                _react2.default.createElement(
                    'label',
                    { className: 'switch' },
                    _react2.default.createElement('input', {
                        name: 'advance',
                        type: 'checkbox',
                        id: 'togBtn-advance-mode',
                        value: advanced,
                        onChange: function onChange() {
                            _this2.setState({ advanced: !advanced });
                            _onChange(!advanced);
                        }
                    }),
                    _react2.default.createElement(
                        'div',
                        { className: 'slider round' },
                        _react2.default.createElement(
                            'span',
                            { className: 'on' },
                            'ON'
                        ),
                        _react2.default.createElement(
                            'span',
                            { className: 'off' },
                            'OFF'
                        )
                    )
                )
            );
        }
    }]);

    return AdvanceModeButton;
}(_react2.default.Component);

AdvanceModeButton.propTypes = {
    onChange: _propTypes2.default.func
};
AdvanceModeButton.defaultProps = {
    onChange: function onChange(f) {
        return f;
    }
};

exports.default = AdvanceModeButton;