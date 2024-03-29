'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/* Calculates the list of articles that should be displayed on the current page */
var calcActiveData = function calcActiveData(_ref) {
    var data = _ref.data,
        pageSize = _ref.pageSize,
        currentPage = _ref.currentPage;

    var activeData = [];
    var numArticles = data ? data.length : 0;

    var startingArticle = pageSize * (currentPage - 1);
    var lastArticle = Math.min(startingArticle + pageSize, numArticles);

    for (var i = startingArticle; i < lastArticle; i += 1) {
        activeData.push(data[i]);
    }
    return { activeData: activeData, startingArticle: startingArticle, lastArticle: lastArticle };
};

var List = function (_React$Component) {
    _inherits(List, _React$Component);

    function List(props) {
        _classCallCheck(this, List);

        var _this = _possibleConstructorReturn(this, (List.__proto__ || Object.getPrototypeOf(List)).call(this, props));

        _this.state = {
            numOfItems: 0,
            startingArticle: 0,
            lastArticle: 0
        };
        return _this;
    }

    _createClass(List, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            var _props = this.props,
                onListDidMount = _props.onListDidMount,
                onNumOfListChange = _props.onNumOfListChange,
                data = _props.data;

            onListDidMount(data); // deprecate: use onDisplay instead.
            this.updateStatus();
        }
    }, {
        key: 'render',
        value: function render() {
            var _props2 = this.props,
                itemDisplay = _props2.itemDisplay,
                data = _props2.data,
                pageSize = _props2.pageSize,
                currentPage = _props2.currentPage,
                container = _props2.container;

            /* New article object with data injected into it. */

            var _calcActiveData = calcActiveData(this.props),
                activeData = _calcActiveData.activeData;

            var itemDisplays = activeData.map(function (item, idx) {
                return _react2.default.cloneElement(itemDisplay, Object.assign({}, item, { key: idx, idx: idx }));
            });

            /* Populates the container element passed to this with the items */
            var populatedContainer = _react2.default.cloneElement(container, { children: itemDisplays });
            return populatedContainer;
        }
    }, {
        key: 'componentDidUpdate',
        value: function componentDidUpdate(prevProps) {
            var _props3 = this.props,
                onDisplay = _props3.onDisplay,
                onNumOfListChange = _props3.onNumOfListChange,
                data = _props3.data;

            var _calcActiveData2 = calcActiveData(this.props),
                activeData = _calcActiveData2.activeData,
                startingArticle = _calcActiveData2.startingArticle,
                lastArticle = _calcActiveData2.lastArticle;

            /* Only setState and invoke callbacks when the state is changed to avoid infinite loop */


            if (activeData.length !== this.state.numOfItems || startingArticle !== this.state.startingArticle || lastArticle !== this.state.lastArticle || prevProps.data.length !== data.length) {
                this.updateStatus();
            }
        }
    }, {
        key: 'updateStatus',
        value: function updateStatus() {
            var _props4 = this.props,
                onDisplay = _props4.onDisplay,
                onNumOfListChange = _props4.onNumOfListChange,
                data = _props4.data;

            var _calcActiveData3 = calcActiveData(this.props),
                activeData = _calcActiveData3.activeData,
                startingArticle = _calcActiveData3.startingArticle,
                lastArticle = _calcActiveData3.lastArticle;

            this.setState({
                numOfItems: activeData.length,
                startingArticle: startingArticle,
                lastArticle: lastArticle
            });
            /* Return number of articles. */
            onNumOfListChange(activeData.length); // deprecated: use onDisplay instead.

            /* onDisplay is provided for cases that the client needs to see
            * the range of articles being displayed */
            onDisplay({ starting: startingArticle, last: lastArticle, numListed: activeData.length, numTotal: data.length, rawData: data });
        }
    }]);

    return List;
}(_react2.default.Component);

List.propTypes = {
    itemDisplay: _react2.default.PropTypes.element.isRequired,
    data: _react2.default.PropTypes.arrayOf(_react2.default.PropTypes.any).isRequired,
    pageSize: _react2.default.PropTypes.number,
    currentPage: _react2.default.PropTypes.number,
    container: _react2.default.PropTypes.element,
    onDisplay: _react2.default.PropTypes.func,
    onNumOfListChange: _react2.default.PropTypes.func,
    onListDidMount: _react2.default.PropTypes.func
};

exports.default = List;