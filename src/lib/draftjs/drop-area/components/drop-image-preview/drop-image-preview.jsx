import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import theme from './styles.scss';
import ImagePropertiesBar from 'app/common/draftjs/image/components/image-block/image-properties-bar';
import ImagePreview from 'app/common/draftjs/image/components/image-block/image-preview';

export default class DropImagePreview extends PureComponent {
  static propTypes = {
    path: PropTypes.string
  };

  render() {
    const {path} = this.props;

    return (
      <div>
        <div className={theme.image}>
          <ImagePropertiesBar />
          <ImagePreview path={path} />
        </div>
      </div>
    );
  }
}
