import React from 'react';
import { ArrowLeft, Users, FilePlus, Save, Star } from 'lucide-react';

const OpportunityDetailPage = ({ opp, onClose, onToggleSave, isSaved }) => (
  <div className="bg-white p-6 rounded-lg border shadow-lg">
    {/* Header with Back button and Action buttons */}
    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-4 pb-4 border-b">
      {/* Back Button */}
      <button
        onClick={onClose}
        className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-blue-700 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Results
      </button>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
        <button
          onClick={() => console.log('Set for discussion clicked')}
          className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-100 transition-colors duration-150"
        >
          <Users className="h-4 w-4" />
          <span>Set for Discussion</span>
        </button>
        <button
          onClick={() => console.log('Create grant call clicked')}
          className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-150"
        >
          <FilePlus className="h-4 w-4" />
          <span>Create Grant Call</span>
        </button>
        <button
          onClick={() => onToggleSave(opp)}
          className={`flex items-center justify-center p-2 rounded-full transition-colors duration-150 ${
            isSaved
              ? 'text-yellow-500 bg-yellow-100 hover:bg-yellow-200'
              : 'text-gray-500 hover:bg-gray-100 hover:text-yellow-500'
          }`}
          aria-label={isSaved ? 'Remove from watchlist' : 'Save to watchlist'}
        >
          {isSaved ? <Save className="h-5 w-5" /> : <Star className="h-5 w-5" />}
        </button>
      </div>
    </div>

    {/* Details Content */}
    <div className="space-y-6">
      <span className="inline-block bg-blue-100 text-blue-800 text-lg font-semibold px-3 py-1 rounded-full">
        {opp.agency}
      </span>
      
      <h1 className="text-3xl font-bold text-gray-900">{opp.title}</h1>
      
      <div>
        <h2 className="text-sm font-semibold text-red-700">DEADLINE</h2>
        <p className="text-lg text-red-600 font-medium">
          {new Date(opp.deadline).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>
      
      <div>
        <h2 className="text-sm font-semibold text-gray-600">DESCRIPTION</h2>
        <p className="text-base text-gray-800 whitespace-pre-wrap">{opp.description}</p>
      </div>
      
      <div>
        <h2 className="text-sm font-semibold text-gray-600">KEYWORDS</h2>
        <div className="flex flex-wrap gap-2 mt-1">
          {opp.keywords.map(keyword => (
            <span key={keyword} className="text-xs text-gray-700 bg-gray-200 px-2 py-1 rounded-full">
              {keyword}
            </span>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default OpportunityDetailPage;