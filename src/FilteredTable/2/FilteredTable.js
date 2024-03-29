import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import TableBody, { ResponsiveTableBody } from './TableBody';
import Search from '../../util/searchUtil';

/*
 * Applies the filtering to the articles and then passes its' props to List for display.
 */

class FilteredTable extends React.Component {
    constructor(props) {
        super(props);
        this.onCheck = this.onCheck.bind(this);
        this.onAllCheck = this.onAllCheck.bind(this);
        this.lastResultsCount = -1;
        this.state = {
            currentPage: props.currentPage,
            checkedItems: new Array(props.data.length).fill(false),
            sortedIdx: props.sortedIdx,
            sortedOrientation: props.defaultSortedOrientation || 'desc',
            dataWithState: this.transformData(props.data),
            uid: new Date().getTime(),
            contentWidth: 0,
        };
        this.resizeTable = this.resizeTable.bind(this);
        this.toggleSort = this.toggleSort.bind(this);
        this.lastFilteredData = [];
        this.filteredData = [];
    }

    

    componentDidMount() {
        this.onFilter(this.generateFilteredArticles(this.applySearch(this.props.data)));
        window.addEventListener('resize', this.resizeTable);
        this.resizeTable();
    }
    componentWillUnmount() {
        window.removeEventListener('resize', this.resizeTable);
    }

