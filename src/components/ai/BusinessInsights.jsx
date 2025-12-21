import { useState, useEffect, useMemo } from 'react';
import { getSearchHistory, getSessionDetails } from '../../services/aiApi';
import { FaSpinner, FaChartLine, FaClock, FaTrophy, FaBoxes, FaShoppingCart, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FF6B6B', '#4ECDC4'];

export default function BusinessInsights() {
  const [loading, setLoading] = useState(true);
  const [rawHistory, setRawHistory] = useState([]);
  const [detailedSessions, setDetailedSessions] = useState([]);
  const [loadingDetails, setLoadingDetails] = useState(false);

  // Load all history data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Load history (up to 1000 records for analysis)
        const result = await getSearchHistory(1, 1000);

        if (result.success && result.data) {
          const items = result.data.items || [];
          setRawHistory(items);

          // Load detailed data for sessions with recommendations (sample first 50)
          setLoadingDetails(true);
          const sessionsWithRecs = items
            .filter(item => item.recommendations_count > 0)
            .slice(0, 50);

          const detailsPromises = sessionsWithRecs.map(async (session) => {
            try {
              const details = await getSessionDetails(session.session_id);
              if (details.success && details.data) {
                return {
                  ...session,
                  objects: details.data.objects || [],
                  recommendations: details.data.recommendations || []
                };
              }
              return session;
            } catch (err) {
              return session;
            }
          });

          const detailed = await Promise.all(detailsPromises);
          setDetailedSessions(detailed);
          setLoadingDetails(false);
        }
      } catch (err) {
        console.error('Failed to load insights:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Analyze data
  const insights = useMemo(() => {
    if (rawHistory.length === 0) return null;

    try {
      // Group by session_id to avoid duplicates
      const sessionMap = {};
      rawHistory.forEach(item => {
        const sid = item.session_id;
        if (!sessionMap[sid]) {
          sessionMap[sid] = {
            session_id: sid,
            created_at: item.created_at,
            detected_objects_count: item.detected_objects_count || 0,
            recommendations_count: item.recommendations_count || 0
          };
        } else {
          // Merge data
          if (item.recommendations_count > 0) {
            sessionMap[sid].recommendations_count = item.recommendations_count;
          }
          if (item.detected_objects_count > 0) {
            sessionMap[sid].detected_objects_count = item.detected_objects_count;
          }
        }
      });

      const uniqueSessions = Object.values(sessionMap);

      // 1. OBJECT DETECTION PERFORMANCE
      const totalObjects = uniqueSessions.reduce((sum, s) => sum + s.detected_objects_count, 0);
      const avgObjectsPerSearch = uniqueSessions.length > 0
        ? (totalObjects / uniqueSessions.length).toFixed(1)
        : 0;

      const sessionsWithObjects = uniqueSessions.filter(s => s.detected_objects_count > 0);
      const detectionSuccessRate = uniqueSessions.length > 0
        ? ((sessionsWithObjects.length / uniqueSessions.length) * 100).toFixed(1)
        : 0;

      // Object count distribution
      const objectCountDist = [
        { range: '0 vật thể', count: 0 },
        { range: '1-3 vật thể', count: 0 },
        { range: '4-6 vật thể', count: 0 },
        { range: '7-10 vật thể', count: 0 },
        { range: '10+ vật thể', count: 0 }
      ];

      uniqueSessions.forEach(s => {
        const count = s.detected_objects_count;
        if (count === 0) objectCountDist[0].count++;
        else if (count <= 3) objectCountDist[1].count++;
        else if (count <= 6) objectCountDist[2].count++;
        else if (count <= 10) objectCountDist[3].count++;
        else objectCountDist[4].count++;
      });

      // 2. RECOMMENDATION EFFECTIVENESS
      const totalRecommendations = uniqueSessions.reduce((sum, s) => sum + s.recommendations_count, 0);
      const avgRecommendationsPerSearch = uniqueSessions.length > 0
        ? (totalRecommendations / uniqueSessions.length).toFixed(1)
        : 0;

      const sessionsWithRecs = uniqueSessions.filter(s => s.recommendations_count > 0);
      const recommendationRate = uniqueSessions.length > 0
        ? ((sessionsWithRecs.length / uniqueSessions.length) * 100).toFixed(1)
        : 0;

      // Recommendation count distribution
      const recCountDist = [
        { range: 'Không có gợi ý', count: 0 },
        { range: '1-5 gợi ý', count: 0 },
        { range: '6-10 gợi ý', count: 0 },
        { range: '10+ gợi ý', count: 0 }
      ];

      uniqueSessions.forEach(s => {
        const count = s.recommendations_count;
        if (count === 0) recCountDist[0].count++;
        else if (count <= 5) recCountDist[1].count++;
        else if (count <= 10) recCountDist[2].count++;
        else recCountDist[3].count++;
      });

      // 3. SIMILARITY SCORES (from detailed sessions)
      let avgSimilarityScore = 0;
      let similarityScores = [];

      if (detailedSessions.length > 0) {
        const allScores = [];
        detailedSessions.forEach(session => {
          if (session.recommendations && session.recommendations.length > 0) {
            session.recommendations.forEach(rec => {
              if (rec.similarity_score) {
                allScores.push(rec.similarity_score);
              }
            });
          }
        });

        if (allScores.length > 0) {
          avgSimilarityScore = ((allScores.reduce((sum, s) => sum + s, 0) / allScores.length) * 100).toFixed(1);

          // Similarity score distribution
          const scoreRanges = [
            { range: '90-100%', count: 0, min: 0.9, max: 1.0 },
            { range: '80-89%', count: 0, min: 0.8, max: 0.9 },
            { range: '70-79%', count: 0, min: 0.7, max: 0.8 },
            { range: '60-69%', count: 0, min: 0.6, max: 0.7 },
            { range: '<60%', count: 0, min: 0, max: 0.6 }
          ];

          allScores.forEach(score => {
            for (const range of scoreRanges) {
              if (score >= range.min && score < range.max) {
                range.count++;
                break;
              }
            }
          });

          similarityScores = scoreRanges;
        }
      }

      // 4. DETECTED OBJECTS ANALYSIS (from detailed sessions)
      const objectFrequency = {};
      detailedSessions.forEach(session => {
        if (session.objects && session.objects.length > 0) {
          session.objects.forEach(obj => {
            const name = obj.name || obj.category || 'Unknown';
            objectFrequency[name] = (objectFrequency[name] || 0) + 1;
          });
        }
      });

      const topObjects = Object.entries(objectFrequency)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

      // 5. USER BEHAVIOR - PEAK HOURS
      const hourlySearches = Array(24).fill(0);
      uniqueSessions.forEach(session => {
        if (session.created_at) {
          const hour = new Date(session.created_at).getHours();
          if (!isNaN(hour) && hour >= 0 && hour < 24) {
            hourlySearches[hour]++;
          }
        }
      });

      const hourlyData = hourlySearches.map((count, hour) => ({
        hour: `${hour}:00`,
        searches: count
      }));

      const peakHours = hourlySearches
        .map((count, hour) => ({ hour, count }))
        .filter(item => item.count > 0)
        .sort((a, b) => b.count - a.count)
        .slice(0, 3);

      // 6. SEARCH TRENDS (last 30 days)
      const now = new Date();
      const last30Days = Array(30).fill(0).map((_, i) => {
        const date = new Date(now);
        date.setDate(date.getDate() - (29 - i));
        return {
          date: date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }),
          searches: 0
        };
      });

      uniqueSessions.forEach(session => {
        const sessionDate = new Date(session.created_at);
        const daysAgo = Math.floor((now - sessionDate) / (1000 * 60 * 60 * 24));
        if (daysAgo >= 0 && daysAgo < 30) {
          const index = 29 - daysAgo;
          if (last30Days[index]) {
            last30Days[index].searches++;
          }
        }
      });

      // 7. TIME PERIODS
      const getTimeStats = (days) => {
        const cutoff = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
        const periodSessions = uniqueSessions.filter(s => new Date(s.created_at) >= cutoff);
        return {
          count: periodSessions.length,
          avgObjects: periodSessions.length > 0
            ? (periodSessions.reduce((sum, s) => sum + s.detected_objects_count, 0) / periodSessions.length).toFixed(1)
            : 0
        };
      };

      const weekStats = getTimeStats(7);
      const monthStats = getTimeStats(30);

      return {
        // Overview
        totalSearches: uniqueSessions.length,
        weekSearches: weekStats.count,
        monthSearches: monthStats.count,

        // Object Detection
        totalObjects,
        avgObjectsPerSearch,
        detectionSuccessRate,
        objectCountDist,
        topObjects,

        // Recommendations
        totalRecommendations,
        avgRecommendationsPerSearch,
        recommendationRate,
        recCountDist,
        avgSimilarityScore,
        similarityScores,

        // User Behavior
        hourlyData,
        peakHours,
        searchTrends: last30Days,

        // Has detailed data
        hasDetailedData: detailedSessions.length > 0
      };
    } catch (error) {
      console.error('Error analyzing data:', error);
      return null;
    }
  }, [rawHistory, detailedSessions]);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-12 text-center">
        <FaSpinner className="animate-spin text-4xl text-blue-500 mx-auto mb-3" />
        <p className="text-gray-600">Đang phân tích dữ liệu...</p>
      </div>
    );
  }

  if (!insights) {
    return (
      <div className="bg-white rounded-lg shadow p-12 text-center">
        <FaChartLine className="text-6xl text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500">Chưa có dữ liệu để phân tích</p>
        <p className="text-sm text-gray-400 mt-2">Thực hiện một số tìm kiếm AI để xem insights</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Loading Details Indicator */}
      {loadingDetails && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center gap-3">
          <FaSpinner className="animate-spin text-blue-500" />
          <p className="text-sm text-blue-700">
            Đang tải chi tiết {detailedSessions.length}/50 sessions để phân tích sâu hơn...
          </p>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow p-6 text-white">
          <FaChartLine className="text-3xl mb-2 opacity-80" />
          <h4 className="text-sm font-medium opacity-90">Tổng tìm kiếm</h4>
          <p className="text-3xl font-bold mt-2">{insights.totalSearches}</p>
          <p className="text-xs opacity-80 mt-1">
            {insights.weekSearches} tuần này • {insights.monthSearches} tháng này
          </p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow p-6 text-white">
          <FaBoxes className="text-3xl mb-2 opacity-80" />
          <h4 className="text-sm font-medium opacity-90">Phát hiện vật thể</h4>
          <p className="text-3xl font-bold mt-2">{insights.avgObjectsPerSearch}</p>
          <p className="text-xs opacity-80 mt-1">TB / lần tìm kiếm</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow p-6 text-white">
          <FaShoppingCart className="text-3xl mb-2 opacity-80" />
          <h4 className="text-sm font-medium opacity-90">Gợi ý sản phẩm</h4>
          <p className="text-3xl font-bold mt-2">{insights.avgRecommendationsPerSearch}</p>
          <p className="text-xs opacity-80 mt-1">TB / lần tìm kiếm</p>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg shadow p-6 text-white">
          <FaTrophy className="text-3xl mb-2 opacity-80" />
          <h4 className="text-sm font-medium opacity-90">Tỷ lệ thành công</h4>
          <p className="text-3xl font-bold mt-2">{insights.detectionSuccessRate}%</p>
          <p className="text-xs opacity-80 mt-1">Phát hiện được vật thể</p>
        </div>
      </div>

      {/* Search Trends (30 days) */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <FaChartLine className="text-blue-500" />
          Xu hướng tìm kiếm 30 ngày qua
        </h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={insights.searchTrends}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tick={{ fontSize: 12 }} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="searches" stroke="#3B82F6" strokeWidth={2} name="Số lượt tìm kiếm" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Object Detection Distribution */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <FaBoxes className="text-green-500" />
            Phân bố số vật thể phát hiện
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={insights.objectCountDist}
                dataKey="count"
                nameKey="range"
                cx="50%"
                cy="50%"
                outerRadius={90}
                label={({ range, count }) => count > 0 ? `${range}: ${count}` : null}
              >
                {insights.objectCountDist.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Recommendation Distribution */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <FaShoppingCart className="text-purple-500" />
            Phân bố số gợi ý sản phẩm
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={insights.recCountDist}
                dataKey="count"
                nameKey="range"
                cx="50%"
                cy="50%"
                outerRadius={90}
                label={({ range, count }) => count > 0 ? `${range}: ${count}` : null}
              >
                {insights.recCountDist.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              Tỷ lệ tạo gợi ý: <span className="font-bold text-purple-600">{insights.recommendationRate}%</span>
            </p>
          </div>
        </div>
      </div>

      {/* Peak Hours */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <FaClock className="text-orange-500" />
          Phân bố theo giờ trong ngày
        </h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={insights.hourlyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="hour" tick={{ fontSize: 11 }} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="searches" fill="#F59E0B" name="Số lượt tìm kiếm" />
          </BarChart>
        </ResponsiveContainer>
        <div className="mt-4 grid grid-cols-3 gap-3">
          {insights.peakHours.map((peak, idx) => (
            <div key={idx} className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg p-3 text-center">
              <p className="text-xs text-gray-600">Top {idx + 1}</p>
              <p className="text-xl font-bold text-orange-600">{peak.hour}:00</p>
              <p className="text-xs text-gray-500">{peak.count} lượt</p>
            </div>
          ))}
        </div>
      </div>

      {/* Top Detected Objects */}
      {insights.hasDetailedData && insights.topObjects.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <FaTrophy className="text-yellow-500" />
            Top 10 vật thể được phát hiện nhiều nhất
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={insights.topObjects} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#10B981" name="Số lần phát hiện" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Similarity Score Distribution */}
      {insights.hasDetailedData && insights.similarityScores && insights.similarityScores.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <FaCheckCircle className="text-green-500" />
            Phân bố điểm phù hợp (Similarity Score)
          </h3>
          <div className="mb-4 text-center">
            <p className="text-sm text-gray-600">
              Điểm phù hợp trung bình: <span className="text-2xl font-bold text-green-600">{insights.avgSimilarityScore}%</span>
            </p>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={insights.similarityScores}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="range" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#10B981" name="Số sản phẩm" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Performance Metrics */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Chỉ số hiệu suất</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <FaCheckCircle className="text-2xl text-green-500" />
              <span className="text-xs text-gray-500">Detection</span>
            </div>
            <p className="text-2xl font-bold text-gray-800">{insights.detectionSuccessRate}%</p>
            <p className="text-xs text-gray-600">Tỷ lệ phát hiện thành công</p>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <FaShoppingCart className="text-2xl text-purple-500" />
              <span className="text-xs text-gray-500">Recommend</span>
            </div>
            <p className="text-2xl font-bold text-gray-800">{insights.recommendationRate}%</p>
            <p className="text-xs text-gray-600">Tỷ lệ tạo gợi ý</p>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <FaBoxes className="text-2xl text-blue-500" />
              <span className="text-xs text-gray-500">Objects</span>
            </div>
            <p className="text-2xl font-bold text-gray-800">{insights.totalObjects}</p>
            <p className="text-xs text-gray-600">Tổng vật thể phát hiện</p>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <FaTrophy className="text-2xl text-yellow-500" />
              <span className="text-xs text-gray-500">Products</span>
            </div>
            <p className="text-2xl font-bold text-gray-800">{insights.totalRecommendations}</p>
            <p className="text-xs text-gray-600">Tổng sản phẩm gợi ý</p>
          </div>
        </div>
      </div>

      {/* Business Insights & Recommendations */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Phân tích & Khuyến nghị</h3>
        <div className="space-y-3">
          {/* Detection Success */}
          <div className={`border-l-4 p-4 ${
            parseFloat(insights.detectionSuccessRate) >= 80
              ? 'bg-green-50 border-green-500'
              : parseFloat(insights.detectionSuccessRate) >= 60
              ? 'bg-yellow-50 border-yellow-500'
              : 'bg-red-50 border-red-500'
          }`}>
            <p className="font-semibold text-gray-800 flex items-center gap-2">
              {parseFloat(insights.detectionSuccessRate) >= 80 ? (
                <FaCheckCircle className="text-green-600" />
              ) : (
                <FaTimesCircle className="text-yellow-600" />
              )}
              Hiệu suất phát hiện vật thể: {insights.detectionSuccessRate}%
            </p>
            <p className="text-sm text-gray-700 mt-1">
              {parseFloat(insights.detectionSuccessRate) >= 80
                ? 'AI đang hoạt động rất tốt! Hầu hết tìm kiếm đều phát hiện được vật thể.'
                : parseFloat(insights.detectionSuccessRate) >= 60
                ? 'Hiệu suất tốt nhưng có thể cải thiện. Khuyến nghị: Train thêm model với nhiều loại phòng hơn.'
                : 'Hiệu suất thấp. Cần kiểm tra lại model hoặc chất lượng ảnh input.'}
            </p>
          </div>

          {/* Recommendation Rate */}
          <div className={`border-l-4 p-4 ${
            parseFloat(insights.recommendationRate) >= 70
              ? 'bg-green-50 border-green-500'
              : parseFloat(insights.recommendationRate) >= 50
              ? 'bg-yellow-50 border-yellow-500'
              : 'bg-red-50 border-red-500'
          }`}>
            <p className="font-semibold text-gray-800 flex items-center gap-2">
              <FaShoppingCart className="text-purple-600" />
              Tỷ lệ users xem gợi ý: {insights.recommendationRate}%
            </p>
            <p className="text-sm text-gray-700 mt-1">
              {parseFloat(insights.recommendationRate) >= 70
                ? 'Tuyệt vời! Users thường xuyên click xem sản phẩm gợi ý.'
                : parseFloat(insights.recommendationRate) >= 50
                ? 'Khá tốt. Có thể cải thiện UX để tăng tỷ lệ click.'
                : 'Thấp. Nên cải thiện UI hoặc quality của recommendations.'}
            </p>
          </div>

          {/* Peak Hours Insight */}
          {insights.peakHours.length > 0 && (
            <div className="bg-orange-50 border-l-4 border-orange-500 p-4">
              <p className="font-semibold text-orange-800 flex items-center gap-2">
                <FaClock className="text-orange-600" />
                Giờ cao điểm: {insights.peakHours[0].hour}:00
              </p>
              <p className="text-sm text-orange-700 mt-1">
                Thời gian {insights.peakHours[0].hour}:00-{insights.peakHours[0].hour + 1}:00 có {insights.peakHours[0].count} lượt tìm kiếm.
                Đây là thời điểm tốt để chạy marketing campaigns hoặc flash sales.
              </p>
            </div>
          )}

          {/* Similarity Score Insight */}
          {insights.hasDetailedData && insights.avgSimilarityScore > 0 && (
            <div className={`border-l-4 p-4 ${
              parseFloat(insights.avgSimilarityScore) >= 80
                ? 'bg-green-50 border-green-500'
                : parseFloat(insights.avgSimilarityScore) >= 70
                ? 'bg-yellow-50 border-yellow-500'
                : 'bg-red-50 border-red-500'
            }`}>
              <p className="font-semibold text-gray-800 flex items-center gap-2">
                <FaTrophy className="text-yellow-600" />
                Chất lượng gợi ý: {insights.avgSimilarityScore}% độ phù hợp
              </p>
              <p className="text-sm text-gray-700 mt-1">
                {parseFloat(insights.avgSimilarityScore) >= 80
                  ? 'Sản phẩm gợi ý rất chính xác và phù hợp với tìm kiếm!'
                  : parseFloat(insights.avgSimilarityScore) >= 70
                  ? 'Chất lượng tốt. Có thể fine-tune model để tăng độ chính xác.'
                  : 'Cần cải thiện thuật toán recommendation để tăng độ phù hợp.'}
              </p>
            </div>
          )}

          {/* Top Object Insight */}
          {insights.topObjects.length > 0 && (
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
              <p className="font-semibold text-blue-800 flex items-center gap-2">
                <FaTrophy className="text-blue-600" />
                Vật thể phổ biến: {insights.topObjects[0].name}
              </p>
              <p className="text-sm text-blue-700 mt-1">
                "{insights.topObjects[0].name}" được phát hiện {insights.topObjects[0].count} lần.
                Nên đảm bảo có đủ stock sản phẩm liên quan đến category này.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Data Source Info */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm text-gray-600">
        <p className="font-medium mb-2">Nguồn dữ liệu:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Phân tích từ {insights.totalSearches} lượt tìm kiếm</li>
          <li>Chi tiết từ {detailedSessions.length} sessions (để tính similarity scores và top objects)</li>
          {!insights.hasDetailedData && (
            <li className="text-yellow-600">
              ⚠️ Một số insights nâng cao cần thêm dữ liệu chi tiết (đang tải...)
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
