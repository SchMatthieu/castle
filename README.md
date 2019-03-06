# Castle

> Sleep well with Relais & Châteaux

My Project: https://schmatthieu-castle-webapp.netlify.com

![castle](https://media.relaischateaux.com/public/hash/919a5432f068d38d0b14b87e52fc27ae66c84376)

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**

- [🐣 Introduction](#-introduction)
- [🎯 Objectives](#-objectives)
- [🏃‍♀️ Steps to do](#%E2%80%8D-steps-to-do)
  - [Stack](#stack)
- [🏃‍♀️ Example of Steps to do](#%E2%80%8D-example-of-steps-to-do)
  - [Investigation](#investigation)
    - [Hotels from Relais & Châteaux](#hotels-from-relais--ch%C3%A2teaux)
    - [Michelin Restaurant](#michelin-restaurant)
    - [The web application](#the-web-application)
  - [Server-side with Node.js](#server-side-with-nodejs)
    - [require('castle')](#requirecastle)
    - [require('michelin')](#requiremichelin)
  - [Client-side with React](#client-side-with-react)
- [Licence](#licence)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## 🐣 Introduction

## 🎯 Objectives

**List the best rates - for each Weekend - for France located Relais & Châteaux with starred restaurants**

## 🏃‍♀️ Steps to do

Create a connection between [relaischateaux.com](https://www.relaischateaux.com), [restaurant.michelin.fr](https://restaurant.michelin.fr/) and the end-user.

### Investigation

#### Properties from Relais & Châteaux

1. How it works https://www.relaischateaux.com ?
1. How to get the list of `Hotel + restaurant`
1. How to identify the restaurant(s) name ?
1. How to compute the booking price for all weekend ? for a given weekend?

etc ...

Some things to do:

1. Browse the website
1. Check how that you can get list of properties: api etc.... (check network activity)
1. Check how that you can get list of restaurants for a given property: api etc.... (check network activity)
1. define the JSON schema for Property

etc ...

Example of Property: https://www.relaischateaux.com/fr/france/mercues-lot-mercues

#### Michelin Restaurant

1. How it works https://restaurant.michelin.fr
1. What are the given properties for a starred restaurant: name, adress, town, stars, chef... ?
1. ...

Some things to do:

1. Browse the website
1. define the JSON schema for a restaurant
1. Check how that you can get list of starred restaurants: api etc.... (check network activity)

etc...

Example of Restaurant: https://restaurant.michelin.fr/2akhln2/lauberge-des-glazicks-plomodiern


#### The web application

Some things to do:

1. How to create a connection between Relais & Châteaux and the starred restaurant?

### Server-side with Node.js

#### require('castle')

Create a module called `castle` that returns the list of best rates for all Weekends for each Property

```js
const castle = require('castle');
...
const property = {...};


const properties = castle.getProperties();
const prices = castle.getPrices(property);

...
```

Some things to do:

1. create the calls (api, http) to get the Property page
1. get the restaurants name (by scraping or decoding api response)
1. check if the restaurant is starred.
1. get the price by Weekend (by scraping or decoding api response)

#### require('michelin')

Create a module called `michelin` that return the list of restaurant

```js
const michelin = require('michelin');

const starred = michelin.get();

...
```

Some things to do:

1. scrape list of France located starred restaurants
1. store the list into JSON file, nosql database (like redis, mongodb...)
1. create a node module that returns the list

### Client-side with React

MVP to do:

1. **For each Weekend, list best rates for France located Relais & Châteaux with starred restaurants**

Next features:

2. Add filters:
  * filtering by name
  * sorting by stars
  * sorting by price
  * sorting by ratings

## Licence

[Uncopyrighted](http://zenhabits.net/uncopyright/)
