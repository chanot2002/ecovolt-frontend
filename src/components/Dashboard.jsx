// src/pages/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import { ref, onValue, query, limitToLast } from 'firebase/database';
import { rtdb } from '../firebase';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const RT_DOC_REF = ref(rtdb, 'realtime_data/latest');
const SENSOR_LOGS_REF = ref(rtdb, 'sensor_logs');
const MAX_HISTORY_POINTS = 20;
const SENSOR_TIMEOUT_SECONDS = 90;

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: {
    x: { ticks: { color: '#888' }, grid: { color: '#333' } },
    y: { ticks: { color: '#888' }, grid: { color: '#333' } },
  },
};

const VoltageChart = ({ data }) => (
  <Line
    data={{
      labels: data.map(d => d.time),
      datasets: [{
        data: data.map(d => d.voltage_v),
        borderColor: '#00e676',
        backgroundColor: 'rgba(0, 230, 118, 0.2)',
        fill: true,
        tension: 0.4,
      }],
    }}
    options={chartOptions}
  />
);

const TempChart = ({ data }) => (
  <Line
    data={{
      labels: data.map(d => d.time),
      datasets: [{
        data: data.map(d => d.temp_c),
        borderColor: '#ff9800',
        backgroundColor: 'rgba(255, 152, 0, 0.2)',
        fill: true,
        tension: 0.4,
      }],
    }}
    options={chartOptions}
  />
);

const GasChart = ({ data }) => (
  <Line
    data={{
      labels: data.map(d => d.time),
      datasets: [{
        data: data.map(d => d.gas_ppm),
        borderColor: '#2196f3',
        backgroundColor: 'rgba(33, 150, 243, 0.2)',
        fill: true,
        tension: 0.4,
      }],
    }}
    options={chartOptions}
  />
);

const Dashboard = () => {
  const [realtime, setRealtime] = useState({ temp_c: 0, gas_ppm: 0, voltage_v: 0, timestamp: 'N/A', rawTimestamp: 0 });
  const [history, setHistory] = useState([]);
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Math.floor(Date.now() / 1000);
      setIsOnline(realtime.rawTimestamp && now - realtime.rawTimestamp <= SENSOR_TIMEOUT_SECONDS);
    }, 5000);
    return () => clearInterval(interval);
  }, [realtime.rawTimestamp]);

  useEffect(() => {
    const unsubRT = onValue(RT_DOC_REF, (snap) => {
      if (snap.exists()) {
        const d = snap.val();
        const ts = parseInt(d.timestamp) || 0;
        setRealtime({
          temp_c: parseFloat(d.temp_c || 0).toFixed(1),
          gas_ppm: parseInt(d.gas_ppm || 0),
          voltage_v: parseFloat(d.voltage_v || 0).toFixed(2),
          timestamp: new Date(ts * 1000).toLocaleTimeString('en-PH'),
          rawTimestamp: ts,
        });
      }
    });

    const q = query(SENSOR_LOGS_REF, limitToLast(MAX_HISTORY_POINTS));
    const unsubHist = onValue(q, (snap) => {
      const list = [];
      snap.forEach((child) => {
        const d = child.val();
        const ts = parseInt(d.timestamp);
        list.push({
          time: new Date(ts * 1000).toLocaleTimeString('en-PH', { hour: '2-digit', minute: '2-digit' }),
          temp_c: parseFloat(d.temp_c || 0),
          gas_ppm: parseInt(d.gas_ppm || 0),
          voltage_v: parseFloat(d.voltage_v || 0),
        });
      });
      setHistory(list.reverse());
    });

    return () => {
      unsubRT();
      unsubHist();
    };
  }, []);

  return (
    <div>
      <h2 className="text-white mb-4">
        <i className="fas fa-chart-line me-3"></i> EcoVolt Monitoring
      </h2>

      {/* Real-time Cards */}
      <div className="row g-3 g-md-4 mb-4">
        <div className="col-12 col-sm-6 col-lg-3">
          <div className="card bg-dark border-success h-100">
            <div className="card-body text-center py-4">
              <i className="fas fa-bolt text-success fa-3x mb-3"></i>
              <h3 className="text-success">{realtime.voltage_v} <small>V</small></h3>
              <p className="text-muted mb-0">Battery Voltage</p>
            </div>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-lg-3">
          <div className="card bg-dark border-warning h-100">
            <div className="card-body text-center py-4">
              <i className="fas fa-thermometer-half text-warning fa-3x mb-3"></i>
              <h3 className="text-warning">{realtime.temp_c} °C</h3>
              <p className="text-muted mb-0">Temperature</p>
            </div>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-lg-3">
          <div className="card bg-dark border-info h-100">
            <div className="card-body text-center py-4">
              <i className="fas fa-wind text-info fa-3x mb-3"></i>
              <h3 className="text-info">{realtime.gas_ppm} ppm</h3>
              <p className="text-muted mb-0">Gas Level</p>
            </div>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-lg-3">
          <div className="card bg-dark border-secondary h-100 d-flex align-items-center justify-content-center">
            <div className="text-center">
              <i className={`fas fa-3x mb-3 ${isOnline ? 'text-success' : 'text-danger'}`}></i>
              <h4 className={isOnline ? 'text-success' : 'text-danger'}>{isOnline ? 'ONLINE' : 'OFFLINE'}</h4>
              <small className="text-muted">{realtime.timestamp}</small>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="row g-4">
        <div className="col-12 col-lg-6">
          <div className="card bg-dark border-success h-100">
            <div className="card-header bg-success text-dark fw-bold">Voltage Trend</div>
            <div className="card-body" style={{ height: '300px' }}>
              <VoltageChart data={history} />
            </div>
          </div>
        </div>
        <div className="col-12 col-lg-6">
          <div className="card bg-dark border-warning h-100">
            <div className="card-header bg-warning text-dark fw-bold">Temperature Trend</div>
            <div className="card-body" style={{ height: '300px' }}>
              <TempChart data={history} />
            </div>
          </div>
        </div>
        <div className="col-12 col-lg-6">
          <div className="card bg-dark border-info h-100">
            <div className="card-header bg-info text-dark fw-bold">Gas Trend</div>
            <div className="card-body" style={{ height: '300px' }}>
              <GasChart data={history} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;