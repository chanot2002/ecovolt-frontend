import React, { useState, useEffect, useRef } from 'react';
import { ref, onValue, query, limitToLast } from 'firebase/database';
import { rtdb } from '../firebase';
import Chart from 'chart.js/auto';

// --- DATABASE PATHS (MATCHED SA ARDUINO CODE) ---
const RT_PATH = "realtime_data/latest"; 
const HISTORY_PATH = "sensor_logs"; 
const MAX_HISTORY_POINTS = 30; 

function EFOAnalysis() {
    // Refs for all charts
    const efficiencyChartRef = useRef(null);
    const powerTrendChartRef = useRef(null);
    const tempChartRef = useRef(null); // Bagong Ref
    const gasChartRef = useRef(null);  // Bagong Ref
    const blendChartRef = useRef(null);
    
    // Canvas Refs
    const efficiencyCanvasRef = useRef(null);
    const powerCanvasRef = useRef(null);
    const tempCanvasRef = useRef(null); // Bagong Canvas Ref
    const gasCanvasRef = useRef(null);  // Bagong Canvas Ref
    const blendCanvasRef = useRef(null);

    const [realtimeData, setRealtimeData] = useState({
        temp_c: 0,
        gas_ppm: 0,
        voltage_v: 0,
    });
    
    const [historyData, setHistoryData] = useState([]);
    const [summary, setSummary] = useState({
        // ... (Summary states are the same)
        currentEFO: 0.0,
        averagePower: 0.0,
        materialUsage: 0.0,
        tempForecast: 'Stable (35°C)',
        methaneForecast: 'Optimal (750 ppm)',
        powerForecast: 'High (0.5 kW)',
        optimizationSuggestion: 'Maintain current feedstock blend and check pH levels weekly.',
    });
    
    // --- RTDB Data Listener (Same Logic) ---
    useEffect(() => {
        const rtRef = ref(rtdb, RT_PATH);
        const unsubscribeRT = onValue(rtRef, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                setRealtimeData({
                    temp_c: parseFloat(data.temp_c || 0),
                    gas_ppm: parseInt(data.gas_ppm || 0),
                    voltage_v: parseFloat(data.voltage_v || 0),
                });
            }
        });

        const historyRef = ref(rtdb, HISTORY_PATH);
        const q = query(historyRef, limitToLast(MAX_HISTORY_POINTS));
        const unsubscribeHistory = onValue(q, (snapshot) => {
            const fetchedData = [];
            snapshot.forEach(childSnapshot => {
                const data = childSnapshot.val();
                fetchedData.push({
                    temp: parseFloat(data.temp_c || 0),
                    gas: parseInt(data.gas_ppm || 0), // Idinagdag ang Gas
                    power: (data.voltage_v * 1 / 1000), 
                    timestamp: new Date(parseInt(data.timestamp) * 1000).toLocaleTimeString().slice(0, 5),
                });
            });
            setHistoryData(fetchedData);
            renderCharts(fetchedData);
        });

        return () => {
            unsubscribeRT();
            unsubscribeHistory();
        };
    }, []);
    
    // --- Chart Rendering Logic (UPDATED) ---
    const renderCharts = (data) => {
        // Destroy previous chart instances
        if (powerTrendChartRef.current) powerTrendChartRef.current.destroy();
        if (tempChartRef.current) tempChartRef.current.destroy();
        if (gasChartRef.current) gasChartRef.current.destroy();
        if (blendChartRef.current) blendChartRef.current.destroy();
        
        const labels = data.map(item => item.timestamp);
        
        // 1. Power Trend Chart (Same as Dashboard, but detailed)
        powerTrendChartRef.current = new Chart(powerCanvasRef.current, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Power Output (kW)',
                    data: data.map(item => item.power.toFixed(2)),
                    borderColor: '#00e676',
                    tension: 0.4,
                }]
            },
            options: { responsive: true, maintainAspectRatio: false, scales: { x: { ticks: { color: '#888' }, grid: { display: false } }, y: { ticks: { color: '#888' }, grid: { color: '#333' } } } }
        });
        
        // 2. 🌡️ Temperature Trend Chart (BAGONG CHART)
        tempChartRef.current = new Chart(tempCanvasRef.current, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Temperature (°C)',
                    data: data.map(item => item.temp.toFixed(2)),
                    borderColor: '#ff9800', // Orange/Warning
                    backgroundColor: 'rgba(255, 152, 0, 0.2)',
                    fill: true,
                    tension: 0.4,
                }]
            },
            options: { responsive: true, maintainAspectRatio: false, scales: { x: { ticks: { color: '#888' }, grid: { display: false } }, y: { ticks: { color: '#888' }, grid: { color: '#333' } } } }
        });

        // 3. 💨 Gas PPM Trend Chart (BAGONG CHART)
        gasChartRef.current = new Chart(gasCanvasRef.current, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Gas Level (ppm)',
                    data: data.map(item => item.gas),
                    borderColor: '#2196f3', // Blue/Info
                    backgroundColor: 'rgba(33, 150, 243, 0.2)',
                    fill: true,
                    tension: 0.4,
                }]
            },
            options: { responsive: true, maintainAspectRatio: false, scales: { x: { ticks: { color: '#888' }, grid: { display: false } }, y: { beginAtZero: true, ticks: { color: '#888' }, grid: { color: '#333' } } } }
        });

        // 4. Blend Chart Setup (Mocked Data)
        blendChartRef.current = new Chart(blendCanvasRef.current, {
            type: 'doughnut',
            data: {
                labels: ['Rice Husks', 'Pili Shells', 'Coconut Coir'],
                datasets: [{
                    data: [45, 30, 25],
                    backgroundColor: ['#f44336', '#ff9800', '#2196f3'],
                }]
            },
            options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { labels: { color: '#fff' } } } }
        });
    };

    useEffect(() => {
        if (historyData.length > 0) {
            renderCharts(historyData);
        }
    }, [historyData]); 


    // --- JSX Render with Styling ---
    return (
        <div className="container-fluid py-4">
            <h2 className="text-white mb-4"><i className="fas fa-flask me-3"></i> EFO Analysis & Optimization</h2>
            <div className="row">
                {/* Real-time Metrics Card */}
                <div className="col-lg-12 mb-4">
                    <div className="card-custom p-4" style={{ background: '#1a1a1a', border: '1px solid #333', borderRadius: '16px' }}>
                        <h5 className="text-white mb-3">Real-Time EFO Status</h5>
                        <div className="row">
                            {/* Metric 1: Power */}
                            <div className="col-md-3">
                                <div className="card-metric bg-dark-secondary text-white p-3 shadow-sm" style={{ background: '#2c2c2c', borderRadius: '8px' }}>
                                    <i className="fas fa-bolt **text-success** fa-2x mb-2"></i>
                                    <div className="h4 **text-success**">{(realtimeData.voltage_v * 1 / 1000).toFixed(2)} kW</div>
                                </div>
                            </div>
                             {/* Metric 2: Temperature */}
                            <div className="col-md-3">
                                <div className="card-metric bg-dark-secondary text-white p-3 shadow-sm" style={{ background: '#2c2c2c', borderRadius: '8px' }}>
                                    <i className="fas fa-thermometer-three-quarters **text-warning** fa-2x mb-2"></i>
                                    <div className="h4 **text-warning**">{realtimeData.temp_c.toFixed(2)} °C</div>
                                </div>
                            </div>
                            {/* Metric 3: Gas */}
                            <div className="col-md-3">
                                <div className="card-metric bg-dark-secondary text-white p-3 shadow-sm" style={{ background: '#2c2c2c', borderRadius: '8px' }}>
                                    <i className="fas fa-wind **text-info** fa-2x mb-2"></i>
                                    <div className="h4 **text-info**">{realtimeData.gas_ppm} ppm</div>
                                </div>
                            </div>
                            {/* Status Alert */}
                            <div className="col-md-3 d-flex align-items-center">
                                <div className={`alert mt-0 w-100 small p-3 ${realtimeData.temp_c > 38 ? 'alert-danger' : 'alert-success'}`} style={{ marginBottom: 0 }}>
                                    <i className={`fas ${realtimeData.temp_c > 38 ? 'fa-exclamation-triangle' : 'fa-check-circle'} me-2`}></i>
                                    **Status:** {realtimeData.temp_c > 38 ? 'Overheating Warning!' : 'Stable Operation'}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Row for all Charts */}
                <div className="col-lg-12">
                    <div className="row">
                        {/* 1. Power Trend Chart */}
                        <div className="col-md-6 mb-4">
                            <div className="card-custom p-4 h-100" style={{ background: '#1a1a1a', border: '1px solid #333', borderRadius: '16px' }}>
                                <h5 className="text-white mb-3"><i className="fas fa-chart-area me-2 text-success"></i> Power Trend (kW)</h5>
                                <div style={{ height: '250px' }}>
                                    <canvas ref={powerCanvasRef} id="powerTrendChart"></canvas>
                                </div>
                            </div>
                        </div>
                        {/* 2. Temperature Trend Chart (BAGONG CHART) */}
                        <div className="col-md-6 mb-4">
                            <div className="card-custom p-4 h-100" style={{ background: '#1a1a1a', border: '1px solid #333', borderRadius: '16px' }}>
                                <h5 className="text-white mb-3"><i className="fas fa-thermometer-half me-2 text-warning"></i> Temperature Trend (°C)</h5>
                                <div style={{ height: '250px' }}>
                                    <canvas ref={tempCanvasRef} id="tempTrendChart"></canvas>
                                </div>
                            </div>
                        </div>
                        {/* 3. Gas PPM Trend Chart (BAGONG CHART) */}
                        <div className="col-md-6 mb-4">
                            <div className="card-custom p-4 h-100" style={{ background: '#1a1a1a', border: '1px solid #333', borderRadius: '16px' }}>
                                <h5 className="text-white mb-3"><i className="fas fa-wind me-2 text-info"></i> Gas Level Trend (ppm)</h5>
                                <div style={{ height: '250px' }}>
                                    <canvas ref={gasCanvasRef} id="gasTrendChart"></canvas>
                                </div>
                            </div>
                        </div>
                        {/* 4. Feedstock Blend Ratio */}
                        <div className="col-md-6 mb-4">
                            <div className="card-custom p-4 h-100" style={{ background: '#1a1a1a', border: '1px solid #333', borderRadius: '16px' }}>
                                <h5 className="text-white mb-3"><i className="fas fa-flask me-2 text-primary"></i> Feedstock Blend Ratio (Mock)</h5>
                                <div style={{ height: '250px' }}><canvas ref={blendCanvasRef} id="blendChart"></canvas></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* EFO Summary and Suggestions */}
                <div className="col-lg-12">
                    <div className="card-custom p-4" style={{ background: '#1a1a1a', border: '1px solid #333', borderRadius: '16px' }}>
                        <h5 className="text-white mb-3"><i className="fas fa-star me-2"></i> Performance Summary & Optimization</h5>
                        <div className="row text-white small">
                            <ul className="list-unstyled col-md-4">
                                <li className="mb-1"><i className="fas fa-chart-line me-2 text-primary"></i> Current EFO: <span className="fw-bold">{summary.currentEFO.toFixed(2)}%</span></li>
                                <li className="mb-1"><i className="fas fa-plug me-2 text-success"></i> Average Power: <span className="fw-bold">{summary.averagePower.toFixed(2)} kW</span></li>
                                <li className="mb-1"><i className="fas fa-balance-scale me-2 text-secondary"></i> Material Usage: <span className="fw-bold">{summary.materialUsage.toFixed(1)} kg/day</span></li>
                            </ul>
                            <ul className="list-unstyled col-md-4">
                                <li className="mb-1"><i className="fas fa-temperature-low me-2 text-warning"></i> Temp Stability: <span className="fw-bold">{summary.tempForecast}</span></li>
                                <li className="mb-1"><i className="fas fa-gas-pump me-2 text-danger"></i> Methane Production: <span className="fw-bold">{summary.methaneForecast}</span></li>
                                <li className="mb-1"><i className="fas fa-bolt me-2 text-success"></i> Power Output: <span className="fw-bold">{summary.powerForecast}</span></li>
                            </ul>
                            <div className="col-md-4">
                                <div className="alert alert-dark border-success small p-2 text-white" style={{ borderColor: '#00e676', background: '#333' }}>
                                    <i className="fas fa-lightbulb me-2 text-success"></i> **Suggestion:** <span className="fw-bold">{summary.optimizationSuggestion}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EFOAnalysis;