import { FaTimes, FaMapMarkerAlt } from 'react-icons/fa';
import { useState } from 'react';

export default function SessionDetailModal({ session, onClose }) {
  const [selectedProduct, setSelectedProduct] = useState(null);

  if (!session) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Chi tiết phiên tìm kiếm</h2>
            <p className="text-sm text-gray-500 mt-1">
              {new Date(session.created_at).toLocaleString('vi-VN')}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FaTimes className="text-2xl" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: Image & Detected Objects */}
            <div className="space-y-4">
              {/* Original Image */}
              {session.original_image_url && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-3 text-gray-800">Hình ảnh phòng</h3>
                  <div className="relative">
                    <img
                      src={session.original_image_url}
                      alt="Room"
                      className="w-full h-auto rounded-lg shadow-md"
                      onError={(e) => {
                        e.target.src = '/placeholder-room.png';
                      }}
                    />
                    {session.detected_objects_count > 0 && (
                      <div className="absolute top-2 right-2 bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                        {session.detected_objects_count} vật thể
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Detected Objects */}
              {session.objects && session.objects.length > 0 && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-3 text-gray-800">
                    Vật thể phát hiện ({session.objects.length})
                  </h3>
                  <div className="space-y-2">
                    {session.objects.map((obj, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between bg-white rounded-lg p-3 border border-gray-200"
                      >
                        <div className="flex items-center gap-3">
                          <FaMapMarkerAlt className="text-blue-500" />
                          <div>
                            <p className="font-semibold text-gray-800 capitalize">
                              {obj.name || obj.category}
                            </p>
                            <p className="text-xs text-gray-500">
                              Độ chính xác: {(obj.confidence * 100).toFixed(1)}%
                            </p>
                          </div>
                        </div>
                        {obj.visual_features?.dominant_color && (
                          <div className="flex items-center gap-2">
                            <div
                              className="w-8 h-8 rounded-full border-2 border-gray-300"
                              style={{ backgroundColor: obj.visual_features.dominant_color }}
                            />
                            <span className="text-xs text-gray-500">Màu chủ đạo</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* No objects detected */}
              {(!session.objects || session.objects.length === 0) && session.detected_objects_count > 0 && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-3 text-gray-800">Vật thể phát hiện</h3>
                  <p className="text-sm text-gray-600">
                    Đã phát hiện {session.detected_objects_count} vật thể (chi tiết không có sẵn)
                  </p>
                </div>
              )}
            </div>

            {/* Right: Recommendations */}
            <div className="space-y-4">
              {session.recommendations && session.recommendations.length > 0 ? (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-3 text-gray-800">
                    Sản phẩm gợi ý ({session.recommendations.length})
                  </h3>
                  <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                    {session.recommendations.map((product) => (
                      <div
                        key={product.product_id}
                        className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => setSelectedProduct(product)}
                      >
                        <div className="flex gap-3 p-3">
                          {/* Product Image */}
                          <div className="flex-shrink-0">
                            <img
                              src={product.image_url}
                              alt={product.name}
                              className="w-24 h-24 object-cover rounded"
                              onError={(e) => {
                                e.target.src = '/placeholder-product.png';
                              }}
                            />
                          </div>

                          {/* Product Info */}
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-gray-800 truncate" title={product.name}>
                              {product.name}
                            </h4>
                            {product.category && (
                              <p className="text-xs text-gray-500 mb-1">{product.category}</p>
                            )}

                            {/* Match Score */}
                            <div className="mb-2">
                              <div className="flex justify-between text-xs text-gray-500 mb-1">
                                <span>Độ phù hợp</span>
                                <span className="font-semibold text-blue-600">
                                  {(product.similarity_score * 100).toFixed(1)}%
                                </span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-1.5">
                                <div
                                  className="bg-blue-500 h-1.5 rounded-full"
                                  style={{ width: `${product.similarity_score * 100}%` }}
                                />
                              </div>
                            </div>

                            {/* Price */}
                            <div className="flex items-center justify-between">
                              <p className="text-lg font-bold text-gray-800">
                                {product.price?.toLocaleString('vi-VN')} ₫
                              </p>
                              <button
                                className="px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 transition-colors"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  window.open(`/products/${product.product_id}`, '_blank');
                                }}
                              >
                                Xem
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : session.recommendations_count > 0 ? (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-3 text-gray-800">Sản phẩm gợi ý</h3>
                  <p className="text-sm text-gray-600">
                    Đã có {session.recommendations_count} sản phẩm gợi ý (chi tiết không có sẵn)
                  </p>
                </div>
              ) : (
                <div className="bg-gray-50 rounded-lg p-4 h-full flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-gray-500">Chưa có sản phẩm gợi ý</p>
                    <p className="text-sm text-gray-400 mt-1">
                      Người dùng chưa click xem gợi ý cho phiên này
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t p-4 bg-gray-50 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
