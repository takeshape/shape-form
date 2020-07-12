import PropTypes from 'prop-types';
import React, {PureComponent} from 'react';
import get from 'lodash/get';

export function getContentPreview(schema, order, content) {
  const fieldName = order.find(name => get(schema, ['properties', name, 'type']) === 'string' && content[name]);
  if (fieldName) {
    let contentPreview = content[fieldName];
    if (contentPreview.length >= 40) {
      contentPreview = contentPreview.substring(0, 37) + '...';
    }
    return contentPreview;
  }
  return '';
}

export default class DefaultContentPreview extends PureComponent {
  static propTypes = {
    value: PropTypes.any.isRequired,
    schema: PropTypes.object.isRequired,
    config: PropTypes.object.isRequired
  };

  render() {
    const {schema, value, config} = this.props;
    let summary = value;
    if (schema.type === 'object') {
      const order = config.order || Object.keys(schema.properties);
      summary = getContentPreview(schema, order, value);
    }
    return <span>{summary || 'New item'}</span>;
  }
}
