import React, { useState, useEffect } from 'react';
import { Shield, User, Key, CheckCircle, AlertOctagon, RefreshCw, Plus } from 'lucide-react';

const Settings = () => {
  // Identity Profile State
  const [profile, setProfile] = useState({ displayName: '', username: '', email: '', bio: '' });
  const [profileStatus, setProfileStatus] = useState({ state: 'idle', message: '' });
  // Password State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passStatus, setPassStatus] = useState({ state: 'idle', message: '' }); // idle, loading, success, error

  // 2FA State
  const [qrCode, setQrCode] = useState(null);
  const [mfaCode, setMfaCode] = useState('');
  const [mfaStatus, setMfaStatus] = useState({ state: 'idle', message: '' }); // idle, setting_up, verifying, success

  const token = localStorage.getItem('finedgeToken');

  useEffect(() => {
    if (!token) return;
    const fetchProfile = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/user/profile`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (res.ok) {
           setProfile({ 
              displayName: data.displayName || '', 
              username: data.username || '', 
              email: data.email || '', 
              bio: data.bio || '' 
           });
        }
      } catch (err) {}
    };
    fetchProfile();
  }, [token]);

  const handleProfileUpdate = async (e) => {
     e.preventDefault();
     setProfileStatus({ state: 'loading', message: '' });
     try {
        const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/user/profile`, {
           method: 'PUT',
           headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
           body: JSON.stringify(profile)
        });
        const data = await res.json();
        if (res.ok) {
           if (data.user) {
               setProfile({
                  displayName: data.user.displayName || '',
                  username: data.user.username || '',
                  email: data.user.email || '',
                  bio: data.user.bio || ''
               });
           }
           setProfileStatus({ state: 'success', message: 'Profile updated successfully!' });
           setTimeout(() => setProfileStatus({ state: 'idle', message: '' }), 5000);
        } else {
           setProfileStatus({ state: 'error', message: data.error || 'Profile update failed.' });
        }
     } catch (error) {
        setProfileStatus({ state: 'error', message: 'Network error updating profile.' });
     }
  };

  // Security: Form Change Password
  const handlePasswordChange = async (e) => {
     e.preventDefault();
     setPassStatus({ state: 'loading', message: '' });

     try {
        const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/change-password`, {
           method: 'POST',
           headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
           body: JSON.stringify({ currentPassword, newPassword })
        });
        const data = await res.json();

        if (res.ok) {
           setPassStatus({ state: 'success', message: 'Master Password successfully rotated.' });
           setCurrentPassword('');
           setNewPassword('');
        } else {
           setPassStatus({ state: 'error', message: data.error || 'Password rotation failed.' });
        }
     } catch (error) {
        setPassStatus({ state: 'error', message: 'Network error during execution.' });
     }
  };

  // Security: Trigger 2FA Backend Setup
  const handleEnable2FA = async () => {
     setMfaStatus({ state: 'loading', message: '' });
     try {
        const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/2fa/setup`, {
           method: 'POST',
           headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();

        if (res.ok) {
           setQrCode(data.qrCode);
           setMfaStatus({ state: 'setting_up', message: 'Scan the QR code with an Authenticator.' });
        } else {
           setMfaStatus({ state: 'error', message: data.error || 'Failed to initialize 2FA.' });
        }
     } catch(err) {
        setMfaStatus({ state: 'error', message: 'Network error initializing 2FA.' });
     }
  };

  // Security: Verify 2FA OTP
  const handleVerify2FA = async (e) => {
     e.preventDefault();
     if (!mfaCode) return;
     
     setMfaStatus({ state: 'verifying', message: '' });
     try {
        const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/2fa/verify-setup`, {
           method: 'POST',
           headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
           body: JSON.stringify({ token: mfaCode })
        });
        const data = await res.json();

        if (res.ok) {
           setMfaStatus({ state: 'success', message: 'Two-Factor Authentication is officially locked.' });
           setQrCode(null);
        } else {
           setMfaStatus({ state: 'error', message: data.error || 'Invalid OTP code. Try again.' });
        }
     } catch(err) {
        setMfaStatus({ state: 'error', message: 'Network error verifying 2FA.' });
     }
  };

  return (
    <div className="p-6 md:p-12 min-h-screen text-white/90 pb-24 space-y-12 relative overflow-hidden">
      
      {/* Massive Header Section */}
      <div className="relative mb-12">
        <div className="absolute -top-32 -left-32 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[150px] pointer-events-none"></div>
        <div className="relative z-10 space-y-4">
          <h1 className="text-6xl md:text-[5rem] font-black tracking-tighter bg-gradient-to-br from-white via-white to-gray-500 bg-clip-text text-transparent drop-shadow-2xl">
            Settings.
          </h1>
          <p className="text-xl md:text-2xl text-gray-400 font-medium tracking-wide">
            Manage your operational identity and platform security.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
         
         {/* Left Column (Identity Profile - Mocked Data) */}
         <div className="xl:col-span-7 space-y-10">
            <div className="bg-[#0D0D0E] border border-white/5 rounded-[3rem] p-8 md:p-12 relative overflow-hidden shadow-2xl">
               <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] pointer-events-none"></div>
               
               <div className="flex items-center gap-6 mb-10 relative z-10">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-[1.5rem] flex items-center justify-center border border-white/10 shadow-[0_0_30px_rgba(59,130,246,0.3)]">
                     <User className="w-10 h-10 text-white" />
                  </div>
                  <div>
                     <h2 className="text-3xl font-black text-white">Public Identity</h2>
                     <p className="text-gray-400 font-bold">Update your platform persona</p>
                  </div>
               </div>

               <form onSubmit={handleProfileUpdate} className="space-y-8 relative z-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <div className="space-y-3 group">
                        <label className="text-sm font-bold text-gray-400 uppercase tracking-widest pl-2 transition-colors group-focus-within:text-blue-400">Display Name</label>
                        <input type="text" value={profile.displayName} onChange={(e) => setProfile({ ...profile, displayName: e.target.value })} placeholder="John Doe" className="w-full bg-[#111113] border-2 border-white/5 focus:border-blue-500/50 rounded-2xl py-4 px-6 text-xl font-bold text-white outline-none transition-all" />
                     </div>
                     <div className="space-y-3 group">
                        <label className="text-sm font-bold text-gray-400 uppercase tracking-widest pl-2 transition-colors group-focus-within:text-blue-400">Username</label>
                        <input type="text" value={profile.username} onChange={(e) => setProfile({ ...profile, username: e.target.value })} placeholder="@johndoe_fin" className="w-full bg-[#111113] border-2 border-white/5 focus:border-blue-500/50 rounded-2xl py-4 px-6 text-xl font-bold text-white outline-none transition-all" />
                     </div>
                  </div>
                  
                  <div className="space-y-3 group">
                     <label className="text-sm font-bold text-gray-400 uppercase tracking-widest pl-2 transition-colors group-focus-within:text-blue-400">Primary Email</label>
                     <input type="email" value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} placeholder="johndoe@example.com" className="w-full bg-[#111113] border-2 border-white/5 focus:border-blue-500/50 rounded-2xl py-4 px-6 text-xl font-bold text-white outline-none transition-all" />
                  </div>

                  <div className="space-y-3 group">
                     <label className="text-sm font-bold text-gray-400 uppercase tracking-widest pl-2 transition-colors group-focus-within:text-blue-400">Personal Bio</label>
                     <textarea rows="3" value={profile.bio} onChange={(e) => setProfile({ ...profile, bio: e.target.value })} placeholder="Long-term cryptocurrency holder & equities manager." className="w-full bg-[#111113] border-2 border-white/5 focus:border-blue-500/50 rounded-2xl py-4 px-6 text-xl font-bold text-white outline-none transition-all resize-none"></textarea>
                  </div>

                  {profileStatus.state !== 'idle' && profileStatus.state !== 'loading' && (
                     <div className={`p-4 rounded-xl border font-bold text-sm flex items-start gap-3 ${profileStatus.state === 'error' ? 'bg-red-500/10 border-red-500/30 text-red-400' : 'bg-green-500/10 border-green-500/30 text-green-400'}`}>
                        {profileStatus.state === 'error' ? <AlertOctagon className="w-5 h-5 shrink-0" /> : <CheckCircle className="w-5 h-5 shrink-0" />}
                        <p>{profileStatus.message}</p>
                     </div>
                  )}

                  <div className="pt-4 flex justify-end">
                     <button type="submit" disabled={profileStatus.state === 'loading'} className="px-10 py-5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-2xl font-black text-xl transition-all shadow-[0_10px_30px_rgba(59,130,246,0.3)] hover:-translate-y-1 disabled:opacity-50">
                        {profileStatus.state === 'loading' ? 'Updating...' : 'Update Identity'}
                     </button>
                  </div>
               </form>
            </div>
         </div>

         {/* Right Column (Security Integrations - LIVE DATA) */}
         <div className="xl:col-span-5 space-y-10">
            
            {/* Password Rotation Block */}
            <div className="bg-[#0D0D0E] border border-white/5 rounded-[3rem] p-8 md:p-10 shadow-2xl relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-48 h-48 bg-purple-500/10 rounded-full blur-[80px] pointer-events-none group-hover:bg-purple-500/20 transition-colors"></div>
               
               <div className="flex items-center gap-4 mb-8 relative z-10">
                  <Key className="w-8 h-8 text-purple-400" />
                  <h2 className="text-3xl font-black text-white tracking-tight">Security Engine</h2>
               </div>

               <form onSubmit={handlePasswordChange} className="space-y-6 relative z-10">
                  <div className="space-y-2">
                     <label className="text-sm font-bold text-gray-500 uppercase tracking-widest pl-2">Current Hash</label>
                     <input type="password" required value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} placeholder="Enter current master password" className="w-full bg-black border border-white/10 focus:border-purple-500/50 rounded-2xl py-4 px-6 text-lg font-bold text-white outline-none transition-all" />
                  </div>
                  <div className="space-y-2">
                     <label className="text-sm font-bold text-gray-500 uppercase tracking-widest pl-2">New Hash</label>
                     <input type="password" required value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Uppercase, lowercase, number, symbol" className="w-full bg-black border border-white/10 focus:border-purple-500/50 rounded-2xl py-4 px-6 text-lg font-bold text-white outline-none transition-all" />
                  </div>

                  {passStatus.state !== 'idle' && passStatus.state !== 'loading' && (
                     <div className={`p-4 rounded-xl border font-bold text-sm flex items-start gap-3 ${passStatus.state === 'error' ? 'bg-red-500/10 border-red-500/30 text-red-400' : 'bg-green-500/10 border-green-500/30 text-green-400'}`}>
                        {passStatus.state === 'error' ? <AlertOctagon className="w-5 h-5 shrink-0" /> : <CheckCircle className="w-5 h-5 shrink-0" />}
                        <p>{passStatus.message}</p>
                     </div>
                  )}

                  <button type="submit" disabled={passStatus.state === 'loading'} className="w-full py-5 bg-white/5 hover:bg-purple-600/20 text-white rounded-2xl font-black text-lg transition-all border border-white/10 hover:border-purple-500/40 mt-4 disabled:opacity-50">
                     {passStatus.state === 'loading' ? 'Encrypting Payload...' : 'Rotate Master Password'}
                  </button>
               </form>
            </div>

            {/* 2FA Implementation Block */}
            <div className={`bg-[#0D0D0E] border relative rounded-[3rem] p-8 md:p-10 shadow-2xl overflow-hidden transition-colors duration-500 ${mfaStatus.state === 'success' ? 'border-green-500/30' : 'border-white/5'}`}>
               <div className={`absolute top-0 left-0 w-64 h-64 rounded-full blur-[100px] pointer-events-none transition-colors duration-1000 ${mfaStatus.state === 'success' ? 'bg-green-500/10' : 'bg-red-500/5'}`}></div>
               
               <div className="flex justify-between items-center mb-8 relative z-10">
                  <div className="flex items-center gap-4">
                     <Shield className={`w-8 h-8 ${mfaStatus.state === 'success' ? 'text-green-400' : 'text-red-500'}`} />
                     <h2 className="text-3xl font-black text-white tracking-tight">2FA Guard</h2>
                  </div>
                  {mfaStatus.state === 'success' && (
                     <span className="px-4 py-1 bg-green-500/20 text-green-400 font-bold text-sm rounded-lg border border-green-500/30">LOCKED</span>
                  )}
               </div>

               <div className="relative z-10">
                  {mfaStatus.state === 'idle' || mfaStatus.state === 'error' ? (
                     <>
                        <p className="text-gray-400 font-medium mb-8">Your account currently lacks external hardware verification. Deploy a Time-Based One-Time Password (TOTP) seed to physically lock your withdrawals.</p>
                        
                        {mfaStatus.state === 'error' && (
                           <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 font-bold text-sm flex items-start gap-3">
                              <AlertOctagon className="w-5 h-5 shrink-0" /> <p>{mfaStatus.message}</p>
                           </div>
                        )}

                        <button onClick={handleEnable2FA} className="w-full py-5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white border border-red-500/50 rounded-2xl font-black text-lg transition-all shadow-[0_10px_30px_rgba(239,68,68,0.2)] flex justify-center items-center gap-2 hover:-translate-y-1">
                           <Plus className="w-6 h-6" /> Initialize 2FA Protocol
                        </button>
                     </>
                  ) : mfaStatus.state === 'setting_up' || mfaStatus.state === 'verifying' ? (
                     <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <div className="bg-white p-4 rounded-2xl w-fit mx-auto border-4 border-purple-500 shadow-[0_0_40px_rgba(168,85,247,0.3)]">
                           {qrCode ? (
                              <img src={qrCode} alt="2FA QR Code" className="w-48 h-48 mx-auto" />
                           ) : (
                              <div className="w-48 h-48 flex items-center justify-center"><RefreshCw className="animate-spin text-purple-500 w-10 h-10" /></div>
                           )}
                        </div>
                        <p className="text-center font-bold text-gray-400">Scan this matrix using Google Authenticator or Authy to bind your device.</p>
                        
                        <form onSubmit={handleVerify2FA} className="mt-6 flex gap-4">
                           <input 
                              type="text" 
                              maxLength="6"
                              required
                              value={mfaCode}
                              onChange={(e) => setMfaCode(e.target.value.replace(/\D/g, ''))}
                              placeholder="000000" 
                              className="w-full bg-black border border-purple-500/30 focus:border-purple-500 rounded-2xl py-4 px-6 text-2xl tracking-[1em] text-center font-black text-white outline-none transition-all" 
                           />
                           <button type="submit" className="px-8 bg-purple-600 hover:bg-purple-500 text-white rounded-2xl font-black text-lg transition-all shadow-xl disabled:opacity-50">
                              Verify
                           </button>
                        </form>
                     </div>
                  ) : (
                     <div className="text-center py-6 animate-in fade-in zoom-in duration-500">
                        <CheckCircle className="w-20 h-20 text-green-400 mx-auto mb-6 drop-shadow-[0_0_20px_rgba(74,222,128,0.4)]" />
                        <h3 className="text-2xl font-black text-white mb-2">Hardware Binding Active</h3>
                        <p className="text-gray-400 font-medium">Your FinEdge sessions and large-volume transactions are now mathematically bound to your mobile device.</p>
                     </div>
                  )}
               </div>
            </div>

         </div>
      </div>
    </div>
  );
};

export default Settings;
