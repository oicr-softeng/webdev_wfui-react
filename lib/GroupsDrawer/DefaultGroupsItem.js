'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactBootstrap = require('react-bootstrap');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DefaultGroupsItem = function (_Component) {
    _inherits(DefaultGroupsItem, _Component);

    function DefaultGroupsItem() {
        _classCallCheck(this, DefaultGroupsItem);

        return _possibleConstructorReturn(this, (DefaultGroupsItem.__proto__ || Object.getPrototypeOf(DefaultGroupsItem)).apply(this, arguments));
    }

    _createClass(DefaultGroupsItem, [{
        key: 'render',
        value: function render() {
            var _props = this.props,
                icon = _props.icon,
                link = _props.link,
                title = _props.title;


            return _react2.default.createElement(
                'div',
                { className: 'col-xs-3' },
                _react2.default.createElement(
                    'a',
                    { href: link },
                    _react2.default.createElement(
                        _reactBootstrap.Row,
                        null,
                        _react2.default.createElement(
                            _reactBootstrap.Col,
                            { xs: 12 },
                            _react2.default.createElement(_reactBootstrap.Image, { src: icon, style: { width: '100%', height: '100%' } })
                        )
                    ),
                    _react2.default.createElement(
                        'p',
                        { className: 'text-center' },
                        title
                    )
                )
            );
        }
    }]);

    return DefaultGroupsItem;
}(_react.Component);

DefaultGroupsItem.propTypes = {
    icon: _react.PropTypes.string.isRequired,
    title: _react.PropTypes.string.isRequired,
    link: _react.PropTypes.string.isRequired
};

exports.default = DefaultGroupsItem;