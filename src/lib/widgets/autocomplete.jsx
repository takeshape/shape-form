import {Autocomplete} from 'react-toolbox/lib/autocomplete';
import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import coerceValue from '../../utils/coerce-value';
import theme from './widget.scss';
import FieldInfo from '../field-info';

export default class AutocompleteWidget extends PureComponent {
  static propTypes = {
    value: PropTypes.any.isRequired,
    error: PropTypes.string,
    isRequired: PropTypes.bool,
    schema: PropTypes.object.isRequired,
    config: PropTypes.object,
    onChange: PropTypes.func.isRequired,
    onBlur: PropTypes.func.isRequired,
    direction: PropTypes.string,
    selectedPosition: PropTypes.string,
    suggestionMatch: PropTypes.string,
    disabled: PropTypes.bool
  };

  handleChange = newValue => {
    const {onChange, onBlur, schema} = this.props;
    onChange(coerceValue(schema, newValue));
    onBlur();
  };

  render() {
    const {
      schema,
      config,
      value,
      error,
      isRequired,
      direction,
      selectedPosition,
      suggestionMatch,
      disabled
    } = this.props;
    const schemaType = schema.get('type');
    const inputProps = {
      error,
      value: schemaType === 'array' ? value : [value],
      required: Boolean(isRequired),
      disabled
    };

    const options = (config.get('options') || schema.get('enum')).toArray();
    const description = schema && schema.get('description');
    const instructions = config && config.get('instructions');

    return (
      <div className={theme.widget}>
        <Autocomplete
          {...inputProps}
          source={options}
          direction={direction || 'down'}
          selectedPosition={selectedPosition || 'above'}
          suggestionMatch={suggestionMatch || 'anywhere'}
          showSuggestionsWhenValueIsSet
          label={schema.get('title')}
          multiple={schemaType === 'array'}
          onChange={this.handleChange}
          onQueryChange={this.handleChange}
          theme={theme}
        />
        <FieldInfo description={description} instructions={instructions} />
      </div>
    );
  }
}
