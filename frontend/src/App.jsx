import { Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider, CircularProgress, Box } from "@mui/material";
import { lazy, Suspense } from "react";
import theme from "./theme/Theme";

// Context
import { SearchProvider } from "./context/SearchContext";
import { FilterProvider } from "./context/FilterContext";
import { AuthProvider } from "./context/AuthContext";
import ProtectRoute from "./context/ProtectRoute";
import AdminRoute from "./context/AdminRoute";

// Layout
import Layout from "./components/Layout/Layout";
import AdminLayout from "./pages/admin/layout/AdminLayout";

// Public pages
const LandingPage = lazy(() => import("./pages/Public/LandingPage"));
const Login = lazy(() => import("./pages/AuthPages/Login"));
const Register = lazy(() => import("./pages/AuthPages/Register"));
const CarRental = lazy(() => import("./pages/Public/CarRental"));
const DealsPage = lazy(() => import("./pages/Public/Deals"));
const Home = lazy(() => import("./pages/Public/Home"));
const HotelList = lazy(() => import("./pages/Public/HotelList"));
const HotelDetail = lazy(() => import("./pages/DetailPages/HotelDetail"));
const HotelRooms = lazy(() => import("./pages/DetailPages/HotelRooms"));
const VerifyEmail = lazy(() => import("./components/Auth/VerifyEmail"));
const CheckEmail = lazy(() => import("./pages/AuthPages/CheckEmail"));
const VerifySuccess = lazy(() => import("./pages/AuthPages/VerifySuccess"));
const VerifyFailed = lazy(() => import("./pages/AuthPages/VerifyFailed"));
const RoomDetail = lazy(() => import("./pages/Public/RoomDetail"));
const Checkout = lazy(() => import("./pages/DetailPages/Checkout"));
const BookingInfo = lazy(() => import("./pages/Public/BookingInfo"));
// User
const MyBookings = lazy(() => import("./pages/DetailPages/MyBookings"));
// Admin
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminHotels = lazy(() => import("./pages/admin/AdminHotels"));
const AdminAddHotel = lazy(() => import("./pages/admin/AdminAddHotel"));
const AdminEditHotel = lazy(() => import("./pages/admin/AdminEditHotel"));
const AdminRooms = lazy(() => import("./pages/admin/AdminRooms"));
const AdminAddRoom = lazy(() => import("./pages/admin/AdminAddRoom"));
const AdminEditRoom = lazy(() => import("./pages/admin/AdminEditRoom"));
const AdminBookings = lazy(() => import("./pages/admin/AdminBookings"));
const AdminRoomMap = lazy(() => import("./pages/admin/AdminRoomMap"));
// Chat
const ChatSupport = lazy(() =>
  import("./components/ChatSupport/ChatSupport")
);

const Loader = (
  <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
    <CircularProgress />
  </Box>
);

export default function App() {
  return (
    <AuthProvider>
      <SearchProvider>
        <FilterProvider>
          <ThemeProvider theme={theme}>
            <Suspense fallback={Loader}>

              {/* ROUTES */}
              <Routes>
                {/* Auth */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/verify-email" element={<VerifyEmail />} />
                <Route path="/check-email" element={<CheckEmail />} />
                <Route path="/verify-success" element={<VerifySuccess />} />
                <Route path="/verify-failed" element={<VerifyFailed />} />

                {/* Public + User */}
                <Route element={<Layout />}>
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/home" element={<Home />} />
                  <Route path="/hotels" element={<HotelList />} />
                  <Route path="/hotels/:id" element={<HotelDetail />} />
                  <Route path="/hotels/:hotelId/rooms" element={<HotelRooms />} />
                  <Route path="/car-rentals" element={<CarRental />} />
                  <Route path="/deals" element={<DealsPage />} />
                  <Route path="/rooms/:id" element={<RoomDetail />} />
                  <Route element={<ProtectRoute />}>
                    <Route path="/my-bookings" element={<MyBookings />} />
                  <Route path="/checkout/:id" element={<Checkout />} />
                  <Route path="/booking-info/:id" element={<BookingInfo />} />
                  </Route>
                </Route>

                {/* Admin */}
                <Route
                  path="/admin"
                  element={
                    <AdminRoute>
                      <AdminLayout />
                    </AdminRoute>
                  }
                >
                  <Route path="room-map" element={<AdminRoomMap />} />
                  <Route index element={<AdminDashboard />} />
                  <Route path="hotels" element={<AdminHotels />} />
                  <Route path="hotels/new" element={<AdminAddHotel />} />
                  <Route path="hotels/:id/edit" element={<AdminEditHotel />} />
                  <Route path="hotels/:hotelId/rooms" element={<AdminRooms />} />
                  <Route path="hotels/:hotelId/rooms/new" element={<AdminAddRoom />} />
                  <Route path="rooms/:roomId/edit" element={<AdminEditRoom />} />
                  <Route path="bookings" element={<AdminBookings />} />
                </Route>

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>

              {/* CHAT SUPPORT – GLOBAL */}
              <ChatSupport />

            </Suspense>
          </ThemeProvider>
        </FilterProvider>
      </SearchProvider>
    </AuthProvider>
  );
}
