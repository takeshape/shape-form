import PropTypes from 'prop-types';
import React, {PureComponent} from 'react';
import theme from './image-size-icon.scss';

export default class ImageSizeIcon extends PureComponent {
  static propTypes = {
    size: PropTypes.string
  };

  render() {
    const {size} = this.props;

    return (
      <span className={theme.sizeIcon}>
        <svg
          className={theme[size]}
          viewBox="0 0 16 16"
          xmlns="http://www.w3.org/2000/svg"
          fillRule="evenodd"
          clipRule="evenodd"
          strokeLinejoin="round"
          strokeMiterlimit="1.414"
        >
          <path d="M0,0L0,4L1,4L1,1L15,1L15,15L12,15L12,16L16,16L16,0L0,0Z" />
          <path d="M0,5L0,9L1,9L1,6L10,6L10,15L7,15L7,16L11,16L11,5L0,5Z" />
          <path d="M0,16L6,16L6,10L0,10L0,16ZM1,15L5,15L5,11L1,11L1,15Z" />
        </svg>
      </span>
    );
  }
}
