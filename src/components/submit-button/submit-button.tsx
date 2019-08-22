import React, {useCallback} from 'react';
import {styled} from '@material-ui/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';

export interface SubmitProps {
  formName: string;
  hasError: boolean;
  isDirty: boolean;
  saving?: boolean;
  onSubmit?: () => void;
  submitForm: (formName: string, callback?: () => void) => void;
}

const SavingIcon = styled(CircularProgress)({
  marginRight: '0.5rem'
});

const SubmitButton: React.FC<SubmitProps> = (props: SubmitProps) => {
  const {formName, hasError, isDirty, saving, onSubmit, submitForm, ...rest} = props;

  const handleSubmit = useCallback(() => {
    if (onSubmit) {
      submitForm(formName, onSubmit);
    } else {
      submitForm(formName);
    }
  }, [formName, submitForm, onSubmit]);

  return (
    <Button
      variant="contained"
      disabled={hasError || saving || !isDirty}
      onClick={handleSubmit}
      color="secondary"
      {...rest}
    >
      {saving && <SavingIcon size={18} variant="indeterminate" color="primary" />}
      {saving ? 'Saving' : 'Save'}
    </Button>
  );
};

export default SubmitButton;
