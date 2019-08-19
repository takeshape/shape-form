import PropTypes from 'prop-types';
import React, {PureComponent} from 'react';
import unionClassNames from 'union-class-names';
import Tooltip from 'app/common/components/tooltip';

const getUrl = (entityKey, contentState) => {
  return contentState.getEntity(entityKey).getData();
};

export default class Link extends PureComponent {
  static propTypes = {
    urlKey: PropTypes.string,
    entityKey: PropTypes.string,
    theme: PropTypes.object,
    className: PropTypes.string,
    component: PropTypes.string,
    rel: PropTypes.string,
    target: PropTypes.string,
    children: PropTypes.any,
    contentState: PropTypes.object,
    setReadOnly: PropTypes.func
  };

  handleMouseEnter = () => {
    this.props.setReadOnly(true);
  };

  handleMouseLeave = () => {
    this.props.setReadOnly(false);
  };

  render() {
    // eslint-disable-next-line react/prop-types
    const {entityKey, theme, className, children, contentState} = this.props;

    const combinedClassName = unionClassNames(theme.link, className);
    const data = getUrl(entityKey, contentState);

    const linkProps = {
      className: combinedClassName,
      children
    };

    const tooltipContentProps = {
      href: data.url,
      target: '_blank',
      rel: 'noopener noreferrer'
    };

    const tooltipContent = (
      <a {...tooltipContentProps} onMouseEnter={this.handleMouseEnter} onMouseLeave={this.handleMouseLeave}>
        {tooltipContentProps.href}
      </a>
    );

    return (
      <Tooltip content={tooltipContent} contentLength={tooltipContentProps.href.length} bottom offset={-2}>
        <span {...linkProps} />
      </Tooltip>
    );
  }
}
