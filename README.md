![image_squidhome@2x.png](http://i.imgur.com/RIvu9.png)

# sails-restful

Provides easy access to RESTful APIs, inline with the [SOON API spec](https://github.com/thisissoon/API-Specification), from Sails.js & Waterline.

This module is a Waterline/Sails adapter, an early implementation of a rapidly-developing, tool-agnostic data standard.  Its goal is to provide a set of declarative interfaces, conventions, and best-practices for integrating with all sorts of data sources.  Not just databases-- external APIs, proprietary web services, or even hardware.

Strict adherence to an adapter specification enables the (re)use of built-in generic test suites, standardized documentation, reasonable expectations around the API for your users, and overall, a more pleasant development experience for everyone.


### Installation

To install this adapter, run:

```sh
$ npm install sails-restful
```




### Usage

```
// api/models/Queue.js
module.exports = {
  adapter: 'restful',
  url: '/player/queue'
};

// config/connections.js, add:
restful: {
  module: 'sails-restful',
  host: 'api.thisissoon.fm',
  port: 443,
  protocol: 'https',
  headers: {}
}
```



### Interfaces

This adapter implements the [semantic](https://github.com/balderdashy/sails-docs/blob/master/contributing/adapter-specification.md#semantic-interface) interface and exposes the following methods:

###### `find()`
`GET` one or more records.

###### `create()`
`POST` a new record.

###### `update()`
`PUT` to a record.

###### `destroy()`
`DELETE` a record.

Support for the [subscribable](https://github.com/balderdashy/sails-docs/blob/master/contributing/adapter-specification.md#subscribable-interface) interface is planned.

For more information, check out this repository's [FAQ](./FAQ.md) and the [adapter interface reference](https://github.com/balderdashy/sails-docs/blob/master/adapter-specification.md) in the Sails docs.


## Development

Check out **Connections** in the Sails docs, or see the `config/connections.js` file in a new Sails project for information on setting up adapters.

### Running the tests

Configure the interfaces you plan to support (and targeted version of Sails/Waterline) in the adapter's `package.json` file:

In your adapter's directory, run:

```sh
$ npm test
```


### Questions?

See [`FAQ.md`](./FAQ.md).



### More Resources

- [Stackoverflow](http://stackoverflow.com/questions/tagged/sails.js)
- [#sailsjs on Freenode](http://webchat.freenode.net/) (IRC channel)
- [Twitter](https://twitter.com/sailsjs)
- [Tutorials](https://github.com/balderdashy/sails-docs/blob/master/FAQ.md#where-do-i-get-help)
- <a href="http://sailsjs.org" target="_blank" title="Node.js framework for building realtime APIs."><img src="https://github-camo.global.ssl.fastly.net/9e49073459ed4e0e2687b80eaf515d87b0da4a6b/687474703a2f2f62616c64657264617368792e6769746875622e696f2f7361696c732f696d616765732f6c6f676f2e706e67" width=60 alt="Sails.js logo (small)"/></a>


### License

**[MIT](./LICENSE)**
&copy; 2015 [SOON_](http://github.com/thisissoon)

[Sails](http://sailsjs.org) is free and open-source under the [MIT License](http://sails.mit-license.org/).


