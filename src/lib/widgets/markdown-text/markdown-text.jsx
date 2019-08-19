import PropTypes from 'prop-types';
import React, {PureComponent} from 'react';
import {Tab, Tabs} from 'react-toolbox/lib/tabs';
import {Input} from 'react-toolbox/lib/input';
import ReactMarkdown from 'react-markdown';
import theme from './markdown-text.scss';
import Widget from '../widget';

export default class MarkDownTextWidget extends PureComponent {
  static propTypes = {
    value: PropTypes.any.isRequired,
    error: PropTypes.string,
    schema: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    onBlur: PropTypes.func.isRequired,
    onFocus: PropTypes.func,
    config: PropTypes.object,
    isRequired: PropTypes.bool,
    disabled: PropTypes.bool
  };
  state = {
    index: 0
  };

  handleTabChange = index => {
    this.setState({index});
  };

  render() {
    const {value, error, isRequired, onChange, onBlur, disabled} = this.props;
    const inputProps = {value, error, required: isRequired, onChange, onBlur};

    return (
      <Widget {...this.props}>
        <Tabs index={this.state.index} onChange={this.handleTabChange} theme={theme}>
          <Tab label="Markdown">
            <Input multiline {...inputProps} theme={theme} disabled={disabled} />
          </Tab>

          <Tab label="Preview">
            <ReactMarkdown source={value} className={theme.preview} />
          </Tab>
        </Tabs>

        <div className={theme.linkContainer}>
          <a className={theme.link} target="_blank" rel="noopener noreferrer" href="http://commonmark.org/">
            Commonmark docs
          </a>
        </div>
      </Widget>
    );
  }
}
