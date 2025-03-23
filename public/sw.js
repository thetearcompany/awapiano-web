// Service Worker for offline support

const CACHE_NAME = "amapiano-fm-cache-v1"
const OFFLINE_URL = "/offline.html"

// Assets to cache on install
const ASSETS_TO_CACHE = [
  "/",
  "/offline.html",
  "/favicon.ico",
  "/manifest.json",
  "/logo192.png",
  "/logo512.png",
  "/static/css/main.css",
  "/static/js/main.js",
]

// Install event - cache assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Opened cache")
      return cache.addAll(ASSETS_TO_CACHE)
    }),
  )
  // Activate immediately
  self.skipWaiting()
})

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log("Deleting old cache:", cacheName)
            return caches.delete(cacheName)
          }
        }),
      )
    }),
  )
  // Claim clients immediately
  self.clients.claim()
})

// Fetch event - serve from cache or network
self.addEventListener("fetch", (event) => {
  // Skip non-GET requests
  if (event.request.method !== "GET") return

  // Skip browser extensions and chrome-extension requests
  if (event.request.url.startsWith("chrome-extension://")) return

  // Handle API requests differently
  if (event.request.url.includes("/api/")) {
    handleApiRequest(event)
    return
  }

  // Handle navigation requests
  if (event.request.mode === "navigate") {
    handleNavigationRequest(event)
    return
  }

  // Handle asset requests
  handleAssetRequest(event)
})

// Handle API requests - network first, then cache
function handleApiRequest(event) {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Clone the response to store in cache
        const clonedResponse = response.clone()

        // Open cache and store response
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, clonedResponse)
        })

        return response
      })
      .catch(() => {
        // If network fails, try to get from cache
        return caches.match(event.request)
      }),
  )
}

// Handle navigation requests - network first, then offline page
function handleNavigationRequest(event) {
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(OFFLINE_URL)
    }),
  )
}

// Handle asset requests - cache first, then network
function handleAssetRequest(event) {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Return cached response if found
      if (response) {
        return response
      }

      // Otherwise fetch from network
      return fetch(event.request).then((response) => {
        // Clone the response to store in cache
        const clonedResponse = response.clone()

        // Open cache and store response for future
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, clonedResponse)
        })

        return response
      })
    }),
  )
}

// Background sync for offline actions
self.addEventListener("sync", (event) => {
  if (event.tag === "sync-posts") {
    event.waitUntil(syncPosts())
  } else if (event.tag === "sync-likes") {
    event.waitUntil(syncLikes())
  } else if (event.tag === "sync-comments") {
    event.waitUntil(syncComments())
  }
})

// Sync posts that were created offline
async function syncPosts() {
  const db = await openDB()
  const offlinePosts = await db.getAll("offlinePosts")

  for (const post of offlinePosts) {
    try {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(post),
      })

      if (response.ok) {
        await db.delete("offlinePosts", post.id)
      }
    } catch (error) {
      console.error("Failed to sync post:", error)
    }
  }
}

// Sync likes that were created offline
async function syncLikes() {
  const db = await openDB()
  const offlineLikes = await db.getAll("offlineLikes")

  for (const like of offlineLikes) {
    try {
      const response = await fetch(`/api/posts/${like.postId}/like`, {
        method: "POST",
      })

      if (response.ok) {
        await db.delete("offlineLikes", like.id)
      }
    } catch (error) {
      console.error("Failed to sync like:", error)
    }
  }
}

// Sync comments that were created offline
async function syncComments() {
  const db = await openDB()
  const offlineComments = await db.getAll("offlineComments")

  for (const comment of offlineComments) {
    try {
      const response = await fetch(`/api/posts/${comment.postId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: comment.content }),
      })

      if (response.ok) {
        await db.delete("offlineComments", comment.id)
      }
    } catch (error) {
      console.error("Failed to sync comment:", error)
    }
  }
}

// Open IndexedDB
function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("AmapianoFM", 1)

    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result)

    request.onupgradeneeded = (event) => {
      const db = event.target.result

      // Create object stores for offline data
      if (!db.objectStoreNames.contains("offlinePosts")) {
        db.createObjectStore("offlinePosts", { keyPath: "id" })
      }

      if (!db.objectStoreNames.contains("offlineLikes")) {
        db.createObjectStore("offlineLikes", { keyPath: "id" })
      }

      if (!db.objectStoreNames.contains("offlineComments")) {
        db.createObjectStore("offlineComments", { keyPath: "id" })
      }
    }
  })
}

