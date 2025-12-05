import { useMemo } from 'react';

interface ChartLineProps {
  data: Array<{ date: string; value: number }>;
}

export default function ChartLine({ data }: ChartLineProps) {
  const maxValue = useMemo(() => {
    return Math.max(...data.map((d) => d.value), 1);
  }, [data]);

  const points = useMemo(() => {
    const width = 100;
    const height = 200;
    return data.map((d, index) => {
      const x = (index / (data.length - 1 || 1)) * width;
      const y = height - (d.value / maxValue) * height;
      return `${x},${y}`;
    }).join(' ');
  }, [data, maxValue]);

  return (
    <div className="h-64 flex items-end justify-between gap-2">
      {data.map((item, index) => (
        <div key={index} className="flex-1 flex flex-col items-center">
          <div
            className="w-full bg-blue-500 rounded-t transition-all hover:bg-blue-600"
            style={{ height: `${(item.value / maxValue) * 100}%` }}
            title={`${item.date}: ${item.value}`}
          />
          <span className="text-xs text-gray-500 mt-2 transform -rotate-45 origin-top-left whitespace-nowrap">
            {new Date(item.date).toLocaleDateString('ar', { month: 'short', day: 'numeric' })}
          </span>
        </div>
      ))}
    </div>
  );
}
