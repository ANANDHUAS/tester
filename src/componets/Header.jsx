import React from 'react';

const Header = ({ userId }) => (
  <header className="bg-white shadow-sm border-b">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold text-blue-700">Fund Finder</h1>
      {userId && (
        <div className="text-right">
          <b>2.0</b>
          <span className="text-sm text-gray-500">User ID</span>
          <p className="text-xs font-mono text-gray-700 bg-gray-100 px-2 py-1 rounded">
            {userId}
          </p>
        </div>
      )}
    </div>
  </header>
);

export default Header;