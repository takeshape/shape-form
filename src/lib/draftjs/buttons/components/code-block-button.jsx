import React from 'react';
import {createBlockStyleButton} from '../utils/button-factory';

export default createBlockStyleButton({
  style: 'code-block',
  icon: (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 12 10"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      xmlSpace="preserve"
      style={{fillRule: 'evenodd', clipRule: 'evenodd', strokeLinejoin: 'round', strokeMiterlimit: '1.41421'}}
    >
      <path d="M0.75,0.75l0,8.25l10.5,0l0,-8.25l-10.5,0Zm11.25,-0.75l0,9.75l-12,0l0,-9.75l12,0Zm-5.2,6.364l0.473,0.461l2.027,-1.976l-2.027,-1.977l-0.473,0.461l1.554,1.516l-1.554,1.515Zm-1.5,0l-1.554,-1.515l1.554,-1.516l-0.473,-0.461l-2.027,1.977l2.027,1.976l0.473,-0.461Z" />
    </svg>
  ),
  title: 'Code Block'
});
