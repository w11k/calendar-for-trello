# Calendar for Trello
Trello is a productivity tool that helps you to organize projects by creating individual lists, boards and cards. Manage your projects in teams, get more flexible and improve your workflow.

Our **Calendar for Trello** allows you to organize all cards of all boards in one calendar. Calendar for Trello is open source and free to use.

Visit our (free) hosted version at [calendar-for-trello.com](https://calendar-for-trello.com/).

## Technologies
1. TypeScript
1. Angular (2) 
1. Material Design
1. Redux
1. Angular CLI

## development
The local dev server runs on `http://localhost:4200`

    npm install
    npm run start
    
**Please** replace the API key if you want to host the calendar on your own. You can find it in `src/config.json`. Get your own Trello API Key at: https://trello.com/app-key 
    
## adding a new language
1. add an entry to the `package.json` similar to what the production builds for other languages looks like
2. add the language to the `npm run extract-i18n` command
3. run the `npm run extract-i18n` command
4. a new file in `src/locale` is created.
5. translate this file using any translation tool or editor like [https://github.com/martinroob/tiny-translator](https://github.com/martinroob/tiny-translator)
6. create a Pull Request and we'll integrate the language
    
## Privacy Information
All accrued data is only stored on your own computer. The communication with Trello API is encrypted via https.


# W11K GmbH
Calendar-for-Trello is handcrafted software made in Esslingen, Germany. [Visit us!](https://www.w11k.de/angular/)
