# Backend API Requirements for AI Analysis Features

Tài liệu này mô tả các API endpoints và data schema cần implement để hỗ trợ đầy đủ tính năng AI Analysis trên Admin Web.

## 📋 Tổng quan

Hiện tại Admin Web đã implement UI cho 3 tabs:
1. **Tìm kiếm AI** - Hoạt động tốt ✅
2. **Lịch sử** - UI đã nâng cấp, cần backend hỗ trợ thêm ⚠️
3. **Phân tích kinh doanh** - Cần backend implement metrics ❌

---

## 1. API Endpoints hiện có (Đang hoạt động)

### ✅ POST `/api/ai/detect`
Upload ảnh và phát hiện vật thể
```javascript
// Response
{
  "success": true,
  "data": {
    "session_id": "uuid",
    "objects": [
      {
        "name": "sofa",
        "confidence": 0.95,
        "bbox": [x1, y1, x2, y2],
        "visual_features": {
          "dominant_color": "#8B4513"
        }
      }
    ],
    "image_url": "https://..."
  }
}
```

### ✅ POST `/api/ai/:sessionId`
Lấy product recommendations cho object đã chọn
```javascript
// Response
{
  "success": true,
  "data": {
    "session_id": "uuid",
    "recommendations": [
      {
        "product_id": 123,
        "name": "Modern Sofa",
        "image_url": "https://...",
        "price": 5000000,
        "category": "Furniture",
        "similarity_score": 0.92
      }
    ]
  }
}
```

### ✅ GET `/api/ai/history/me?page=1&page_size=20`
Lấy search history của user
```javascript
// Response hiện tại
{
  "success": true,
  "data": {
    "total": 100,
    "page": 1,
    "page_size": 20,
    "items": [
      {
        "id": 1,
        "session_id": "uuid",
        "created_at": "2025-01-15T10:30:00Z",
        "original_image_url": "https://...",
        "detected_objects_count": 5,
        "recommendations_count": 10,
        "query_type": "detect" // hoặc "recommend"
      }
    ]
  }
}
```

---

## 2. ⚠️ Cải tiến CẦN THIẾT cho History API

Backend cần bổ sung các fields sau vào `/api/ai/history/me` response:

```javascript
{
  "success": true,
  "data": {
    "items": [
      {
        // ✅ Đã có
        "id": 1,
        "session_id": "uuid",
        "created_at": "2025-01-15T10:30:00Z",
        "original_image_url": "https://...",
        "detected_objects_count": 5,
        "recommendations_count": 10,
        "query_type": "detect",

        // ❌ CẦN BỔ SUNG (cho Tab Phân tích kinh doanh)
        "query_category": "Living Room",  // Loại phòng
        "avg_match_score": 0.85,          // TB similarity_score
        "dominant_colors": ["#8B4513", "#D2691E"]  // Màu chủ đạo
      }
    ]
  }
}
```

---

## 3. Implementation Guide

### 3.1. Room Category Classification (`query_category`)

**Cách đơn giản - Rule-based:**

```python
def classify_room_category(detected_objects):
    """Phân loại loại phòng dựa vào objects"""
    object_names = [obj['name'].lower() for obj in detected_objects]

    # Living Room
    if any(obj in object_names for obj in ['sofa', 'tv', 'coffee table']):
        return 'Living Room'

    # Bedroom
    if any(obj in object_names for obj in ['bed', 'pillow', 'nightstand']):
        return 'Bedroom'

    # Kitchen
    if any(obj in object_names for obj in ['stove', 'refrigerator', 'sink']):
        return 'Kitchen'

    # Dining Room
    if any(obj in object_names for obj in ['dining table', 'chair']):
        return 'Dining Room'

    # Office
    if any(obj in object_names for obj in ['desk', 'computer', 'bookshelf']):
        return 'Office'

    return 'Other'
```

**Khi nào gọi?** Sau khi detect objects thành công:

```python
@app.post('/api/ai/detect')
async def detect_objects(file):
    # 1. Detect objects
    objects = yolo_model.detect(file)
    
    # 2. ✨ Classify room category
    room_category = classify_room_category(objects)
    
    # 3. Save to database
    db.execute("""
        INSERT INTO ai_search_history 
        (session_id, query_category, detected_objects_count)
        VALUES (?, ?, ?)
    """, [session_id, room_category, len(objects)])
```

