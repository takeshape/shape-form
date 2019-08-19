import React, {PureComponent} from 'react';

const style = {
  display: 'block',
  marginTop: '0.5em',
  marginBottom: '0.5em',
  marginLeft: 'auto',
  marginRight: 'auto',
  borderStyle: 'inset',
  borderWidth: '1px'
};

export default class HorizontalRule extends PureComponent {
  render() {
    return <hr style={style} />;
  }
}
