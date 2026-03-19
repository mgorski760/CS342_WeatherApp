package weather;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.databind.ObjectMapper;

import java.lang.reflect.Array;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static weather.WeatherAPI.getForecast;
import java.time.LocalDate;

@CrossOrigin(origins = "http://localhost:5173") // allows the backend to send data to the frontend vise versa
@RestController
@RequestMapping("/weather")
public class WeatherController {
    @GetMapping("/{city}")
    public ArrayList<Period> getCords(@PathVariable String city) {
        RestTemplate restTemplate = new RestTemplate(); // used to send GET requests to the URL
        String url = "https://photon.komoot.io/api/?q=" + city;
        Map<String, Object> response = restTemplate.getForObject(url, Map.class); // returns all fields in map called response
        // Go into the list to access features
        List features = (List) response.get("features");

        if(features == null || features.isEmpty()){
            return new ArrayList<>();
        }

        // then we go into nested maps to get the geometry field
        Map geometry = (Map) ((Map) features.get(0)).get("geometry");
        if(geometry == null) {
            return new ArrayList<>();
        }

        // go to the list where the coords are then get the coords
        List<Double> coordinates = (List<Double>) geometry.get("coordinates");
        if(coordinates == null || coordinates.size() < 2){
            return new ArrayList<>();
        }

        double longitude = coordinates.get(0);
        double latitude = coordinates.get(1);

        //now we use the lat and long to get the region, gridx, and gridy
        String convertToGrids = "https://api.weather.gov/points/" + latitude + "," + longitude;
        Map<String, Object> gridResponse = restTemplate.getForObject(convertToGrids, Map.class); // used to call APi's from Java (HTTP requests)

        // go find map properties
        Map<String, Object> properties = (Map<String, Object>) gridResponse.get("properties");
        if(properties == null) {
            return new ArrayList<>();
        }
        // find the region in properties as well as the gridX and gridY
        String region = (String) properties.get("gridId");
        int gridX = (int) properties.get("gridX");
        int gridY = (int) properties.get("gridY");

        // send this info the api we are given
        ArrayList<Period> forecast = WeatherAPI.getForecast(region, gridX, gridY);

        // pass this to period variables because we need it for the windy weather radar, now we can access cords for all cities
        forecast.get(0).longitude = longitude;
        forecast.get(0).latitude = latitude;

        ArrayList<Period> sevenDayForecast = new ArrayList<>();

        // get json data for the day and night forecast
        for(int i = 0; i < forecast.size() && sevenDayForecast.size() < 7; i++){
            Period day = forecast.get(i);

            // day temps
            if(day.isDaytime){
                day.day = day.temperature;

                // (i+1) is night temps
                if((i + 1) < forecast.size()){ // check if we aren't going out of bounds
                    day.night = forecast.get(i + 1).temperature;
                }
                sevenDayForecast.add(day);
            }
        }
        return sevenDayForecast;
    }

    /**
     * Returns an LLM-generated weather recommendation for the given city.
     *
     * <p>Fetches the 7-day forecast, filters it to the client's local date,
     * then sends the weather context to the Modal-hosted LLM and returns
     * a structured JSON response.</p>
     *
     * @param city          the name of the city to get a recommendation for (e.g. "Chicago")
     * @return JSON with three keys:
     *         <ul>
     *           <li>{@code summary} — overall weather summary for today</li>
     *           <li>{@code advice} — clothing recommendations</li>
     *           <li>{@code risk}   — any weather risks to be aware of</li>
     *         </ul>
     */

