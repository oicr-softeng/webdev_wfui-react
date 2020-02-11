import React, { cloneElement } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {
    FormControl,
    Form,
    FormGroup,
    ControlLabel,
    HelpBlock,
    Col,
} from '../index';

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
    meta: { touched, error, data },
    descDisplay,
    fullWidth,
    onChange,
    inline,
    showErrors
}) => (
        <Form.Row
            className={classNames(
                className,
                'wfui-form-item',
                {
                    'wfui-form-item-error': (touched || showErrors) && (error || globalError),
                },
                {
                    'wfui-form-item-warning': (touched || showErrors) && data && data.warning,
                },
                { 'wfui-form-disabled': disabled },
                { 'wfui-form-preview': preview },
                { 'wfui-form-item-full-width': fullWidth }
            )}
        >
            {label && (
                <Col xs={12} lg={inline ? 2 : 12} className="wfui-form-label">
                    <ControlLabel>
                        {label}
                        {required && <b className="required"> *</b>}
                    </ControlLabel>
                </Col>
            )}
            <FormGroup
                as={Col}
                xs={12}
                lg={
                    inline && label
                        ? descDisplay && !preview
                            ? 4
                            : 10
                        : descDisplay && !preview
                            ? 6
                            : 12
                }
                className={`wfui-form-field ${
                    descDisplay
                        ? 'wfui-form-field-with-description'
                        : 'wfui-form-field-no-description'
                    } wfui-form-checkboxes`}
            // validationState={(touched || showErrors) && (error || globalError) ? 'error' : null}
            >
                <FormControl
                    isInvalid={(touched || showErrors) && (error || globalError)}
                    isValid={(touched || showErrors) && data && data.warning}
                    className={classNames('d-none', 'custom-form-control', {
                        'is-valid-warning': (touched || showErrors) && data && data.warning,
                    })}
                />
                <div className="wfui-form-checkbox-group-container custom-form-control-wrapper">
                    {options.map((option, i) => {
                        const _key =
                            typeof option === 'string' ? option : option.key;
                        const _option =
                            typeof option === 'string' ? option : option.value;
                        return (
                            <Form.Check
                                type="checkbox"
                                key={i}
                                className={`wfui-form-checkbox-container${
                                    input.value && input.value.includes(_key)
                                        ? ' active'
                                        : ''
                                    }${disabled ? ' disabled' : ''}${
                                    preview ? ' preview' : ''
                                    }`}
                            >
                                <Form.Check.Label>
                                    <Form.Check.Input
                                        type="checkbox"
                                        name={input.name}
                                        value={_key}
                                        checked={
                                            input.value &&
                                            input.value.includes(_key)
                                        }
                                        disabled={disabled}
                                        onChange={e => {
                                            const newValue = [...input.value];
                                            if (e.target.checked) {
                                                newValue.push(_key);
                                            } else {
                                                newValue.splice(
                                                    newValue.indexOf(_key),
                                                    1
                                                );
                                            }
                                            input.onBlur();
                                            input.onChange(newValue);
                                            if (typeof onChange === 'function')
                                                onChange(newValue, input);
                                        }}
                                        isInvalid={
                                            touched && (error || globalError)
                                        }
                                    />
                                    <span
                                        dangerouslySetInnerHTML={{
                                            __html: _option,
                                        }}
                                    />
                                    {option.required && (
                                        <b className="required"> *</b>
                                    )}
                                </Form.Check.Label>
                            </Form.Check>
                        );
                    })}
                </div>
                {(touched || showErrors) && error && (
                    <Form.Control.Feedback
                        className="wfui-form-error"
                        type="invalid"
                    >
                        {Array.isArray(error)
                            ? error.map(item => <div>{item}</div>)
                            : error}
                    </Form.Control.Feedback>
                )}
                {(touched || showErrors) && globalError && (
                    <Form.Control.Feedback
                        className="wfui-form-error"
                        type="invalid"
                    >
                        <span>
                            {Array.isArray(globalError)
                                ? globalError.join(', ')
                                : globalError}
                        </span>
                    </Form.Control.Feedback>
                )}
                {(touched || showErrors) && data && data.warning && (
                    <Form.Control.Feedback
                        className="wfui-form-warning"
                        type="valid"
                    >
                        {Array.isArray(data.warning)
                            ? data.warning.map(item => <div>{item}</div>)
                            : data.warning}
                    </Form.Control.Feedback>
                )}
                {help && !preview && (
                    <HelpBlock className="wfui-form-help text-muted">
                        <div dangerouslySetInnerHTML={{ __html: help }} />
                    </HelpBlock>
                )}
            </FormGroup>
            {descDisplay && !preview ? (
                <Col
                    className="wfui-form-description"
                    xs={12}
                    lg={{ span: 6, offset: 0 }}
                >
                    {cloneElement(descDisplay)}
                </Col>
            ) : null}
        </Form.Row>
    );

export default renderCheckboxes;