### 3.2. Average Match Score (`avg_match_score`)

```python
def calculate_avg_match_score(recommendations):
    """Tính TB similarity_score"""
    if not recommendations:
        return 0.0
    
    total = sum(rec['similarity_score'] for rec in recommendations)
    return total / len(recommendations)
```

**Khi nào update?** Sau khi tạo recommendations:

```python
@app.post('/api/ai/:sessionId')
async def get_recommendations(session_id, selected_bbox):
    # 1. Get recommendations
    recommendations = search_similar_products(selected_bbox)
    
    # 2. ✨ Calculate avg score
    avg_score = calculate_avg_match_score(recommendations)
    
    # 3. Update database
    db.execute("""
        UPDATE ai_search_history
        SET avg_match_score = ?,
            recommendations_count = ?
        WHERE session_id = ?
    """, [avg_score, len(recommendations), session_id])
```

### 3.3. Dominant Colors (`dominant_colors`)

```python
def extract_dominant_colors(detected_objects, top_n=2):
    """Lấy top N màu phổ biến"""
    colors = []
    
    for obj in detected_objects:
        if 'visual_features' in obj:
            color = obj['visual_features'].get('dominant_color')
            if color:
                colors.append(color)
    
    # Count frequency
    from collections import Counter
    color_counts = Counter(colors)
    
    # Return top N
    return [color for color, _ in color_counts.most_common(top_n)]
```

**Khi nào gọi?** Cùng lúc với classify_room_category:

```python
@app.post('/api/ai/detect')
async def detect_objects(file):
    objects = yolo_model.detect(file)
    
    # Extract metadata
    room_category = classify_room_category(objects)
    dominant_colors = extract_dominant_colors(objects)  # ✨
    
    # Save
    db.execute("""
        INSERT INTO ai_search_history 
        (session_id, query_category, dominant_colors)
        VALUES (?, ?, ?)
    """, [session_id, room_category, json.dumps(dominant_colors)])
```

---

## 4. Database Schema Update

```sql
-- Thêm 3 columns vào bảng ai_search_history
ALTER TABLE ai_search_history
ADD COLUMN query_category VARCHAR(50),
ADD COLUMN avg_match_score FLOAT DEFAULT 0.0,
ADD COLUMN dominant_colors JSON;

-- Tạo index để query nhanh
CREATE INDEX idx_query_category ON ai_search_history(query_category);
CREATE INDEX idx_created_at ON ai_search_history(created_at);
```

---

## 5. Testing Checklist

- [ ] POST `/api/ai/detect` lưu `query_category` và `dominant_colors`
- [ ] POST `/api/ai/:sessionId` update `avg_match_score`
- [ ] GET `/api/ai/history/me` trả về 3 fields mới
- [ ] Database có 3 columns mới
- [ ] Room classification chính xác với các loại phòng phổ biến

### Test Cases

```bash
# Test 1: Upload ảnh living room
curl -F "file=@living_room.jpg" http://localhost:3000/api/ai/detect
# Expected: query_category = "Living Room"

# Test 2: Get history
curl http://localhost:3000/api/ai/history/me?page=1
# Expected: có query_category, avg_match_score, dominant_colors
```

---

## 6. Timeline Estimate

| Task | Effort |
|------|--------|
| Database migration | 30 min |
| Room classification logic | 2 hours |
| Avg match score | 1 hour |
| Dominant colors | 1 hour |
| Testing | 1 hour |
| **Total** | **5-6 hours** |

---

## 7. Priority

🔴 **HIGH**: Cần implement để Tab 3 (Phân tích kinh doanh) hoạt động

Hiện tại Tab 3 không có dữ liệu thực → Cần 3 fields này để:
- Hiển thị chart "Phân tích theo danh mục"
- Hiển thị "Sở thích màu sắc"
- Tính "Điểm phù hợp trung bình"

---

## Questions?

Liên hệ Frontend Team nếu cần clarify requirements.
