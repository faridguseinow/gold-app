import React from 'react';
import './style.scss';
import { NavLink } from 'react-router-dom';

export default function index() {
  return (
    <nav className="bottom-nav">

      {/* <NavLink className="nav-button" to="/contacts">
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#666666"><path d="M800-86q-131 0-259-57T307-305Q201-411 144-539.5T87-799q0-32 21-53.5t53-21.5h161q37 0 60 18t31 52l25 119q6 31-.5 53T411-593l-103 90q16 26 37.5 52.5T396-396q26 26 50 45.5t48 33.5l101-98q20-19 44.5-25.5t53.5-.5l111 25q35 10 52.5 31t17.5 55v169q0 32-21.5 53.5T800-86Z" /></svg>
        <div className='nav_line'></div>
      </NavLink> */}

      <NavLink className="nav-button" to="/price">
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#fff"><path d="M878-359 601-82q-18.29 18-41.14 27Q537-46 513-46t-46.86-9Q443.29-64 425-82L83-424q-17-17-27-39.88Q46-486.76 46-512v-277q0-51.56 36.72-88.28T171-914h277q24.7 0 47.85 9.5Q519-895 536-877l342 341q19 19 28 42t9 46.9q0 23.9-9 47T878-359ZM269.88-632Q294-632 311-648.88q17-16.88 17-41T311.12-731q-16.88-17-41-17T229-731.12q-17 16.88-17 41T228.88-649q16.88 17 41 17Z" /></svg>Прайслист        
 
      </NavLink>

      <NavLink className="nav-button" to="/trucks">
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#fff"><path d="M240-160q-50 0-85-35t-35-85H40v-440q0-33 23.5-56.5T120-800h560v160h120l120 160v200h-80q0 50-35 85t-85 35q-50 0-85-35t-35-85H360q0 50-35 85t-85 35Zm0-80q17 0 28.5-11.5T280-280q0-17-11.5-28.5T240-320q-17 0-28.5 11.5T200-280q0 17 11.5 28.5T240-240Zm480 0q17 0 28.5-11.5T760-280q0-17-11.5-28.5T720-320q-17 0-28.5 11.5T680-280q0 17 11.5 28.5T720-240Zm-40-200h170l-90-120h-80v120Z" /></svg>Транспорт

      </NavLink>


    </nav>
  )
}
