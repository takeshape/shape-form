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

export default connect(
  mapStateToProps,
  {registerForm, clearForm, submitForm}
)(SchemaForm);
