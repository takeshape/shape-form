import {connect} from 'react-redux';
import {makeValueSelector} from '../../selectors';
import ContentPreview from './content-preview';

const getMapStateToProps = () => {
  const selector = makeValueSelector();
  return (state, props) => selector(state, props);
};

export default connect(getMapStateToProps)(ContentPreview);
