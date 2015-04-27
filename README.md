# trello-calendar
Calendar for Trello made with with Ionic, AngularJS and [fabs](https://github.com/w11k/fabs).


Hosted Version:
<http://trello-calendar.w11k.de>

## Development

#####install components:
    npm install
    bower install

#####get Trello Application Key:
<https://trello.com/app-key>

#####edit config
    src/app/app.js
    
    angular.module('w11kcal.app').constant('AppKey', 'YOURKEY');
    angular.module('w11kcal.app').constant('baseUrl', 'URL');

while developing your URL will be http://localhost:9000

####fire it up:
    grunt dev
###deploy with:
    grunt dist


## License
