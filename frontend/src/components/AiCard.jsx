import React, { useState, useEffect } from 'react';

import shirt from "../assets/shirt.png";
import jacket from "../assets/jacket.png";
import pants from "../assets/pants.png";
import hoodie from "../assets/hoodie.png";
import shorts from "../assets/shorts.png";
import shoes from "../assets/shoes.png";
import boots from "../assets/boots.png";


function AiCard({city}){

    const [summary, setSummary] = useState('')
    const [topKey, setTopKey] = useState('shirt');
    const [bottomKey, setBottomKey] = useState('pants');
    const [feetKey, setFeetKey] = useState('shoes');
    const [loading, setLoading] = useState(false);

    //Get AI_Advisor card info from our backend
    useEffect(() => {
        async function loadData(){
            setLoading(true);
            try{
                
                let res = await fetch(`http://localhost:8080/weather/getrecommendation/${city}`);
                let data = await res.json();
                setSummary(data.summary)
                setTopKey(data.top.toLowerCase());
                setBottomKey(data.bottom.toLowerCase());
                setFeetKey(data.feet.toLowerCase());
                setLoading(false);
            } catch (e){
                console.error(e.message)
                setLoading(false);
            }
        }

        loadData();
            
    }, [city])
    //the city parameter within use effect ensures the function only
    //runs with changes within the city.

    const imageMap = {
        shirt,
        jacket,
        pants,
        hoodie,
        shorts,
        shoes,
        boots
    };


    const topImage = imageMap[topKey] || shirt;
    const bottomImage = imageMap[bottomKey] || pants;
    const feetImage = imageMap[feetKey] || shoes;

    return(
        <>
            <div className="border-4 border-gray-800 w-3/6 bg-gray-700 mx-auto  text-white rounded-lg p-2">
                
                <div className="flex flex-row flex-nowrap">
                    <div className="w-3/4">
                        <h1 className="text-xl"><b>Agent Summary</b> 🤖</h1>
                        {loading ? (
                            <p className="mt-2 text-white animate-pulse">Loading AI recommendation...</p>
                        ) : (
                            <p className="mt-2 text-base">{summary}</p>
                        )}
                    </div>

                    <div className="w-1/4 bg-gray-800 rounded-md flex flex-col h-[200px] p-1 overflow-hidden">
                        <p className="text-center text-sm shrink-0 text-white">Recommended Fit:</p>

                        {loading ? (
                            <div className="flex-1 min-h-0 flex items-center justify-center">
                                <p className="text-white animate-pulse">Loading...</p>
                            </div>
                        ) : (
                            <>
                                <div className="flex-1 min-h-0 flex items-center justify-center">
                                    <img src={topImage} className="max-w-full max-h-full object-contain p-1" />
                                </div>

                                <div className="flex-1 min-h-0 flex items-center justify-center">
                                    <img src={bottomImage} className="max-w-full max-h-full object-contain p-1" />
                                </div>

                                <div className="flex-1 min-h-0 flex items-center justify-center">
                                    <img src={feetImage} className="max-w-full max-h-full object-contain p-1" />
                                </div>
                            </>
                        )}
                    </div>
                </div>

                    
                
            </div>
        </>
    )

}

export default AiCard