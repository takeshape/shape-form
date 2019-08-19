import PropTypes from 'prop-types';
import cx from 'classnames';
import React, {PureComponent} from 'react';
import styles from './color.scss';
import {colorObjectToCss} from './utils';

export default class Color extends PureComponent {
  static propTypes = {
    toggleColorPicker: PropTypes.func.isRequired,
    color: PropTypes.any,
    disabled: PropTypes.bool
  };

  render() {
    const defaultColor = {r: 0, g: 0, b: 0, a: 0};
    const color = this.props.color ? this.props.color : defaultColor;
    const style = {background: colorObjectToCss(color)};
    const handleClick = this.props.toggleColorPicker;
    const previewColorClassNames = cx(styles.previewColor, {
      [styles.disabled]: this.props.disabled
    });

    return (
      <div className={styles.previewContainer} onClick={handleClick}>
        <div style={style} className={previewColorClassNames} />
      </div>
    );
  }
}
