"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { ArrowLeft, Home, Search, Package } from "lucide-react";

export default function NotFound() {
  const router = useRouter();
  const currentPath = usePathname();
  const isTracking = currentPath?.includes("track") || currentPath?.includes("awb");
  const isAuth = currentPath?.includes("login") || currentPath?.includes("sign");

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4">
      <div className="w-full max-w-lg border border-gray-200 rounded-xl shadow-sm p-8">
        <div className="flex items-center justify-between mb-8">
          <Link href="/" className="flex flex-col leading-none">
            <span className="font-[family-name:var(--font-caveat-brush)] text-3xl text-[#E11D2A]">Airpak<sup className="text-xs align-super">®</sup></span>
            <span className="text-xs font-semibold tracking-wide text-gray-800 mt-0.5">Airpak Express</span>
          </Link>
        </div>
        
        <div className="text-center space-y-4 mb-8">
          <div className="text-6xl font-bold text-gray-300">404</div>
          <h1 className="text-2xl font-bold text-gray-900">Page not found</h1>
          <p className="text-gray-600">
            We couldn&apos;t find the page you were looking for. 
            The page may have moved or been removed.
          </p>
        </div>
        
        <div className="space-y-3">
          <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
            Popular destinations
          </h2>
          
          <div className="grid gap-2">
            {isTracking && (
              <button 
                onClick={() => router.push("/tracking")}
                className="flex items-center gap-3 w-full p-3 border border-gray-200 rounded-lg hover:border-[#E11D2A] hover:shadow-sm transition-all text-left"
              >
                <Search className="h-5 w-5 text-[#E11D2A]" />
                <div>
                  <p className="font-medium text-gray-900">Track a Shipment</p>
                  <p className="text-xs text-gray-500">Enter your AWB number</p>
                </div>
              </button>
            )}
            
            <button 
              onClick={() => router.push("/")}
              className="flex items-center gap-3 w-full p-3 border border-gray-200 rounded-lg hover:border-[#E11D2A] hover:shadow-sm transition-all text-left"
            >
              <Home className="h-5 w-5 text-[#E11D2A]" />
              <div>
                <p className="font-medium text-gray-900">Homepage</p>
                <p className="text-xs text-gray-500">Return to Airpak Express</p>
              </div>
            </button>
            
            <button 
              onClick={() => router.push("/services")}
              className="flex items-center gap-3 w-full p-3 border border-gray-200 rounded-lg hover:border-[#E11D2A] hover:shadow-sm transition-all text-left"
            >
              <Package className="h-5 w-5 text-[#E11D2A]" />
              <div>
                <p className="font-medium text-gray-900">Our Services</p>
                <p className="text-xs text-gray-500">View shipping options</p>
              </div>
            </button>
            
            {isAuth && (
              <button 
                onClick={() => router.push("/signin")}
                className="flex items-center gap-3 w-full p-3 border border-gray-200 rounded-lg hover:border-[#E11D2A] hover:shadow-sm transition-all text-left"
              >
                <ArrowLeft className="h-5 w-5 text-[#E11D2A]" />
                <div>
                  <p className="font-medium text-gray-900">Sign In</p>
                  <p className="text-xs text-gray-500">Access your account</p>
                </div>
              </button>
            )}
          </div>
        </div>
        
        <div className="text-center text-sm text-gray-500 mt-8">
          <p>Need help? <Link href="/contact" className="text-[#E11D2A] hover:underline">Contact support</Link></p>
        </div>
      </div>
    </div>
  );
}
