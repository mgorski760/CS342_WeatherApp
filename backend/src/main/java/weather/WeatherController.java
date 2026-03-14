package weather;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.lang.reflect.Array;
import java.util.ArrayList;
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
        RestTemplate restTemplate = new RestTemplate();
        String url = "https://photon.komoot.io/api/?q=" + city;
        Map<String, Object> response = restTemplate.getForObject(url, Map.class);
        // Go into the list to access features
        List features = (List) response.get("features");

        if(features == null || features.isEmpty()){
            return null;
        }

        // then we go into nested maps to get the geometry field
        Map geometry = (Map) ((Map) features.get(0)).get("geometry");

        // go to the list where the coords are then get the coords
        List<Double> coordinates = (List<Double>) geometry.get("coordinates");
        double longitude = coordinates.get(0);
        double latitude = coordinates.get(1);

        //now we use the lat and long to get the region, gridx, and gridy
        String convertToGrids = "https://api.weather.gov/points/" + latitude + "," + longitude;
        Map<String, Object> gridResponse = restTemplate.getForObject(convertToGrids, Map.class);

        // go find map properties
        Map<String, Object> properties = (Map<String, Object>) gridResponse.get("properties");
        // find the region in properties as well as the gridX and gridY
        String region = (String) properties.get("gridId");
        int gridX = (int) properties.get("gridX");
        int gridY = (int) properties.get("gridY");

        // send this info the api we are given
        ArrayList<Period> forecast = WeatherAPI.getForecast(region, gridX, gridY);
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
}

