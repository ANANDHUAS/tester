import React from 'react';
import { X } from 'lucide-react';

const SavedOppItem = ({ item, onToggleSave, onViewDetails }) => (
  <li className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-lg">
    <div className="flex-grow pr-2">
      <h4 
        className="font-medium text-sm text-gray-800 cursor-pointer hover:text-blue-700"
        onClick={() => onViewDetails(item)}
      >
        {item.title}
      </h4>
      <p className="text-xs text-gray-500">{item.agency} - Deadline: {new Date(item.deadline).toLocaleDateString()}</p>
    </div>
    <button
      onClick={() => onToggleSave(item)}
      className="p-1.5 rounded-full text-gray-400 hover:bg-red-100 hover:text-red-500 transition-colors"
      aria-label="Remove from saved"
    >
      <X className="h-4 w-4" />
    </button>
  </li>
);

export default SavedOppItem;