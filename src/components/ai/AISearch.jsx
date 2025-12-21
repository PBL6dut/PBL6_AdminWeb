import { useState } from 'react';
import { detectObjects, getRecommendations } from '../../services/aiApi';
import { FaUpload, FaSpinner } from 'react-icons/fa';

export default function AISearch() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [detectedObjects, setDetectedObjects] = useState([]);
  const [sessionId, setSessionId] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedObject, setSelectedObject] = useState(null);

  // Handle image upload
  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setSelectedImage(URL.createObjectURL(file));
    setLoading(true);
    setError(null);
    setDetectedObjects([]);
    setRecommendations([]);
    setSelectedObject(null);

    try {
      const result = await detectObjects(file, 'main_search');

      if (result.success && result.data) {
        setSessionId(result.data.session_id);
        setDetectedObjects(result.data.objects || []);
      } else {
        setError(result.message || 'Không thể phát hiện vật thể. Vui lòng thử lại.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Không thể phát hiện vật thể. Vui lòng thử lại.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Handle object selection
  const handleObjectSelect = async (object) => {
    if (!sessionId) return;

    setSelectedObject(object);
    setLoading(true);
    setError(null);

    try {
      const result = await getRecommendations(sessionId, object.bbox, 10, 'main_search');

      if (result.success && result.data) {
        setRecommendations(result.data.recommendations || []);
      } else {
        setError(result.message || 'Không tìm thấy sản phẩm phù hợp');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Không thể lấy gợi ý sản phẩm. Vui lòng thử lại.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Tìm kiếm bằng hình ảnh</h3>

        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            disabled={loading}
            className="hidden"
            id="image-upload"
          />
          <label htmlFor="image-upload" className="cursor-pointer">
            <FaUpload className="mx-auto text-4xl text-gray-400 mb-3" />
            <p className="text-gray-600">Nhấp để tải lên hình ảnh phòng</p>
            <p className="text-sm text-gray-400 mt-1">PNG, JPG lên đến 10MB</p>
          </label>
        </div>

        {selectedImage && (
          <div className="mt-4">
            <img src={selectedImage} alt="Uploaded" className="max-w-full h-auto rounded-lg shadow-md mx-auto" style={{ maxHeight: '400px' }} />
          </div>
        )}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <FaSpinner className="animate-spin text-4xl text-blue-500 mx-auto mb-3" />
          <p className="text-gray-600">Đang xử lý...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          {error}
        </div>
      )}

      {/* Detected Objects */}
      {detectedObjects.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Vật thể phát hiện ({detectedObjects.length})</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {detectedObjects.map((obj, idx) => (
              <div
                key={idx}
                onClick={() => handleObjectSelect(obj)}
                className={`border rounded-lg p-4 cursor-pointer hover:shadow-lg transition-all ${
                  selectedObject === obj ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                }`}
              >
                <p className="font-semibold text-gray-800">{obj.name}</p>
                <p className="text-sm text-gray-600">Độ chính xác: {(obj.confidence * 100).toFixed(1)}%</p>
                <div className="mt-2 flex items-center gap-2">
                  <div
                    className="w-6 h-6 rounded-full border border-gray-300"
                    style={{ backgroundColor: obj.visual_features?.dominant_color }}
                  />
                  <p className="text-xs text-gray-500">Màu chủ đạo</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Sản phẩm gợi ý ({recommendations.length})</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendations.map((product) => (
              <div key={product.product_id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                  onError={(e) => { e.target.src = '/placeholder-product.png'; }}
                />
                <div className="p-4">
                  <h4 className="font-semibold text-gray-800 truncate" title={product.name}>
                    {product.name}
                  </h4>
                  {product.category && (
                    <p className="text-sm text-gray-600 mb-2">{product.category}</p>
                  )}

                  <div className="mb-3">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>Độ phù hợp</span>
                      <span className="font-semibold text-blue-600">
                        {(product.similarity_score * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${product.similarity_score * 100}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <p className="text-lg font-bold text-gray-800">
                      {product.price?.toLocaleString('vi-VN')} ₫
                    </p>
                    <button
                      className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors"
                      onClick={() => window.open(`/products/${product.product_id}`, '_blank')}
                    >
                      Xem
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
