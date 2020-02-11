import React, { Component } from 'react';
import PropTypes from 'prop-types';

/**
 * Input table
 */
class InputTable extends Component {
    constructor() {
        super();
        this.state = {
            refs: '',
        };
        this.onHandleClick = this.onHandleClick.bind(this);
    }

    onHandleClick(e) {
        const { stopPropagation } = this.props;
        if (stopPropagation) e.stopPropagation();
    }

    render() {
        const {
            label,
            fieldLabel,
            fieldType,
            description,
            children,
            className,
        } = this.props;

        // Get the number of inputs
        this.numOfInputs = children.length;

        // Render input fields
        //= =========
        let fields;
        if (children) {
            fields = (
                <div className="wfui-input-table__form">
                    <p
                        className="wfui-input-table__label"
                        dangerouslySetInnerHTML={{
                            __html: fieldLabel.replace(/\n/g, '<br/>'),
                        }}
                    />
                    <ul className="wfui-input-table__ul" ref="allInputs">
                        {children.map(function(field, i) {
                            if (children.length - 1 > i) {
                                var condition = (
                                    <span className="wfui-input-table__condition">
                                        {fieldType.toUpperCase()}
                                    </span>
                                );
                            }
                            return (
                                <li
                                    key={i}
                                    className="wfui-input-table__li"
                                    ref="hello"
                                >
                                    {field}
                                    {condition}
                                </li>
                            );
                            this.numOfInputs = children.length;
                        })}
                    </ul>
                </div>
            );
        } //= =========

        return (
            <div
                className={`wfui-input-table ${className}` ? className : ''}
                onClick={this.onHandleClick}
            >
                <label
                    dangerouslySetInnerHTML={{
                        __html: label.replace(/\n/g, '<br/>'),
                    }}
                />
                {description}
                {fields}
            </div>
        );
    }
}

/**
 * Property types
 */
InputTable.propTypes = {
    label: PropTypes.string,
    fieldLabel: PropTypes.string,
    fieldType: PropTypes.oneOf(['and', 'or']),
    description: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
    stopPropagation: PropTypes.bool,
};
InputTable.defaultProps = {
    label: '',
    fieldLabel: '',
    fieldType: 'and',
    description: '',
    stopPropagation: false,
};

export default InputTable;