    @GetMapping("/getrecommendation/{city}")
    public Map<String, String> getRecommendation(@PathVariable String city) {

        RestTemplate restTemplate = new RestTemplate();

        //Build Weather context (Currently next 5 days);
        ArrayList<Period> forecast = getCords(city);

        //Check if we can get data for
        if(forecast == null || forecast.isEmpty()){
            return Map.of(
                "summary", "Failed to get weather data for " + city,
                "top", "",
                "bottom", "",
                "feet", ""
            );
        }
        System.out.println("Got data for " + city);
        //Convert JSON to a Java Map
        ObjectMapper objectMapper = new ObjectMapper();

        String forecastJson;

        try {
            forecastJson = objectMapper.writeValueAsString(forecast.get(0));
        } catch (Exception e){
            return Map.of(
                "summary", "Failed to get current day's weather.",
                "top", "",
                "bottom", "",
                "feet", ""
            );
        }

        //Modal route for our custom LLM. IT IS REALLY IMPORTANT THAT its the chat completions otherwise bad things happen.
        String llm_url = "https://mgorski760--cs342-weatherapp-vllm-serve.modal.run/v1/chat/completions";

        //Multi modal context for our llm
        String prompt =
            "You are a weather outfit recommender for a React app.\n" +
            "\n" + 
            "Your output is used to select clothing images by key.\n" +
            "Allowed keys are:\n" + 
            "\n" + 
            "TOP: \"shirt\" | \"hoodie\" | \"jacket\"\n" + 
            "BOTTOM: \"pants\" | \"shorts\"\n" + 
            "FEET: \"shoes\" | \"boots\"\n" + 
            "\n" + 
            "Rules:\n" + 
            "- Pick exactly 1 key for top, bottom, feet.\n" +
            "- Use only lowercase keys from the allowed list.\n" + 
            "- Do not invent new keys.\n" + 
            "- If conditions are cold/windy/rainy/snowy, prefer \"jacket\", \"pants\", \"boots\".\n" + 
            "- If conditions are warm/hot and dry, prefer \"shirt\", \"shorts\", \"shoes\".\n" + 
            "- \"summary\" should be 1-3 short sentences (max 300 words), user-friendly, please include any potential risks regarding weather conditions.\n" +
            "\n" + 
            "Return ONLY valid JSON in this exact shape:\n" + //
            "{\n" + 
            "  \"summary\": \"string\",\n" + //
            "  \"top\": \"shirt|hoodie|jacket\",\n" + //
            "  \"bottom\": \"pants|shorts\",\n" + //
            "  \"feet\": \"shoes|boots\"\n" + //
            "}" +
            "\n\nForecast JSON:\n" + forecastJson;

        //Define type of HTTP request.
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        System.out.println(prompt);
        //Build JSON for Modal.
        Map<String, Object> payload = new HashMap<>();
        payload.put("model", "openai/gpt-oss-20b");
        payload.put("messages", List.of(
                Map.of("role", "system", "content", "Return strict JSON only."),
                Map.of("role", "user", "content", prompt)
        ));
        payload.put("temperature", 0.1); //Conservative. Might give it more freedom if need be.

        //Make API call, then get response.
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(payload, headers);
        Map response = restTemplate.postForObject(llm_url, entity, Map.class);

        //LLM Sanity check.
        if (response == null || response.get("choices") == null) {
            return Map.of(
                   "summary", "Agent failed to get correct JSON data.",
                    "top", "",
                    "bottom", "",
                    "feet", ""
            );
        }

        //OpenAI JSON returns an Array of multiple responses, so in our case the LLM in gonna return the
        //JSON format we listed above. The default is gonna be the first index.
        List<Map<String, Object>> choices = (List<Map<String, Object>>) response.get("choices");

        //We take the first option and get the actual string response.
        String content = (String) ((Map<String, Object>) choices.get(0).get("message")).get("content");

        try {
            //Convert the String message into JSON.
            Map<String, String> parsed = objectMapper.readValue(content, Map.class);
            return Map.of(
                    "summary", parsed.getOrDefault("summary", ""),
                    "top", parsed.getOrDefault("top", "shirt"),
                    "bottom", parsed.getOrDefault("bottom", "pants"),
                    "feet", parsed.getOrDefault("feet", "shoes")
            );
        } catch (Exception e) {
            return Map.of(
                    "summary", "Failed to parse through json data.",
                    "top", "",
                    "bottom", "",
                    "feet", ""
            );
        }
    }

    @GetMapping("/getcoords/{city}")
    public Map<String, Double> getCoords(@PathVariable String city){
        RestTemplate restTemplate = new RestTemplate();
        
        String url = "https://photon.komoot.io/api/?q=" + city;
        Map<String, Object> response = restTemplate.getForObject(url, Map.class);

        List features = (List) response.get("features");

        Map geometry = (Map) ((Map) features.get(0)).get("geometry");
        
        if(geometry == null) {
            Map.of("lat", 50.4, "lon", 14.3);
        }

        List<Double> coordinates = (List<Double>) geometry.get("coordinates");
        
        if(coordinates == null || coordinates.size() < 2){
            Map.of("lat", 50.4, "lon", 14.3);    
        }

        double longitude = coordinates.get(0);
        double latitude = coordinates.get(1);

        return Map.of("lat", latitude, "lon", longitude);
    }
}



