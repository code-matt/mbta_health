# MBTA_Health

## ( very much work in progress )

### http://mbta-health.herokuapp.com/
![Screenshot](screenshot.png)

##todo
* ~~get alerts for all stations every 30secs and pipe them in via websocket~~
* add in details(schedule/alerts) pane for stations/routes when one is selected (in progress )
* update station nodes color in realtime depending if trains are running on time or not( right now they do for alerts )
* ~~refactor component structure~~
* refactor types and make interfaces

## Installation
!! You need an API key from the MBTA in order to seed and run this project.
Place it inside .env ```MBTA_KEY=<your key>```
```
cd MBTA_Health
bundle install
rails db:create
rails db:migrate
rails db:seed
```
```
cd client
npm install
```
Create a file in ```client``` named ```env.json```
```
{
  "baseUrl": "http://localhost:3000",
  "wsUrl": "ws://localhost:3000/cable"
}
```
```
ng env
ng build
rails s
```