import React from 'react';
import { Save, Star } from 'lucide-react';

const OpportunityCard = ({ opp, onToggleSave, isSaved, onViewDetails }) => (
  <div className="bg-white border rounded-lg shadow-sm overflow-hidden transform transition-all hover:shadow-md">
    <div className="p-5">
      <div className="flex justify-between items-start">
        <div className="flex-grow pr-4">
          <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full mb-2">
            {opp.agency}
          </span>
          <h3 
            className="text-lg font-semibold text-gray-900 cursor-pointer hover:text-blue-700"
            onClick={() => onViewDetails(opp)}
          >
            {opp.title}
          </h3>
        </div>
        <button
          onClick={() => onToggleSave(opp)}
          className={`ml-4 p-2 rounded-full transition-colors duration-150 ${
            isSaved
              ? 'text-yellow-500 bg-yellow-100 hover:bg-yellow-200'
              : 'text-gray-500 hover:bg-yellow-100 hover:text-yellow-500'
          }`}
          aria-label={isSaved ? 'Remove from watchlist' : 'Save to watchlist'}
        >
          {isSaved ? <Save className="h-5 w-5" /> : <Star className="h-5 w-5" />}
        </button>
      </div>
      <p className="text-sm text-gray-600 mt-2 line-clamp-2">{opp.description}</p>
      <p className="text-sm text-red-600 font-medium mt-4">
        Deadline: {new Date(opp.deadline).toLocaleDateString()}
      </p>
    </div>
  </div>
);

export default OpportunityCard;