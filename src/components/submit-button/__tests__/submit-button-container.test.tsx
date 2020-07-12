jest.mock('../../../selectors');
import {mapStateToProps, mapDispatchToProps} from '../submit-button-container';
// @ts-ignore
import {getForm} from '../../../selectors';
// @ts-ignore
import {submitForm} from '../../../actions';

const formName = 'form';
const state = {
  schemaForm: {
    forms: {
      [formName]: {
        errors: {}
      }
    }
  }
};

describe('Submit Button Container', () => {
  it('mapDispatchToProps', () => {
    expect(mapDispatchToProps).toEqual({submitForm});
  });

  it('mapStateToProps', () => {
    (getForm as jest.Mock).mockReturnValueOnce({errors: {}});
    expect(mapStateToProps(state, {formName})).toEqual({
      hasError: false,
      isDirty: false
    });
  });
});
