import PropTypes from 'prop-types';
import React from 'react';

function loadScript(div) {
  if (div) {
    const scripts = div.getElementsByTagName('script');
    if (scripts.length) {
      const scriptEl = document.createElement('script');
      scriptEl.src = scripts[0].src;
      document.head.appendChild(scriptEl);

      scriptEl.onload = () => {
        if (scriptEl.src.includes('instagram')) {
          window.instgrm.Embeds.process();
        }
      };
    }
  }
}

export default class DefaultOembedComponent extends React.Component {
  static propTypes = {
    blockProps: PropTypes.object
  };

  render() {
    const {html} = this.props.blockProps;

    if (html) {
      return (
        // eslint-disable-next-line react/no-danger
        <div ref={loadScript} dangerouslySetInnerHTML={{__html: html}} />
      );
    }
    return (
      <div>
        <p>Invalid Url</p>
      </div>
    );
  }
}
