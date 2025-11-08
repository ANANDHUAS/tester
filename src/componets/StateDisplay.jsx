import React from 'react';
import { Loader2, AlertCircle, Inbox } from 'lucide-react';

const StateDisplay = ({ isLoading, error, data, type }) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-10">
        <Loader2 className="h-8 w-8 text-gray-400 animate-spin" />
        <span className="ml-3 text-gray-500">Loading...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center py-10 text-center">
        <AlertCircle className="h-10 w-10 text-red-400" />
        <h3 className="mt-2 text-lg font-medium text-red-600">Error</h3>
        <p className="text-sm text-gray-500">{error.message}</p>
      </div>
    );
  }

  if (data.length === 0) {
    if (type === 'search') {
      return (
        <div className="flex flex-col items-center py-10 text-center">
          <Inbox className="h-10 w-10 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-700">No Results Found</h3>
          <p className="text-sm text-gray-500">Try adjusting your search or filter terms.</p>
        </div>
      );
    }
    if (type === 'saved') {
      return (
        <div className="text-center py-6">
          <p className="text-sm text-gray-500">Your watchlist is empty.</p>
          <p className="text-xs text-gray-400 mt-1">Click the star icon on a search result to save it.</p>
        </div>
      );
    }
    // --- New case for recommendations ---
    if (type === 'recommended') {
      return (
        <div className="text-center py-6 bg-white/50 rounded-lg">
          <p className="text-sm text-gray-500">No specific recommendations for you at this time.</p>
        </div>
      );
    }
  }

  return null;
};

export default StateDisplay;