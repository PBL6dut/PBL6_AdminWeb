import { useState, useEffect } from 'react';
import { getSearchHistory } from '../../services/aiApi';
import { FaSpinner, FaChartLine, FaPalette, FaClock, FaTrophy } from 'react-icons/fa';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

export default function BusinessInsights() {
  const [loading, setLoading] = useState(true);
  const [insights, setInsights] = useState(null);

  const analyzeData = (data) => {
    if (!data || data.length === 0) return null;

    try {
      // 1. Phân tích theo danh mục (Category Analysis)
      const categoryCount = {};
      const categoryRevenue = {};

      data.forEach((item) => {
        if (item.query_category) {
          categoryCount[item.query_category] = (categoryCount[item.query_category] || 0) + 1;
          if (item.estimated_revenue) {
            categoryRevenue[item.query_category] = (categoryRevenue[item.query_category] || 0) + item.estimated_revenue;
          }
        }
      });

      const categoryData = Object.entries(categoryCount).map(([name, value]) => ({
        name,
        searches: value,
        percentage: ((value / data.length) * 100).toFixed(1),
      })).sort((a, b) => b.searches - a.searches);

      // 2. Phân tích màu sắc phổ biến (Color Analysis)
      const colorPreferences = {};
      data.forEach((item) => {
        if (item.dominant_colors && Array.isArray(item.dominant_colors)) {
          item.dominant_colors.forEach((color) => {
            colorPreferences[color] = (colorPreferences[color] || 0) + 1;
          });
        }
      });

      const colorData = Object.entries(colorPreferences).map(([name, value]) => ({
        name,
        count: value,
      })).sort((a, b) => b.count - a.count).slice(0, 6);

      // 3. Phân tích theo thời gian (Peak Hours)
      const hourlySearches = Array(24).fill(0);
      data.forEach((item) => {
        if (item.created_at) {
          const hour = new Date(item.created_at).getHours();
          if (!isNaN(hour) && hour >= 0 && hour < 24) {
            hourlySearches[hour]++;
          }
        }
      });

      const peakHours = hourlySearches
        .map((count, hour) => ({ hour, count }))
        .filter(item => item.count > 0)
        .sort((a, b) => b.count - a.count)
        .slice(0, 3);

      // 4. Tỷ lệ chuyển đổi (Conversion Rate)
      // Group by session_id để đếm số sessions và bao nhiêu sessions có recommendations
      const sessions = {};
      data.forEach((item) => {
        const sid = item.session_id;
        if (!sessions[sid]) {
          sessions[sid] = { has_recommendations: false };
        }
        if (item.recommendations_count > 0) {
          sessions[sid].has_recommendations = true;
        }
      });

      const totalSessions = Object.keys(sessions).length;
      const sessionsWithRecommendations = Object.values(sessions).filter(s => s.has_recommendations).length;
      const conversionRate = totalSessions > 0
        ? ((sessionsWithRecommendations / totalSessions) * 100).toFixed(1)
        : 0;

      // 5. Match Score trung bình
      const matchScoreItems = data.filter((item) => item.avg_match_score && !isNaN(item.avg_match_score));
      const avgMatchScore = matchScoreItems.length > 0
        ? matchScoreItems.reduce((sum, item) => sum + item.avg_match_score, 0) / matchScoreItems.length
        : 0;

      return {
        totalSearches: data.length,
        categoryData,
        colorData,
        peakHours,
        conversionRate,
        avgMatchScore: (avgMatchScore * 100).toFixed(1),
        topCategory: categoryData[0]?.name || 'N/A',
      };
    } catch (error) {
      console.error('Error analyzing data:', error);
      return null;
    }
  };

  const loadInsights = async () => {
    setLoading(true);
    try {
      // Lấy toàn bộ history để phân tích
      const result = await getSearchHistory(1, 1000);

      if (result.success && result.data) {
        const data = result.data.items || [];
        // Phân tích dữ liệu
        const analyzed = analyzeData(data);
        setInsights(analyzed);
      }
    } catch (err) {
      console.error('Failed to load insights:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInsights();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow p-6 text-white">
          <FaChartLine className="text-3xl mb-2 opacity-80" />
          <h4 className="text-sm font-medium opacity-90">Tổng tìm kiếm</h4>
          <p className="text-3xl font-bold mt-2">{insights.totalSearches}</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow p-6 text-white">
          <FaTrophy className="text-3xl mb-2 opacity-80" />
          <h4 className="text-sm font-medium opacity-90">Danh mục phổ biến</h4>
          <p className="text-2xl font-bold mt-2">{insights.topCategory}</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow p-6 text-white">
          <FaChartLine className="text-3xl mb-2 opacity-80" />
          <h4 className="text-sm font-medium opacity-90">Tỷ lệ xem gợi ý</h4>
          <p className="text-3xl font-bold mt-2">{insights.conversionRate}%</p>
          <p className="text-xs opacity-80 mt-1">Users click xem sản phẩm</p>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg shadow p-6 text-white">
          <FaChartLine className="text-3xl mb-2 opacity-80" />
          <h4 className="text-sm font-medium opacity-90">Điểm phù hợp TB</h4>
          <p className="text-3xl font-bold mt-2">{insights.avgMatchScore}%</p>
        </div>
      </div>

      {/* Category Analysis */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <FaChartLine className="text-blue-500" />
          Phân tích theo danh mục
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={insights.categoryData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="searches" fill="#3B82F6" name="Số lượt tìm kiếm" />
          </BarChart>
        </ResponsiveContainer>
        <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {insights.categoryData.map((cat, idx) => (
            <div key={idx} className="bg-gray-50 rounded-lg p-3 text-center">
              <p className="text-sm font-medium text-gray-700">{cat.name}</p>
              <p className="text-xs text-gray-500">{cat.percentage}%</p>
            </div>
          ))}
        </div>
      </div>

      {/* Color Preferences */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <FaPalette className="text-purple-500" />
          Sở thích màu sắc
        </h3>
        <div className="flex flex-col md:flex-row items-center gap-6">
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={insights.colorData}
                dataKey="count"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {insights.colorData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-3 flex-1">
            {insights.colorData.map((color, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <div className="w-6 h-6 rounded" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                <div>
                  <p className="text-sm font-medium text-gray-700">{color.name}</p>
                  <p className="text-xs text-gray-500">{color.count} lượt</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Peak Hours */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <FaClock className="text-orange-500" />
          Giờ cao điểm
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {insights.peakHours.map((peak, idx) => (
            <div key={idx} className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg p-4">
              <p className="text-sm text-gray-600">Top {idx + 1}</p>
              <p className="text-2xl font-bold text-orange-600">{peak.hour}:00</p>
              <p className="text-sm text-gray-500">{peak.count} lượt tìm kiếm</p>
            </div>
          ))}
        </div>
      </div>

      {/* Business Recommendations */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Khuyến nghị chiến lược kinh doanh</h3>
        <div className="space-y-3">
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
            <p className="font-semibold text-blue-800">Tập trung vào danh mục: {insights.topCategory}</p>
            <p className="text-sm text-blue-700 mt-1">
              Đây là danh mục được tìm kiếm nhiều nhất. Nên tăng cường stock và marketing cho danh mục này.
            </p>
          </div>

          <div className="bg-green-50 border-l-4 border-green-500 p-4">
            <p className="font-semibold text-green-800">Chạy quảng cáo vào giờ cao điểm</p>
            <p className="text-sm text-green-700 mt-1">
              Thời gian {insights.peakHours[0]?.hour}:00 có lượng tìm kiếm cao nhất. Đây là thời điểm tốt để chạy ads.
            </p>
          </div>

          <div className="bg-purple-50 border-l-4 border-purple-500 p-4">
            <p className="font-semibold text-purple-800">Tỷ lệ xem gợi ý: {insights.conversionRate}%</p>
            <p className="text-sm text-purple-700 mt-1">
              {insights.conversionRate >= 70
                ? 'Users thường xuyên click xem sản phẩm gợi ý. AI đang hoạt động tốt!'
                : `${insights.conversionRate}% users click xem gợi ý. Nên cải thiện UI hoặc chất lượng phát hiện vật thể.`}
            </p>
          </div>

          <div className="bg-orange-50 border-l-4 border-orange-500 p-4">
            <p className="font-semibold text-orange-800">Xu hướng màu sắc</p>
            <p className="text-sm text-orange-700 mt-1">
              Khách hàng ưa chuộng màu {insights.colorData[0]?.name}. Nên nhập thêm sản phẩm với màu sắc này.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
