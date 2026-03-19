import { useEffect, useRef, useState } from "react";

function RadarCard({city, setCity}){
    //Assume that this card hasn't been rerendered.
    const didInit = useRef(false);
    const windyRef = useRef(null);
    const [lat, setLat] = useState(50.4);
    const [lon, setLon] = useState(14.3);

    //chi lat lon


    useEffect(() =>{
        if (didInit.current){
            return; //Don't re init the page
        }
        didInit.current = true;

        let cancelled = false;
        
        const options = {
            key: import.meta.env.VITE_WINDY_API, 
            verbose: true,
            lat: 50.4,
            lon: 14.3,
            zoom: 5,
        };

        // Initialize Windy API
       windyInit(options, windyAPI => {
            
            const { map } = windyAPI;
            windyRef.current = windyAPI;
            // .map is instance of Leaflet map

            L.popup()
                .setLatLng([lat, lon])
                .openOn(map);
        });

        return () => {
            cancelled = true;
        };
    },[]);

    //update the lat and long based on user input.
    useEffect(() => {
        if(!windyRef.current || !city){ return }
        console.log(city);
        console.log("City updated. Changing positioning.");

        async function loadData(){
            try{
                let res = await fetch(`http://localhost:8080/weather/getcoords/${city}`);
                let data = await res.json();
                if(!res.ok){ throw new Error(`HTTP ${res.status}`);}
                const nextLat = Number(data.lat);
                const nextLon = Number(data.lon);
                if(nextLat == null || nextLon == null){
                    throw new Error("API gave me wrong lat/lon");
                }

                setLat(nextLat);
                setLon(nextLon);

                windyRef.current.map.setView([nextLat, nextLon], 9);
            } catch(e){
                console.error(e.message);
            }
        }
        
        loadData();
    }, [city])
    
    return(
        <>
            <div className="border-4 border-gray-800 w-5/6 h-[700px] bg-gray-700 mx-auto text-white rounded-lg p-2">
                <div id="windy" className="w-full h-full"></div>
            </div>
        </>
    )
}

export default RadarCard;