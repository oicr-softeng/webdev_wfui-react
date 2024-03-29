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

var DrawerPopover = function (_Component) {
    _inherits(DrawerPopover, _Component);

    function DrawerPopover() {
        _classCallCheck(this, DrawerPopover);

        return _possibleConstructorReturn(this, (DrawerPopover.__proto__ || Object.getPrototypeOf(DrawerPopover)).apply(this, arguments));
    }

    _createClass(DrawerPopover, [{
        key: 'render',
        value: function render() {
            var _props = this.props,
                title = _props.title,
                show = _props.show,
                target = _props.target,
                placement = _props.placement,
                handleClose = _props.handleClose,
                bsStyle = _props.bsStyle,
                bsRole = _props.bsRole,
                children = _props.children;


            return _react2.default.createElement(
                _reactBootstrap.Overlay,
                {
                    show: show,
                    target: target,
                    placement: placement
                },
                _react2.default.createElement(
                    _reactBootstrap.Popover,
                    {
                        bsRole: bsRole,
                        bsStyle: bsStyle,
                        id: 'popover',
                        onClick: handleClose,
                        title: title
                    },
                    children
                )
            );
        }
    }]);

    return DrawerPopover;
}(_react.Component);

DrawerPopover.propTypes = {
    title: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.arrayOf(_react.PropTypes.element), _react.PropTypes.element]),
    show: _react.PropTypes.bool,
    target: _react.PropTypes.shape({}),
    handleClose: _react.PropTypes.func,
    placement: _react.PropTypes.oneOf(['top', 'right', 'bottom', 'left']),
    bsStyle: _react.PropTypes.string,
    bsRole: _react.PropTypes.string,
    children: _react.PropTypes.oneOfType([_react.PropTypes.arrayOf(_react.PropTypes.element), _react.PropTypes.element])
};

DrawerPopover.defaultProps = {
    title: null,
    show: false,
    bsStyle: '',
    bsRole: 'popover',
    placement: 'bottom'
};

exports.default = DrawerPopover;