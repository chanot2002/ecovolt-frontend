import React, { useState, useEffect } from 'react';
// Imports para sa Realtime Database (RTDB)
import { ref, onValue, remove, query, limitToLast } from 'firebase/database'; 
import { rtdb } from '../firebase'; // Import ang RTDB instance
import * as XLSX from 'xlsx'; // Para sa Export to Excel

// --- FIREBASE REFERENCES (RTDB) ---
// Tiyakin na ito ang tamang path kung saan nakalagay ang mga log ng sensor
const SENSOR_LOGS_REF = ref(rtdb, 'sensor_logs'); 
const MAX_HISTORY_POINTS = 100;

function Reports() {
    const [historyData, setHistoryData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');

    // --- 1. Real-time Listener for Sensor History (READ) --
    useEffect(() => {
        // Kumuha ng huling 100 logs
        const q = query(SENSOR_LOGS_REF, limitToLast(MAX_HISTORY_POINTS));

        // Ang onValue listener ang nagpapakita na 'kusang' naglo-load ang data
        const unsubscribe = onValue(q, (snapshot) => {
            const fetchedData = [];
            snapshot.forEach(childSnapshot => {
                const data = childSnapshot.val();
                const id = childSnapshot.key; 
                const timestamp = data.timestamp ? data.timestamp : 0;
                
                // I-calculate ang Power Output
                const power_kw = (data.voltage_v * 1 / 1000).toFixed(2);
                
                fetchedData.push({
                    id: id,
                    date: new Date(parseInt(timestamp) * 1000).toLocaleString('en-US', { hour12: true }),
                    power_kw: power_kw,
                    temp_c: parseFloat(data.temp_c).toFixed(2),
                    gas_ppm: parseInt(data.gas_ppm),
                    level_cm: "N/A", // Kung walang level sensor data
                });
            });

            // I-reverse ang data para ang pinakabagong log ang nasa itaas
            setHistoryData(fetchedData.reverse()); 
            setLoading(false);
        }, (error) => {
            console.error("RTDB Read Error:", error);
            setMessage(`❌ Error reading historical data: ${error.message}`);
            setLoading(false);
        });

        // Clean up the listener kapag umalis sa page
        return () => unsubscribe();
    }, []);

    // --- 2. Delete Log Function (DELETE) ---
    const deleteSensorLog = async (logId, logDate) => {
        const logRef = ref(rtdb, `sensor_logs/${logId}`);
        try {
            await remove(logRef); 
            setMessage(`✅ Successfully deleted log for: ${logDate}`);
        } catch (error) {
            console.error("Error deleting document: ", error);
            setMessage(`❌ Error deleting log: ${error.message}`);
        }
    };

    // --- 3. Export to Excel (XLSX) Function ---
    const handleExport = () => {
        if (historyData.length === 0) {
            setMessage("❌ Walang data na ma-export.");
            return;
        }

        const dataToExport = historyData.map(item => ({
            'Date/Time': item.date,
            'Power (kW)': item.power_kw,
            'Temperature (°C)': item.temp_c,
            'Gas (ppm)': item.gas_ppm,
        }));

        const ws = XLSX.utils.json_to_sheet(dataToExport);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Sensor History");
        XLSX.writeFile(wb, "EcoVolt_Sensor_Report.xlsx");
    };


    return (
        <div className="container-fluid py-4">
            <h2 className="text-white mb-4"><i className="fas fa-file-invoice me-3"></i> System Reports</h2>
            <div className="card-custom p-4" style={{ background: '#1a1a1a', border: '1px solid #333', borderRadius: '16px' }}>
                <h5 className="text-white mb-3">Historical Sensor Data</h5>
                
                <div className="d-flex justify-content-between mb-3">
                    <button 
                        className="btn btn-success" 
                        onClick={handleExport}
                        title="Download Data as Excel File"
                    >
                        <i className="fas fa-download me-2"></i> Export to Excel
                    </button>
                    {message && (
                        <div className={`alert py-1 px-3 mb-0 small text-white ${message.includes('❌') ? 'alert-danger' : 'alert-success'}`}
                            style={{ backgroundColor: message.includes('❌') ? 'rgba(244, 67, 54, 0.2)' : 'rgba(0, 230, 118, 0.2)', border: '1px solid' + (message.includes('❌') ? '#f44336' : '#00e676') }}>
                            {message}
                        </div>
                    )}
                </div>

                <div className="row">
                    <div className="col-12">
                        {loading ? (
                            <p className="text-info">Loading history data...</p>
                        ) : (
                            <div className="table-responsive" style={{ maxHeight: '600px', overflowY: 'auto' }}>
                                <table className="table table-dark table-striped table-sm small">
                                    <thead>
                                        <tr>
                                            <th className="text-light">Date/Time</th>
                                            <th className="text-light">Power (kW)</th>
                                            <th className="text-light">Temp (°C)</th>
                                            <th className="text-light">Gas (ppm)</th>
                                            <th className="text-light">Level (cm)</th>
                                            <th className="text-light">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {historyData.map((item) => (
                                            <tr key={item.id}>
                                                <td className="text-light">{item.date}</td>
                                                <td className="text-success">{item.power_kw}</td>
                                                <td className="text-warning">{item.temp_c}</td>
                                                <td className="text-info">{item.gas_ppm}</td>
                                                <td className="text-light">{item.level_cm}</td>
                                                <td>
                                                    <button 
                                                        className="btn btn-sm btn-outline-danger py-0 px-2" 
                                                        onClick={() => deleteSensorLog(item.id, item.date)} 
                                                        title="Delete Log"
                                                    >
                                                        <i className="fas fa-times"></i>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                        {historyData.length === 0 && (
                                            <tr><td colSpan="6" className="text-center text-danger">No sensor data available.</td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Reports;