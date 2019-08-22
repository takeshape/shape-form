import PropTypes from 'prop-types';
import React, {PureComponent} from 'react';
import Button from '@material-ui/core/Button';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelActions from '@material-ui/core/ExpansionPanelActions';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Reorder from '@material-ui/icons/Reorder';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/styles/withStyles';
import SchemaField from '../schema-field';
import sortableItem from '../../decorators/sortable-item';
import ContentPreview from '../content-preview';

class ArrayFieldItem extends PureComponent {
  static propTypes = {
    classes: PropTypes.shape({
      details: PropTypes.string,
      expanded: PropTypes.string,
      dragging: PropTypes.string,
      previewFix: PropTypes.string
    }),
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
      classes,
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
    const expansion = (
      <div>
        <ExpansionPanel
          square
          onChange={this.handleToggle}
          expanded={!isCollapsed}
          disabled={disabled}
          classes={{root: isDragging ? classes.dragging : undefined, expanded: classes.expanded}}
        >
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            {!disabled && <Reorder />}
            <Typography>
              <ContentPreview
                formName={formName}
                path={currentPath}
                schema={schema}
                config={config}
                widgets={widgets}
                locale={locale}
              />
            </Typography>
          </ExpansionPanelSummary>
          {field && <ExpansionPanelDetails className={classes.details}>{field}</ExpansionPanelDetails>}
          <ExpansionPanelActions>
            <Button variant="text" onClick={this.handleRemove}>
              Remove
            </Button>
          </ExpansionPanelActions>
        </ExpansionPanel>
      </div>
    );

    return connectDragPreview(
      connectDropTarget(
        <li className={classes.previewFix} ref={this.setDomNode}>
          {disabled ? expansion : connectDragSource(expansion)}
        </li>
      )
    );
  }
}

const styles = {
  details: {
    flexDirection: 'column'
  },
  expanded: {
    marginTop: '0.5rem',
    marginBottom: '0.5rem'
  },
  dragging: {
    visibility: 'hidden'
  },
  previewFix: {
    transform: 'translate3d(0, 0, 0)'
  }
};

export {ArrayFieldItem};
export default withStyles(styles)(sortableItem(ArrayFieldItem));
