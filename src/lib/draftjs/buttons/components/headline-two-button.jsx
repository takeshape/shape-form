import React from 'react';
import {createBlockStyleButton} from '../utils/button-factory';

export default createBlockStyleButton({
  style: 'header-two',
  icon: (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 12 9"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      xmlSpace="preserve"
      style={{fillRule: 'evenodd', clipRule: 'evenodd', strokeLinejoin: 'round', strokeMiterlimit: '1.41421'}}
    >
      <path d="M12,9l-4.936,0l0,-1.005l2.267,-2.249c0.288,-0.311 0.499,-0.588 0.635,-0.832c0.135,-0.243 0.203,-0.455 0.203,-0.635c0,-0.256 -0.068,-0.46 -0.206,-0.612c-0.137,-0.153 -0.343,-0.229 -0.617,-0.229c-0.246,0 -0.439,0.098 -0.579,0.295c-0.141,0.196 -0.211,0.447 -0.211,0.752l-1.598,0l-0.01,-0.028c-0.016,-0.615 0.197,-1.137 0.64,-1.565c0.442,-0.428 1.028,-0.642 1.758,-0.642c0.775,0 1.379,0.18 1.814,0.539c0.434,0.36 0.651,0.852 0.651,1.476c0,0.421 -0.115,0.793 -0.346,1.116c-0.231,0.322 -0.657,0.802 -1.276,1.439l-0.955,0.964l0.015,0.028l2.751,0l0,1.188Zm-6.316,0l-1.576,0l0,-2.717l-2.522,0l0,2.717l-1.586,0l0,-6.75l1.586,0l0,2.828l2.522,0l0,-2.828l1.576,0l0,6.75Z" />
    </svg>
  ),
  title: 'Heading 2'
});
