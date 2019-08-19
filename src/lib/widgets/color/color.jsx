import PropTypes from 'prop-types';
import React, {PureComponent} from 'react';
import ChromePicker from 'react-color/lib/components/chrome/Chrome';
import Widget from '../widget';
import {Button} from 'react-toolbox/lib/button';
import ColorPreview from './color-preview';
import styles from './color.scss';

function stripExtraColorFields(color) {
  return {
    hsl: color.hsl,
    hex: color.hex,
    rgb: color.rgb,
    hsv: color.hsv
  };
}

function getRGB(value) {
  return value && value.has('rgb') ? value.get('rgb').toJS() : undefined;
}

export default class Color extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isColorPickerVisible: false
    };
  }

  static propTypes = {
    value: PropTypes.any.isRequired,
    error: PropTypes.string,
    schema: PropTypes.object.isRequired,
    config: PropTypes.object,
    onChange: PropTypes.func.isRequired,
    onBlur: PropTypes.func.isRequired,
    disabled: PropTypes.bool
  };

  handleChange = payload => {
    const color = stripExtraColorFields(payload);
    this.props.onChange(color);
  };

  handleResetColor = () => {
    this.props.onChange(null);
  };

  toggleColorPicker = () => {
    const {isColorPickerVisible} = this.state;
    if (!this.props.disabled) {
      this.setState({isColorPickerVisible: !isColorPickerVisible});
    }
  };

  pageClick = event => {
    if (this.colorPicker.contains(event.target)) {
      return;
    }
    this.setState({isColorPickerVisible: false});
  };

  setRef = el => {
    this.colorPicker = el;
  };

  componentDidMount() {
    window.addEventListener('mousedown', this.pageClick, false);
  }

  componentWillUnmount() {
    window.removeEventListener('mousedown', this.pageClick);
  }

  render() {
    const disabled = this.props.disabled;
    const color = getRGB(this.props.value);
    const transition = 'transform 0.15s cubic-bezier(.3,1.2,.2,1)';
    const scale = this.state.isColorPickerVisible ? 1 : 0;
    const colorPickerStyle = {transform: `scale(${scale})`, transition};
    const resetButtonVisibility = color ? 'visible' : 'hidden';

    return (
      <Widget {...this.props}>
        <div className={styles.colorWidgetContainer} tabIndex="0" ref={this.setRef}>
          <ColorPreview toggleColorPicker={this.toggleColorPicker} color={color} disabled={disabled} />
          {!disabled && (
            <Button
              raised
              icon="undo"
              type="button"
              className={styles.resetButton}
              onClick={this.handleResetColor}
              style={{visibility: resetButtonVisibility}}
            />
          )}
          <div className={styles.colorPickerContainer} style={colorPickerStyle}>
            <ChromePicker onChange={this.handleChange} color={color} />
          </div>
        </div>
      </Widget>
    );
  }
}
