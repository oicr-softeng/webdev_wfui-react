import React, { cloneElement } from 'react';
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
    descDisplay,
    fullWidth,
    showErrors
}) => (
        <div
            className={classNames(
                className,
                'wfui-form-item',
                {
                    'wfui-form-item-error': (touched || showErrors) && (error || globalError),
                },
                { 'wfui-form-disabled': disabled },
                { 'wfui-form-preview': preview },
                { 'wfui-form-item-full-width': fullWidth },
            )}
        >
            {label && (
                <div className="wfui-form-label">
                    <ControlLabel>
                        {label}
                        {required && <b className="required"> *</b>}
                    </ControlLabel>
                </div>
            )}
            <FormGroup
                className={`wfui-form-field ${
                    descDisplay
                        ? 'wfui-form-field-with-description'
                        : 'wfui-form-field-no-description'
                    } wfui-form-checkboxes`}
                validationState={(touched || showErrors) && (error || globalError) ? 'error' : null}
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
                                input.onBlur();
                                return input.onChange(newValue);
                            }}
                        >
                            <span dangerouslySetInnerHTML={{ __html: _option }} />
                            {option.required && <b className="required"> *</b>}
                        </Checkbox>
                    );
                })}
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
                {help && !preview && (
                    <div
                        className="wfui-form-help"
                        dangerouslySetInnerHTML={{ __html: help }}
                    />
                )}
            </FormGroup>
            {descDisplay && !preview ? cloneElement(descDisplay) : ''}
        </div>
    );

export default renderCheckboxes;