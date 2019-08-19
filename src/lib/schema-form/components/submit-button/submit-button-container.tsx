import {connect} from 'react-redux';
// @ts-ignore
import {getForm} from '../../selectors';
// @ts-ignore
import {submitForm} from '../../actions';
import SubmitButton, {SubmitProps} from './submit-button';

export interface SubmitStateProps {
  hasError: boolean;
  isDirty: boolean;
}

export const mapStateToProps = (state: any, ownProps: Partial<SubmitProps>): SubmitStateProps => {
  const {formName} = ownProps;
  const form = getForm(state, {formName});
  const errors = form.get('errors');
  const dirty = form.get('dirty');
  return {
    hasError: errors && errors.size > 0,
    isDirty: dirty && dirty.size > 0
  };
};

export const mapDispatchToProps = {submitForm};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SubmitButton);
