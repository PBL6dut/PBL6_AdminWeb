# PBL6 Admin Web - Project Overview

## Project Information
- **Project Name**: PBL6 AdminWeb FE
- **Type**: Admin Dashboard Web Application
- **Tech Stack**: React 19 + Vite + TailwindCSS 4
- **Backend API**: http://localhost:3000
- **Current Branch**: dev

## Project Description
Ứng dụng Admin Dashboard để quản lý hệ thống bán hàng nội thất, bao gồm quản lý sản phẩm, đơn hàng, và khách hàng. Hệ thống có authentication, hiển thị thống kê, biểu đồ và các chức năng CRUD cho các resource.

## Tech Stack Details
### Core Dependencies
- **React**: 19.1.1 - UI framework
- **React Router DOM**: 7.8.1 - Client-side routing
- **Vite**: 7.1.2 - Build tool
- **TailwindCSS**: 4.1.12 - Styling framework
- **Axios**: 1.11.0 - HTTP client
- **React Hook Form**: 7.62.0 - Form management
- **Recharts**: 3.1.2 - Charting library
- **React Icons**: 5.5.0 - Icon library

## Project Structure
```
src/
├── assets/           # Static assets
├── components/       # React components
│   ├── auth/        # Authentication components (Login, Register)
│   ├── ui/          # UI components (Button, Card, Table, Form, etc.)
│   │   └── modal/   # Modal components (BaseModal, ConfirmModal, DetailModal, FormModal)
│   └── Sidebar.jsx  # Sidebar navigation
├── configs/         # Configuration files
│   ├── cardConfigs.js
│   ├── formConfigs.js
│   ├── headingConfigs.jsx
│   ├── onDeleteConfigs.jsx
│   ├── onEditConfigs.jsx
│   ├── onViewConfigs.js
│   └── tableConfigs.jsx
├── contexts/        # React Context providers
│   ├── AuthContext.jsx          # Authentication state
│   ├── DataContext.jsx          # Global data management
│   ├── ModalContext.jsx         # Modal state management
│   └── ResourcePageContext.jsx  # Resource page configuration
├── hooks/           # Custom React hooks
│   ├── useFetch.jsx
│   └── useContextName.jsx
├── layouts/         # Layout components
│   ├── AuthLayout.jsx
│   └── MainLayout.jsx
├── pages/           # Page components
│   ├── AIAnalysis.jsx
│   ├── Dashboard.jsx
│   └── Resource.jsx
├── services/        # API services
│   ├── axios.js            # Axios instance with interceptors
│   ├── authService.js      # Authentication APIs
│   ├── productService.js   # Product APIs (CRUD + categories)
│   ├── orderService.js     # Order APIs
│   └── userService.js      # User/Customer APIs
├── utils/           # Utility functions
├── App.jsx          # Main app component with routes
├── main.jsx         # App entry point
└── index.css        # Global styles
```

## Key Features
1. **Authentication System**
   - Login/Register pages
   - Token-based authentication (Bearer token in localStorage)
   - Protected routes
   - Auto token injection via Axios interceptors

2. **Dashboard**
   - Statistics cards (Products, Orders, Customers, Revenue)
   - Area chart for revenue visualization
   - Bar chart for best-selling products
   - Placeholder sections for future features

3. **Resource Management Pages** (Products/Orders/Customers)
   - List view with data tables
   - Search functionality
   - CRUD operations (View/Edit/Delete)
   - Modal-based forms
   - Statistics cards per resource type

4. **Modal System**
   - BaseModal - Foundation modal component
   - ConfirmModal - Confirmation dialogs
   - DetailModal - View resource details
   - FormModal - Create/Edit forms
   - NotificationModal - User notifications

## Routing Structure
```
/ - FormModal (test page)
/auth
  /login - Login page
  /register - Register page
/dashboard
  / (index) - Dashboard page
  /products - Products management
  /orders - Orders management
  /customers - Customers management
  /ai-analysis - AI Analysis page
```

## Context Architecture
1. **AuthContext**: Manages authentication state (isAuthenticated, token, login, logout)
2. **DataContext**: Global data store (customers, orders, products, categories), handles CRUD operations
3. **ModalContext**: Controls modal states (form, detail, confirm modals)
4. **ResourcePageContext**: Dynamic configuration for resource pages based on route path

## API Integration
- **Base URL**: `http://localhost:3000/api`
- **Authentication**: Bearer token in Authorization header
- **Auto-interceptors**:
  - Request: Injects token from localStorage
  - Response: Handles 401 errors, normalizes success responses

### Available API Services
- **Auth**: login, register
- **Products**: getAll, getById, create, update, delete, getAllCategories
- **Orders**: getAll
- **Users/Customers**: getAll

## Data Flow
1. User authenticates → Token stored in localStorage
2. On app load → `useFetch` hook fetches all data (customers, orders, products, categories)
3. Data stored in DataContext → Available globally
4. Resource pages use ResourcePageContext to get page-specific configs
5. Configs include: heading, cards, table structure, form fields, action handlers

## Config-Driven Architecture
Resource pages are config-driven, separating UI logic from data:
- **headingConfigs**: Page titles and action buttons
- **cardConfigs**: Statistics cards per resource type
- **tableConfigs**: Column definitions and data mapping
- **formConfigs**: Form field definitions for create/edit
- **onDeleteConfigs**: Delete confirmation handlers
- **onViewConfigs**: Detail view handlers
- **onEditConfigs**: Edit form handlers

## Current State
- ✅ Authentication system working
- ✅ Dashboard with charts
- ✅ Product management with full CRUD
- ✅ Order and Customer listing
- ✅ Modal system implemented
- ⚠️ Route "/" currently shows FormModal (likely for testing)
- 📝 Some dashboard placeholder sections await implementation

## Guidelines Applied
- Files kept under 150 lines where possible
- No refactoring unless necessary
- Config-driven approach for maintainability
- Component reusability (UI components, modals)
- Context-based state management

## Environment Variables
- `VITE_BACKEND_URL`: Backend API base URL (currently http://localhost:3000)
