import React from 'react';

import {ShapeFormProvider} from '../src/provider';

export default renderFn => <ShapeFormProvider>{renderFn()}</ShapeFormProvider>;