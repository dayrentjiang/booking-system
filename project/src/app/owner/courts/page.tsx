"use client";

import React from "react";
import { addCourtAction } from "@/actions/addCourtAction";

export default function CourtsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Courts</h1>
        <p className="text-gray-600">Manage your courts</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">All Courts</h2>
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              onClick={() => addCourtAction()}
            >
              Add Court
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Sample court card */}
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold text-lg">Court 1</h3>
              <p className="text-gray-600 text-sm mt-1">Indoor Hard Court</p>
              <div className="mt-4 flex justify-between items-center">
                <span className="text-sm text-gray-600">$30/hour</span>
                <button className="text-blue-600 hover:text-blue-800">
                  Edit
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
