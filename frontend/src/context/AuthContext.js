import React, { createContext, useContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import * as Device from 'expo-device';
import { api } from '../services/api';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    restoreSession();
  }, []);

  const restoreSession = async () => {
    try {
      const savedToken = await SecureStore.getItemAsync('rchessmistry_token');
      const savedUser = await SecureStore.getItemAsync('rchessmistry_user');
      if (savedToken && savedUser) {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
        api.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`;
      }
    } catch (e) {
      console.log('Session restore failed:', e);
    } finally {
      setLoading(false);
    }
  };

  const getDeviceInfo = () => ({
    deviceId: Device.modelId || Device.osInternalBuildId || 'unknown',
    deviceName: Device.deviceName || `${Device.brand} ${Device.modelName}` || 'Unknown Device',
  });

  const login = async (username, password) => {
    const deviceInfo = getDeviceInfo();
    const response = await api.post('/auth/login', {
      username,
      password,
      ...deviceInfo,
    });
    await saveSession(response.data);
    return response.data;
  };

  const register = async (username, password, displayName) => {
    const deviceInfo = getDeviceInfo();
    const response = await api.post('/auth/register', {
      username,
      password,
      displayName,
      ...deviceInfo,
    });
    await saveSession(response.data);
    return response.data;
  };

  const saveSession = async (data) => {
    const { token: newToken, ...userData } = data;
    setToken(newToken);
    setUser(userData);
    api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
    await SecureStore.setItemAsync('rchessmistry_token', newToken);
    await SecureStore.setItemAsync('rchessmistry_user', JSON.stringify(userData));
  };

  const logout = async () => {
    setToken(null);
    setUser(null);
    delete api.defaults.headers.common['Authorization'];
    await SecureStore.deleteItemAsync('rchessmistry_token');
    await SecureStore.deleteItemAsync('rchessmistry_user');
  };

  const updateUser = async (updatedData) => {
    const newUser = { ...user, ...updatedData };
    setUser(newUser);
    await SecureStore.setItemAsync('rchessmistry_user', JSON.stringify(newUser));
  };

  const refreshProfile = async () => {
    try {
      const response = await api.get('/user/profile');
      await updateUser(response.data);
    } catch (e) {
      console.log('Profile refresh failed:', e);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      login,
      register,
      logout,
      updateUser,
      refreshProfile,
      isAuthenticated: !!token,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export default AuthContext;
