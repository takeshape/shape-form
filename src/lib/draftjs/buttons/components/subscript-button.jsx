import React from 'react';
import {createInlineStyleButton} from '../utils/button-factory';

export default createInlineStyleButton({
  style: 'SUB',
  icon: (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 16 12"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      xmlSpace="preserve"
      style={{fillRule: 'evenodd', clipRule: 'evenodd', strokeLinejoin: 'round', strokeMiterlimit: '1.41421'}}
    >
      <path d="M0,0l10.191,0l0,2.184l-4.004,0l0,8.735l-2.183,0l0,-8.735l-4.004,0l0,-2.184Zm11.689,8.851l0.229,-0.229l0.229,0.229l0.374,0.374l0.229,0.229l-0.229,0.229l-1.256,1.256l1.256,1.257l0.229,0.229l-0.229,0.229l-0.374,0.374l-0.229,0.229l-0.229,-0.229l-1.257,-1.256l-1.256,1.256l-0.229,0.229l-0.229,-0.229l-0.375,-0.374l-0.229,-0.229l0.229,-0.229l1.257,-1.257l-1.257,-1.256l-0.229,-0.229l0.229,-0.229l0.375,-0.374l0.229,-0.229l0.229,0.229l1.256,1.256l1.257,-1.256Z" />
    </svg>
  ),
  title: 'Subscript'
});
