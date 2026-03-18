import { useEffect } from "react";

function RadarCard(){

    useEffect(() =>{
        const key = (import.meta.env.VITE_WINDY_API || "").trim();
        console.log("Windy key loaded:", !!key, "Origin:", window.location.origin);
        const options = {
        // Required: API key
        key: import.meta.env.VITE_WINDY_API, // REPLACE WITH YOUR KEY !!!

        // Put additional console output
        verbose: true,

        // Optional: Initial state of the map
        lat: 50.4,
        lon: 14.3,
        zoom: 5,
        };

        // Initialize Windy API
       windyInit(options, windyAPI => {
            // windyAPI is ready, and contain 'map', 'store',
            // 'picker' and other usefull stuff

            const { map } = windyAPI;
            // .map is instance of Leaflet map

            L.popup()
                .setLatLng([50.4, 14.3])
                .setContent('Hello World')
                .openOn(map);
        });
    },[]);
    

    //Scripts are for the windy API that we are using.
    return(
        <>
            <div className="border-4 border-gray-800 w-3/6 h-[500px] bg-gray-700 mx-auto text-white rounded-lg p-2">
                <div id="windy" className="w-full h-full"></div>
            </div>
        </>
    )
}

export default RadarCard