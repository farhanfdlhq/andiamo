
import React from 'react';

interface LogoIconProps extends React.SVGProps<SVGSVGElement> {
  // No custom props needed for this simple icon
}

const LogoIcon: React.FC<LogoIconProps> = (props) => (
  <svg 
    viewBox="0 0 200 50" 
    xmlns="http://www.w3.org/2000/svg" 
    aria-label="Andiamo.id Logo"
    {...props}
  >
    <rect width="200" height="50" fill="#FFD400" />
    <text 
      x="50%" 
      y="50%" 
      dominantBaseline="middle" 
      textAnchor="middle" 
      fontFamily="Poppins, sans-serif" 
      fontSize="28" 
      fontWeight="bold" 
      fill="#000000"
    >
      Andiamo.id
    </text>
  </svg>
);

export default LogoIcon;
