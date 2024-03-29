'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ResponsiveFilteredTable = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _TableBody = require('./TableBody');

var _TableBody2 = _interopRequireDefault(_TableBody);

var _searchUtil = require('../../util/searchUtil');

var _searchUtil2 = _interopRequireDefault(_searchUtil);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/*
 * Applies the filtering to the articles and then passes its' props to List for display.
 */

var FilteredTable = function (_React$Component) {
    _inherits(FilteredTable, _React$Component);

    function FilteredTable(props) {
        _classCallCheck(this, FilteredTable);

        var _this = _possibleConstructorReturn(this, (FilteredTable.__proto__ || Object.getPrototypeOf(FilteredTable)).call(this, props));

        _this.onCheck = _this.onCheck.bind(_this);
        _this.onAllCheck = _this.onAllCheck.bind(_this);
        _this.lastResultsCount = -1;
        _this.state = {
            currentPage: props.currentPage,
            checkedItems: new Array(props.data.length).fill(false),
            sortedIdx: props.sortedIdx,
            sortedOrientation: props.defaultSortedOrientation || 'desc',
            dataWithState: _this.transformData(props.data),
            uid: new Date().getTime(),
            contentWidth: 0
        };
        _this.resizeTable = _this.resizeTable.bind(_this);
        _this.toggleSort = _this.toggleSort.bind(_this);
        _this.lastFilteredData = [];
        _this.filteredData = [];
        return _this;
    }

    _createClass(FilteredTable, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            this.onFilter(this.generateFilteredArticles(this.applySearch(this.props.data)));
            window.addEventListener('resize', this.resizeTable);
            this.resizeTable();
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            window.removeEventListener('resize', this.resizeTable);
        }
    }, {
        key: 'transformData',
        value: function transformData(data) {
            return data.map(function (obj, i) {
                var _obj = JSON.stringify(obj) ? JSON.parse(JSON.stringify(obj)) : {};
                _obj.checked = false;
                _obj.idx = i;
                return _obj;
            });
        }
    }, {
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(nextProps) {
            /* Also note: JSON.stringify is the cheapest arbitrary comparison function
             * since it runs on native code. */
            var thisData = this.props.data;
            var nextData = nextProps.data;

            var newState = {};

            if (JSON.stringify(thisData) !== JSON.stringify(nextData)) {
                newState.dataWithState = this.transformData(nextData);
            }

            if (this.props.defaultSortedOrientation !== nextProps.defaultSortedOrientation) {
                newState.sortedOrientation = nextProps.defaultSortedOrientation || 'desc';
            }

            if (!isNaN(nextProps.sortedIdx) && this.props.sortedIdx !== nextProps.sortedIdx) {
                newState.sortedIdx = nextProps.sortedIdx;
            }

            if (Object.keys(newState).length) {
                this.setState(newState);
            }
        }
    }, {
        key: 'componentDidUpdate',
        value: function componentDidUpdate() {
            var data = this.props.data;

            this.onFilter(this.generateFilteredArticles(this.applySearch(data)));
        }

        /* This is called when a individual item's checkbox is clicked */

    }, {
        key: 'onCheck',
        value: function onCheck(index) {
            var _this2 = this;

            var dataWithState = this.state.dataWithState;

            var newArray = dataWithState.slice(0);
            newArray[index].checked = !newArray[index].checked;

            /* We do this since setstate does not immediately mutate the state */
            this.setState({ dataWithState: newArray }, function () {
                return _this2.selectionChanged();
            });
        }
    }, {
        key: 'onAllCheck',
        value: function onAllCheck() {
            var _this3 = this;

            var dataWithState = this.state.dataWithState;

            var newArray = dataWithState.slice(0);

            var filteredData = this.generateFilteredArticles(this.applySearch(dataWithState));

            if (filteredData.every(function (item) {
                return item.checked;
            })) {
                /* If all items are checked, then uncheck everything */
                filteredData.forEach(function (item) {
                    var idx = newArray.findIndex(function (i) {
                        return i.idx === item.idx;
                    });
                    if (idx > -1) newArray[idx].checked = false;
                });
            } else {
                // Reset
                filteredData.forEach(function (item) {
                    var idx = newArray.findIndex(function (i) {
                        return i.idx === item.idx;
                    });
                    if (idx > -1) newArray[idx].checked = false;
                });

                /* Else check everything */
                filteredData.forEach(function (item) {
                    var idx = newArray.findIndex(function (i) {
                        return i.idx === item.idx;
                    });
                    if (idx > -1) newArray[idx].checked = true;
                });
            }

            this.setState({ dataWithState: newArray }, function () {
                return _this3.selectionChanged();
            });
        }
    }, {
        key: 'toggleSort',
        value: function toggleSort(event, idx) {
            var _state = this.state,
                sortedIdx = _state.sortedIdx,
                sortedOrientation = _state.sortedOrientation;

            event.preventDefault();
            if (sortedIdx === idx) {
                if (sortedOrientation === 'desc') {
                    this.setState({ sortedOrientation: 'asc' });
                } else {
                    this.setState({ sortedOrientation: 'desc' });
                }
            } else {
                this.setState({ sortedOrientation: 'desc', sortedIdx: idx });
            }
        }

        /* Passes the list of filtered articles to the callbacks in the props. */

    }, {
        key: 'onFilter',
        value: function onFilter(filteredArticles) {
            var _props = this.props,
                onResultsNumUpdate = _props.onResultsNumUpdate,
                onFilteredArticleUpdate = _props.onFilteredArticleUpdate;

            /* Now sort the articles*/

            var resultsCount = filteredArticles.length;
            if (this.lastResultsCount !== resultsCount) {
                this.lastResultsCount = resultsCount;
                if (onResultsNumUpdate) {
                    onResultsNumUpdate(resultsCount);
                }
            }
            if (onFilteredArticleUpdate) {
                if (this.lastFilteredData.length !== filteredArticles.length || JSON.stringify(this.lastFilteredData) !== JSON.stringify(filteredArticles)) {
                    this.lastFilteredData = filteredArticles;
                    onFilteredArticleUpdate(filteredArticles);
                }
            }
        }
    }, {
        key: 'generateFilteredArticles',
        value: function generateFilteredArticles(articles) {
            var _props2 = this.props,
                filterList = _props2.filterList,
                itemFormat = _props2.itemFormat;
            var _state2 = this.state,
                sortedIdx = _state2.sortedIdx,
                sortedOrientation = _state2.sortedOrientation;


            var filteredArticles = articles;
            filterList.forEach(function (filter) {
                return filteredArticles = filteredArticles.filter(filter);
            });

            if (sortedIdx !== -1) {
                filteredArticles = filteredArticles.sort(function (a, b) {
                    var getSortingData = itemFormat[sortedIdx].sortingKey;
                    var aData = getSortingData(a);
                    var bData = getSortingData(b);
                    if (sortedOrientation === 'desc') {
                        if (typeof aData === 'string') {
                            return bData.toLowerCase().localeCompare(aData.toLowerCase());
                        } else if (aData instanceof Date) {
                            return bData.getTime() - aData.getTime();
                        }
                        return bData - aData;
                    }
                    if (typeof aData === 'string') {
                        return aData.toLowerCase().localeCompare(bData.toLowerCase());
                    } else if (aData instanceof Date) {
                        return aData.getTime() - bData.getTime();
                    }
                    return aData - bData;
                });
            }

            return filteredArticles;
        }
    }, {
        key: 'applySearch',
        value: function applySearch(articles) {
            var _props3 = this.props,
                searchTerm = _props3.searchTerm,
                simpleSearch = _props3.simpleSearch,
                searchKeys = _props3.searchKeys,
                wholeWord = _props3.wholeWord,
                searchLogic = _props3.searchLogic,
                exclProps = _props3.exclProps;

            if (searchTerm) {
                var filteredArticles = simpleSearch ? _searchUtil2.default.simpleSearch(articles, searchTerm, searchKeys, wholeWord, searchLogic, true, exclProps) : _searchUtil2.default.search(articles, searchTerm, exclProps);
                return filteredArticles;
            }

            return articles;
        }

        /* Return a list of the indices of all selected items */

    }, {
        key: 'selectionChanged',
        value: function selectionChanged() {
            var onSelectionChange = this.props.onSelectionChange;
            var dataWithState = this.state.dataWithState;


            var indexes = [];
            var checkedItems = dataWithState.filter(function (item, i) {
                if (item.checked) indexes.push(i);
                return item.checked;
            });

            onSelectionChange(indexes, checkedItems);
        }
    }, {
        key: 'generatePaginatorObject',
        value: function generatePaginatorObject() {
            var _this4 = this;

            var currentPage = this.state.currentPage;
            var _props4 = this.props,
                pageSize = _props4.pageSize,
                data = _props4.data;


            var filteredData = this.applySearch(this.generateFilteredArticles(data));
            var dataLength = filteredData ? filteredData.length : 0;
            var numPages = Math.ceil(dataLength / pageSize);

            var Paginator = {
                currentPage: currentPage,
                numPages: numPages,
                /* Returns a function that will open the page 'page'
                 * or undefined if the page does not exist.  */
                getOpenPage: function getOpenPage(page) {
                    if (page > 0 && page <= numPages) {
                        return function () {
                            return _this4.setState({ currentPage: page });
                        };
                    }
                    return undefined;
                }
            };
            return Paginator;
        }
    }, {
        key: 'render',
        value: function render() {
            var _props5 = this.props,
                style = _props5.style,
                itemFormat = _props5.itemFormat,
                className = _props5.className,
                paginatorDisplay = _props5.paginatorDisplay,
                pageSize = _props5.pageSize,
                selectable = _props5.selectable,
                onSelectionChange = _props5.onSelectionChange,
                onRowClick = _props5.onRowClick,
                rowSelect = _props5.rowSelect,
                contentHeight = _props5.contentHeight,
                noTableHeader = _props5.noTableHeader,
                rowHeight = _props5.rowHeight,
                rowHeightGetter = _props5.rowHeightGetter,
                headerHeight = _props5.headerHeight,
                columnResizeDisabled = _props5.columnResizeDisabled,
                isResponsive = _props5.isResponsive,
                rowClassNameGetter = _props5.rowClassNameGetter,
                onColumnResizeEndCallback = _props5.onColumnResizeEndCallback;
            var _state3 = this.state,
                currentPage = _state3.currentPage,
                dataWithState = _state3.dataWithState,
                sortedOrientation = _state3.sortedOrientation,
                sortedIdx = _state3.sortedIdx,
                uid = _state3.uid,
                contentWidth = _state3.contentWidth;

            this.filteredData = this.applySearch(this.generateFilteredArticles(dataWithState));

            /* We have to do this to avoid breaking backwards compatibility */
            var table = isResponsive ? _react2.default.createElement(_TableBody.ResponsiveTableBody, {
                className: className,
                data: this.filteredData,
                itemFormat: itemFormat,
                pageSize: pageSize,
                currentPage: currentPage,
                selectable: selectable,
                onSelectionChange: onSelectionChange,
                onCheck: this.onCheck,
                checks: this.state.checkedItems,
                onRowClick: onRowClick,
                allCheckbox: _react2.default.createElement('input', {
                    type: 'Checkbox',
                    onChange: this.onAllCheck,
                    checked: this.filteredData.every(function (item) {
                        return item.checked;
                    })
                }),
                toggleSort: this.toggleSort,
                sortedOrientation: sortedOrientation,
                sortedIdx: sortedIdx,
                rowSelect: rowSelect,
                contentWidth: contentWidth,
                contentHeight: contentHeight,
                noTableHeader: noTableHeader,
                rowHeight: rowHeight,
                rowHeightGetter: rowHeightGetter,
                onColumnResizeEndCallback: onColumnResizeEndCallback,
                headerHeight: headerHeight,
                columnResizeDisabled: columnResizeDisabled,
                rowClassNameGetter: rowClassNameGetter,
                id: 'wfui-filtered-table-' + uid
            }) : _react2.default.createElement(_TableBody2.default, {
                className: className,
                data: this.filteredData,
                itemFormat: itemFormat,
                pageSize: pageSize,
                currentPage: currentPage,
                selectable: selectable,
                onSelectionChange: onSelectionChange,
                onCheck: this.onCheck,
                checks: this.state.checkedItems,
                onRowClick: onRowClick,
                allCheckbox: _react2.default.createElement('input', {
                    type: 'Checkbox',
                    onChange: this.onAllCheck,
                    checked: this.filteredData.every(function (item) {
                        return item.checked;
                    })
                }),
                toggleSort: this.toggleSort,
                sortedOrientation: sortedOrientation,
                sortedIdx: sortedIdx,
                rowSelect: rowSelect,
                contentWidth: contentWidth,
                contentHeight: contentHeight,
                noTableHeader: noTableHeader,
                rowHeight: rowHeight,
                rowHeightGetter: rowHeightGetter,
                headerHeight: headerHeight,
                columnResizeDisabled: columnResizeDisabled,
                rowClassNameGetter: rowClassNameGetter,
                id: 'wfui-filtered-table-' + uid
            });

            if (paginatorDisplay) {
                var paginatorObject = this.generatePaginatorObject();
                var InjectedPaginatorDisplay = _react2.default.cloneElement(paginatorDisplay, paginatorObject);
                return _react2.default.createElement(
                    'div',
                    {
                        className: (0, _classnames2.default)(className, 'wfui-filtered-table'),
                        id: 'wfui-filtered-table-' + uid,
                        style: style
                    },
                    table,
                    InjectedPaginatorDisplay
                );
            }
            return _react2.default.createElement(
                'div',
                {
                    className: (0, _classnames2.default)(className, 'wfui-filtered-table'),
                    id: 'wfui-filtered-table-' + uid,
                    style: style
                },
                table
            );
        }
    }, {
        key: 'resizeTable',
        value: function resizeTable() {
            var _state4 = this.state,
                uid = _state4.uid,
                contentWidth = _state4.contentWidth;

            var element = document.getElementById('wfui-filtered-table-' + uid);
            if (element && element.offsetWidth !== contentWidth) {
                this.setState({ contentWidth: element.offsetWidth });
            }
        }
    }]);

    return FilteredTable;
}(_react2.default.Component);

