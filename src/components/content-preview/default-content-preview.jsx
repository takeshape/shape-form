import PropTypes from 'prop-types';
import React, {PureComponent} from 'react';

export function getContentPreview(schema, order, content) {
  const fieldName = order.find(name => schema.getIn(['properties', name, 'type']) === 'string' && content.get(name));
  if (fieldName) {
    let contentPreview = content.get(fieldName);
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
    if (schema.get('type') === 'object') {
      const order = config.get('order') || schema.get('properties').keySeq();
      summary = getContentPreview(schema, order, value);
    }
    return <span>{summary || 'New item'}</span>;
  }
}
