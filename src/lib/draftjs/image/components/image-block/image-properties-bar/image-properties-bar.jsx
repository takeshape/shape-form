import PropTypes from 'prop-types';
import React, {PureComponent} from 'react';
import theme from './image-properties-bar.scss';
import {IconButton} from 'react-toolbox/lib/button';
import FontIcon from 'react-toolbox/lib/font_icon';
import SizeIcon from '../image-size-icon/image-size-icon';

export default class ImagePropertiesBar extends PureComponent {
  static propTypes = {
    onEdit: PropTypes.func,
    title: PropTypes.string,
    alignment: PropTypes.string,
    size: PropTypes.string
  };

  render() {
    const {onEdit, title, alignment, size} = this.props;

    return (
      <div className={theme.propertiesBar} onClick={onEdit}>
        <div className={theme.statusIcons}>
          {alignment && <FontIcon className={theme.alignment} value={'format_align_' + alignment} />}
          {size && <SizeIcon size={size} />}
        </div>
        <div className={theme.title}>
          <span className={theme.titleText}>{title}</span>
        </div>
        <div className={theme.edit}>
          <IconButton theme={theme} icon="edit" onClick={onEdit} />
        </div>
      </div>
    );
  }
}