FilteredTable.propTypes = {
    className: _propTypes2.default.string,
    paginatorDisplay: _propTypes2.default.element,
    data: _propTypes2.default.arrayOf(_propTypes2.default.any).isRequired,
    pageSize: _propTypes2.default.number,
    currentPage: _propTypes2.default.number,
    filterList: _propTypes2.default.arrayOf(_propTypes2.default.func),
    searchTerm: _propTypes2.default.string,
    selectable: _propTypes2.default.bool,
    rowSelect: _propTypes2.default.bool,
    onSelectionChange: _propTypes2.default.func,
    itemFormat: _propTypes2.default.arrayOf(_propTypes2.default.object),
    onResultsNumUpdate: _propTypes2.default.func,
    onFilteredArticleUpdate: _propTypes2.default.func,
    simpleSearch: _propTypes2.default.bool,
    searchKeys: _propTypes2.default.arrayOf(_propTypes2.default.string),
    sortedIdx: _propTypes2.default.number,
    defaultSortedOrientation: _propTypes2.default.string,
    wholeWord: _propTypes2.default.bool,
    searchLogic: _propTypes2.default.oneOf(['and', 'or']),
    onRowClick: _propTypes2.default.func,
    contentHeight: _propTypes2.default.number,
    noTableHeader: _propTypes2.default.bool,
    rowHeight: _propTypes2.default.number,
    rowHeightGetter: _propTypes2.default.func,
    headerHeight: _propTypes2.default.number,
    columnResizeDisabled: _propTypes2.default.bool,
    isResponsive: _propTypes2.default.bool,
    rowClassNameGetter: _propTypes2.default.func,
    style: _propTypes2.default.string,
    onColumnResizeEndCallback: _propTypes2.default.func,
    exclProps: _propTypes2.default.arrayOf(_propTypes2.default.string)
};

FilteredTable.defaultProps = {
    pageSize: 100000,
    currentPage: 1,
    filterList: [],
    searchTerm: '',
    selectable: false,
    rowSelect: true,
    sortedIdx: -1,
    wholeWord: false,
    onSelectionChange: function onSelectionChange(f) {
        return f;
    },
    onFilteredArticleUpdate: function onFilteredArticleUpdate(f) {
        return f;
    },
    searchLogic: 'and',
    noTableHeader: false,
    rowHeight: 50,
    headerHeight: 50,
    exclProps: []
};

var ResponsiveFilteredTable = function ResponsiveFilteredTable(props) {
    return _react2.default.createElement(FilteredTable, _extends({}, props, { isResponsive: true }));
};

var FilteredTableWrapper = function FilteredTableWrapper(props) {
    return _react2.default.createElement(FilteredTable, _extends({}, props, { isResponsive: false }));
};

exports.default = FilteredTableWrapper;
exports.ResponsiveFilteredTable = ResponsiveFilteredTable;