import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import {
  subscribeTemples,
  subscribeRoutes,
  subscribeGuesthouseInfo,
  subscribeEmergencyContacts,
  addTemple,
  updateTemple,
  deleteTemple,
  saveRoutes,
  saveGuesthouseInfo,
  saveEmergencyContacts,
} from '../services/dataService';

const DataContext = createContext(null);

export function DataProvider({ children }) {
  const [temples, setTemples] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [guesthouseInfo, setGuesthouseInfo] = useState(null);
  const [emergencyContacts, setEmergencyContacts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribers = [
      subscribeTemples(setTemples),
      subscribeRoutes(setRoutes),
      subscribeGuesthouseInfo((info) => {
        setGuesthouseInfo(info);
        setIsLoading(false);
      }),
      subscribeEmergencyContacts(setEmergencyContacts),
    ];
    return () => unsubscribers.forEach((unsub) => unsub && unsub());
  }, []);

  const value = useMemo(
    () => ({
      temples,
      routes,
      guesthouseInfo,
      emergencyContacts,
      isLoading,
      actions: {
        addTemple,
        updateTemple,
        deleteTemple,
        saveRoutes,
        saveGuesthouseInfo,
        saveEmergencyContacts,
      },
    }),
    [temples, routes, guesthouseInfo, emergencyContacts, isLoading],
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

DataProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export function useData() {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within a DataProvider');
  return context;
}
