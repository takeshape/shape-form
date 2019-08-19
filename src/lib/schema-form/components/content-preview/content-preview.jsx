import PropTypes from 'prop-types';
import React, {PureComponent} from 'react';
import DefaultContentPreview from './default-content-preview';

export default class ContentPreview extends PureComponent {
  static propTypes = {
    value: PropTypes.any.isRequired,
    schema: PropTypes.object.isRequired,
    formName: PropTypes.string.isRequired,
    path: PropTypes.string.isRequired,
    config: PropTypes.object.isRequired,
    context: PropTypes.object,
    widgets: PropTypes.object,
    locale: PropTypes.string
  };

  render() {
    const {widgets, config} = this.props;
    let Preview = DefaultContentPreview;

    if (widgets && config) {
      const widgetName = config.get('preview', 'contentPreview');
      if (widgets[widgetName]) {
        Preview = widgets[widgetName];
      }
    }

    return <Preview {...this.props} />;
  }
}
