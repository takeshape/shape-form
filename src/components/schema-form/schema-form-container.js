import {connect} from 'react-redux';
import {makeSchemaSelector} from '../../selectors';
import {registerForm, clearForm, submitForm} from '../../actions';
import SchemaForm from './schema-form';

function mapStateToProps() {
  const selector = makeSchemaSelector();
  return (state, props) => {
    return {
      registeredSchema: selector(state, props)
    };
  };
}

const ShapeForm = connect(
  mapStateToProps,
  {registerForm, clearForm, submitForm}
)(SchemaForm);

ShapeForm.displayName = 'ShapeForm';

export default ShapeForm;
