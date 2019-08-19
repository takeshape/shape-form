import decorateComponentWithProps from 'decorate-component-with-props';
import Link from './components/link';
import LinkButton from './components/link-button';
import InlineLinkForm from './components/inline-link-form';
import styles from './styles.scss';

const defaultTheme = {
  link: styles.link
};

export const defaultType = 'LINK';
export const defaultUrlKey = 'url';
export {Link};

const linkPlugin = (config = {}) => {
  // Styles are overwritten instead of merged as merging causes a lot of confusion.

  // Why? Because when merging a developer needs to know all of the underlying
  // styles which needs a deep dive into the code. Merging also makes it prone to
  // errors when upgrading as basically every styling change would become a major
  // breaking change. 1px of an increased padding can break a whole layout.

  const {
    component,
    theme = defaultTheme,
    type = defaultType,
    urlKey = defaultUrlKey,
    target = '_blank',
    setReadOnly
  } = config;

  return {
    decorators: [
      {
        strategy(contentBlock, callback, contentState) {
          contentBlock.findEntityRanges(character => {
            const entityKey = character.getEntity();
            return entityKey !== null && contentState.getEntity(entityKey).getType() === type;
          }, callback);
        },
        component: decorateComponentWithProps(Link, {theme, target, component, urlKey, setReadOnly})
      }
    ]
  };
};

export default linkPlugin;
export {LinkButton};
export {InlineLinkForm};
