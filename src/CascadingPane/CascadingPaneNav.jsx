/* global window, document */
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Glyphicon, Alert } from 'react-bootstrap';

import LoadingComponent from '../LoadingComponent/LoadingComponent';
import FilteredTable from '../FilteredTable/2/FilteredTable';

class CascadingPaneNav extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            selected: props.cascNav || '',
            fetched: props.fetchedNav,
            dataWithClass: props.data
                ? props.data.map(item => {
                      const newItem = JSON.parse(JSON.stringify(item));
                      newItem.className = `nav-item-${
                          item[props.itemIdField]
                      } ${
                          item[props.itemIdField] === props.cascNav
                              ? 'active'
                              : ''
                      }`;
                      return newItem;
                  })
                : [],
            tableHeight: 0,
        };

        this.onHandleClick = this.onHandleClick.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        const { fetchedNav, cascNav, data } = this.props;
        if (fetchedNav !== nextProps.fetchedNav) {
            this.setState({
                fetched: nextProps.fetchedNav,
            });
        }
        if (cascNav) {
            if (!nextProps.cascNav) {
                window.location.href = `${
                    window.location.href.split('?')[0]
                }?cascNav=${nextProps.data[0][nextProps.itemIdField]}`;
            }
            if (cascNav !== nextProps.cascNav) {
                this.setState({
                    selected: nextProps.cascNav || '',
                    dataWithClass: nextProps.data
                        ? nextProps.data.map(item => {
                              const newItem = JSON.parse(JSON.stringify(item));
                              newItem.className = `nav-item-${
                                  item[nextProps.itemIdField]
                              } ${
                                  item[nextProps.itemIdField] ===
                                  nextProps.cascNav
                                      ? 'active'
                                      : ''
                              }`;
                              return newItem;
                          })
                        : [],
                });
            }
        } else if (nextProps.cascNav) {
            this.setState({
                selected: nextProps.cascNav,
                dataWithClass: nextProps.data
                    ? nextProps.data.map(item => {
                          const newItem = JSON.parse(JSON.stringify(item));
                          newItem.className = `nav-item-${
                              item[nextProps.itemIdField]
                          } ${
                              item[nextProps.itemIdField] === nextProps.cascNav
                                  ? 'active'
                                  : ''
                          }`;
                          return newItem;
                      })
                    : [],
            });
        } else if (nextProps.data && nextProps.data.length > 0) {
            window.location.href = `${
                window.location.href.split('?')[0]
            }?cascNav=${nextProps.data[0][nextProps.itemIdField]}`;
        }
        if (JSON.stringify(data) !== JSON.stringify(nextProps.data)) {
            this.setState({
                dataWithClass: nextProps.data
                    ? nextProps.data.map(item => {
                          const newItem = JSON.parse(JSON.stringify(item));
                          newItem.className = `nav-item-${
                              item[nextProps.itemIdField]
                          } ${
                              item[nextProps.itemIdField] === nextProps.cascNav
                                  ? 'active'
                                  : ''
                          }`;
                          return newItem;
                      })
                    : [],
            });
        }
    }

    componentDidUpdate(prevProps, prevState) {
        const { updateGroupSelect, data, itemIdField } = this.props;
        const { selected, tableHeight } = this.state;
        if (
            (prevProps.data.length === 0 && data.length > 0) ||
            selected !== prevState.selected ||
            JSON.stringify(data) !== JSON.stringify(prevProps.data)
        ) {
            const groupSelected = data.filter(
                item => item[itemIdField] === selected,
            );
            updateGroupSelect(groupSelected[0]);
        }

        // Set table height
        if (!tableHeight) {
            const navList = document.getElementsByClassName('cascading-pane-nav-list')[0];
            if (navList) {
                this.setState({ tableHeight: navList.offsetHeight });
            }
        }
    }

    onHandleClick(item) {
        const { itemIdField } = this.props;
        const { selected } = this.state;

        if (selected !== item[itemIdField]) {
            window.location.href = `${
                window.location.href.split('?')[0]
            }?cascNav=${encodeURI(item[itemIdField])}`;
        }
    }

    render() {
        const {
            key,
            className,
            headerDisplay,
            footerDisplay,
            navFetch,
            data,
            itemConfigDisplay,
            getCascadingNav,
            logoField,
            logoDefault,
            titleField,
            itemIdField,
            isHiddenField,
        } = this.props;
        const { fetched, dataWithClass, tableHeight } = this.state;

        const navFormat = [];
        if (logoField) {
            navFormat.push({
                name: 'Logo',
                className: 'nav-group-logo',
                display: item => (
                    <img
                        role="presentation"
                        src={item[logoField] || logoDefault}
                        className="cascading-nav-logo"
                    />
                ),
                flexGrow: 0,
                width: 37,
            });
        }
        navFormat.push({
            name: 'Title',
            className: 'nav-group-title',
            display: item =>
                item[titleField] && item[titleField].length > 0
                    ? item[titleField]
                    : item[itemIdField],
            width: 165,
        });
        if (isHiddenField) {
            navFormat.push({
                name: 'Visibility',
                className: 'nav-group-visibility',
                display: item =>
                    item[isHiddenField] ? (
                        <Glyphicon
                            glyph="eye-close"
                            title="Only visible to CUD administrators"
                        />
                    ) : (
                        ''
                    ),
                flexGrow: 0,
                width: 45,
            });
        }
        if (itemConfigDisplay) {
            navFormat.push({
                name: 'Actions',
                className: 'nav-group-actions',
                display: item =>
                    React.cloneElement(
                        itemConfigDisplay,
                        Object.assign(
                            {},
                            { item },
                            { updateNav: () => getCascadingNav() },
                        ),
                    ),
                excludeRowClick: true,
                flexGrow: 0,
                width: 72,
            });
        }

        return (
            <div
                className={classNames(className, 'cascading-pane-nav')}
                key={key}
            >
                {headerDisplay}
                <LoadingComponent {...navFetch}>
                    <div className="cascading-pane-nav-list">
                        {fetched &&
                            !data && (
                                <Alert bsStyle="danger">
                                    No data available
                                </Alert>
                            )}
                        {fetched &&
                            data && (
                                <FilteredTable
                                    className="table table-striped table-bordered table-condensed table-cascading-nav"
                                    data={dataWithClass}
                                    itemFormat={navFormat}
                                    rowClickable
                                    onRowClick={item =>
                                        this.onHandleClick(item)
                                    }
                                    contentHeight={tableHeight}
                                    noTableHeader
                                />
                            )}
                    </div>
                </LoadingComponent>
                {footerDisplay}
            </div>
        );
    }
}

CascadingPaneNav.propTypes = {
    role: PropTypes.string,
    key: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    data: PropTypes.array,
    getCascadingNav: PropTypes.func,
    navFetch: PropTypes.shape({
        status: PropTypes.string,
        isFetching: PropTypes.bool,
    }),
    fetchedNav: PropTypes.bool,
    cascNav: PropTypes.string,
    updateGroupSelect: PropTypes.func,

    className: PropTypes.string,
    itemIdField: PropTypes.string,
    logoField: PropTypes.string,
    logoDefault: PropTypes.string,
    titleField: PropTypes.string,
    isHiddenField: PropTypes.string,

    headerDisplay: PropTypes.element,
    footerDisplay: PropTypes.element,
    itemConfigDisplay: PropTypes.element,
};

CascadingPaneNav.defaultProps = {
    role: 'nav',
    key: 0,
    data: [],
    getCascadingNav: f => f,
    navFetch: {
        status: '',
        isFetching: false,
    },
    fetchedNav: false,
    cascNav: '',
    updateGroupSelect: f => f,

    className: '',
    itemIdField: 'id',
    logoField: '',
    logoDefault: '',
    titleField: 'title',
    isHiddenField: '',
};

export default CascadingPaneNav;
