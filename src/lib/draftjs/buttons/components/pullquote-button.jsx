import React from 'react';
import {createBlockStyleButton} from '../utils/button-factory';

export default createBlockStyleButton({
  style: 'pullquote',
  icon: (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 20 20"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      xmlSpace="preserve"
      style={{fillRule: 'evenodd', clipRule: 'evenodd', strokeLinejoin: 'round', strokeMiterlimit: '1.41421'}}
    >
      <path d="M5.444,13.333l2.223,0l1.481,-2.963l0,-4.444l-4.444,0l0,4.444l2.222,0l-1.482,2.963Zm5.926,0l1.482,-2.963l-2.222,0l0,-4.444l4.444,0l0,4.444l-1.481,2.963l-2.223,0Zm7.408,-13.333l0,1.481l-17.778,0l0,-1.481l17.778,0Zm0,18.519l0,1.481l-17.778,0l0,-1.481l17.778,0Z" />
    </svg>
  ),
  title: 'Pull quote'
});
