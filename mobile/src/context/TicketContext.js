import React, { createContext, useState, useCallback, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';
import { API_BASE } from '../constants/theme';

export const TicketContext = createContext();

export const TicketProvider = ({ children }) => {
  const { token } = useContext(AuthContext);
  const [tickets, setTickets] = useState([]);
  const [refreshingTickets, setRefreshingTickets] = useState(false);

  const fetchTickets = useCallback(async () => {
    if (!token) return;
    try {
      setRefreshingTickets(true);
      const res = await axios.get(`${API_BASE}/tickets`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const priorityWeights = { 'high': 3, 'normal': 2, 'low': 1 };
      const sortedTickets = res.data.sort((a, b) => {
        const pA = priorityWeights[(a.priority || 'normal').toLowerCase()] || 0;
        const pB = priorityWeights[(b.priority || 'normal').toLowerCase()] || 0;
        return pB - pA;
      });

      setTickets(sortedTickets);
    } catch (e) {
      console.log('fetch tickets error', e.message);
    } finally {
      setRefreshingTickets(false);
    }
  }, [token]);

  const updateTicketLocally = useCallback((updatedTicket) => {
    setTickets(prev => prev.map(t => t.id === updatedTicket.id ? { ...t, ...updatedTicket } : t));
  }, []);

  const addTicketLocally = useCallback((newTicket) => {
    setTickets(prev => [newTicket, ...prev]);
  }, []);

  const clearTickets = useCallback(() => {
    setTickets([]);
  }, []);

  return (
    <TicketContext.Provider value={{ tickets, fetchTickets, refreshingTickets, updateTicketLocally, addTicketLocally, clearTickets }}>
      {children}
    </TicketContext.Provider>
  );
};
