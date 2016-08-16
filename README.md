# Raingular2

Boilerplate with Angular2(cli,RC5) frontend with a Rails5(5.0.0) Backend in api_only mode.
Rails serves the index.html and Angular's router takes over after that.
Tested and works with Heroku deployment.


## Installation
Change the project name. I suggest doing find and replace 'Raingular2'

This project is setup for Postgres using the 'pg' gem.

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

##JWT auth dependencies
Rails:
* https://github.com/nsarno/knock
* https://github.com/codahale/bcrypt-ruby

Angular:
* https://github.com/auth0/angular2-jwt

##Contribute!
* Fork it
* Create your feature branch (git checkout -b my-new-feature)
* Commit your changes (git commit -am 'Add some feature')
* Push to the branch (git push origin my-new-feature)
* Create a new Pull Request

## Heroku Deployment
Make sure to configure ```config/initializers/cors.rb``` beforehand.
```
heroku create
heroku buildpacks:add https://github.com/jasonswett/heroku-buildpack-nodejs
heroku buildpacks:add heroku/ruby
git push heroku master
```