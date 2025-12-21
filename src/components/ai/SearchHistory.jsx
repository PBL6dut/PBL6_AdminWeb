import { useState, useEffect, useMemo } from 'react';
import { getSearchHistory, clearSearchHistory, getSessionDetails } from '../../services/aiApi';
import { FaSearch, FaStar, FaTrash, FaSpinner, FaCalendarAlt, FaFilter, FaChartBar, FaBoxes, FaShoppingCart, FaClock, FaRedoAlt, FaTimes } from 'react-icons/fa';
import SessionDetailModal from './SessionDetailModal';

export default function SearchHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  // Filtering & Search states
  const [dateFilter, setDateFilter] = useState('all'); // all, today, week, month
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('date'); // date, objects, recommendations

  const loadHistory = async () => {
    setLoading(true);

    try {
      const result = await getSearchHistory(page, 20);

      if (result.success && result.data) {
        const items = result.data.items || [];
        setHistory((prev) => (page === 1 ? items : [...prev, ...items]));
        const hasMore = result.data.page * result.data.page_size < result.data.total;
        setHasMore(hasMore);
      }
    } catch (err) {
      console.error('Failed to load history:', err);
    } finally {
      setLoading(false);
    }
  };

  // Load history on mount and when page changes
  useEffect(() => {
    loadHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const handleClearHistory = async () => {
    if (!window.confirm('Bạn có chắc muốn xóa toàn bộ lịch sử tìm kiếm?')) {
      return;
    }

    try {
      await clearSearchHistory();
      setHistory([]);
      setPage(1);
      alert('Đã xóa lịch sử thành công');
    } catch (err) {
      alert('Không thể xóa lịch sử');
      console.error(err);
    }
  };

  const handleLoadMore = () => {
    setPage((prev) => prev + 1);
  };

  const handleViewDetails = async (session) => {
    setLoadingDetails(true);
    try {
      const result = await getSessionDetails(session.session_id);

      if (result.success && result.data) {
        setSelectedSession({
          ...session,
          ...result.data,
        });
      } else {
        setSelectedSession(session);
      }
    } catch (err) {
      console.error('Failed to load session details:', err);
      setSelectedSession(session);
    } finally {
      setLoadingDetails(false);
    }
  };

  // Group by session_id first
  const groupedSessions = useMemo(() => {
    const sessions = {};

    history.forEach((item) => {
      const sessionId = item.session_id;

      if (!sessions[sessionId]) {
        sessions[sessionId] = {
          id: item.id,
          session_id: sessionId,
          created_at: item.created_at,
          original_image_url: item.original_image_url,
          detected_objects_count: item.detected_objects_count || 0,
          recommendations_count: item.recommendations_count || 0,
          query_category: item.query_category,
          query_type: item.query_type
        };
      } else {
        if (item.recommendations_count > 0) {
          sessions[sessionId].recommendations_count = item.recommendations_count;
        }
        if (item.detected_objects_count > 0) {
          sessions[sessionId].detected_objects_count = item.detected_objects_count;
        }
        if (new Date(item.created_at) < new Date(sessions[sessionId].created_at)) {
          sessions[sessionId].created_at = item.created_at;
        }
      }
    });

    return Object.values(sessions);
  }, [history]);

  // Apply filtering and sorting
  const filteredAndSortedSessions = useMemo(() => {
    let filtered = [...groupedSessions];

    // Date filtering
    const now = new Date();
    if (dateFilter === 'today') {
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      filtered = filtered.filter(s => new Date(s.created_at) >= today);
    } else if (dateFilter === 'week') {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      filtered = filtered.filter(s => new Date(s.created_at) >= weekAgo);
    } else if (dateFilter === 'month') {
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      filtered = filtered.filter(s => new Date(s.created_at) >= monthAgo);
    }

    // Search filtering (search in session_id for now)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(s =>
        s.session_id.toLowerCase().includes(query)
      );
    }

    // Sorting
    if (sortBy === 'objects') {
      filtered.sort((a, b) => b.detected_objects_count - a.detected_objects_count);
    } else if (sortBy === 'recommendations') {
      filtered.sort((a, b) => b.recommendations_count - a.recommendations_count);
    } else {
      // Default: sort by date (newest first)
      filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }

    return filtered;
  }, [groupedSessions, dateFilter, searchQuery, sortBy]);

  // Group filtered sessions by date for display
  const groupByDate = useMemo(() => {
    const dateGroups = {};
    filteredAndSortedSessions.forEach((session) => {
      const date = new Date(session.created_at).toLocaleDateString('vi-VN');
      if (!dateGroups[date]) {
        dateGroups[date] = [];
      }
      dateGroups[date].push(session);
    });
    return dateGroups;
  }, [filteredAndSortedSessions]);

  // Calculate statistics
  const statistics = useMemo(() => {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const weekSearches = groupedSessions.filter(s => new Date(s.created_at) >= weekAgo);
    const monthSearches = groupedSessions.filter(s => new Date(s.created_at) >= monthAgo);

    const totalObjects = groupedSessions.reduce((sum, s) => sum + s.detected_objects_count, 0);
    const avgObjectsPerSearch = groupedSessions.length > 0
      ? (totalObjects / groupedSessions.length).toFixed(1)
      : 0;

    const totalRecommendations = groupedSessions.reduce((sum, s) => sum + s.recommendations_count, 0);
    const avgRecommendations = groupedSessions.length > 0
      ? (totalRecommendations / groupedSessions.length).toFixed(1)
      : 0;

    return {
      totalSearches: groupedSessions.length,
      weekSearches: weekSearches.length,
      monthSearches: monthSearches.length,
      avgObjectsPerSearch,
      avgRecommendations,
      totalObjects,
      totalRecommendations
    };
  }, [groupedSessions]);

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow p-5 text-white">
          <div className="flex items-center justify-between mb-2">
            <FaChartBar className="text-2xl opacity-80" />
            <span className="text-xs font-medium bg-white bg-opacity-20 px-2 py-1 rounded">Tuần này</span>
          </div>
          <p className="text-3xl font-bold">{statistics.weekSearches}</p>
          <p className="text-sm opacity-90 mt-1">Tìm kiếm tuần này</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow p-5 text-white">
          <div className="flex items-center justify-between mb-2">
            <FaClock className="text-2xl opacity-80" />
            <span className="text-xs font-medium bg-white bg-opacity-20 px-2 py-1 rounded">Tháng này</span>
          </div>
          <p className="text-3xl font-bold">{statistics.monthSearches}</p>
          <p className="text-sm opacity-90 mt-1">Tìm kiếm tháng này</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow p-5 text-white">
          <div className="flex items-center justify-between mb-2">
            <FaBoxes className="text-2xl opacity-80" />
          </div>
          <p className="text-3xl font-bold">{statistics.avgObjectsPerSearch}</p>
          <p className="text-sm opacity-90 mt-1">TB vật thể / lần tìm</p>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg shadow p-5 text-white">
          <div className="flex items-center justify-between mb-2">
            <FaShoppingCart className="text-2xl opacity-80" />
          </div>
          <p className="text-3xl font-bold">{statistics.avgRecommendations}</p>
          <p className="text-sm opacity-90 mt-1">TB gợi ý / lần tìm</p>
        </div>
      </div>

      {/* Header with Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
          <h3 className="text-lg font-semibold">Lịch sử tìm kiếm</h3>
          <button
            onClick={handleClearHistory}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors w-full lg:w-auto justify-center"
          >
            <FaTrash />
            Xóa tất cả
          </button>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Date Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FaCalendarAlt className="inline mr-2" />
              Lọc theo thời gian
            </label>
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Tất cả</option>
              <option value="today">Hôm nay</option>
              <option value="week">7 ngày qua</option>
              <option value="month">30 ngày qua</option>
            </select>
          </div>

          {/* Sort */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FaFilter className="inline mr-2" />
              Sắp xếp theo
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="date">Mới nhất</option>
              <option value="objects">Nhiều vật thể nhất</option>
              <option value="recommendations">Nhiều gợi ý nhất</option>
            </select>
          </div>

          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FaSearch className="inline mr-2" />
              Tìm kiếm
            </label>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm session ID..."
                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <FaTimes />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Active Filters Summary */}
        {(dateFilter !== 'all' || searchQuery) && (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="text-sm text-gray-600">Bộ lọc đang áp dụng:</span>
            {dateFilter !== 'all' && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                {dateFilter === 'today' ? 'Hôm nay' : dateFilter === 'week' ? '7 ngày' : '30 ngày'}
                <button onClick={() => setDateFilter('all')} className="hover:text-blue-900">
                  <FaTimes className="text-xs" />
                </button>
              </span>
            )}
            {searchQuery && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                Tìm: "{searchQuery}"
                <button onClick={() => setSearchQuery('')} className="hover:text-blue-900">
                  <FaTimes className="text-xs" />
                </button>
              </span>
            )}
            <button
              onClick={() => {
                setDateFilter('all');
                setSearchQuery('');
              }}
              className="text-sm text-blue-600 hover:text-blue-800 underline"
            >
              Xóa tất cả
            </button>
          </div>
        )}
      </div>

      {/* Loading State */}
      {loading && page === 1 && (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <FaSpinner className="animate-spin text-4xl text-blue-500 mx-auto mb-3" />
          <p className="text-gray-600">Đang tải...</p>
        </div>
      )}

      {/* Timeline View with Enhanced Items */}
      {Object.keys(groupByDate).length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="space-y-8">
            {Object.entries(groupByDate).map(([date, items]) => (
              <div key={date}>
                <h4 className="text-md font-semibold text-gray-700 mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  {date}
                  <span className="text-sm font-normal text-gray-500">({items.length} lần tìm kiếm)</span>
                </h4>
                <div className="space-y-4 ml-4 border-l-2 border-gray-200 pl-4">
                  {items.map((session) => (
                    <EnhancedHistoryItem
                      key={session.session_id}
                      session={session}
                      onViewDetails={handleViewDetails}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Load More */}
          {hasMore && (
            <div className="mt-6 text-center">
              <button
                onClick={handleLoadMore}
                disabled={loading}
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:bg-gray-400"
              >
                {loading ? 'Đang tải...' : 'Tải thêm'}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Empty State */}
      {filteredAndSortedSessions.length === 0 && !loading && (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <FaSearch className="text-6xl text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">
            {searchQuery || dateFilter !== 'all'
              ? 'Không tìm thấy kết quả phù hợp'
              : 'Chưa có lịch sử tìm kiếm'}
          </p>
          {(searchQuery || dateFilter !== 'all') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setDateFilter('all');
              }}
              className="mt-4 text-blue-600 hover:text-blue-800 underline"
            >
              Xóa bộ lọc
            </button>
          )}
        </div>
      )}

      {/* Session Detail Modal */}
      {selectedSession && (
        <SessionDetailModal
          session={selectedSession}
          onClose={() => setSelectedSession(null)}
        />
      )}

      {/* Loading Details Overlay */}
      {loadingDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-30 z-40 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 shadow-xl">
            <FaSpinner className="animate-spin text-4xl text-blue-500 mx-auto mb-3" />
            <p className="text-gray-600">Đang tải chi tiết...</p>
          </div>
        </div>
      )}
    </div>
  );
}

// Enhanced History Item Component with previews and top products
function EnhancedHistoryItem({ session, onViewDetails }) {
  const [sessionDetails, setSessionDetails] = useState(null);
  const [loadingPreview, setLoadingPreview] = useState(false);

  // Auto-load preview when component mounts
  useEffect(() => {
    const loadPreview = async () => {
      if (session.recommendations_count > 0) {
        setLoadingPreview(true);
        try {
          const result = await getSessionDetails(session.session_id);
          if (result.success && result.data) {
            setSessionDetails(result.data);
          }
        } catch (err) {
          console.error('Failed to load preview:', err);
        } finally {
          setLoadingPreview(false);
        }
      }
    };

    loadPreview();
  }, [session.session_id, session.recommendations_count]);

  const topProducts = sessionDetails?.recommendations?.slice(0, 3) || [];
  const detectedObjects = sessionDetails?.objects?.slice(0, 4) || [];

  return (
    <div className="bg-gray-50 rounded-lg p-5 hover:shadow-lg transition-all cursor-pointer border-2 border-transparent hover:border-blue-300">
      <div className="flex items-start gap-4">
        {/* Thumbnail image */}
        {session.original_image_url && (
          <div className="flex-shrink-0">
            <img
              src={session.original_image_url}
              alt="Room"
              className="w-28 h-28 object-cover rounded-lg border-2 border-gray-200 shadow-sm"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-3">
            <FaSearch className="text-blue-500 text-lg" />
            <p className="font-semibold text-gray-800">Tìm kiếm AI</p>
            {session.query_category && (
              <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded">
                {session.query_category}
              </span>
            )}
          </div>

          {/* Stats */}
          <div className="flex flex-wrap gap-4 mb-3">
            {session.detected_objects_count > 0 && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FaBoxes className="text-blue-400" />
                <span className="font-medium">{session.detected_objects_count}</span>
                <span>vật thể</span>
              </div>
            )}
            {session.recommendations_count > 0 && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FaStar className="text-yellow-500" />
                <span className="font-medium">{session.recommendations_count}</span>
                <span>gợi ý</span>
              </div>
            )}
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <FaClock />
              <span>
                {new Date(session.created_at).toLocaleTimeString('vi-VN', {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>
          </div>

          {/* Preview: Detected Objects */}
          {detectedObjects.length > 0 && (
            <div className="mb-3">
              <p className="text-xs font-medium text-gray-600 mb-2">Vật thể phát hiện:</p>
              <div className="flex flex-wrap gap-2">
                {detectedObjects.map((obj, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-2 py-1 bg-white border border-gray-200 rounded text-xs"
                  >
                    {obj.visual_features?.dominant_color && (
                      <div
                        className="w-3 h-3 rounded-full border border-gray-300"
                        style={{ backgroundColor: obj.visual_features.dominant_color }}
                      />
                    )}
                    <span className="font-medium">{obj.name || obj.category}</span>
                    <span className="text-gray-500">({(obj.confidence * 100).toFixed(0)}%)</span>
                  </span>
                ))}
                {sessionDetails?.objects?.length > 4 && (
                  <span className="text-xs text-gray-500 px-2 py-1">
                    +{sessionDetails.objects.length - 4} khác
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Preview: Top 3 Recommended Products */}
          {topProducts.length > 0 && (
            <div className="mb-3">
              <p className="text-xs font-medium text-gray-600 mb-2">Top sản phẩm gợi ý:</p>
              <div className="grid grid-cols-3 gap-2">
                {topProducts.map((product) => (
                  <div
                    key={product.product_id}
                    className="bg-white rounded border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-16 object-cover"
                      onError={(e) => { e.target.src = '/placeholder-product.png'; }}
                    />
                    <div className="p-1.5">
                      <p className="text-xs font-medium text-gray-800 truncate" title={product.name}>
                        {product.name}
                      </p>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs font-bold text-blue-600">
                          {(product.similarity_score * 100).toFixed(0)}%
                        </span>
                        <span className="text-xs text-gray-500">
                          {product.price ? `${(product.price / 1000).toFixed(0)}k` : ''}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {loadingPreview && (
            <div className="text-xs text-gray-500 flex items-center gap-2">
              <FaSpinner className="animate-spin" />
              Đang tải preview...
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-3 mt-3 pt-3 border-t border-gray-200">
            <button
              onClick={() => onViewDetails(session)}
              className="flex items-center gap-2 px-3 py-1.5 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors"
            >
              <FaSearch />
              Xem chi tiết
            </button>
            <button
              className="flex items-center gap-2 px-3 py-1.5 bg-gray-200 text-gray-700 text-sm rounded hover:bg-gray-300 transition-colors"
              title="Tìm lại với ảnh này"
            >
              <FaRedoAlt />
              Tìm lại
            </button>
            <div className="ml-auto">
              {session.recommendations_count > 0 ? (
                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">
                  Hoàn thành
                </span>
              ) : (
                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded">
                  Chỉ phát hiện
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
