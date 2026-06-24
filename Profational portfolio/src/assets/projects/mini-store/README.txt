This folder is for: mini-store

HOW TO ADD SCREENSHOTS:
1. Drop your screenshot images here (.png or .jpg), named anything,
   e.g. screen-1.png, screen-2.png, dashboard.png, etc.
   You can add 1 to 15+ images — as many as you have.

2. Open src/data/projects.js and find the project with id: "mini-store"

3. At the top of projects.js, import each image:
     import mini_store_1 from "../assets/projects/mini-store/screen-1.png";
     import mini_store_2 from "../assets/projects/mini-store/screen-2.png";

4. On that project's object, set:
     image: mini_store_1,                         // shown on the project
                                                     // card in the Projects grid
     gallery: [mini_store_1, mini_store_2],        // ALL images shown on the
                                                     // project detail page

That's it — the card and the detail page both update automatically.
Delete this README.txt once your images are in place (optional).
