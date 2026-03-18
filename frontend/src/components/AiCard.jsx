import React, { useState, useEffect } from 'react';

function AiCard({city}){

    const [summary, setSummary] = useState('')
    const [advice, setAdvice] = useState('')
    const [risk, setRisk] = useState('')

    //Get AI_Advisor card info from our backend
    useEffect(() => {
        console.log("This ran.")
        async function loadData(){
            try{
                console.log("Function ran")
                let res = await fetch(`http://localhost:8080/weather/getrecommendation/${city}`);
                let data = await res.json();
                setSummary(data.summary)
                setAdvice(data.advice)
                setRisk(data.risk)
                console.log(data)
            } catch (e){
                console.error(e.message)
            }
        }

        loadData();
            
    }, [city])
    //the city parameter within use effect ensures the function only
    //runs with changes within the city.

    return(
        <>
            <div className="border-4 border-gray-800 w-3/6 bg-gray-700 mx-auto text-white rounded-lg p-2">
                <h2>Our Opinion for Weather in: {city} ☀️</h2>
                <p>Summary: {summary}</p>
                <p>Clothing Advice: {advice}</p>
                <p>Risks: {risk}</p>
            </div>
        </>
    )

}

export default AiCard