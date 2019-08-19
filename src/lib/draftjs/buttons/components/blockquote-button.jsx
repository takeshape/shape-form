import React from 'react';
import {createBlockStyleButton} from '../utils/button-factory';

export default createBlockStyleButton({
  style: 'blockquote',
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
      <path d="M2,2l1.6,0l0,16l-1.6,0l0,-16Zm12,8l1.6,-3.2l-2.4,0l0,-4.8l4.8,0l0,4.8l-1.6,3.2l-2.4,0Zm-6.4,0l1.6,-3.2l-2.4,0l0,-4.8l4.8,0l0,4.8l-1.6,3.2l-2.4,0Z" />
    </svg>
  ),
  title: 'Block quote'
});
