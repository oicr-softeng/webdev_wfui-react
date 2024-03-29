import React from 'react';
import classNames from 'classnames';
import List from './List';
import Search from '../util/searchUtil';

/*
 * Applies the filtering to the articles and then passes its' props to List for display.
 */
class FilteredList extends React.Component {
   constructor(props) {
       super(props);
       this.state = {
           currentPage: props.currentPage,
       };
   }

   goto(page) {
    const { currentPage } = this.state;
    const { pageSize, data } = this.props;

    const filteredData = this.applySearch(
        this.generateFilteredArticles(data)
    );
    const dataLength = filteredData ? filteredData.length : 0;
    const numPages = Math.ceil(dataLength / pageSize);

    if (page > 0 && page <= numPages) {
        this.setState({ currentPage: page });
    }
}

   generateFilteredArticles(articles) {
      const { filterList } = this.props;
      let filteredArticles = articles;
      filterList.forEach(filter => (
         filteredArticles = filteredArticles.filter(filter)
      ));
      return filteredArticles;
   }

   applySearch(articles) {
      const { searchTerm, simpleSearch, searchKeys, wholeWord, searchLogic } = this.props;
      if (searchTerm) {
        const filteredArticles = simpleSearch ? Search.simpleSearch(articles, searchTerm, searchKeys, wholeWord, searchLogic) : Search.search(articles, searchTerm);
        return filteredArticles;
      }
      return articles;
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
                    return (
                        () => (
                            this.setState({ currentPage: page })
                        )
                    );
               }
               return undefined;
           },
       };
       return Paginator;
   }

   render() {
      const { className, itemDisplay, paginatorDisplay, data, pageSize, sortFunction, container, onDisplay, onNumOfListChange, onListDidMount, noWrapper } = this.props;
      const { currentPage } = this.state;
      const filteredData = this.applySearch(this.generateFilteredArticles(data));
      if (sortFunction) {
        filteredData.sort(sortFunction);
      }

      const paginatorObject = this.generatePaginatorObject();

      if (noWrapper && !paginatorDisplay) {
        return (
            <List
                data={filteredData}
                itemDisplay={itemDisplay}
                pageSize={pageSize}
                container={container}
                currentPage={currentPage}
                onDisplay={onDisplay}
                onNumOfListChange={onNumOfListChange}
                onListDidMount={onListDidMount}
            />
        );
      }
      
      return (
         <div className={classNames(className, 'wfui-filtered-list')}>
            <List
                data={filteredData}
                itemDisplay={itemDisplay}
                pageSize={pageSize}
                container={container}
                currentPage={currentPage}
                onDisplay={onDisplay}
                onNumOfListChange={onNumOfListChange}
                onListDidMount={onListDidMount}
            />
            { paginatorDisplay ? React.cloneElement(paginatorDisplay, paginatorObject) : null }
         </div>
      );
   }
}

FilteredList.propTypes = {
    itemDisplay: React.PropTypes.element.isRequired,
    container: React.PropTypes.element,
    paginatorDisplay: React.PropTypes.element,
    data: React.PropTypes.arrayOf(React.PropTypes.any).isRequired,
    pageSize: React.PropTypes.number,
    currentPage: React.PropTypes.number,
    filterList: React.PropTypes.arrayOf(React.PropTypes.func),
    sortFunction: React.PropTypes.func,
    searchTerm: React.PropTypes.string,
    onDisplay: React.PropTypes.func,
    onNumOfListChange: React.PropTypes.func,
    onListDidMount: React.PropTypes.func,
    simpleSearch: React.PropTypes.bool,
    searchKeys: React.PropTypes.arrayOf(React.PropTypes.string),
    wholeWord: React.PropTypes.bool,
    searchLogic: React.PropTypes.oneOf(['and', 'or']),
    noWrapper: React.PropTypes.bool,
};

FilteredList.defaultProps = {
    pageSize: 1000,
    currentPage: 1,
    filterList: [],
    container: <div />,
    searchTerm: '',
    sortFunction: undefined,
    onDisplay: () => undefined,
    onNumOfListChange: () => undefined,
    onListDidMount: () => undefined,
    searchLogic: 'and',
};

export default FilteredList;
