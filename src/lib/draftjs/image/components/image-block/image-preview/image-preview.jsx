import PropTypes from 'prop-types';
import React, {PureComponent} from 'react';
import FontIcon from 'react-toolbox/lib/font_icon';
import getImageUrl from 'app/common/utils/get-image-url';
import theme from './image-preview.scss';
import cx from 'classnames';

export default class ImagePreview extends PureComponent {
  static propTypes = {
    path: PropTypes.string,
    onClick: PropTypes.func,
    isDraggedOn: PropTypes.any
  };

  state = {isLoading: false};

  doneLoading = () => this.setState({isLoading: false});

  handleImageLoading = img => {
    if (img) {
      this.setState({isLoading: true});
      img.addEventListener('load', this.doneLoading);
    } else {
      this.setState({isLoading: false});
      this.img.removeEventListener('load', this.doneLoading);
    }
    this.img = img;
  };

  render() {
    const {path, onClick, isDraggedOn} = this.props;

    if (path) {
      const classNames = cx(
        {
          [theme.dragging]: isDraggedOn,
          [theme.loading]: this.state.isLoading
        },
        theme.preview
      );
      return (
        <div className={classNames} onClick={onClick}>
          <img ref={this.handleImageLoading} className={theme.imageDisplay} src={getImageUrl(path)} />
        </div>
      );
    }
    return (
      <div className={theme.placeholder} onClick={onClick}>
        <FontIcon value="photo_library" />
        <p>Add asset</p>
      </div>
    );
  }
}
