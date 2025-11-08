import React, { useState } from 'react';
import { Search, Filter } from 'lucide-react';

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const [agency, setAgency] = useState('All');
  const [status, setStatus] = useState('All');
  const [sortBy, setSortBy] = useState('relevance');
  const [filtersVisible, setFiltersVisible] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(query, agency, status, sortBy);
  };

  const handleFilterChange = (setter, value) => {
    setter(value);
    // Trigger search immediately on filter change
    if (setter === setAgency) {
      onSearch(query, value, status, sortBy);
    } else if (setter === setStatus) {
      onSearch(query, agency, value, sortBy);
    } else if (setter === setSortBy) {
      onSearch(query, agency, status, value);
    }
  };

  const resetFilters = () => {
    setAgency('All');
    setStatus('All');
    setSortBy('relevance');
    setFiltersVisible(false);
    onSearch(query, 'All', 'All', 'relevance');
  };


  return (
    <form onSubmit={handleSearch} className="p-4 bg-gray-50 rounded-lg border space-y-4">
      {/* Top Row: Search and Filter Toggle */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-grow">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by keyword (e.g., 'AI', 'health', 'energy')"
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
        <button
          type="button"
          onClick={() => setFiltersVisible(!filtersVisible)}
          className={`flex-shrink-0 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition duration-150 flex items-center justify-center gap-2 ${
            filtersVisible ? 'bg-gray-100 ring-2 ring-blue-500' : ''
          }`}
        >
          <Filter className="h-4 w-4" />
          <span>Filters</span>
        </button>
        <button
          type="submit"
          className="flex-shrink-0 bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition duration-150 flex items-center justify-center gap-2"
        >
          <Search className="h-4 w-4" />
          <span>Search</span>
        </button>
      </div>

      {/* Collapsible Filter Section */}
      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          filtersVisible ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="pt-4 border-t border-gray-200">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label htmlFor="agency" className="block text-sm font-medium text-gray-700 mb-1">Agency</label>
              <select
                id="agency"
                value={agency}
                onChange={(e) => handleFilterChange(setAgency, e.target.value)}
                className="w-full px-4 py-2 border rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="All">All Agencies</option>
                <option value="NSF">NSF</option>
                <option value="NIH">NIH</option>
                <option value="DOE">DOE</option>
                <option value="NEH">NEH</option>
                <option value="NASA">NASA</option>
              </select>
            </div>
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                id="status"
                value={status}
                onChange={(e) => handleFilterChange(setStatus, e.target.value)}
                className="w-full px-4 py-2 border rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="All">All Statuses</option>
                <option value="Open">Open</option>
                <option value="Closed">Closed</option>
              </select>
            </div>
            <div>
              <label htmlFor="sortby" className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
              <select
                id="sortby"
                value={sortBy}
                onChange={(e) => handleFilterChange(setSortBy, e.target.value)}
                className="w-full px-4 py-2 border rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="relevance">Sort: Relevance</option>
                <option value="deadline">Sort: Deadline (Soonest)</option>
              </select>
            </div>
            
            <div className="sm:col-span-3 text-right mt-2">
              <button
                type="button"
                onClick={resetFilters}
                className="text-sm text-blue-600 hover:underline"
              >
                Reset Filters
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default SearchBar;