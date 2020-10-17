# [apollo-link-http-pooled](https://www.apollographql.com/docs/link/)

### apollo-link-http

[apollo-link-http docs](https://www.apollographql.com/docs/link/links/http/)

The default http link is the most common Apollo Link (a system of modular components for GraphQL networking). If you haven't done so already, read the Apollo Link docs to learn about the Apollo Link ecosystem and how to use this link with libraries like Apollo Client and graphql-tools, or as a standalone client.

The http link is a terminating link that fetches GraphQL results from a GraphQL endpoint over an http connection. The http link supports both POST and GET requests with the ability to change the http options on a per query basis. This can be used for authentication, persisted queries, dynamic uris, and other granular updates.


### apollo-link-http-pooled

This repository provides a version of http link with two additional features: 


#### Connection Pooling

A lot goes on to set up client-server connectivity (tcp connection) before an HTTP request / response message exchange even takes place. There is considerable overhead in establishing a new connection for each http request.   The default apollo-link-http creates a new connection each time.

From HTTP/1.1 forward the underlying TCP connection (along with its TLS handshake state) can be reused to perform further HTTP transactions against the same server host. Multiple requests may even be pipelined rather than running in a serialized request -> response -> request -> and so on lock-step fashion.  This will dramatically improve performance.


#### DNS Lookup Caching

If you are frequently connecting to the same URL, each connection doesn't need to perform a DNS lookup against your DNS server every single time.  In Node, not only is there overhead in connceting to the DNS server and waiting for a response, but DNS lookups are also blocking code that can impact the node event loop.   Performance of making many many connections will be dramatically improved by turning on caching. 

Note:  If you cache a DNS hostname and the actual DNS record changes, you will need to wait for your cache to expire to see that change in your application. Design your application accordingly. 


## Quick start

To get started, install `apollo-link-http-pooled` from npm:

```bash
npm install apollo-link-http-pooled --save
```


## Usage

```typescript
import { createHttpLink } from "apollo-link-http-pooled";

const link = createHttpLink({ uri: "/graphql" });
```

All default options from [apollo-link-http](https://www.apollographql.com/docs/link/links/http/) are supported. 


#### Additional Options

The following additional options can be passed in:

```typescript

const link = createHttpLink({ 

  enableDnsCache: true,         # enable or disable

  enableConnectionPool: true,   # enable or disable

  freeSocketTimeout: 30000,    # when free sockets time out in ms

  dnsCacheTtl: 300             # when dns cache expires in ms

});

```


Now you should be good to go!  Use this as you would use the normal [apollo-link-http](https://www.apollographql.com/docs/link/links/http/)

## Sponsors

Work on this repository is sometimes sponsored by Canada's [Neo Financial](https://github.com/neofinancial)
