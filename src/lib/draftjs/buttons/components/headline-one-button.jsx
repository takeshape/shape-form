import React from 'react';
import {createBlockStyleButton} from '../utils/button-factory';

export default createBlockStyleButton({
  style: 'header-one',
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
      <path d="M6.947,9l-1.927,0l0,-3.622l-3.082,0l0,3.622l-1.938,0l0,-9l1.938,0l0,3.771l3.082,0l0,-3.771l1.927,0l0,9Zm5.053,0l-1.929,0l0,-6.9l-1.86,0l0,-1.47l3.789,-0.63l0,9Z" />
    </svg>
  ),
  title: 'Heading 1'
});
