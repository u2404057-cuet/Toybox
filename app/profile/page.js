"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { toast } from 'react-hot-toast';

export default function ProfilePage() {
  const { user, isLoggedIn, isLoading } = useAuth();
  const router = useRouter();
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });

  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      router.push('/auth/login?redirect=/profile');
    }
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || ''
      });
    }
  }, [user, isLoggedIn, isLoading, router]);

  const handleSaveAccount = (e) => {
    e.preventDefault();
    toast.success('Account info saved!');
  };

  const handleSaveShipping = (e) => {
    e.preventDefault();
    toast.success('Shipping info saved!');
  };

  if (isLoading) return <div className="container mx-auto px-4 py-8 max-w-5xl">Loading...</div>;
  if (!isLoggedIn || !user) return null;

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 max-w-5xl">
      <h1 className="text-3xl font-black font-display text-cobalt mb-8">My Profile</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Account Info Card */}
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-border">
          <h2 className="text-xl font-bold font-display text-cobalt mb-6 pb-4 border-b border-border">
            Account Information
          </h2>
          <form onSubmit={handleSaveAccount} className="space-y-4">
            <Input 
              label="Full Name" 
              value={profileData.name} 
              onChange={(e) => setProfileData({...profileData, name: e.target.value})} 
            />
            <Input 
              label="Email Address" 
              value={profileData.email} 
              readOnly 
              className="opacity-70"
            />
            <Button type="submit" variant="secondary" className="w-full mt-4">
              Save Account Changes
            </Button>
          </form>
        </div>

        {/* Shipping Info Card */}
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-border">
          <h2 className="text-xl font-bold font-display text-cobalt mb-6 pb-4 border-b border-border">
            Shipping Information
          </h2>
          <form onSubmit={handleSaveShipping} className="space-y-4">
            <Input 
              label="Phone Number" 
              value={profileData.phone} 
              onChange={(e) => setProfileData({...profileData, phone: e.target.value})} 
            />
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-bold text-charcoal">Shipping Address</label>
              <textarea 
                value={profileData.address}
                onChange={(e) => setProfileData({...profileData, address: e.target.value})}
                rows={4}
                className="px-4 py-3 rounded-xl border border-border bg-white focus:outline-none focus:ring-2 focus:ring-cobalt/20 focus:border-cobalt transition-all resize-none"
              />
            </div>
            <Button type="submit" variant="secondary" className="w-full mt-4">
              Save Shipping Changes
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
