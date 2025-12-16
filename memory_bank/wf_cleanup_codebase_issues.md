# Workflow: Cleanup Codebase Issues

## Current Tasks
Cleanup các vấn đề nhỏ trong codebase để cải thiện code quality mà không cần refactor lớn.

## Plan (Simple)
1. Xóa duplicate components (Login/Register trong ui/)
2. Fix import paths để sử dụng đúng components từ auth/
3. Fix route "/" về dashboard hoặc login
4. Xóa commented code không cần thiết
5. Tạo TODO list dài hạn cho các improvements sau này

## Steps
### Immediate Cleanup (Đang thực hiện)
- [IN PROGRESS] Tạo workflow file
- [ ] Xóa duplicate Login component trong `components/ui/Login.jsx`
- [ ] Xóa duplicate Register component trong `components/ui/Register.jsx`
- [ ] Fix import paths trong `App.jsx` để import từ `components/auth/`
- [ ] Fix route "/" để redirect về dashboard hoặc login
- [ ] Xóa commented code trong `AuthContext.jsx`
- [ ] Xóa commented code trong `Login.jsx` và `Register.jsx`
- [ ] Tạo TODO list dài hạn

### Future Improvements (Để sau)
- [ ] Split Dashboard.jsx (329 lines) thành smaller components
- [ ] Split Form.jsx (240 lines) thành smaller components
- [ ] Split Product detail modal (226 lines)
- [ ] Split Order detail modal (190 lines)
- [ ] Implement error boundaries
- [ ] Create protected route wrapper component
- [ ] Optimize useFetch to use pagination/lazy loading
- [ ] Re-enable token verification hoặc implement proper auth flow
- [ ] Add proper error handling UI
- [ ] Add loading states for all async operations

## Things Done
- ✅ Analyzed codebase structure
- ✅ Identified issues:
  - Duplicate Login/Register components
  - Wrong import paths in App.jsx
  - Route "/" pointing to test component
  - Commented code in multiple files
  - Some files exceed 150 lines guideline
- ✅ Created cleanup plan
- ✅ Created workflow file

## Things Not Done Yet
- ⏳ Remove duplicate components
- ⏳ Fix import paths
- ⏳ Fix root route
- ⏳ Clean up commented code
- ⏳ Create comprehensive TODO list

## Notes
- **KHÔNG refactor lớn** - giữ nguyên architecture hiện tại vì nó đã tốt
- **Chỉ cleanup** các vấn đề rõ ràng: duplicates, dead code, wrong imports
- **Files vượt 150 lines** - để sau, không ưu tiên vì chức năng đang hoạt động tốt
- **Guideline**: Keep files under 150 lines khi possible, nhưng không force refactor