    transformData(data) {
        return data.map((obj, i) => {
            const _obj = JSON.stringify(obj) ? JSON.parse(JSON.stringify(obj)) : {};
            _obj.checked = false;
            _obj.idx = i;
            return _obj;
        });
    }
    componentWillReceiveProps(nextProps) {
        /* Also note: JSON.stringify is the cheapest arbitrary comparison function
         * since it runs on native code. */
        const thisData = this.props.data;
        const nextData = nextProps.data;

        const newState = {};

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

    componentDidUpdate() {
        const { data } = this.props;
        this.onFilter(this.generateFilteredArticles(this.applySearch(data)));
    }

    /* This is called when a individual item's checkbox is clicked */
    onCheck(index) {
        const { dataWithState } = this.state;
        const newArray = dataWithState.slice(0);
        newArray[index].checked = !newArray[index].checked;

        /* We do this since setstate does not immediately mutate the state */
        this.setState({ dataWithState: newArray }, () => this.selectionChanged());
    }

    onAllCheck() {
        const { dataWithState } = this.state;
        const newArray = dataWithState.slice(0);

        const filteredData = this.generateFilteredArticles(this.applySearch(dataWithState));

        if (filteredData.every(item => item.checked)) {
            /* If all items are checked, then uncheck everything */
            filteredData.forEach((item) => {
                const idx = newArray.findIndex(i => i.idx === item.idx);
                if (idx > -1) newArray[idx].checked = false;
            });
        } else {
            // Reset
            filteredData.forEach((item) => {
                const idx = newArray.findIndex(i => i.idx === item.idx);
                if (idx > -1) newArray[idx].checked = false;
            });

            /* Else check everything */
            filteredData.forEach((item) => {
                const idx = newArray.findIndex(i => i.idx === item.idx);
                if (idx > -1) newArray[idx].checked = true;
            });
        }

        this.setState({ dataWithState: newArray }, () => this.selectionChanged());
    }

    toggleSort(event, idx) {
        const { sortedIdx, sortedOrientation } = this.state;
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
    onFilter(filteredArticles) {
        const { onResultsNumUpdate, onFilteredArticleUpdate } = this.props;

        /* Now sort the articles*/
        const resultsCount = filteredArticles.length;
        if (this.lastResultsCount !== resultsCount) {
            this.lastResultsCount = resultsCount;
            if (onResultsNumUpdate) {
                onResultsNumUpdate(resultsCount);
            }
        }
        if (onFilteredArticleUpdate) {
            if (
                this.lastFilteredData.length !== filteredArticles.length ||
                JSON.stringify(this.lastFilteredData) !== JSON.stringify(filteredArticles)
            ) {
                this.lastFilteredData = filteredArticles;
                onFilteredArticleUpdate(filteredArticles);
            }
        }
    }

    generateFilteredArticles(articles) {
        const { filterList, itemFormat } = this.props;
        const { sortedIdx, sortedOrientation } = this.state;

        let filteredArticles = articles;
        filterList.forEach(filter => (filteredArticles = filteredArticles.filter(filter)));

        if (sortedIdx !== -1) {
            filteredArticles = filteredArticles.sort((a, b) => {
                const getSortingData = itemFormat[sortedIdx].sortingKey;
                const aData = getSortingData(a);
                const bData = getSortingData(b);
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

    applySearch(articles) {
        const { searchTerm, simpleSearch, searchKeys, wholeWord, searchLogic, exclProps } = this.props;
        if (searchTerm) {
            const filteredArticles = simpleSearch
                ? Search.simpleSearch(articles, searchTerm, searchKeys, wholeWord, searchLogic, true, exclProps)
                : Search.search(articles, searchTerm, exclProps);
            return filteredArticles;
        }

        return articles;
    }

    /* Return a list of the indices of all selected items */
    selectionChanged() {
        const { onSelectionChange } = this.props;
        const { dataWithState } = this.state;

        const indexes = [];
        const checkedItems = dataWithState.filter((item, i) => {
            if (item.checked) indexes.push(i);
            return item.checked;
        });

        onSelectionChange(indexes, checkedItems);
    }

    generatePaginatorObject() {
        const { currentPage } = this.state;
        const { pageSize, data } = this.props;

        const filteredData = this.applySearch(this.generateFilteredArticles(data));
        const dataLength = filteredData ? filteredData.length : 0;
        const numPages = Math.ceil(dataLength / pageSize);

        const Paginator = {
            currentPage,
            numPages,
            /* Returns a function that will open the page 'page'
             * or undefined if the page does not exist.  */
            getOpenPage: (page) => {
                if (page > 0 && page <= numPages) {
                    return () => this.setState({ currentPage: page });
                }
                return undefined;
            },
        };
        return Paginator;
    }

    render() {
        const {
            style,
            itemFormat,
            className,
            paginatorDisplay,
            pageSize,
            selectable,
            onSelectionChange,
            onRowClick,
            rowSelect,
            contentHeight,
            noTableHeader,
            rowHeight,
            rowHeightGetter,
            headerHeight,
            columnResizeDisabled,
            isResponsive,
            rowClassNameGetter,
            onColumnResizeEndCallback
        } = this.props;

        const {
            currentPage,
            dataWithState,
            sortedOrientation,
            sortedIdx,
            uid,
            contentWidth,
        } = this.state;
        this.filteredData = this.applySearch(this.generateFilteredArticles(dataWithState));

        /* We have to do this to avoid breaking backwards compatibility */
        const table = isResponsive ? (
            <ResponsiveTableBody
                className={className}
                data={this.filteredData}
                itemFormat={itemFormat}
                pageSize={pageSize}
                currentPage={currentPage}
                selectable={selectable}
                onSelectionChange={onSelectionChange}
                onCheck={this.onCheck}
                checks={this.state.checkedItems}
                onRowClick={onRowClick}
                allCheckbox={
                    <input
                        type="Checkbox"
                        onChange={this.onAllCheck}
                        checked={this.filteredData.every(item => item.checked)}
                    />
                }
                toggleSort={this.toggleSort}
                sortedOrientation={sortedOrientation}
                sortedIdx={sortedIdx}
                rowSelect={rowSelect}
                contentWidth={contentWidth}
                contentHeight={contentHeight}
                noTableHeader={noTableHeader}
                rowHeight={rowHeight}
                rowHeightGetter={rowHeightGetter}
                onColumnResizeEndCallback={onColumnResizeEndCallback}
                headerHeight={headerHeight}
                columnResizeDisabled={columnResizeDisabled}
                rowClassNameGetter={rowClassNameGetter}
                id={`wfui-filtered-table-${uid}`}
            />
        ) : (
            <TableBody
                className={className}
                data={this.filteredData}
                itemFormat={itemFormat}
                pageSize={pageSize}
                currentPage={currentPage}
                selectable={selectable}
                onSelectionChange={onSelectionChange}
                onCheck={this.onCheck}
                checks={this.state.checkedItems}
                onRowClick={onRowClick}
                allCheckbox={
                    <input
                        type="Checkbox"
                        onChange={this.onAllCheck}
                        checked={this.filteredData.every(item => item.checked)}
                    />
                }
                toggleSort={this.toggleSort}
                sortedOrientation={sortedOrientation}
                sortedIdx={sortedIdx}
                rowSelect={rowSelect}
                contentWidth={contentWidth}
                contentHeight={contentHeight}
                noTableHeader={noTableHeader}
                rowHeight={rowHeight}
                rowHeightGetter={rowHeightGetter}
                headerHeight={headerHeight}
                columnResizeDisabled={columnResizeDisabled}
                rowClassNameGetter={rowClassNameGetter}
                id={`wfui-filtered-table-${uid}`}
            />
        );

        if (paginatorDisplay) {
            const paginatorObject = this.generatePaginatorObject();
            const InjectedPaginatorDisplay = React.cloneElement(paginatorDisplay, paginatorObject);
            return (
                <div
                    className={classNames(className, 'wfui-filtered-table')}
                    id={`wfui-filtered-table-${uid}`}
                    style={style}
                >
                    {table}
                    {InjectedPaginatorDisplay}
                </div>
            );
        }
        return (
            <div
                className={classNames(className, 'wfui-filtered-table')}
                id={`wfui-filtered-table-${uid}`}
                style={style}
            >
                {table}
            </div>
        );
    }
    resizeTable() {
        const { uid, contentWidth } = this.state;
        const element = document.getElementById(`wfui-filtered-table-${uid}`);
        if (element && element.offsetWidth !== contentWidth) {
            this.setState({ contentWidth: element.offsetWidth });
        }
    }
}

FilteredTable.propTypes = {
    className: PropTypes.string,
    paginatorDisplay: PropTypes.element,
    data: PropTypes.arrayOf(PropTypes.any).isRequired,
    pageSize: PropTypes.number,
    currentPage: PropTypes.number,
    filterList: PropTypes.arrayOf(PropTypes.func),
    searchTerm: PropTypes.string,
    selectable: PropTypes.bool,
    rowSelect: PropTypes.bool,
    onSelectionChange: PropTypes.func,
    itemFormat: PropTypes.arrayOf(PropTypes.object),
    onResultsNumUpdate: PropTypes.func,
    onFilteredArticleUpdate: PropTypes.func,
    simpleSearch: PropTypes.bool,
    searchKeys: PropTypes.arrayOf(PropTypes.string),
    sortedIdx: PropTypes.number,
    defaultSortedOrientation: PropTypes.string,
    wholeWord: PropTypes.bool,
    searchLogic: PropTypes.oneOf(['and', 'or']),
    onRowClick: PropTypes.func,
    contentHeight: PropTypes.number,
    noTableHeader: PropTypes.bool,
    rowHeight: PropTypes.number,
    rowHeightGetter: PropTypes.func,
    headerHeight: PropTypes.number,
    columnResizeDisabled: PropTypes.bool,
    isResponsive: PropTypes.bool,
    rowClassNameGetter: PropTypes.func,
    style: PropTypes.string,
    onColumnResizeEndCallback: PropTypes.func,
    exclProps: PropTypes.arrayOf(PropTypes.string),
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
    onSelectionChange: f => f,
    onFilteredArticleUpdate: f => f,
    searchLogic: 'and',
    noTableHeader: false,
    rowHeight: 50,
    headerHeight: 50,
    exclProps: [],
};

const ResponsiveFilteredTable = props => <FilteredTable {...props} isResponsive />;

const FilteredTableWrapper = props => <FilteredTable {...props} isResponsive={false} />;

export default FilteredTableWrapper;

export { ResponsiveFilteredTable };
