import React, { createContext, useContext, useState, useEffect } from 'react';
import { rtdb, db } from '../firebase';
import { ref, onValue, set, push, query, limitToLast } from 'firebase/database';
import { collection, doc, getDoc, setDoc, getDocs, orderBy } from 'firebase/firestore';

const DataContext = createContext();

export const useData = () => useContext(DataContext);

export const DataProvider = ({ children }) => {
    const [realtimeData, setRealtimeData] = useState({});
    const [historyData, setHistoryData] = useState([]);
    const [settings, setSettings] = useState({});
    const [inventoryLog, setInventoryLog] = useState([]);

    // --- Realtime Database (Sensor Data) ---
    useEffect(() => {
        const realtimeRef = ref(rtdb, 'sensor_data/realtime');
        const historyQuery = query(ref(rtdb, 'sensor_data/history'), limitToLast(12));

        // Listener for Real-time Data
        const unsubscribeRTDB = onValue(realtimeRef, (snapshot) => {
            const data = snapshot.val();
            setRealtimeData(data || {});
        });

        // Listener for History Data (Chart data)
        const unsubscribeHistory = onValue(historyQuery, (snapshot) => {
            const dataArray = [];
            snapshot.forEach(childSnapshot => {
                dataArray.push(childSnapshot.val());
            });
            setHistoryData(dataArray);
        });

        return () => {
            unsubscribeRTDB();
            unsubscribeHistory();
        };
    }, []);
    
    // --- Firestore (Settings) ---
    const settingsRef = doc(db, 'system', 'calibration');
    
    useEffect(() => {
        // Load Settings
        const fetchSettings = async () => {
            const docSnap = await getDoc(settingsRef);
            if (docSnap.exists()) {
                setSettings(docSnap.data());
            } else {
                setSettings({ temp_low: 30, temp_high: 40, level_min: 20 }); // Defaults
            }
        };
        fetchSettings();
    }, []);

    const saveSettings = async (newSettings) => {
        try {
            await setDoc(settingsRef, newSettings);
            setSettings(newSettings);
            return { success: true, message: "Settings saved successfully." };
        } catch (error) {
            console.error("Error saving settings: ", error);
            return { success: false, message: "Failed to save settings." };
        }
    };

    // --- Firestore (Agrowaste Inventory) ---
    const inventoryCollectionRef = collection(db, 'inventory');

    const fetchInventory = async () => {
        try {
            const q = query(inventoryCollectionRef, orderBy('timestamp', 'desc'));
            const querySnapshot = await getDocs(q);
            const log = [];
            querySnapshot.forEach((doc) => {
                log.push({ id: doc.id, ...doc.data() });
            });
            setInventoryLog(log);
        } catch (error) {
            console.error("Error fetching inventory: ", error);
        }
    };

    const addInventory = async (data) => {
        try {
            await push(inventoryCollectionRef, { ...data, timestamp: new Date().toISOString() });
            fetchInventory(); // Refresh log
            return { success: true, message: "Inventory updated successfully." };
        } catch (error) {
            console.error("Error adding inventory: ", error);
            return { success: false, message: "Failed to add inventory." };
        }
    };

    useEffect(() => {
        fetchInventory();
    }, []);


    const value = {
        realtimeData,
        historyData,
        settings,
        saveSettings,
        inventoryLog,
        addInventory,
    };

    return (
        <DataContext.Provider value={value}>
            {children}
        </DataContext.Provider>
    );
};