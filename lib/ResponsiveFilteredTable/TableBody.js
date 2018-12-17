'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _fixedDataTable = require('fixed-data-table-2');

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _reactDimensions = require('react-dimensions');

var _reactDimensions2 = _interopRequireDefault(_reactDimensions);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /* global document, window */


var TableBody = function (_React$Component) {
    _inherits(TableBody, _React$Component);

    function TableBody() {
        _classCallCheck(this, TableBody);

        var _this = _possibleConstructorReturn(this, (TableBody.__proto__ || Object.getPrototypeOf(TableBody)).call(this));

        _this.state = { rowSelected: undefined };
        _this.onHandleScroll = _this.onHandleScroll.bind(_this);
        return _this;
    }

    _createClass(TableBody, [{
        key: 'onHandleScroll',
        value: function onHandleScroll() {
            var event = document.createEvent('Event');
            event.initEvent('fixedTableScrollStart', true, true);
            window.dispatchEvent(event);
        }
    }, {
        key: 'render',
        value: function render() {
            var _this2 = this;

            var _props = this.props,
                itemFormat = _props.itemFormat,
                data = _props.data,
                pageSize = _props.pageSize,
                currentPage = _props.currentPage,
                selectable = _props.selectable,
                onCheck = _props.onCheck,
                _onRowClick = _props.onRowClick,
                allCheckbox = _props.allCheckbox,
                toggleSort = _props.toggleSort,
                sortedOrientation = _props.sortedOrientation,
                sortedIdx = _props.sortedIdx,
                noTableHeader = _props.noTableHeader,
                rowHeight = _props.rowHeight,
                rowHeightGetter = _props.rowHeightGetter,
                headerHeight = _props.headerHeight,
                containerHeight = _props.containerHeight,
                containerWidth = _props.containerWidth;
            var rowSelected = this.state.rowSelected;


            var indexOffset = (currentPage - 1) * pageSize;

            /* Calculates the Table of articles that should be displayed on the current page */
            var activeData = [];
            var numArticles = data ? data.length : 0;
            var startingArticle = pageSize * (currentPage - 1);

            for (var i = startingArticle; i < startingArticle + pageSize && i < numArticles; i += 1) {
                activeData.push(data[i]);
            }
            return _react2.default.createElement(
                _fixedDataTable.Table,
                {
                    rowHeight: rowHeight,
                    rowHeightGetter: rowHeightGetter,
                    headerHeight: noTableHeader ? 0 : headerHeight,
                    rowsCount: activeData.length,
                    width: containerWidth,
                    height: containerHeight,
                    onRowClick: function onRowClick(event, rowIndex) {
                        if (event.target.tagName !== 'INPUT' && event.target.tagName !== 'BUTTON') {
                            // e.stopPropagation on cell doesn't work. This will be invoked first.
                            _onRowClick(activeData[rowIndex], event);
                            _this2.setState({ rowSelected: rowIndex });
                        }
                    },
                    rowClassNameGetter: function rowClassNameGetter(idx) {
                        return (0, _classnames2.default)({
                            even: (idx + 1) % 2 === 0,
                            add: (idx + 1) % 2 !== 0,
                            checked: activeData[idx].checked,
                            selected: rowSelected === idx
                        });
                    },
                    onScrollStart: this.onHandleScroll,
                    data: activeData
                },
                selectable && _react2.default.createElement(_fixedDataTable.Column, {
                    columnKey: 'select',
                    header: noTableHeader ? undefined : _react2.default.createElement(
                        _fixedDataTable.Cell,
                        null,
                        allCheckbox
                    ),
                    cell: function cell(props) {
                        return _react2.default.createElement(
                            _fixedDataTable.Cell,
                            props,
                            _react2.default.createElement('input', {
                                type: 'checkbox',
                                checked: activeData[props.rowIndex].checked,
                                onChange: function onChange(e) {
                                    e.stopPropagation();
                                    onCheck(activeData[props.rowIndex].idx);
                                }
                            })
                        );
                    },
                    width: 30,
                    fixed: itemFormat[0].fixed
                }),
                itemFormat.map(function (item, i) {
                    return _react2.default.createElement(_fixedDataTable.Column, _extends({
                        key: i
                    }, item, {
                        columnKey: item.columnKey || item.name,
                        header: noTableHeader ? undefined : _react2.default.createElement(
                            _fixedDataTable.Cell,
                            {
                                className: (0, _classnames2.default)({
                                    sortActive: sortedIdx === i,
                                    sortDesc: sortedIdx === i && sortedOrientation === 'desc',
                                    sortAsc: sortedIdx === i && sortedOrientation === 'asc'
                                })
                            },
                            item.sortingKey ? _react2.default.createElement(
                                'a',
                                {
                                    href: '#',
                                    onClick: function onClick(e) {
                                        toggleSort(e, i);
                                    }
                                },
                                item.name
                            ) : item.name
                        ),
                        cell: function cell(props) {
                            return _react2.default.createElement(
                                _fixedDataTable.Cell,
                                _extends({}, props, { className: item.className }),
                                item.display(activeData[props.rowIndex])
                            );
                        },
                        flexGrow: typeof item.flexGrow === 'undefined' ? 1 : item.flexGrow,
                        width: item.width || 20
                    }));
                })
            );
        }
    }]);

    return TableBody;
}(_react2.default.Component);

TableBody.propTypes = {
    data: _react2.default.PropTypes.arrayOf(_react2.default.PropTypes.any).isRequired,
    pageSize: _react2.default.PropTypes.number.isRequired,
    currentPage: _react2.default.PropTypes.number.isRequired,
    selectable: _react2.default.PropTypes.bool.isRequired,
    itemFormat: _react2.default.PropTypes.arrayOf(_react2.default.PropTypes.object).isRequired,
    onCheck: _react2.default.PropTypes.func.isRequired,
    onRowClick: _react2.default.PropTypes.func,
    allCheckbox: _react2.default.PropTypes.element,
    toggleSort: _react2.default.PropTypes.func,
    sortedOrientation: _react2.default.PropTypes.string,
    sortedIdx: _react2.default.PropTypes.number,
    containerWidth: _react2.default.PropTypes.number,
    containerHeight: _react2.default.PropTypes.number,
    rowHeight: _react2.default.PropTypes.number,
    rowHeightGetter: _react2.default.PropTypes.func,
    headerHeight: _react2.default.PropTypes.number
};

TableBody.defaultProps = {
    onRowClick: function onRowClick(f) {
        return f;
    },
    toggleSort: function toggleSort(f) {
        return f;
    }
};

exports.default = (0, _reactDimensions2.default)()(TableBody);