import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { Spinner, FormGroup, FormControl, ControlLabel, HelpBlock } from '../';

/**
 * Autocomplete component.
 */
const Autocomplete = ({
    fetching,
    items,
    onClickItem,
    itemDisplay,
    textNoResult,
    autoFetched,
}) => (
        <div className="navbar-form">
            <div className="form-group">
                <ul
                    id="ui-autocomplete"
                    className="autocomplete-ps ui-menu ui-widget ui-widget-content ui-autocomplete ui-front"
                >
                    {!fetching && autoFetched && (!items || items.length === 0) && (
                        <li className="ui-menu-item">{textNoResult}</li>
                    )}
                    {!fetching &&
                        autoFetched &&
                        items &&
                        items.map((item, idx) =>
                            itemDisplay ? (
                                React.cloneElement(
                                    <li key={idx} className="ui-menu-item">
                                        {itemDisplay(item, onClickItem)}
                                    </li>,
                                    Object.assign({}, {}, { key: idx }),
                                )
                            ) : (
                                    <li key={idx} className="ui-menu-item">
                                        <div className="ui-menu-item-wrapper">
                                            <a onClick={onClickItem} data-key={item}>
                                                {`${item}`}
                                            </a>
                                        </div>
                                    </li>
                                ),
                        )}
                    {fetching && (
                        <li className="mp ps">
                            <Spinner
                                type={1}
                                color="#0072c6"
                                fontSize={'5px'}
                                margin={'10px auto'}
                            />
                        </li>
                    )}
                </ul>
            </div>
        </div>
    );

/**
 * Reusable field component.
 */
class renderAutocomplete extends React.Component {
    constructor() {
        super();
        this.state = {
            autoCompleteItems: [],
            fetching: false,
            term: '',
            autoTerm: 'default',
            secondsElapsed: 0,
            autoFetched: false,
        };
    }
    componentDidMount() {
        const { queryInterval } = this.props;
        this.interval = setInterval(() => this.tick(), queryInterval);
    }
    componentWillUnmount() {
        clearInterval(this.interval);
    }
    tick() {
        const { getAutocomplete } = this.props;
        const { fetching, secondsElapsed, term, autoTerm } = this.state;

        if (!fetching) {
            if (secondsElapsed > 3) {
                if (term.length > 0 && autoTerm !== term) {
                    this.setState({
                        autoTerm: term,
                        secondsElapsed: 0,
                        fetching: true,
                        autoFetched: false,
                    });
                    getAutocomplete(term).then(({ data }) => {
                        this.setState({
                            fetching: false,
                            autoFetched: true,
                            autoCompleteItems: data,
                        });
                    });
                }
            } else {
                this.setState(prevState => ({
                    secondsElapsed: prevState.secondsElapsed + 1,
                }));
            }
        }
    }
    render() {
        const {
            className,
            inline,
            input,
            label,
            postfix,
            help,
            placeholder,
            type,
            maxlength,
            max,
            min,
            onHandleChange,
            required,
            disabled,
            preview,
            globalError,
            itemDisplay,
            textNoResult,
            fullWidth,
            meta: { touched, error },
            showErrors
        } = this.props;
        const { fetching, autoFetched, term, autoCompleteItems } = this.state;

        return (
            <div
                className={classNames(
                    className,
                    'wfui-form-item',
                    {
                        'wfui-form-item-error':
                            (touched || showErrors) && (error || globalError),
                    },
                    { 'wfui-form-inline': inline },
                    { 'wfui-form-disabled': disabled },
                    { 'wfui-form-preview': preview },
                    { answered: input.value },
                    { 'wfui-form-item-full-width': fullWidth },
                )}
            >
                <div className="wfui-form-label">
                    <ControlLabel>
                        {label}
                        {required && <b className="required"> *</b>}
                    </ControlLabel>
                </div>
                <FormGroup
                    className="wfui-form-input wfui-form-autocomplete"
                    validationState={
                        (touched || showErrors) && (error || globalError) ? 'error' : null
                    }
                >
                    <FormControl
                        {...input}
                        placeholder={
                            placeholder || placeholder === ''
                                ? placeholder
                                : label
                        }
                        type={type}
                        maxLength={maxlength}
                        min={min}
                        max={max}
                        disabled={disabled}
                        onChange={e => {
                            input.onChange(e);
                            this.setState({
                                term: e.target.value,
                                secondsElapsed: 0,
                                autoFetched: false,
                            });
                            if (!e.target.value) {
                                this.setState({
                                    term: '',
                                    autoTerm: 'default',
                                    autoCompleteItems: [],
                                });
                            }
                            if (onHandleChange) onHandleChange(e);
                        }}
                        autoComplete="off"
                    />
                    {postfix && (
                        <div className="wfui-form-postfix">{postfix}</div>
                    )}
                    {(autoCompleteItems.length > 0 || term) && (
                        <Autocomplete
                            items={autoCompleteItems}
                            onClickItem={e => {
                                const _term = e.target.getAttribute('data-key');
                                if (_term) {
                                    input.onChange(_term);
                                    this.setState({
                                        term: _term,
                                        autoTerm: _term,
                                        autoCompleteItems: [],
                                        autoFetched: false,
                                    });
                                    if (onHandleChange) onHandleChange(_term);
                                }
                            }}
                            autoFetched={autoFetched}
                            fetching={fetching}
                            itemDisplay={itemDisplay}
                            textNoResult={textNoResult}
                        />
                    )}
                    <FormControl.Feedback />
                    {(touched || showErrors) && error && (
                        <HelpBlock className="wfui-form-error">
                            <span>{error}</span>
                        </HelpBlock>
                    )}
                    {(touched || showErrors) && globalError && (
                        <HelpBlock className="wfui-form-error">
                            <span>{globalError}</span>
                        </HelpBlock>
                    )}
                    {help && (
                        <div
                            className="wfui-form-help"
                            dangerouslySetInnerHTML={{ __html: help }}
                        />
                    )}
                </FormGroup>
            </div>
        );
    }
}
renderAutocomplete.propTypes = {
    queryInterval: PropTypes.number,
    fullWidth: PropTypes.bool,
};
renderAutocomplete.defaultProps = {
    queryInterval: 100,
    textNoResult: 'No results available',
    fullWidth: false,
};

export default renderAutocomplete;
