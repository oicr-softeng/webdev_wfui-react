/* global document */
import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import classNames from 'classnames';
import ReactTooltip from 'react-tooltip';
import { FormattedHTMLMessage, FormattedNumber } from 'react-intl';

const dateToString = date => {
    const months = [
        'Jan.',
        'Feb.',
        'Mar.',
        'Apr.',
        'May',
        'June',
        'July',
        'Aug.',
        'Sept.',
        'Oct.',
        'Nov.',
        'Dec.',
    ];

    return `${months[date.getMonth()]} ${date.getDate()}`;
};

const isCurrent = (startDate, endDate) => {
    const date = new Date();
    return (
        date.getTime() >= startDate.getTime() &&
        date.getTime() <= endDate.getTime()
    );
};

class RenderFee extends React.Component {
    render() {
        const { fee, currency, feeIntlId } = this.props;

        return (
            <td
                className={classNames('event-price', {
                    current: fee && isCurrent(fee.start_date, fee.end_date),
                })}
                data-tip
                data-for={fee && fee.description ? 'tool-description' : ''}
            >
                {fee && fee.description && (
                    <ReactTooltip
                        id={`tool-description`}
                        className="event-fee-tooltip"
                        type="dark"
                        effect="solid"
                        delayHide={100}
                    >
                        <div
                            dangerouslySetInnerHTML={{
                                __html: fee.description,
                            }}
                        />
                    </ReactTooltip>
                )}
                {fee && fee.price !== undefined && (
                    <b>
                        <FormattedNumber
                            style="currency"
                            currency={currency}
                            value={fee.price >= 0 ? fee.price : 0}
                        />
                    </b>
                )}
                {fee && fee.start_date && (
                    <FormattedHTMLMessage
                        id={feeIntlId}
                        defaultMessage=" {tax, select, HST { + HST }}<br/>(before {end_date})"
                        values={{
                            tax: fee.taxes,
                            end_date: `${dateToString(
                                fee.end_date,
                            )}, ${fee.end_date.getFullYear()}`,
                        }}
                    />
                )}
            </td>
        );
    }
}

RenderFee.propTypes = {
    fee: PropTypes.object,
    currency: PropTypes.string,
    feeIntlId: PropTypes.string,
};

RenderFee.defaultProps = {
    currency: 'CAD',
    feeIntlId: 'admin_form_builder.question_type.fee.fee_text',
};

export default RenderFee;
