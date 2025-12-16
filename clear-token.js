// Script để xóa token cũ không hợp lệ
// Chạy file này trong browser console hoặc tạo bookmark để chạy nhanh

console.log('Clearing old token...');
localStorage.removeItem('token');
console.log('Token cleared! Redirecting to login...');
window.location.href = '/auth/login';
