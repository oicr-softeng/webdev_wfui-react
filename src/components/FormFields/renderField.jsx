/* global FileReader */
/* eslint react/prop-types : 0 */
import React, { cloneElement } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {
    FormGroup,
    FormControl,
    ControlLabel,
    HelpBlock,
    Form,
    Col,
} from '../index';

/**
 * Reusable field component.
 */
const renderField = ({
    className,
    inline,
    input,
    label,
    postfix,
    help,
    placeholder,
    maxlength,
    max,
    min,
    onHandleChange,
    onChange,
    required,
    disabled,
    preview,
    globalError,
    descDisplay,
    meta: { touched, error, data },
    fullWidth,
    autoComplete,
    showErrors,
}) => (
        <Form.Row
            className={classNames(
                className,
                'wfui-form-item',
                { 'wfui-form-item-error': (touched || showErrors) && (error || globalError) },
                {
                    'wfui-form-item-warning': (touched || showErrors) && data && data.warning,
                },
                { 'wfui-form-inline': inline },
                { 'wfui-form-disabled': disabled },
                { 'wfui-form-preview': preview },
                { answered: input.value },
                { 'wfui-form-item-full-width': fullWidth },
                { 'wfui-form-with-description': descDisplay }
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
                    inline
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
                    } wfui-form-input`}
            // validationState={(touched || showErrors) && (error || globalError) ? 'error' : null}
            >
                <FormControl
                    {...input}
                    placeholder={
                        placeholder || placeholder === '' ? placeholder : label
                    }
                    maxLength={maxlength}
                    min={min}
                    max={max}
                    disabled={disabled}
                    onChange={e => {
                        input.onChange(e);
                        if (onChange) onChange(e, input);
                        if (onHandleChange) onHandleChange(e, input);
                    }}
                    isInvalid={(touched || showErrors) && (error || globalError)}
                    isValid={(touched || showErrors) && data && data.warning}
                    className={classNames({
                        'is-valid-warning': (touched || showErrors) && data && data.warning,
                    })}
                    autoComplete={autoComplete}
                />
                {postfix && <div className="wfui-form-postfix">{postfix}</div>}
                <FormControl.Feedback />
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
                <Col className="wfui-form-description" xs={12} lg={6}>
                    {cloneElement(descDisplay)}
                </Col>
            ) : null}
        </Form.Row>
    );

export default renderField;