import PropTypes from 'prop-types';
import React, {PureComponent} from 'react';
import SchemaField from '../schema-field';
import {IconButton} from 'react-toolbox/lib/button';
import {Card, CardText} from 'react-toolbox/lib/card';
import sortableItem from '../../decorators/sortable-item';
import style from './array-field-item.scss';
import classnames from 'classnames';
import ContentPreview from '../content-preview';
import {caretIcon} from './icons';

class ArrayFieldItem extends PureComponent {
  static propTypes = {
    formName: PropTypes.string.isRequired,
    schema: PropTypes.object.isRequired,
    path: PropTypes.string.isRequired,
    config: PropTypes.object.isRequired,
    context: PropTypes.object,
    widgets: PropTypes.object,
    disabled: PropTypes.bool,
    locale: PropTypes.string,

    // Array related:
    index: PropTypes.number.isRequired,
    arrayKey: PropTypes.number.isRequired,
    isCollapsed: PropTypes.bool.isRequired,
    removeItem: PropTypes.func.isRequired,
    toggleItem: PropTypes.func.isRequired,
    fieldAction: PropTypes.func.isRequired,
    isDragging: PropTypes.bool.isRequired,
    isPlaceholder: PropTypes.bool,
    connectDragSource: PropTypes.func.isRequired,
    connectDropTarget: PropTypes.func.isRequired,
    connectDragPreview: PropTypes.func.isRequired,
    onBlur: PropTypes.func
  };

  handleRemove = event => {
    event.preventDefault();
    const {removeItem, index, onBlur} = this.props;
    removeItem(index);
    onBlur();
  };

  handleToggle = event => {
    event.preventDefault();
    const {toggleItem, arrayKey} = this.props;
    toggleItem(arrayKey);
  };

  setDomNode = node => {
    this.domNode = node;
  };

  render() {
    const {
      formName,
      schema,
      path,
      index,
      config,
      context,
      widgets,
      connectDragSource,
      connectDropTarget,
      connectDragPreview,
      isDragging,
      isCollapsed,
      isPlaceholder,
      disabled,
      locale
    } = this.props;

    const currentPath = `${path}[${index}]`;

    let field;
    if (!isCollapsed && !isPlaceholder) {
      field = (
        <SchemaField
          schema={schema}
          formName={formName}
          path={currentPath}
          config={config}
          context={context}
          widgets={widgets}
          disabled={disabled}
          locale={locale}
        />
      );
    }

    const Wrapper = widgets && widgets[config.get('wrapper')];
    if (Wrapper) {
      return (
        <Wrapper
          {...this.props}
          setDomNode={this.setDomNode}
          onRemoveItem={this.handleRemove}
          onToggleItem={this.handleToggle}
          parentPath={path}
          path={currentPath}
          disabled={disabled}
        >
          {field}
        </Wrapper>
      );
    }

    const classNames = classnames(style.element, {
      [style.dragging]: isDragging || isPlaceholder
    });

    const caretButtonStyles = classnames(style.caret, {
      [style.collapsed]: isCollapsed
    });

    const headerClassNames = classnames(style.header, {
      [style.draggable]: !disabled
    });

    const header = (
      <header className={headerClassNames}>
        <IconButton className={caretButtonStyles} onClick={this.handleToggle}>
          {caretIcon}
        </IconButton>
        <ContentPreview
          formName={formName}
          path={currentPath}
          schema={schema}
          config={config}
          widgets={widgets}
          locale={locale}
        />
        <IconButton className={style.delete} icon="delete" onClick={this.handleRemove} disabled={disabled} />
      </header>
    );

    return connectDragPreview(
      connectDropTarget(
        <li className={classNames} ref={this.setDomNode}>
          <Card theme={style}>
            {disabled ? header : connectDragSource(header)}
            {!isCollapsed && <CardText theme={style}>{field}</CardText>}
          </Card>
        </li>
      )
    );
  }
}

export default sortableItem(ArrayFieldItem);
