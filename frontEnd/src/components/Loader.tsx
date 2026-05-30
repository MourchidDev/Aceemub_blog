import React from 'react';
import sharedImage from '../assets/ac.png';
import './Loader.css';

const Loader: React.FC<{ isLoading: boolean }> = ({ isLoading }) => {
  if (!isLoading) return null;

  return (
    <div className="loader-overlay">
      <div className="loader-wrapper">
        {/* SVG Animation - disparaît avant la fin */}
        <svg 
          viewBox="0 0 400 400" 
          className="premium-svg"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* La Lune - Effet de remplissage progressif */}
          <path 
            className="logo-moon"
            d="M100,250 A120,120 0 1,1 300,250 A100,100 0 1,0 100,250" 
            fill="none" 
            stroke="#f7a16f" 
            strokeWidth="4"
          />
          
          {/* La Plume - Animation de tracé (Stroke) */}
          <path 
            className="logo-feather"
            d="M200,50 C180,100 180,200 200,300 L210,310 L190,310" 
            fill="none" 
            stroke="#228B22" 
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* Le Texte - Apparition élégante */}
          <text 
            x="50%" 
            y="370" 
            textAnchor="middle" 
            className="logo-text"
          >
            ACEEMUB
          </text>
        </svg>

        {/* Logo - apparaît quand le SVG disparaît */}
        <img src={sharedImage} alt="Logo ACEEMUB" className="loader-logo" />
        
        {/* Barre de progression discrète en bas */}
        <div className="minimal-progress">
          <div className="progress-bar-fill"></div>
        </div>
      </div>
    </div>
  );
};

export default Loader;