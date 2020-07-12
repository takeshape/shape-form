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
  const errors = form && form.errors;
  const dirty = form && form.dirty;
  return {
    hasError: Boolean(errors && errors.size > 0),
    isDirty: Boolean(dirty && dirty.size > 0)
  };
};

export const mapDispatchToProps = {submitForm};

const ConnectedSubmitButton = connect(
  mapStateToProps,
  mapDispatchToProps
)(SubmitButton);

ConnectedSubmitButton.displayName = 'SubmitButton';

export default ConnectedSubmitButton;
