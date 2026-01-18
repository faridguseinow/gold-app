import React from 'react';
import './style.scss';


import LogoGF from '/src/assets/icons/logo.svg';
import LogoOA from '/src/assets/icons/oasis_logo.svg';

export default function Index() {

  return (
    <div className="header">
      <div className="logo">
        <img src={LogoGF} width={150} alt="logo" />
        <img src={LogoOA} width={110} alt="logo" />
      </div>
    </div>
  );
}
