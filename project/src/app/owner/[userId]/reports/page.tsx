import React from 'react';

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Reports</h1>
        <p className="text-gray-600">View your business analytics</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Revenue Overview</h2>
          <div className="h-64 flex items-center justify-center border rounded bg-gray-50">
            <p className="text-gray-500">Revenue chart placeholder</p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Booking Trends</h2>
          <div className="h-64 flex items-center justify-center border rounded bg-gray-50">
            <p className="text-gray-500">Booking trends chart placeholder</p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6 lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Detailed Reports</h2>
            <div className="space-x-2">
              <button className="px-4 py-2 border rounded hover:bg-gray-50">
                Export CSV
              </button>
              <button className="px-4 py-2 border rounded hover:bg-gray-50">
                Export PDF
              </button>
            </div>
          </div>
          <div className="h-64 flex items-center justify-center border rounded bg-gray-50">
            <p className="text-gray-500">Detailed reports table placeholder</p>
          </div>
        </div>
      </div>
    </div>
  );
}