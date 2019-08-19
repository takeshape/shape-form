import PropTypes from 'prop-types';
import React, {PureComponent} from 'react';
import {IconButton} from 'react-toolbox/lib/button';
import Dialog from 'react-toolbox/lib/dialog';
import Input from 'react-toolbox/lib/input';
import {connect} from 'react-redux';
import {getCurrentProjectId} from 'app/project/selectors';
import addOembed from '../modifiers/add-oembed';
import theme from '../../../button-style.scss';
import oEmbed from '../utils/api';

export const preventBubblingUp = event => {
  event.preventDefault();
};

export class OembedButton extends PureComponent {
  static propTypes = {
    projectId: PropTypes.string.isRequired,
    editorState: PropTypes.object.isRequired,
    setEditorState: PropTypes.func.isRequired,
    theme: PropTypes.object
  };

  state = {
    showDialog: false,
    url: '',
    inputError: undefined
  };

  handleToggle = () => {
    this.setState(state => ({showDialog: !state.showDialog, url: '', inputError: undefined}));
  };

  handleSave = async () => {
    const {editorState, setEditorState, projectId} = this.props;
    const {url} = this.state;

    if (url) {
      try {
        const res = await oEmbed({projectId, url});
        setEditorState(addOembed(editorState, {...res.data, url}));
        this.handleToggle();
      } catch (e) {
        this.setState({inputError: 'Invalid Url'});
      }
    }
  };

  handleChangeUrl = value => {
    this.setState({url: value, inputError: undefined});
  };

  actions = [{label: 'Cancel', onClick: this.handleToggle}, {label: 'Save', onClick: this.handleSave}];

  render() {
    return (
      <div className={theme.button} onMouseDown={preventBubblingUp}>
        <IconButton title="oEmbed" className={theme['button-icon']} onClick={this.handleToggle} icon="library_add" />
        <Dialog
          actions={this.actions}
          active={this.state.showDialog}
          onEscKeyDown={this.handleToggle}
          onOverlayClick={this.handleToggle}
          title="Content Embed"
        >
          <Input
            error={this.state.inputError}
            label="Media URL"
            onChange={this.handleChangeUrl}
            value={this.state.url}
          />
        </Dialog>
      </div>
    );
  }
}

export function mapStateToProps(state) {
  return {
    projectId: getCurrentProjectId(state)
  };
}

export default connect(mapStateToProps)(OembedButton);
