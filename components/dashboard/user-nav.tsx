"use client";

import Link from "next/link";
import Image from "next/image";
import { User } from "@/lib/types";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface UserNavProps {
  user: User;
}

export function UserNav({ user }: UserNavProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleSignOut = async () => {
    setIsLoading(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/auth/login");
    setIsLoading(false);
  };

  const initials = user.full_name
    ? user.full_name.split(" ").map(n => n[0]).join("").toUpperCase()
    : (user.email[0] || "U").toUpperCase();

  return (
    <div style={{position: 'relative'}}>
      <div 
        className="user-avatar"
        onClick={() => setShowDropdown(!showDropdown)}
        style={{
          cursor: 'pointer',
          backgroundColor: 'var(--primary-blue)',
          color: 'white',
          width: '30px',
          height: '30px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 'bold',
          fontSize: '12px'
        }}
      >
        {user.avatar_url ? (
          <Image 
            src={user.avatar_url} 
            alt={user.full_name || user.email}
            width={30}
            height={30}
            style={{
              borderRadius: '50%',
              objectFit: 'cover'
            }}
          />
        ) : (
          initials
        )}
      </div>
      
      {showDropdown && (
        <div style={{
          position: 'absolute',
          top: '40px',
          right: '0',
          backgroundColor: 'var(--bg-content)',
          border: '1px solid var(--border-color)',
          borderRadius: '8px',
          padding: '10px',
          minWidth: '200px',
          zIndex: 1000,
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
        }}>
          <div style={{
            padding: '10px',
            borderBottom: '1px solid var(--border-color)',
            marginBottom: '10px'
          }}>
            <div style={{
              color: 'var(--text-primary)',
              fontWeight: '500',
              marginBottom: '5px'
            }}>
              {user.full_name || "Anonymous"}
            </div>
            <div style={{
              color: 'var(--text-secondary)',
              fontSize: '12px'
            }}>
              {user.email}
            </div>
            {user.role === 'admin' && (
              <div style={{
                backgroundColor: 'var(--primary-blue)',
                color: 'white',
                fontSize: '10px',
                padding: '2px 6px',
                borderRadius: '4px',
                marginTop: '5px',
                display: 'inline-block'
              }}>
                Administrator
              </div>
            )}
          </div>
          
          <div style={{display: 'flex', flexDirection: 'column', gap: '5px'}}>
            <Link 
              href="/dashboard/profile" 
              style={{
                color: 'var(--text-primary)',
                textDecoration: 'none',
                padding: '8px',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-sidebar)'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              👤 Profile
            </Link>
            
            <Link 
              href="/dashboard/settings" 
              style={{
                color: 'var(--text-primary)',
                textDecoration: 'none',
                padding: '8px',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-sidebar)'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              ⚙️ Settings
            </Link>
            
            <button
              onClick={handleSignOut}
              disabled={isLoading}
              style={{
                color: 'var(--text-primary)',
                backgroundColor: 'transparent',
                border: 'none',
                padding: '8px',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                width: '100%',
                textAlign: 'left'
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-sidebar)'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              🚪 {isLoading ? "Signing out..." : "Sign out"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 