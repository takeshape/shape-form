import {connect} from 'react-redux';
import DropArea from './drop-area-container';
import {uploadAssets} from 'app/asset-uploader/actions';

export default connect(
  null,
  {onDrop: uploadAssets}
)(DropArea);
