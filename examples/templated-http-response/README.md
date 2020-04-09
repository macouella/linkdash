# Linkdash as a templated http reponse

It's useful for anyone or (any) group of people to share a common dashboard. This example shows how to serve a linkdash html page using a [Zeit 2.0](https://zeit.co/docs/v2/serverless-functions/introduction) serverless function.

The example can be accessed by visiting https://linkdash.now.sh/api/templated-http-response?key=MY_SECRET_KEY

The source code for the example can be found in the site apis folder [/site/api/templated-http-response folder](../../site/api/templated-http-response/).

We use linkdash's `buildTemplate` helper to output an html string which we then write back as a server response.

As part of this example is a simple auth strategy as well which requires the url to be visited with a ?key=MY_SECRET_KEY.

For the data store - we're imagining that we have a deep ORM / database integration and we're processing fruit data to build quick google search urls for each type. :)
