import instance from "./axios";

export const getAdminBookings = (params) =>
  instance.get("/admin/bookings", { params });

export const updateContactStatus = (id, data) =>
  instance.put(`/admin/bookings/${id}/action`, data);

export const getAdminStats = () =>
  instance.get("/admin/stats");

export const getFollowUpBookings = () =>
  instance.get("/admin/bookings/follow-up");

export const markBookingPaid = (id, note) =>
  instance.put(`/admin/bookings/${id}/pay`, { note });
