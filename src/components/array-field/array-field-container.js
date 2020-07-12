import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {makeArrayLengthSelector, makeValueSelector} from '../../selectors';
import {
  bindMeta,
  initializeArray,
  swapArrayItems,
  addArrayItem,
  removeArrayItem,
  toggleArrayItem,
  expandAllArrayItems,
  collapseAllArrayItems,
  blurField
} from '../../actions';
import ArrayField from './array-field';

const initialUiState = {
  arrayKeys: [],
  collapsed: new Set()
};

function mapStateToProps() {
  const lengthSelector = makeArrayLengthSelector();
  const valueSelector = makeValueSelector();

  return (state, props) => {
    const {ui, error} = valueSelector(state, props);
    return {
      length: lengthSelector(state, props),
      ui: ui || initialUiState,
      error
    };
  };
}

const identity = x => x;
const mapDispatchToProps = (dispatch, {formName, path}) => {
  const bind = bindMeta(formName, path);
  return bindActionCreators(
    {
      swapArrayItems: bind(swapArrayItems),
      addArrayItem: bind(addArrayItem),
      removeArrayItem: bind(removeArrayItem),
      toggleArrayItem: bind(toggleArrayItem),
      expandAllArrayItems: bind(expandAllArrayItems),
      collapseAllArrayItems: bind(collapseAllArrayItems),
      initializeArray: bind(initializeArray),
      fieldAction: bind(identity),
      blurField: blurField.bind(null, formName, path)
    },
    dispatch
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ArrayField);
