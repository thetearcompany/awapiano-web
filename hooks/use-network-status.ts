'use client'
import { useState } from "react"
import { useEffect } from "react"

// Detect network status
export function useNetworkStatus() {
    const [isOnline, setIsOnline] = useState(typeof navigator !== "undefined" ? navigator.onLine : true)

    useEffect(() => {
        const handleOnline = () => setIsOnline(true)
        const handleOffline = () => setIsOnline(false)

        window.addEventListener("online", handleOnline)
        window.addEventListener("offline", handleOffline)

        return () => {
            window.removeEventListener("online", handleOnline)
            window.removeEventListener("offline", handleOffline)
        }
    }, [])

    return isOnline
}