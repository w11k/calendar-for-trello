#calendar for Trello

Trello is a productivity tool that helps you to organize projects by creating individual lists, boards and cards.
Manage your projects in teams, get more flexible and improve your workflow.

The calendar for Trello allows you to organize all cards of all boards in one calendar.

made with AngularJS, Angular Material, Phonegap and [fabs](https://github.com/w11k/fabs).


Hosted Version:
<http://calendar-for-trello.com>

## development:

#####install components:
    npm install
    bower install

#####get Trello Application Key:
<https://trello.com/app-key>

#####edit config:
    src/app.js
    
    angular.module('w11kcal.app').constant('AppKey', 'YOURKEY');

while developing your URL will be http://localhost:9000

####fire it up:
    grunt dev
####deploy with:
    grunt dist


##mobil

*mobil part is at the very beginning. If the dev/deploy command doesn't work check the symlink (www) or simply use "grunt dist" before running the build/run command.*

before running the app make sure to enable the Content-Security-Policy Line in index.html

### mobil setup:
    cd mobil/
    phonegap platform add android




### mobil development:
    cd mobil/
    phonegap run [platform]


### mobil deploy
    cd mobil/
    phonegap build [platform]


## License
Apache 2.0 - see LICENSE file









