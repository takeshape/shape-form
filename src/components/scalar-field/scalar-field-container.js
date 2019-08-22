import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {makeValueSelector} from '../../selectors';
import {changeField, blurField, focusField, setUI} from '../../actions';
import ScalarField from './scalar-field';

const getMapStateToProps = () => {
  const selector = makeValueSelector();
  return (state, props) => selector(state, props);
};

const mapDispatchToProps = (dispatch, {formName, path}) =>
  bindActionCreators(
    {
      onChange: changeField(formName, path, false),
      onChangeSilent: changeField(formName, path, true),
      onBlur: blurField.bind(null, formName, path),
      onFocus: focusField.bind(null, formName, path),
      setUI: setUI.bind(null, formName, path)
    },
    dispatch
  );

export default connect(
  getMapStateToProps,
  mapDispatchToProps
)(ScalarField);
