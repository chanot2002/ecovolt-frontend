import React, { useState, useEffect, useRef } from 'react';
// Firestore Imports
import { collection, doc, onSnapshot, addDoc, query, orderBy, serverTimestamp, limit, deleteDoc } from 'firebase/firestore'; 
import { db } from '../firebase'; 
import Chart from 'chart.js/auto';

// --- FIRESTORE COLLECTIONS ---
const RT_LEVEL_DOC_REF = doc(db, 'realtime_data', 'latest'); // Mocked/RTDB placeholder
const LOG_COLLECTION_REF = collection(db, 'agrowaste_transactions'); 

// TANGGALIN ANG INITIAL_INVENTORY DEFAULT DATA
const INITIAL_INVENTORY = {}; 

function Agrowaste() {
    const stockChartRef = useRef(null);
    const stockCanvasRef = useRef(null);
    const [digesterLevel, setDigesterLevel] = useState(75.5); // Mocked value
    const [inventory, setInventory] = useState(INITIAL_INVENTORY); 
    
    // BINAGO: materialType -> materialName (Dahil text input na)
    const [materialName, setMaterialName] = useState('');
    
    const [quantityKg, setQuantityKg] = useState('');
    const [activityType, setActivityType] = useState('Add'); 
    const [message, setMessage] = useState('');
    const [activityLog, setActivityLog] = useState([]);
    const [loading, setLoading] = useState(true);

    // --- Material Suggestion Logic ---
    const getMaterialSuggestion = (currentInventory) => {
        // Tanging mga materyales na may stock na *greater than 0* lang ang isasama sa suggestion
        const materialEntries = Object.entries(currentInventory).filter(([, stock]) => stock > 0);
        
        if (materialEntries.length === 0) {
            // I-handle kung walang transactions o puro consume lang.
            return { type: 'No Stock/Logs', stock: 0 }; 
        }
        
        // Hanapin ang material na may pinakamababang stock (na may laman)
        const suggestion = materialEntries.reduce(
            (lowest, [type, stock]) => (stock < lowest.stock ? { type, stock } : lowest),
            { type: '', stock: Infinity }
        );

        return suggestion;
    };
    
    // [BAGONG FUNCTION] Delete Log Entry
    const handleDeleteLog = async (id, action, type, quantity) => {
        // ... (Logic para sa pag-delete ng log)
        try {
            await deleteDoc(doc(db, 'agrowaste_transactions', id));
            
            // Ang inventory update ay mangyayari sa 'onSnapshot' listener pagkatapos mag-delete.
            // Walang kailangang manual state update dito.

            setMessage(`✅ Successfully deleted log for: ${type} (${quantity}kg)`);
        } catch (error) {
            console.error("Error deleting document: ", error);
            setMessage(`❌ Error deleting log: ${error.message}`);
        }
    };
    
    // --- Firestore Listeners ---
    useEffect(() => {
        // 1. Transaction Log Listener (Firestore)
        const qLog = query(LOG_COLLECTION_REF, orderBy('timestamp', 'asc'), limit(50)); // Order by asc to correctly calculate running total
        const unsubscribeLog = onSnapshot(qLog, (snapshot) => {
            const fetchedLogs = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                date: doc.data().timestamp ? doc.data().timestamp.toDate().toLocaleString() : 'N/A'
            }));
            
            // I-reverse para ang pinakabagong transaction ang nasa itaas ng table
            setActivityLog(fetchedLogs.reverse()); 
            
            // 2. Inventory Calculation - BATAYAN AY ANG LAHAT NG TRANSACTIONS
            const calculatedInventory = {}; // Magsimula sa WALANG laman
            
            // I-loop ang *lahat* ng transactions para makuha ang current running total
            fetchedLogs.forEach(log => { 
                const qty = parseFloat(log.quantity);
                const type = log.type;
                calculatedInventory[type] = calculatedInventory[type] || 0; // Initialize if not present
                
                if (log.action === 'Add') {
                    calculatedInventory[type] += qty;
                } else if (log.action === 'Consume') {
                    calculatedInventory[type] -= qty;
                }
            });
            
            setInventory(calculatedInventory);
            setLoading(false);
            
            // 3. Render Chart
            renderStockChart(calculatedInventory);
        }, (error) => {
            console.error("Firestore Log Read Error:", error);
            setMessage(`❌ Error reading logs: ${error.message}`);
            setLoading(false);
        });
        
        return () => {
            unsubscribeLog();
        };
    }, []);
    
    // --- Chart Rendering ---
    const renderStockChart = (currentInventory) => {
        if (stockChartRef.current) stockChartRef.current.destroy();
        
        // Tanging may laman (stock > 0) lang ang ipapakita sa chart
        const labels = Object.keys(currentInventory).filter(key => currentInventory[key] > 0);
        const data = labels.map(key => currentInventory[key]);
        const backgroundColors = ['#f44336', '#ff9800', '#2196f3', '#00e676', '#9c27b0', '#ffeb3b']; // Dagdagan ang kulay
        
        stockChartRef.current = new Chart(stockCanvasRef.current, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Current Stock (kg)',
                    data: data,
                    backgroundColor: labels.map((_, i) => backgroundColors[i % backgroundColors.length]),
                    borderColor: '#444',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { labels: { color: '#aaa' } }
                },
                scales: {
                    x: { ticks: { color: '#aaa' }, grid: { display: false } },
                    y: { beginAtZero: true, ticks: { color: '#aaa' }, grid: { color: '#333' } }
                }
            }
        });
    };

    // --- Form Submission (CREATE) ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!materialName.trim()) {
            setMessage("❌ Please enter the Material Name.");
            return;
        }

        const quantity = parseFloat(quantityKg);
        if (isNaN(quantity) || quantity <= 0) {
            setMessage("❌ Please enter a valid quantity.");
            return;
        }
        
        // Simple check to prevent consuming non-existent stock (optional but recommended)
        if (activityType === 'Consume' && (inventory[materialName.trim()] || 0) < quantity) {
             setMessage(`❌ ERROR: Insufficient stock for ${materialName.trim()}. Current stock: ${(inventory[materialName.trim()] || 0).toFixed(1)}kg`);
            return;
        }

        try {
            await addDoc(LOG_COLLECTION_REF, {
                action: activityType,
                type: materialName.trim(), // Gagamitin ang input ng user
                quantity: quantity,
                timestamp: serverTimestamp(),
                user: 'Admin (Web)', 
            });

            setMessage(`✅ ${activityType} ${quantity}kg of ${materialName.trim()} successfully recorded.`);
            setQuantityKg(''); // Reset quantity
            setMaterialName(''); // Reset material name for new entry
        } catch (error) {
            console.error("Error adding document: ", error);
            setMessage(`❌ Error recording transaction: ${error.message}`);
        }
    };
    
    const suggestedMaterial = getMaterialSuggestion(inventory);

    return (
        <div className="container-fluid py-4">
            <h2 className="text-white mb-4"><i className="fas fa-leaf me-3"></i> Agrowaste Management</h2>
            <div className="row">
                
                {/* Digester Level and Suggestion */}
                <div className="col-lg-6 mb-4">
                    <div className="row">
                        {/* Digester Level */}
                        <div className="col-md-6 mb-4">
                            <div className="card-metric text-white p-4 shadow-lg" style={{ background: '#1c1c1c', borderRadius: '12px' }}>
                                <i className="fas fa-box-open text-info fa-3x mb-2"></i>
                                <div className="h3 mt-2">{digesterLevel.toFixed(1)} cm</div>
                                <p className="mb-0 small text-muted">Digester Level (Mock)</p>
                            </div>
                        </div>

                        {/* Material Suggestion */}
                        <div className="col-md-6 mb-4">
                            <div className="card-metric text-white p-4 shadow-lg h-100" style={{ background: '#1c1c1c', borderRadius: '12px', border: suggestedMaterial.stock < 50 && suggestedMaterial.stock > 0 ? '1px solid #ff9800' : (suggestedMaterial.stock === 0 && suggestedMaterial.type !== 'No Stock/Logs' ? '1px solid #f44336' : '1px solid #00e676') }}>
                                <i className={`fas fa-${suggestedMaterial.type === 'No Stock/Logs' ? 'plus-circle' : 'exclamation-triangle'} ${suggestedMaterial.stock < 50 && suggestedMaterial.stock > 0 ? 'text-warning' : (suggestedMaterial.stock === 0 && suggestedMaterial.type !== 'No Stock/Logs' ? 'text-danger' : 'text-success')} fa-3x mb-2`}></i>
                                <div className="h4 mt-2" style={{ color: suggestedMaterial.stock < 50 && suggestedMaterial.stock > 0 ? '#ff9800' : (suggestedMaterial.stock === 0 && suggestedMaterial.type !== 'No Stock/Logs' ? '#f44336' : '#00e676') }}>{suggestedMaterial.type}</div>
                                <p className="mb-0 small text-light">Current Stock: {suggestedMaterial.stock.toFixed(0)} kg</p>
                                <p className="mb-0 small text-muted">Recommendation: **{suggestedMaterial.type === 'No Stock/Logs' ? 'ADD FIRST MATERIAL' : (suggestedMaterial.stock < 50 ? 'ADD NOW' : 'STABLE')}**</p>
                            </div>
                        </div>
                    </div>
                    
                    {/* New Transaction Form */}
                    <div className="row">
                        <div className="col-12">
                            <div className="card-custom p-4" style={{ background: '#1a1a1a', border: '1px solid #333', borderRadius: '16px' }}>
                                <h5 className="text-white mb-3">Record New Transaction</h5>
                                <form onSubmit={handleSubmit}>
                                    
                                    {/* Material Name (User Defined Text Input) */}
                                    <div className="mb-3">
                                        <label htmlFor="materialName" className="form-label small text-light">Material Name</label>
                                        <input 
                                            type="text" 
                                            className="form-control text-white" 
                                            id="materialName" 
                                            value={materialName} 
                                            onChange={(e) => setMaterialName(e.target.value)}
                                            required
                                            placeholder="e.g., Rice Husks, Pili Shells" 
                                            style={{ background: '#242424', border: '1px solid #444' }}
                                        />
                                    </div>
                                    
                                    {/* Quantity */}
                                    <div className="mb-3">
                                        <label htmlFor="quantityKg" className="form-label small text-light">Quantity (kg)</label>
                                        <input 
                                            type="number" 
                                            className="form-control text-white" 
                                            id="quantityKg" 
                                            value={quantityKg} 
                                            onChange={(e) => setQuantityKg(e.target.value)}
                                            min="0.1"
                                            step="0.1"
                                            required
                                            style={{ background: '#242424', border: '1px solid #444' }}
                                        />
                                    </div>
                                    {/* Activity */}
                                    <div className="mb-3">
                                        <label htmlFor="activityType" className="form-label small text-light">Activity</label>
                                        <select 
                                            className="form-select text-white" 
                                            id="activityType" 
                                            value={activityType} 
                                            onChange={(e) => setActivityType(e.target.value)}
                                            required
                                            style={{ background: '#242424', border: '1px solid #444' }}
                                        >
                                            <option value="Add" className="text-white bg-dark">Add to Inventory</option>
                                            <option value="Consume" className="text-white bg-dark">Consume (Feed Digester)</option>
                                        </select>
                                    </div>
                                    {message && (
                                        <div className={`alert mt-3 small text-white ${message.includes('❌') ? 'alert-danger' : 'alert-success'}`}>
                                            {message}
                                        </div>
                                    )}
                                    <button type="submit" className="btn btn-primary w-100 mt-2">Record Transaction</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Inventory Chart */}
                <div className="col-lg-6 mb-4">
                    <div className="card-custom p-4 h-100" style={{ background: '#1a1a1a', border: '1px solid #333', borderRadius: '16px' }}>
                        <h5 className="text-white mb-3"><i className="fas fa-warehouse me-2"></i> Current Feedstock Inventory (kg)</h5>
                        <div style={{ height: '350px' }}><canvas ref={stockCanvasRef} id="stockChart"></canvas></div>
                    </div>
                </div>

                {/* Transaction History */}
                <div className="col-12">
                    <div className="card-custom p-4" style={{ background: '#1a1a1a', border: '1px solid #333', borderRadius: '16px' }}>
                        <h5 className="text-white mb-3">Transaction History</h5>
                        <div>
                            {loading ? (
                                <p className="text-info">Loading transaction history...</p>
                            ) : (
                                <div className="table-responsive" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                                    <table className="table table-dark table-striped table-sm small">
                                        <thead>
                                            <tr>
                                                <th className="text-light">Date/Time</th>
                                                <th className="text-light">Action</th>
                                                <th className="text-light">Material</th>
                                                <th className="text-light text-end">Quantity (kg)</th>
                                                <th className="text-light">User</th>
                                                <th className="text-light">Delete</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {activityLog.length === 0 ? (
                                                <tr><td colSpan="6" className="text-center text-muted">No transactions recorded.</td></tr>
                                            ) : (
                                                activityLog.map(log => (
                                                    <tr key={log.id}>
                                                        <td className="text-light">{log.date}</td>
                                                        <td className={log.action === 'Add' ? 'text-success' : 'text-danger'}>{log.action}</td>
                                                        <td className="text-light">{log.type}</td>
                                                        <td className="text-light text-end">{log.quantity.toFixed(1)}</td>
                                                        <td className="text-muted">{log.user}</td>
                                                        <td>
                                                            <button 
                                                                className="btn btn-sm btn-outline-danger py-0 px-2"
                                                                onClick={() => handleDeleteLog(log.id, log.action, log.type, log.quantity)}
                                                                title="Delete Transaction"
                                                            >
                                                                <i className="fas fa-times"></i>
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Agrowaste;