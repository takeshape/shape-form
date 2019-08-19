/* eslint-disable react/display-name */
import PropTypes from 'prop-types';
import React, {PureComponent} from 'react';
import redraft from 'redraft';
import {formatRawContent, rawContentHasText} from '../../../utils';
import theme from './image-caption-bar.scss';
import linkTheme from '../../../../link/styles.scss';

const renderers = {
  inline: {
    BOLD: (children, {key}) => <strong key={key}>{children}</strong>,
    ITALIC: (children, {key}) => <em key={key}>{children}</em>,
    UNDERLINE: (children, {key}) => <u key={key}>{children}</u>
  },
  entities: {
    LINK: (children, data, {key}) => (
      <a className={linkTheme.link} key={key} href={data.url}>
        {children}
      </a>
    )
  }
};

export default class ImageCaptionBar extends PureComponent {
  static propTypes = {
    caption: PropTypes.any,
    credit: PropTypes.any,
    onEdit: PropTypes.func
  };

  render() {
    const {caption, credit, onEdit} = this.props;
    const formattedCaption = formatRawContent(caption);
    const formattedCredit = formatRawContent(credit);

    const shouldRenderCaption = rawContentHasText(formattedCaption);
    const shouldRenderCredit = rawContentHasText(formattedCredit);

    if (shouldRenderCaption || shouldRenderCredit) {
      return (
        <div className={theme.captionBar} onClick={onEdit}>
          {shouldRenderCaption && <p className={theme.caption}>{redraft(formattedCaption, renderers)}</p>}
          {shouldRenderCredit && <p className={theme.credit}>{redraft(formattedCredit, renderers)}</p>}
        </div>
      );
    }
    return null;
  }
}
