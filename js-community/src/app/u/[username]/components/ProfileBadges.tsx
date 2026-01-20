/**
 * Profile badges component
 * Displays user's earned badges
 */

type Badge = {
  id: number;
  badgeId: number;
  grantedAt: string;
  featured: number;
  badgeName: string;
  badgeDescription: string | null;
  badgeIcon: string | null;
  badgeImageUrl: string | null;
};

type ProfileBadgesProps = {
  badges: Badge[];
};

export default function ProfileBadges({ badges }: ProfileBadgesProps) {
  if (badges.length === 0) {
    return null;
  }

  return (
    <div className="border-t pt-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Badges ({badges.length})
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {badges.map((badge) => (
          <div
            key={badge.id}
            className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="flex-shrink-0">
              {badge.badgeImageUrl ? (
                // biome-ignore lint/performance/noImgElement: External badge images may not be optimizable
                <img
                  src={badge.badgeImageUrl}
                  alt={badge.badgeName}
                  className="w-12 h-12 rounded-full"
                />
              ) : (
                <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xl">
                    {badge.badgeIcon || "🏆"}
                  </span>
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900">
                {badge.badgeName}
              </p>
              {badge.badgeDescription && (
                <p className="text-sm text-gray-500 mt-1">
                  {badge.badgeDescription}
                </p>
              )}
              <p className="text-xs text-gray-400 mt-1">
                Earned {new Date(badge.grantedAt).toLocaleDateString()}
              </p>
            </div>
            {badge.featured === 1 && (
              <div className="flex-shrink-0">
                <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-yellow-100 text-yellow-800">
                  Featured
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
