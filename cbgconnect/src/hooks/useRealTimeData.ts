// src/hooks/useRealTimeData.ts
import { useState, useEffect, useCallback } from 'react';
import apiService from '@/services/api';

interface RealTimeDataOptions {
  endpoint: string;
  dependencies?: any[];
  pollingInterval?: number;
  enabled?: boolean;
}

export function useRealTimeData<T>(options: RealTimeDataOptions) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!options.enabled) return;
    
    try {
      setLoading(true);
      setError(null);
      const result = await apiService.request({
        method: 'GET',
        url: options.endpoint,
      });
      setData(result as T);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch data');
      console.error('Failed to fetch data:', err);
    } finally {
      setLoading(false);
    }
  }, [options.endpoint, options.enabled]);

  useEffect(() => {
    if (!options.enabled) return;

    // Initial fetch
    fetchData();

    // Set up polling for real-time updates
    let intervalId: number;
    if (options.pollingInterval && options.pollingInterval > 0) {
      intervalId = setInterval(fetchData, options.pollingInterval);
    }

    // Set up WebSocket for real-time updates
    const userId = localStorage.getItem('userId');
    const userRole = localStorage.getItem('userRole');
    
    let ws: WebSocket | null = null;
    
    if (userId && userRole) {
      ws = apiService.setupWebSocket(userId, userRole);
      
      if (ws) {
        ws.onmessage = (event) => {
          const updateData = JSON.parse(event.data);
          if (updateData.type === 'dashboard_update' && updateData.endpoint === options.endpoint) {
            setData(updateData.data);
          }
        };
      }
    }

    // Cleanup
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
      if (ws) {
        ws.close();
      }
    };
  }, [fetchData, options.endpoint, options.enabled, options.pollingInterval]);

  // Listen for real-time updates
  useEffect(() => {
    const handleRealTimeUpdate = (event: CustomEvent) => {
      const updateData = event.detail;
      if (updateData.type === 'dashboard_update' && updateData.endpoint === options.endpoint) {
        setData(updateData.data);
      }
    };

    window.addEventListener('realTimeUpdate', handleRealTimeUpdate as EventListener);
    
    return () => {
      window.removeEventListener('realTimeUpdate', handleRealTimeUpdate as EventListener);
    };
  }, [options.endpoint]);

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refetch,
  };
}

// Specific hooks for different dashboard types
export function useTeacherDashboard() {
  return useRealTimeData({
    endpoint: '/dashboard/teacher',
    pollingInterval: 30000, // 30 seconds
    enabled: true,
  });
}

export function useMetronDashboard() {
  return useRealTimeData({
    endpoint: '/dashboard/metron',
    pollingInterval: 30000,
    enabled: true,
  });
}

export function usePatronDashboard() {
  return useRealTimeData({
    endpoint: '/dashboard/patron',
    pollingInterval: 30000,
    enabled: true,
  });
}

export function useNotifications(userRole: string) {
  return useRealTimeData({
    endpoint: `/notifications?role=${userRole}`,
    pollingInterval: 10000, // 10 seconds for notifications
    enabled: true,
  });
}
