/**
 * Profile stats component
 * Displays user statistics like profile views, join date, etc.
 */

type User = {
  id: number;
  username: string;
  name: string | null;
  trustLevel: number;
  admin: boolean;
  moderator: boolean;
  active: boolean;
  suspended: boolean;
  createdAt: string;
  lastSeenAt: string | null;
};

type Profile = {
  location: string | null;
  website: string | null;
  bioRaw: string | null;
  bioCooked: string | null;
  avatarUrl: string | null;
  profileBackgroundUrl: string | null;
  cardBackgroundUrl: string | null;
  views: number;
};

type ProfileStatsProps = {
  user: User;
  profile: Profile;
};

export default function ProfileStats({ user, profile }: ProfileStatsProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatLastSeen = (dateString: string | null) => {
    if (!dateString) return "Never";
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays < 7) return `${diffDays} days ago`;
    return formatDate(dateString);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="text-sm text-gray-500">Joined</div>
        <div className="mt-1 text-lg font-semibold text-gray-900">
          {formatDate(user.createdAt)}
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="text-sm text-gray-500">Last Seen</div>
        <div className="mt-1 text-lg font-semibold text-gray-900">
          {formatLastSeen(user.lastSeenAt)}
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="text-sm text-gray-500">Profile Views</div>
        <div className="mt-1 text-lg font-semibold text-gray-900">
          {profile.views.toLocaleString()}
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="text-sm text-gray-500">Trust Level</div>
        <div className="mt-1 text-lg font-semibold text-gray-900">
          Level {user.trustLevel}
        </div>
      </div>

      {profile.location && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="text-sm text-gray-500">Location</div>
          <div className="mt-1 text-lg font-semibold text-gray-900">
            {profile.location}
          </div>
        </div>
      )}

      {profile.website && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="text-sm text-gray-500">Website</div>
          <div className="mt-1 text-lg font-semibold text-gray-900">
            <a
              href={profile.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-500 hover:underline"
            >
              {profile.website}
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
