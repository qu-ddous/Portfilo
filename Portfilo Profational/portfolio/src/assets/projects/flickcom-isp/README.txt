This folder is for: flickcom-isp

HOW TO ADD SCREENSHOTS:
1. Drop your screenshot images here (.png or .jpg), named anything,
   e.g. screen-1.png, screen-2.png, dashboard.png, etc.
   You can add 1 to 15+ images — as many as you have.

2. Open src/data/projects.js and find the project with id: "flickcom-isp"

3. At the top of projects.js, import each image:
     import flickcom_isp_1 from "../assets/projects/flickcom-isp/screen-1.png";
     import flickcom_isp_2 from "../assets/projects/flickcom-isp/screen-2.png";

4. On that project's object, set:
     image: flickcom_isp_1,                         // shown on the project
                                                     // card in the Projects grid
     gallery: [flickcom_isp_1, flickcom_isp_2],        // ALL images shown on the
                                                     // project detail page

That's it — the card and the detail page both update automatically.
Delete this README.txt once your images are in place (optional).
