# Arogya Vision - Healthcare Frontend

A modern React + Vite frontend for the multi-tenant healthcare management system.

## Features

- **Role-Based Dashboard** - Separate interfaces for Admin, Doctor, and Receptionist
- **Patient Management** - View and manage patient records
- **Appointment Scheduling** - Schedule and track appointments
- **Consultation Builder** - Create detailed consultation notes with AI assistance
- **Analytics Dashboard** - Admin panel with real-time statistics
- **User Management** - Admin controls for staff management
- **Responsive Design** - Tailwind CSS for modern UI
- **JWT Authentication** - Secure token-based auth with automatic interceptors

## Tech Stack

- **React 19** - UI framework
- **Vite 7** - Build tool with HMR
- **React Router 7** - Client-side routing
- **Tailwind CSS 3** - Utility-first styling
- **Axios** - HTTP client with JWT interceptor
- **Lucide React** - Icon library

## Prerequisites

- Node.js 16+
- npm or yarn
- Backend server running on `http://localhost:5000`

## Installation

1. **Clone and enter directory**
   ```bash
   cd arogya-vision-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   ```bash
   # .env file (provided with project)
   VITE_API_URL=http://localhost:5000/api
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```
   Frontend runs on `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server with HMR
- `npm run build` - Build for production (output in `dist/`)
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint code quality checks

## Project Structure

```
src/
├── pages/              # Page components (Dashboard, Login, etc.)
│   ├── admin/         # Admin-only pages
│   ├── Login.jsx      # Public login page
│   ├── Dashboard.jsx  # Role-based dashboard
│   ├── Appointments.jsx
│   ├── Consultation.jsx
│   ├── Patients.jsx
│   └── Doctors.jsx
├── layouts/           # Layout components
│   ├── AppLayout.jsx  # Doctor/Receptionist layout
│   └── AdminLayout.jsx # Admin layout
├── components/        # Reusable components
│   ├── ProtectedRoute.jsx
│   ├── Sidebar.jsx
│   └── Topbar.jsx
├── context/          # React Context
│   ├── AuthContext.jsx   # Auth state management
│   └── RoleContext.jsx   # (Legacy - to be removed)
├── services/         # API utilities
│   ├── api.js        # Axios instance with JWT interceptor
│   └── patientsApi.js
├── App.jsx          # Main app component with routing
└── main.jsx         # React DOM entry point
```

## Authentication Flow

1. **Login** → `/api/auth/login` → Receive JWT token
2. **Token Storage** → Stored in localStorage
3. **JWT Interceptor** → Automatically attached to all API requests
4. **Token Expiry** → 401 response clears localStorage and redirects to login

### Available Roles

- **admin** - Full system access, user management, analytics
- **doctor** - Patient consultations, appointments
- **receptionist** - Patient management, appointment booking

## API Integration

All API calls use the centralized `api` instance in `src/services/api.js`:

```javascript
import api from "../services/api"

// JWT token automatically attached
const res = await api.get("/patients")
```

### Key Endpoints

| Method | Endpoint | Role | Purpose |
|--------|----------|------|---------|
| POST | `/auth/login` | Public | User login |
| GET | `/patients` | All | List patients |
| POST | `/patients` | Receptionist | Create patient |
| GET | `/appointments` | All | List appointments |
| POST | `/appointments` | Receptionist | Book appointment |
| POST | `/consultations` | Doctor | Create consultation |
| GET | `/consultations` | All | List consultations |
| POST | `/ai/suggest` | Doctor | Get AI medicine suggestions |
| GET | `/admin/users` | Admin | List staff users |
| POST | `/admin/users` | Admin | Create staff user |
| GET | `/analytics/overview` | Admin | Get clinic statistics |

## State Management

### AuthContext
Handles login, logout, and JWT token lifecycle:
```javascript
const { user, loading, login, logout, role } = useAuth()
```

**Available methods:**
- `login(data)` - Save token and user data
- `logout()` - Clear session and redirect to login
- `role` - Current user's role

## Routing

### Public Routes
- `/` → Redirects based on auth state
- Login form shown when not authenticated

### Doctor/Receptionist Routes (Protected)
- `/` → Dashboard
- `/appointments` → Appointment management
- `/consultation` → Consultation builder
- `/patients` → Patient management (receptionist)

### Admin Routes (Protected + Role Check)
- `/admin` → Admin dashboard
- `/admin/users` → User management
- `/admin/analytics` → Analytics
- `/admin/settings` → Settings

## Development

### Adding a New Page

1. Create component in `src/pages/YourPage.jsx`
2. Add route in `src/App.jsx`:
   ```jsx
   <Route path="/your-path" element={<YourPage />} />
   ```
3. Add navigation link in `src/layouts/AppLayout.jsx` or `AdminLayout.jsx`

### Adding API Calls

```javascript
import api from "../services/api"

const res = await api.get("/endpoint")
// JWT automatically included in headers
```

## Environment Variables

| Variable | Value | Purpose |
|----------|-------|---------|
| `VITE_API_URL` | `http://localhost:5000/api` | Backend API base URL |

## Customization

### Colors
Edit `tailwind.config.js` for primary color:
```javascript
colors: {
  primary: "#0F766E", // Change to your brand color
}
```

### Logo
Replace `/public/logo.png` with your clinic logo

### App Name
Update `<title>` in `index.html` and sidebar text in layouts

## Building for Production

```bash
npm run build
```

Output files in `dist/` directory ready for deployment.

### Deployment Checklist

- [ ] Update `VITE_API_URL` in `.env` to production backend URL
- [ ] Test all authentication flows
- [ ] Verify role-based routing
- [ ] Test appointment and consultation workflows
- [ ] Enable HTTPS
- [ ] Configure CORS with backend

## Troubleshooting

### API 401 Unauthorized
- Check JWT token in localStorage
- Verify backend JWT_SECRET matches
- Ensure Authorization header format: `Bearer <token>`

### CORS Errors
- Backend must have correct CORS configuration
- Check `VITE_API_URL` in `.env`

### Page Blank After Login
- Verify user role matches route permissions
- Check browser console for errors
- Ensure backend returns role in login response

## License

ISC
