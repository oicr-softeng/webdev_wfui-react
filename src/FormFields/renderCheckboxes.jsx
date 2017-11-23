import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { FormGroup, ControlLabel, HelpBlock, Checkbox } from '../index';

const renderCheckboxes = ({
    className,
    label,
    options,
    input,
    help,
    required,
    disabled,
    preview,
    globalError,
    meta: { touched, error },
}) => (
    <div
        className={classNames(
            className,
            'wfui-form-item',
            {
                'wfui-form-item-error': error || globalError,
            },
            { 'wfui-form-disabled': disabled },
            { 'wfui-form-preview': preview },
        )}
    >
        <ControlLabel>{label}</ControlLabel>
        {required && <b className="required"> *</b>}
        <FormGroup
            className="wfui-form-checkboxes"
            validationState={touched && (error || globalError) ? 'error' : null}
        >
            {options.map((option, i) => {
                const _key = typeof option === 'string' ? option : option.key;
                const _option =
                    typeof option === 'string' ? option : option.value;
                return (
                    <Checkbox
                        key={i}
                        name={input.name}
                        value={_key}
                        disabled={disabled}
                        checked={input.value && input.value.includes(_key)}
                        className={
                            input.value && input.value.includes(_key)
                                ? 'active'
                                : ''
                        }
                        onChange={e => {
                            const newValue = [...input.value];
                            if (e.target.checked) {
                                newValue.push(_key);
                            } else {
                                newValue.splice(newValue.indexOf(_key), 1);
                            }
                            return input.onChange(newValue);
                        }}
                    >
                        {_option}
                    </Checkbox>
                );
            })}
            {touched &&
                error && (
                    <HelpBlock className="wfui-form-error">
                        <span>{error}</span>
                    </HelpBlock>
                )}
            {touched &&
                globalError && (
                    <HelpBlock className="wfui-form-error">
                        <span>{globalError}</span>
                    </HelpBlock>
                )}
            {help && (
                <div
                    className="wfui-form-description"
                    dangerouslySetInnerHTML={{ __html: help }}
                />
            )}
        </FormGroup>
    </div>
);

export default renderCheckboxes;
