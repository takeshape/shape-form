import PropTypes from 'prop-types';
import React, {PureComponent} from 'react';
import Fab from '@material-ui/core/Fab';
import Add from '@material-ui/icons/Add';
import List from '@material-ui/core/List';
import IconButton from '@material-ui/core/IconButton';
import UnfoldMore from '@material-ui/icons/UnfoldMore';
import UnfoldLess from '@material-ui/icons/UnfoldLess';
import SchemaField from '../schema-field';
import ArrayFieldItem from './array-field-item';
import Widget from '../../widgets/widget';
import DropTarget from './drop-target';
import {PLACEHOLDER_KEY} from '../../constants';

function isSingle(schema) {
  return schema.get('minItems') === 1 && schema.get('maxItems') === 1;
}

const defaultValues = {
  string: '',
  boolean: false,
  integer: 0,
  number: 0,
  object: {},
  array: []
};

function getDefaultValue(schema) {
  const defaultValue = schema.get('default');
  return defaultValue === undefined ? defaultValues[schema.get('type')] : defaultValue;
}

function initialize({initializeArray, schema, formName, path}) {
  if (!isSingle(schema)) {
    initializeArray(formName, path);
  }
}

export default class ArrayField extends PureComponent {
  static propTypes = {
    schema: PropTypes.object.isRequired,
    formName: PropTypes.string.isRequired,
    path: PropTypes.string.isRequired,
    config: PropTypes.object.isRequired,
    context: PropTypes.object,
    widgets: PropTypes.object,
    error: PropTypes.string,
    isRequired: PropTypes.bool,
    disabled: PropTypes.bool,
    locale: PropTypes.string,

    length: PropTypes.number.isRequired,
    ui: PropTypes.object.isRequired,
    fieldAction: PropTypes.func.isRequired,
    addArrayItem: PropTypes.func.isRequired,
    removeArrayItem: PropTypes.func.isRequired,
    toggleArrayItem: PropTypes.func.isRequired,
    expandAllArrayItems: PropTypes.func.isRequired,
    collapseAllArrayItems: PropTypes.func.isRequired,
    initializeArray: PropTypes.func.isRequired,
    blurField: PropTypes.func
  };

  componentDidMount() {
    initialize(this.props);
  }

  componentDidUpdate(prevProps) {
    if (this.props.path !== prevProps.path) {
      initialize(this.props);
    }
  }

  handleAddItem = event => {
    event.preventDefault();
    const itemSchema = this.props.schema.get('items');
    const defaultValue = getDefaultValue(itemSchema);
    this.props.addArrayItem(defaultValue);
    this.props.blurField();
  };

  renderSingle(itemSchema, itemConfig) {
    const {formName, context, widgets, path, disabled, locale} = this.props;
    return (
      <SchemaField
        schema={itemSchema}
        formName={formName}
        path={`${path}[0]`}
        config={itemConfig}
        context={context}
        widgets={widgets}
        disabled={disabled}
        locale={locale}
      />
    );
  }

  renderFields(itemSchema, itemConfig, placeholder) {
    const {
      formName,
      context,
      widgets,
      path,
      ui,
      length,
      removeArrayItem,
      toggleArrayItem,
      fieldAction,
      blurField,
      disabled,
      locale
    } = this.props;

    const keys = ui.get('arrayKeys');
    const collapsed = ui.get('collapsed');

    const totalLength = length + (placeholder ? 1 : 0);
    const fields = new Array(totalLength);
    for (let i = 0, j = 0; j < totalLength; j++) {
      const isPlaceholder = Boolean(placeholder && placeholder.get('index') === j);
      const key = isPlaceholder ? PLACEHOLDER_KEY : keys.get(i, i);
      fields[j] = (
        <ArrayFieldItem
          key={key}
          arrayKey={key}
          isCollapsed={collapsed.has(key)}
          index={i}
          hoverIndex={j}
          formName={formName}
          path={path}
          schema={itemSchema}
          config={itemConfig}
          context={context}
          widgets={widgets}
          fieldAction={fieldAction}
          removeItem={removeArrayItem}
          toggleItem={toggleArrayItem}
          onBlur={blurField}
          isPlaceholder={isPlaceholder}
          disabled={disabled}
          locale={locale}
        />
      );
      i += isPlaceholder ? 0 : 1;
    }
    return fields;
  }

  getWrapperProps(Wrapper) {
    const {length, ui} = this.props;
    const onExpandAll = this.props.expandAllArrayItems;
    const onCollapseAll = this.props.collapseAllArrayItems;

    const keys = ui.get('arrayKeys');
    const collapsed = ui.get('collapsed');
    const allCollapsed = keys.size === collapsed.size;

    if (Wrapper === Widget) {
      if (length > 0) {
        const actions = (
          <span>
            {allCollapsed ? (
              <IconButton size="small" onClick={onExpandAll}>
                <UnfoldMore />
              </IconButton>
            ) : (
              <IconButton size="small" onClick={onCollapseAll}>
                <UnfoldLess />
              </IconButton>
            )}
          </span>
        );
        return {actions};
      }

      return {};
    }

    return {onExpandAll, onCollapseAll};
  }

  getFieldProps(dragAndDrop, placeholder) {
    const {config, path, length, fieldAction} = this.props;
    const fieldsProps = {
      className: config.get('listStyle')
    };
    if (dragAndDrop) {
      fieldsProps.path = path;
      fieldsProps.count = length;
      fieldsProps.fieldAction = fieldAction;
      fieldsProps.placeholderIndex = placeholder && placeholder.get('index');
    }
    return fieldsProps;
  }

  render() {
    const {schema, config, ui, widgets, disabled} = this.props;

    const itemSchema = schema.get('items');
    const itemConfig = config.get('items', config);

    if (isSingle(schema)) {
      return this.renderSingle(itemSchema, itemConfig);
    }
    const placeholder = ui.get('placeholder');
    const dragAndDrop = config.get('dragAndDrop', false);
    const showAddButton = config.get('showAddButton', true);
    const Wrapper = (widgets && widgets[config.get('wrapper')]) || Widget;
    const Fields = dragAndDrop ? DropTarget : List;

    return (
      <Wrapper {...this.props} {...this.getWrapperProps(Wrapper)}>
        <Fields {...this.getFieldProps(dragAndDrop, placeholder)}>
          {this.renderFields(itemSchema, itemConfig, placeholder)}
        </Fields>
        {showAddButton && !disabled && (
          <Fab size="small" color="secondary" onClick={this.handleAddItem}>
            <Add />
          </Fab>
        )}
      </Wrapper>
    );
  }
}
