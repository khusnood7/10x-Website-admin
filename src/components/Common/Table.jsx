// src/components/Common/Table.jsx

import React from 'react';
import clsx from 'clsx';

const Table = ({ headers, data, renderRow }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border">
        <thead>
          <tr>
            {headers.map((header, index) => (
              <th
                key={index}
                className="py-2 px-4 bg-gray-200 text-left text-sm font-semibold text-gray-700 border-b"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={headers.length} className="py-4 text-center text-gray-500">
                No data available.
              </td>
            </tr>
          ) : (
            data.map((item, index) => (
              <tr key={item.id || index} className={clsx('hover:bg-gray-100')}>
                {renderRow(item)}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
