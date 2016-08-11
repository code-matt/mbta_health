# Raingular2

Boilerplate with Angular2(RC4) frontend with a Rails5(5.0.0) Backend in api_only mode.
Rails serves the index.html and Angular's router takes over after that.
Tested and works with Heroku deployment.


## Installation
Go and change the project name in the following places:
* config/application.rb - change the module name
* config/initializers/session_store.rb - change the session key name
* config/database.yml - change the database names

```
cd <root dir>
bundle install
rails db:create
rails db:migrate
rails db:seed
```
```
cd client
npm install
```
```
cd ..
rails s
```

Right now you have to run ```ng build``` in the client directory while
the server is still running to see any changes you make. Still trying
to figure out how to bring live reload back.

## "Rails Resolver"
This is my best attempt so far for making Rails's routes.rb talk with angular's
router when people go to URL's directly. Mashed together from a few different sources online.
```
client/src/app/resolver/rails.component.ts
this.router.navigate(['index'])
```
Replace 'index' with whatever component you want to be loaded
for visits to the root address.



## Heroku Deployment

```
heroku create
heroku buildpacks:add https://github.com/jasonswett/heroku-buildpack-nodejs
heroku buildpacks:add heroku/ruby
git push heroku master
```
