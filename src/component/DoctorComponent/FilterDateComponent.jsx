import React, { useState, useEffect, useRef } from "react";

const FilterDateComponent = ({ dateRange, onClose, onApply }) => {
  const today = new Date().toLocaleDateString('en-CA');
  console.log(today);
  const [localDateRange, setLocalDateRange] = useState({
    from: today,
    to: today,
  });

  const dropdownRef = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const onChange = () => {};

  return (
    <div
      ref={dropdownRef}
      className="w-64 max-w-[90vw] bg-white border border-gray-200 shadow-lg rounded-xl p-4 space-y-4 ml-4 sm:m-0"
    >
      <div className="text-sm font-medium text-gray-700">Select Date Range</div>
      <div className="flex flex-col gap-2">
        <label className="text-xs text-gray-500">From</label>
        <input
          type="date"
          value={localDateRange.from}
          onChange={(e) => setLocalDateRange({ ...localDateRange, from: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-300 focus:outline-none"
        />
        <label className="text-xs text-gray-500">To</label>
        <input
          type="date"
          value={localDateRange.to}
          onChange={(e) => setLocalDateRange({ ...localDateRange, to: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-300 focus:outline-none"
        />
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <button
          onClick={onClose}
          className="px-4 py-1 text-sm rounded-lg text-gray-600 hover:text-gray-800"
        >
          Cancel
        </button>
        <button
          onClick={() => {
            onApply(localDateRange);
            onClose();
          }}
          className="px-4 py-1 text-sm rounded-lg text-white bg-indigo-600 hover:bg-indigo-700"
        >
          Apply
        </button>
      </div>
    </div>
  );
};

export default FilterDateComponent;
