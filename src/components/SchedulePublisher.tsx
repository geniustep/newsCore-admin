import { useState } from 'react';
import { format } from 'date-fns';
import { CalendarIcon, ClockIcon } from '@heroicons/react/24/outline';

interface SchedulePublisherProps {
  onSchedule: (date: Date | null) => void;
  currentSchedule?: Date;
}

export default function SchedulePublisher({
  onSchedule,
  currentSchedule
}: SchedulePublisherProps) {
  const [scheduleDate, setScheduleDate] = useState(
    currentSchedule ? format(currentSchedule, "yyyy-MM-dd'T'HH:mm") : ''
  );

  const handleSchedule = () => {
    if (!scheduleDate) return;
    onSchedule(new Date(scheduleDate));
  };

  const now = format(new Date(), "yyyy-MM-dd'T'HH:mm");

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <CalendarIcon className="w-5 h-5" />
        جدولة النشر
      </h3>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            تاريخ ووقت النشر
          </label>
          <input
            type="datetime-local"
            value={scheduleDate}
            onChange={(e) => setScheduleDate(e.target.value)}
            min={now}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleSchedule}
            disabled={!scheduleDate}
            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            جدولة النشر
          </button>

          {currentSchedule && (
            <button
              onClick={() => {
                setScheduleDate('');
                onSchedule(null);
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              إلغاء الجدولة
            </button>
          )}
        </div>

        {currentSchedule && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm">
            <ClockIcon className="w-4 h-4 inline ml-2" />
            مجدول للنشر في: {format(currentSchedule, 'yyyy/MM/dd - HH:mm')}
          </div>
        )}
      </div>
    </div>
  );
}
