import { create } from 'zustand';
import { axiosInstance } from '../lib/axios';
import toast from 'react-hot-toast';

export const useTicketStore = create((set, get) => ({
  tickets: [],
  myTickets: [],
  myTaskCounts: {
    Open: 0,
    'In Progress': 0,
    Review: 0,
    Completed: 0,
  },
  selectedTicket: null,
  isLoading: false,
  error: null,

  // Create a new ticket
  createTicket: async (ticketData) => {
    set({ isLoading: true });
    const toastId = toast.loading('Creating ticket...');
    try {
      const response = await axiosInstance.post('/tickets', ticketData);
      toast.success('Ticket created successfully!', { id: toastId });
      set((state) => ({
        tickets: [response.data.ticket, ...state.tickets],
        isLoading: false,
      }));
      return response.data.ticket;
    } catch (error) {
      console.error('Error creating ticket:', error);
      toast.error(error.response?.data?.message || 'Failed to create ticket', { id: toastId });
      set({ isLoading: false });
      throw error;
    }
  },

  // Fetch all tickets (with optional filters)
  fetchAllTickets: async (filters = {}) => {
    set({ isLoading: true });
    try {
      const params = new URLSearchParams(filters).toString();
      const response = await axiosInstance.get(`/tickets?${params}`);
      set({ tickets: response.data.tickets, isLoading: false });
    } catch (error) {
      console.error('Error fetching tickets:', error);
      toast.error('Failed to fetch tickets');
      set({ isLoading: false });
    }
  },

  // Fetch tickets assigned to current user
  fetchMyTasks: async () => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.get('/tickets/my');
      set({ 
        myTickets: response.data.tickets, 
        myTaskCounts: response.data.counts,
        isLoading: false 
      });
    } catch (error) {
      console.error('Error fetching my tasks:', error);
      toast.error('Failed to fetch your tasks');
      set({ isLoading: false });
    }
  },

  // Fetch single ticket by ID
  fetchTicketById: async (id) => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.get(`/tickets/${id}`);
      set({ selectedTicket: response.data.ticket, isLoading: false });
      return response.data.ticket;
    } catch (error) {
      console.error('Error fetching ticket:', error);
      toast.error('Failed to fetch ticket details');
      set({ isLoading: false });
      throw error;
    }
  },

  // Update ticket status
  updateTicketStatus: async (id, newStatus) => {
    const toastId = toast.loading('Updating status...');
    try {
      const response = await axiosInstance.patch(`/tickets/${id}/status`, { status: newStatus });
      toast.success('Status updated successfully!', { id: toastId });
      
      // Update in both tickets and myTickets arrays
      set((state) => ({
        tickets: state.tickets.map(t => t._id === id ? response.data.ticket : t),
        myTickets: state.myTickets.map(t => t._id === id ? response.data.ticket : t),
        selectedTicket: state.selectedTicket?._id === id ? response.data.ticket : state.selectedTicket,
      }));
      return response.data.ticket;
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error(error.response?.data?.message || 'Failed to update status', { id: toastId });
      throw error;
    }
  },

  // Reassign ticket (Admin/Manager only)
  reassignTicket: async (id, newAssignedTo) => {
    const toastId = toast.loading('Reassigning ticket...');
    try {
      const response = await axiosInstance.patch(`/tickets/${id}/reassign`, { assignedTo: newAssignedTo });
      toast.success('Ticket reassigned successfully!', { id: toastId });
      
      set((state) => ({
        tickets: state.tickets.map(t => t._id === id ? response.data.ticket : t),
        myTickets: state.myTickets.map(t => t._id === id ? response.data.ticket : t),
        selectedTicket: state.selectedTicket?._id === id ? response.data.ticket : state.selectedTicket,
      }));
      return response.data.ticket;
    } catch (error) {
      console.error('Error reassigning ticket:', error);
      toast.error(error.response?.data?.message || 'Failed to reassign ticket', { id: toastId });
      throw error;
    }
  },

  // Close ticket (Admin/Manager only)
  closeTicket: async (id) => {
    const toastId = toast.loading('Closing ticket...');
    try {
      const response = await axiosInstance.patch(`/tickets/${id}/close`);
      toast.success('Ticket closed successfully!', { id: toastId });
      
      set((state) => ({
        tickets: state.tickets.map(t => t._id === id ? response.data.ticket : t),
        myTickets: state.myTickets.map(t => t._id === id ? response.data.ticket : t),
        selectedTicket: state.selectedTicket?._id === id ? response.data.ticket : state.selectedTicket,
      }));
      return response.data.ticket;
    } catch (error) {
      console.error('Error closing ticket:', error);
      toast.error(error.response?.data?.message || 'Failed to close ticket', { id: toastId });
      throw error;
    }
  },

  // Add comment to ticket
  addComment: async (id, comment) => {
    const toastId = toast.loading('Adding comment...');
    try {
      const response = await axiosInstance.post(`/tickets/${id}/comment`, { comment });
      toast.success('Comment added successfully!', { id: toastId });
      
      set((state) => ({
        selectedTicket: state.selectedTicket?._id === id ? response.data.ticket : state.selectedTicket,
      }));
      return response.data.ticket;
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error(error.response?.data?.message || 'Failed to add comment', { id: toastId });
      throw error;
    }
  },

  // Add attachment to ticket
  addAttachment: async (id, fileName, fileUrl) => {
    const toastId = toast.loading('Uploading attachment...');
    try {
      const response = await axiosInstance.post(`/tickets/${id}/attachment`, { fileName, fileUrl });
      toast.success('Attachment added successfully!', { id: toastId });
      
      set((state) => ({
        selectedTicket: state.selectedTicket?._id === id ? response.data.ticket : state.selectedTicket,
      }));
      return response.data.ticket;
    } catch (error) {
      console.error('Error adding attachment:', error);
      toast.error(error.response?.data?.message || 'Failed to add attachment', { id: toastId });
      throw error;
    }
  },

  // Delete ticket (Admin only)
  deleteTicket: async (id) => {
    const toastId = toast.loading('Deleting ticket...');
    try {
      await axiosInstance.delete(`/tickets/${id}`);
      toast.success('Ticket deleted successfully!', { id: toastId });
      
      set((state) => ({
        tickets: state.tickets.filter(t => t._id !== id),
        myTickets: state.myTickets.filter(t => t._id !== id),
      }));
    } catch (error) {
      console.error('Error deleting ticket:', error);
      toast.error(error.response?.data?.message || 'Failed to delete ticket', { id: toastId });
      throw error;
    }
  },

  // Clear selected ticket
  clearSelectedTicket: () => {
    set({ selectedTicket: null });
  },

  // Clear error
  clearError: () => {
    set({ error: null });
  },
}));
