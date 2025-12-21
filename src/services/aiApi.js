/**
 * AI API Service
 * Handles AI-powered image search and recommendations
 */

import axios from 'axios';
import { getAnonymousId } from '../utils/anonymousId';
import { detectPlatform } from '../utils/platform';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

// Create separate axios instance for AI API
const aiApiClient = axios.create({
  baseURL: `${BACKEND_URL}/api/ai`,
  timeout: 60000, // AI detection can take 30-60 seconds
});

// Add request interceptor to inject headers
aiApiClient.interceptors.request.use(
  async (config) => {
    // IMPORTANT: Anonymous ID is REQUIRED for tracking (even for logged-in users)
    // This allows us to track searches across login/logout sessions
    const anonymousId = getAnonymousId();
    config.headers['X-Anonymous-Id'] = anonymousId;

    // Detect platform (web/mobile/tablet)
    const platform = detectPlatform();
    config.headers['X-Platform'] = platform;

    // OPTIONAL: Add Authorization token if user is logged in
    // If token exists: Backend associates search with user_id
    // If token is null: Backend uses anonymous_id only
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // OPTIONAL: Track source feature for analytics
    if (config.sourceFeature) {
      config.headers['X-Source-Feature'] = config.sourceFeature;
      delete config.sourceFeature;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
aiApiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('AI API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

/**
 * Detect objects in uploaded room image
 * @param {File} imageFile - Image file from input
 * @param {string} sourceFeature - Source feature name
 * @returns {Promise<{success: boolean, data: {session_id: string, objects: Array, image_url: string}}>}
 */
export async function detectObjects(imageFile, sourceFeature = 'main_search') {
  const formData = new FormData();
  formData.append('file', imageFile);

  const response = await aiApiClient.post('/detect', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    sourceFeature,
  });

  return response.data;
}

/**
 * Get product recommendations for selected object
 * @param {string} sessionId - AI session ID from detect
 * @param {Array<number>} selectedBbox - Bounding box [x1, y1, x2, y2]
 * @param {number} topK - Number of recommendations
 * @param {string} sourceFeature - Source feature name
 * @returns {Promise<{success: boolean, data: {session_id: string, recommendations: Array, metadata: Object}}>}
 */
export async function getRecommendations(sessionId, selectedBbox, topK = 10, sourceFeature = 'main_search') {
  const response = await aiApiClient.post(`/${sessionId}`, {
    selected_bbox: selectedBbox,
    top_k: topK,
  }, {
    sourceFeature,
  });

  return response.data;
}

/**
 * Get user search history
 * @param {number} page - Page number (1-indexed)
 * @param {number} pageSize - Items per page
 * @returns {Promise<{success: boolean, data: {total: number, page: number, page_size: number, items: Array}}>}
 */
export async function getSearchHistory(page = 1, pageSize = 20) {
  const response = await aiApiClient.get('/history/me', {
    params: { page, page_size: pageSize },
  });

  return response.data;
}

/**
 * Clear all search history for current user
 * @returns {Promise<{success: boolean, message: string}>}
 */
export async function clearSearchHistory() {
  const response = await aiApiClient.delete('/history/clear');
  return response.data;
}

/**
 * Get session details with objects and recommendations
 * @param {string} sessionId - Session ID
 * @returns {Promise<{success: boolean, data: {session_id: string, objects: Array, recommendations: Array, ...}}>}
 */
export async function getSessionDetails(sessionId) {
  const response = await aiApiClient.get(`/history/session/${sessionId}`);
  return response.data;
}

export default aiApiClient;
