import PropTypes from 'prop-types';
import React from 'react';
import {Provider} from 'react-redux';

import {createStore} from './store';

const ShapeFormProvider = ({children}) => <Provider store={createStore()}>{children}</Provider>;

ShapeFormProvider.propTypes = {
  children: PropTypes.any
};

export {ShapeFormProvider};
