import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { usersApi } from '../../lib/api';
import { UserIcon } from '@heroicons/react/24/outline';

interface AssignReviewerProps {
  currentReviewerId?: string;
  onAssign: (userId: string) => void;
}

export default function AssignReviewer({ currentReviewerId, onAssign }: AssignReviewerProps) {
  const [selectedUserId, setSelectedUserId] = useState<string>(currentReviewerId || '');

  const { data: users } = useQuery({
    queryKey: ['users', 'reviewers'],
    queryFn: () => usersApi.getAll({ role: 'editor' }),
  });

  const handleAssign = () => {
    if (selectedUserId) {
      onAssign(selectedUserId);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <UserIcon className="w-5 h-5" />
        تعيين مراجع
      </h3>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            اختر المراجع
          </label>
          <select
            value={selectedUserId}
            onChange={(e) => setSelectedUserId(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          >
            <option value="">-- اختر مراجع --</option>
            {users?.map((user: any) => (
              <option key={user.id} value={user.id}>
                {user.displayName || user.email}
              </option>
            ))}
          </select>
        </div>

        {currentReviewerId && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm">
            المراجع الحالي: {users?.find((u: any) => u.id === currentReviewerId)?.displayName || 'غير معين'}
          </div>
        )}

        <button
          onClick={handleAssign}
          disabled={!selectedUserId}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          تعيين مراجع
        </button>
      </div>
    </div>
  );
}
