const CACHE_NAME = 'WEATHER_APP_CACHE_V1';

const cacheAssets = [
    'index.html',
    'styles/index.css',
    'scripts/index.js'
    // 'assets\android-chrome-192x192.png',
    // 'assets\android-chrome-512x512.png',
    // 'assets\apple-touch-icon.png',
    // 'assets\browserconfig.xml'
]

// Install the service worker (this is where you actually cache the assets)
self.addEventListener('install', (installer) => {
    console.log('Service Worker: Installed')
    
    const done = async () => {
        // Get the cache instance which return the cache based on the name of the cache(CACHE_NAME)
        const cache = await caches.open(CACHE_NAME);
         // get the cache of the specified CACHE_NAME and add some assets into it
        return cache.addAll(cacheAssets);
    }
    // When everything has been completed, do this:
    installer.waitUntil(done());
})


// Activate the service worker (and delete any unused caches)
self.addEventListener('activate', (activator) => {
    const done = async () => {
        const cacheNames = await caches.keys();
        return Promise.all(cacheNames.map(cache => {
            if(cache !== CACHE_NAME) {
                return caches.delete(cache);
            }
        }))
    }

    activator.waitUntil(done())
})

// // On fetch, intercept the network and get the request from the cache
self.addEventListener('fetch', (fetchEvent) => {

    const url = fetchEvent.request.url;
    console.log('Fetching ' + url)

    const getResponse = async (request) => {
        let response;
        
        // Check the cache for a match for the request.
        response = await caches.match(request);
        if(response && response.status === 200) {
            // If there is, return that match as the response
            return response;
        }

        try {
            // If there's no match for the request in the cache...
            // Make a fetch request using the fetch API
            response = await fetch(request);
            if(response && response.status === 404) {
                // Return a 404 page if the response has a 404 status
                const notFountPage = await caches.match('/404.html')
                return notFountPage;
            }
        }
        catch(error) {
            // Return an offline page if the fetch request is not made
            console.log(error)
            response = await caches.match('/offline.html');
            return response;
        }   

        // Having fetched the request, clone the response gotten back
        const clone = response.clone();
        // Open the cache, 
        const cache = await caches.open(CACHE_NAME);
        // Add a clone of the response into the cache...
        await cache.put(url, clone);
        // before finally returning the response
        return response;
    }

    fetchEvent.respondWith(getResponse(fetchEvent.request))

})