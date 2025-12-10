import React, { useState, useEffect } from 'react';
import { doc, onSnapshot, setDoc } from 'firebase/firestore'; 
import { updateProfile, EmailAuthProvider, reauthenticateWithCredential, updatePassword } from 'firebase/auth'; 
import { db, auth } from '../firebase'; 
import { useAuth } from '../context/AuthContext'; // I-assume na mayroong AuthContext

// --- FIREBASE REFERENCES (Firestore) ---
const SETTINGS_DOC_REF = doc(db, 'system_settings', 'calibration');

const INITIAL_SETTINGS = {
    max_temp: 40.0,
    min_level: 40.0,
    max_level: 90.0,
    min_power_kW: 0.5,
    alert_gas_ppm: 800,
};

const INITIAL_PROFILE = {
    displayName: '',
    email: '',
    role: 'Loading...',
    phone: '',
    uid: '',
};

const Settings = () => {
    const { currentUser } = useAuth();
    const userId = currentUser ? currentUser.uid : null;

    // State for System Settings
    const [localSettings, setLocalSettings] = useState(INITIAL_SETTINGS);
    const [isSavingSettings, setIsSavingSettings] = useState(false);
    const [settingsMessage, setSettingsMessage] = useState('');
    
    // State for User Profile
    const [localProfile, setLocalProfile] = useState(INITIAL_PROFILE);
    const [isSavingProfile, setIsSavingProfile] = useState(false);
    const [profileMessage, setProfileMessage] = useState('');

    // State for Password Change
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [passwordMessage, setPasswordMessage] = useState('');


    // --- 1. System Settings Listener (READ) ---
    useEffect(() => {
        const unsubscribeSettings = onSnapshot(SETTINGS_DOC_REF, (docSnap) => {
            if (docSnap.exists()) {
                setLocalSettings(docSnap.data());
            } else {
                // Kung walang settings, i-set ang default values (CREATE)
                setDoc(SETTINGS_DOC_REF, INITIAL_SETTINGS).then(() => console.log("Default settings set."));
            }
        }, (error) => {
            console.error("Error reading settings:", error);
            setSettingsMessage(`❌ Error loading settings: ${error.message}`);
        });

        return () => unsubscribeSettings();
    }, []);

    // --- 2. User Profile Listener (READ) ---
    useEffect(() => {
        if (currentUser) {
            setLocalProfile({
                displayName: currentUser.displayName || 'N/A',
                email: currentUser.email || 'N/A',
                role: 'Admin', // Mock role for now
                phone: currentUser.phone || 'N/A',
                uid: currentUser.uid,
            });
        }
    }, [currentUser]);


    // --- 3. Save Settings Function (UPDATE) ---
    const handleSaveSettings = async (e) => {
        e.preventDefault();
        setIsSavingSettings(true);
        setSettingsMessage('');
        try {
            // Update ang Firestore document
            await setDoc(SETTINGS_DOC_REF, localSettings); 
            setSettingsMessage("✅ System settings successfully updated.");
        } catch (error) {
            console.error("Error saving settings:", error);
            setSettingsMessage(`❌ Error saving settings: ${error.message}`);
        } finally {
            setIsSavingSettings(false);
        }
    };
    
    // --- 4. Save Profile Function (UPDATE) ---
    const handleSaveProfile = async (e) => {
        e.preventDefault();
        setIsSavingProfile(true);
        setProfileMessage('');
        try {
            // Update ang Auth user profile
            await updateProfile(auth.currentUser, {
                displayName: localProfile.displayName,
                // photoURL: localProfile.photoURL, // Kung may photo
            });
            setProfileMessage("✅ Profile successfully updated.");
        } catch (error) {
            console.error("Error saving profile:", error);
            setProfileMessage(`❌ Error saving profile: ${error.message}`);
        } finally {
            setIsSavingProfile(false);
        }
    };
    
    // --- 5. Change Password Function (UPDATE) ---
    const handleChangePassword = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmNewPassword) {
            setPasswordMessage("❌ New passwords do not match.");
            return;
        }
        if (newPassword.length < 6) {
            setPasswordMessage("❌ Password must be at least 6 characters long.");
            return;
        }

        setIsChangingPassword(true);
        setPasswordMessage('');

        try {
            const credential = EmailAuthProvider.credential(
                currentUser.email,
                currentPassword
            );
            
            // Re-authenticate user
            await reauthenticateWithCredential(currentUser, credential);
            
            // Update the password
            await updatePassword(currentUser, newPassword);
            
            setPasswordMessage("✅ Password successfully changed!");
            setCurrentPassword('');
            setNewPassword('');
            setConfirmNewPassword('');
        } catch (error) {
            console.error("Error changing password:", error);
            let errorMessage = "❌ Error changing password. Please check your current password.";
            if (error.code === 'auth/wrong-password') {
                errorMessage = "❌ Current password is incorrect.";
            }
            setPasswordMessage(errorMessage);
        } finally {
            setIsChangingPassword(false);
        }
    };


    return (
        <div className="container-fluid py-4">
            <h2 className="text-white mb-4"><i className="fas fa-cog me-3"></i> System Settings</h2>
            <div className="row">
                
                {/* 1. System Settings */}
                <div className="col-lg-4 mb-4">
                    <div className="card-custom p-4 h-100" style={{ background: '#1a1a1a', border: '1px solid #333', borderRadius: '16px' }}>
                        <h5 className="text-white mb-3">Calibration & Alerts</h5>
                        <form onSubmit={handleSaveSettings}>
                            {/* Max Temperature */}
                            <div className="mb-3">
                                <label htmlFor="maxTemp" className="form-label small">Max Temp Alert (°C)</label>
                                <input 
                                    type="number" 
                                    className="form-control" 
                                    id="maxTemp" 
                                    value={localSettings.max_temp}
                                    onChange={(e) => setLocalSettings({...localSettings, max_temp: parseFloat(e.target.value)})}
                                    step="0.1"
                                    required
                                    style={{ background: '#242424', border: '1px solid #444', color: '#fff' }}
                                />
                            </div>

                            {/* Alert Gas PPM */}
                            <div className="mb-3">
                                <label htmlFor="alertGasPPM" className="form-label small">Alert Gas (ppm)</label>
                                <input 
                                    type="number" 
                                    className="form-control" 
                                    id="alertGasPPM" 
                                    value={localSettings.alert_gas_ppm}
                                    onChange={(e) => setLocalSettings({...localSettings, alert_gas_ppm: parseInt(e.target.value)})}
                                    required
                                    style={{ background: '#242424', border: '1px solid #444', color: '#fff' }}
                                />
                            </div>
                            
                            {/* Min Power kW */}
                            <div className="mb-3">
                                <label htmlFor="minPowerKW" className="form-label small">Min Power Target (kW)</label>
                                <input 
                                    type="number" 
                                    className="form-control" 
                                    id="minPowerKW" 
                                    value={localSettings.min_power_kW}
                                    onChange={(e) => setLocalSettings({...localSettings, min_power_kW: parseFloat(e.target.value)})}
                                    step="0.1"
                                    required
                                    style={{ background: '#242424', border: '1px solid #444', color: '#fff' }}
                                />
                            </div>
                            
                            {settingsMessage && (
                                <div className={`alert mt-3 small text-white ${settingsMessage.includes('❌') ? 'alert-danger' : 'alert-success'}`}>
                                    {settingsMessage}
                                </div>
                            )}

                            <button type="submit" className="btn btn-primary w-100 mt-3" disabled={isSavingSettings}>
                                <i className={`fas ${isSavingSettings ? 'fa-spinner fa-spin' : 'fa-save'} me-2`}></i> 
                                {isSavingSettings ? 'Saving...' : 'Save System Settings'}
                            </button>
                        </form>
                    </div>
                </div>

                {/* 2. User Profile */}
                <div className="col-lg-4 mb-4">
                    <div className="card-custom p-4 h-100" style={{ background: '#1a1a1a', border: '1px solid #333', borderRadius: '16px' }}>
                        <h5 className="text-white mb-3">User Profile</h5>
                        <form onSubmit={handleSaveProfile}>
                            {/* Display Name */}
                            <div className="mb-3">
                                <label htmlFor="displayName" className="form-label small">Display Name</label>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    id="displayName" 
                                    value={localProfile.displayName}
                                    onChange={(e) => setLocalProfile({...localProfile, displayName: e.target.value})}
                                    required
                                    style={{ background: '#242424', border: '1px solid #444', color: '#fff' }}
                                />
                            </div>

                            {/* Email (Read-Only) */}
                            <div className="mb-3">
                                <label htmlFor="email" className="form-label small">Email</label>
                                <input 
                                    type="email" 
                                    className="form-control" 
                                    id="email" 
                                    value={localProfile.email}
                                    readOnly 
                                    style={{ background: '#3a3a3a', border: '1px solid #444', color: '#888' }}
                                />
                            </div>
                            
                            {/* Role (Read-Only) */}
                            <div className="mb-3">
                                <label htmlFor="role" className="form-label small">Role</label>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    id="role" 
                                    value={localProfile.role}
                                    readOnly 
                                    style={{ background: '#3a3a3a', border: '1px solid #444', color: '#888' }}
                                />
                            </div>

                            {profileMessage && (
                                <div className={`alert mt-3 small text-white ${profileMessage.includes('❌') ? 'alert-danger' : 'alert-success'}`}>
                                    {profileMessage}
                                </div>
                            )}

                            <button type="submit" className="btn btn-primary w-100 mt-3" disabled={isSavingProfile}>
                                <i className={`fas ${isSavingProfile ? 'fa-spinner fa-spin' : 'fa-user-edit'} me-2`}></i> 
                                {isSavingProfile ? 'Saving Profile...' : 'Save Profile Changes'}
                            </button>
                        </form>
                    </div>
                </div>

                {/* 3. Password Change */}
                <div className="col-lg-4 mb-4">
                    <div className="card-custom p-4 h-100" style={{ background: '#1a1a1a', border: '1px solid #333', borderRadius: '16px' }}>
                        <h5 className="text-white mb-3">Change Password</h5>
                        <form onSubmit={handleChangePassword}>
                            {/* Current Password */}
                            <div className="mb-3">
                                <label htmlFor="currentPassword" className="form-label small">Current Password</label>
                                <input 
                                    type="password" 
                                    className="form-control" 
                                    id="currentPassword"
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    required
                                    style={{ background: '#242424', border: '1px solid #444', color: '#fff' }}
                                />
                            </div>

                            {/* New Password */}
                            <div className="mb-3">
                                <label htmlFor="newPassword" className="form-label small">New Password (min 6 chars)</label>
                                <input 
                                    type="password" 
                                    className="form-control" 
                                    id="newPassword"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    required
                                    style={{ background: '#242424', border: '1px solid #444', color: '#fff' }}
                                />
                            </div>

                            {/* Confirm New Password */}
                            <div className="mb-3">
                                <label htmlFor="confirmNewPassword" className="form-label small">Confirm New Password</label>
                                <input 
                                    type="password" 
                                    className="form-control" 
                                    id="confirmNewPassword"
                                    value={confirmNewPassword}
                                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                                    required
                                    style={{ background: '#242424', border: '1px solid #444', color: '#fff' }}
                                />
                            </div>
                            
                            {passwordMessage && (
                                <div className={`alert mt-3 small text-white ${passwordMessage.includes('❌') ? 'alert-danger' : 'alert-success'}`}>
                                    {passwordMessage}
                                </div>
                            )}

                            <button type="submit" className="btn btn-danger w-100 mt-3" disabled={isChangingPassword}>
                                <i className={`fas ${isChangingPassword ? 'fa-spinner fa-spin' : 'fa-key'} me-2`}></i> 
                                {isChangingPassword ? 'Changing Password...' : 'Confirm Change Password'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;