import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-4">
      <div className="container mx-auto text-center">
        <p className="text-sm">©️ 2007 GSR HOSPITALITY SERVICES | All rights Reserved</p>
        <div className="flex justify-center space-x-4 mt-2 text-sm">
          <Link to="/refund-cancellation" className="hover:underline">
            Refund & Cancellation |
          </Link>
          <Link to="/privacy-policy" className="hover:underline">
            Privacy Policy |
          </Link>
          
          <Link to="/terms-conditions" className="hover:underline">
            Terms & Conditions |
          </Link>
          <Link to="/return-policy" className="hover:underline">
            Return Policy
          </Link>
        </div>
      </div>
    </footer>
  );
};
  
export default Footer;
