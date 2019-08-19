import React from 'react';
import {createInlineStyleButton} from '../utils/button-factory';

export default createInlineStyleButton({
  style: 'SUP',
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
      <path d="M0,0l9.89,0l0,2.119l-3.885,0l0,8.477l-2.12,0l0,-8.477l-3.885,0l0,-2.119Zm14.72,0.249l0.222,-0.222l0.222,0.222l0.364,0.364l0.222,0.222l-0.222,0.221l-1.22,1.22l1.22,1.22l0.222,0.222l-0.222,0.222l-0.364,0.364l-0.222,0.222l-0.222,-0.222l-1.219,-1.22l-1.22,1.22l-0.222,0.222l-0.222,-0.222l-0.364,-0.364l-0.222,-0.222l0.222,-0.222l1.22,-1.22l-1.22,-1.22l-0.222,-0.221l0.222,-0.222l0.364,-0.364l0.222,-0.222l0.222,0.222l1.22,1.22l1.219,-1.22Z" />
    </svg>
  ),
  title: 'Superscript'
});
