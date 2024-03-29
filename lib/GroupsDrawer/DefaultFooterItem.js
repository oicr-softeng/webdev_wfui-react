"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DefaultFooterItem = function (_Component) {
    _inherits(DefaultFooterItem, _Component);

    function DefaultFooterItem() {
        _classCallCheck(this, DefaultFooterItem);

        return _possibleConstructorReturn(this, (DefaultFooterItem.__proto__ || Object.getPrototypeOf(DefaultFooterItem)).apply(this, arguments));
    }

    _createClass(DefaultFooterItem, [{
        key: "render",
        value: function render() {
            var _props = this.props,
                title = _props.title,
                link = _props.link;

            return _react2.default.createElement(
                "li",
                { className: "col-xs-6" },
                _react2.default.createElement(
                    "a",
                    { href: link },
                    title
                )
            );
        }
    }]);

    return DefaultFooterItem;
}(_react.Component);

DefaultFooterItem.propTypes = {
    title: _react.PropTypes.string,
    link: _react.PropTypes.string
};

exports.default = DefaultFooterItem;