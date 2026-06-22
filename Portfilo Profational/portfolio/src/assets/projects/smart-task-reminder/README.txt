This folder is for: smart-task-reminder

HOW TO ADD SCREENSHOTS:
1. Drop your screenshot images here (.png or .jpg), named anything,
   e.g. screen-1.png, screen-2.png, dashboard.png, etc.
   You can add 1 to 15+ images — as many as you have.

2. Open src/data/projects.js and find the project with id: "smart-task-reminder"

3. At the top of projects.js, import each image:
     import smart_task_reminder_1 from "../assets/projects/smart-task-reminder/screen-1.png";
     import smart_task_reminder_2 from "../assets/projects/smart-task-reminder/screen-2.png";

4. On that project's object, set:
     image: smart_task_reminder_1,                         // shown on the project
                                                     // card in the Projects grid
     gallery: [smart_task_reminder_1, smart_task_reminder_2],        // ALL images shown on the
                                                     // project detail page

That's it — the card and the detail page both update automatically.
Delete this README.txt once your images are in place (optional).
