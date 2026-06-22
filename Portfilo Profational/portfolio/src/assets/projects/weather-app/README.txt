This folder is for: weather-app

HOW TO ADD SCREENSHOTS:
1. Drop your screenshot images here (.png or .jpg), named anything,
   e.g. screen-1.png, screen-2.png, dashboard.png, etc.
   You can add 1 to 15+ images — as many as you have.

2. Open src/data/projects.js and find the project with id: "weather-app"

3. At the top of projects.js, import each image:
     import weather_app_1 from "../assets/projects/weather-app/screen-1.png";
     import weather_app_2 from "../assets/projects/weather-app/screen-2.png";

4. On that project's object, set:
     image: weather_app_1,                         // shown on the project
                                                     // card in the Projects grid
     gallery: [weather_app_1, weather_app_2],        // ALL images shown on the
                                                     // project detail page

That's it — the card and the detail page both update automatically.
Delete this README.txt once your images are in place (optional).
