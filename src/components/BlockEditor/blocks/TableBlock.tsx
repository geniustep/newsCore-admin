import { useState } from 'react';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';

interface TableBlockProps {
  data: { rows?: number; cols?: number; cells?: string[][] };
  onChange: (data: any) => void;
}

export default function TableBlock({ data, onChange }: TableBlockProps) {
  const rows = data.rows || 2;
  const cols = data.cols || 2;
  const cells = data.cells || Array(rows).fill(null).map(() => Array(cols).fill(''));

  const updateCell = (rowIndex: number, colIndex: number, value: string) => {
    const newCells = cells.map((row, r) =>
      r === rowIndex
        ? row.map((cell, c) => (c === colIndex ? value : cell))
        : row
    );
    onChange({ ...data, cells: newCells });
  };

  const addRow = () => {
    const newCells = [...cells, Array(cols).fill('')];
    onChange({ ...data, rows: rows + 1, cells: newCells });
  };

  const removeRow = (rowIndex: number) => {
    const newCells = cells.filter((_, i) => i !== rowIndex);
    onChange({ ...data, rows: rows - 1, cells: newCells });
  };

  const addCol = () => {
    const newCells = cells.map((row) => [...row, '']);
    onChange({ ...data, cols: cols + 1, cells: newCells });
  };

  const removeCol = (colIndex: number) => {
    const newCells = cells.map((row) => row.filter((_, i) => i !== colIndex));
    onChange({ ...data, cols: cols - 1, cells: newCells });
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2 mb-4">
        <button
          onClick={addRow}
          className="flex items-center gap-1 px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          <PlusIcon className="w-4 h-4" />
          إضافة صف
        </button>
        <button
          onClick={addCol}
          className="flex items-center gap-1 px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          <PlusIcon className="w-4 h-4" />
          إضافة عمود
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300">
          <thead>
            <tr>
              {Array(cols).fill(0).map((_, colIndex) => (
                <th key={colIndex} className="border border-gray-300 p-2 bg-gray-50">
                  <div className="flex items-center justify-between">
                    <span>عمود {colIndex + 1}</span>
                    {cols > 1 && (
                      <button
                        onClick={() => removeCol(colIndex)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {cells.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, colIndex) => (
                  <td key={colIndex} className="border border-gray-300 p-2">
                    <input
                      type="text"
                      value={cell}
                      onChange={(e) => updateCell(rowIndex, colIndex, e.target.value)}
                      className="w-full px-2 py-1 border-0 focus:ring-1 focus:ring-blue-500"
                    />
                  </td>
                ))}
                {rows > 1 && (
                  <td className="border border-gray-300 p-2">
                    <button
                      onClick={() => removeRow(rowIndex)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
