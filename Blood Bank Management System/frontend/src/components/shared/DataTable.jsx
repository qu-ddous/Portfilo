import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

export const DataTable = ({ columns, data, onRowClick, emptyMessage = "No data records found" }) => {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-12 text-center shadow-[0_10px_0_#cbd5e1,0_15px_30px_rgba(0,0,0,0.05)] border-2 border-white">
        <p className="text-lg font-bold text-[#7F8C8D] uppercase tracking-wider">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl shadow-[0_10px_0_#cbd5e1,0_15px_30px_rgba(0,0,0,0.05)] border-2 border-white overflow-hidden relative">
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/80 border-b-2 border-gray-100">
              {columns.map((col, i) => (
                <th key={i} className="px-6 py-5 text-xs font-black text-[#2C3E50] uppercase tracking-widest whitespace-nowrap">
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y-2 divide-gray-50">
            {data.map((row, rowIndex) => (
              <motion.tr 
                key={rowIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: rowIndex * 0.05 }}
                onClick={() => onRowClick && onRowClick(row)}
                className={cn(
                  "group transition-colors duration-200", 
                  onRowClick ? "cursor-pointer hover:bg-red-50/50" : "hover:bg-gray-50/30"
                )}
              >
                {columns.map((col, colIndex) => (
                  <td key={colIndex} className="px-6 py-5 text-sm font-semibold text-[#2C3E50]">
                    {col.render ? col.render(row) : row[col.accessor]}
                  </td>
                ))}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
