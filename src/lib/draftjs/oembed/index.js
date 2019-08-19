import decorateComponentWithProps from 'decorate-component-with-props';
import addOembed from './oembed/modifiers/add-oembed';
import DefaultOembedComponent from './oembed/components/default-oembed-component';
import * as types from './oembed/constants';

const oembedPlugin = (config = {}) => {
  const theme = config.theme;
  let oEmbed = config.oEmbed || DefaultOembedComponent;
  if (config.decorator) {
    oEmbed = config.decorator(oEmbed);
  }
  const ThemedEmbed = decorateComponentWithProps(oEmbed, {theme});
  return {
    blockRendererFn: (block, {getEditorState}) => {
      if (block.getType() === types.ATOMIC) {
        const entityKey = block.getEntityAt(0);
        if (entityKey) {
          const entity = getEditorState()
            .getCurrentContent()
            .getEntity(entityKey);
          const type = entity.getType();
          const {html} = entity.getData();
          if (type === types.OEMBEDTYPE) {
            return {
              component: ThemedEmbed,
              editable: false,
              props: {
                html
              }
            };
          }
        }
      }
      return null;
    },
    addOembed,
    types
  };
};

export default oembedPlugin;
