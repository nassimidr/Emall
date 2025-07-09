"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export default function ProfilePage() {
  const { user, getProfile, logout } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      getProfile().finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
    // eslint-disable-next-line
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Chargement du profil...</div>;
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <p className="mb-4 text-lg">Vous n'êtes pas connecté.</p>
        <Button onClick={() => (window.location.href = "/login")}>Se connecter</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 w-full max-w-md flex flex-col items-center">
        <Avatar className="w-24 h-24 mb-4">
          <AvatarImage src={"/placeholder-user.jpg"} alt={user.fullName} />
          <AvatarFallback>{user.fullName?.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
        <h2 className="text-2xl font-semibold mb-2">{user.fullName}</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-1">{user.email}</p>
        <p className="text-gray-500 dark:text-gray-400 mb-4">Rôle : {user.role}</p>
        <Button variant="outline" onClick={logout} className="w-full">Se déconnecter</Button>
      </div>
    </div>
  );
} 