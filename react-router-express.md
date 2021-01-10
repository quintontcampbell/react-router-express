## Learning Objectives

- Understand how our routes are loaded within a monolith web application
- Identify how we can use React Router to bypass the typical HTTP request/response cycle
- Learn how to create links and nested routes for rendering React components in a multi-page React app

## Getting Started

From your challenges directory, run the following:

```sh
et get react-router-express
cd react-router-express
yarn install
yarn run dev
```

Navigate to http://localhost:3000/ to see our app. You should see a list of delicious cereals, with no errors displayed in the console.

We are in the middle of building a React and Express app for our favorite breakfast cereals, and we need your help! Here are our requirements:

* The homepage will show an index page (a list) of cereals.
* Clicking on a cereal should update the URL from `/` to `/cereals/:id`, and we should be able to view additional information for a particular cereal.
* Navigating to `/milks` should bring us to a page with a list of milks
* A nav bar should be present on every page.

Let's get started! But first...

## Building a Multi-Page React App

So far, we have only built React applications that have one page, at one specific URL (usually our root `localhost:3000`). However, as web developers we know that we're probably going to need to be able to build applications with multiple pages, and multiple different URLs.

Based on our interaction with React, and JavaScript in general, so far, we know that one of the main benefits it provides is the ability to update certain parts of our page without dispatching an entirely fresh HTTP request/response cycle. By being able to update a part of our page based on state, we avoid the need to entirely refresh our page every time we want it to change. This significantly speeds up our application load times.

As of right now, however, if we want multiple pages in our application, we still have to send out an HTTP request to our backend every time we want to move to a new page, with a new URL. We don't yet have a way to manage that navigation from one page to another while staying entirely in our frontend React application. Enter: React Router.

## What is React Router, anyway?

React Router gives us a way to navigate between different pages _entirely within our React application_, without sending new HTTP requests to our Express backend before loading the page. React Router is a library built on top of React, which allows you to quickly add multiple pages and flows of information within React, and to keep the browser itself in touch with what's being displayed on the page. 

At a lower level, Router is really just a _component_ that loads other components based on the URL.

React Router gives us a ton of fantastic functionality, including the ability to:

- create special links to other parts of your React app that _allow you to stay within React_
- handle for different routes and nest routes, similar to our Express routers
- use JavaScript to update the URL in our browser, without making an HTTP request

React Router also lets you use _dynamic routing_, rather than manually coding the links in your app, and gives your React app access to `params` to access any dynamic parts of the URL. For example, you can create a route of `/pets/:id` and gain access to a param of `id: 5` when your user navigates to `/pets/5`.

Going a step further, creating distinct URLs for different "pages" in your web application also means that you can link directly to a specific page _section_ when sending out links to others. For instance, if you wanted to send a link to a _particular_ cereal page to your friend, you could do so easily, thanks to the way our backend and frontend are working together to let React know what to load on that page. This is otherwise very difficult to do in React because you are often only serving up a single page from the server that contains all the JavaScript code (as we've been doing so far).

## Allowing our React Router to Take Over

Within our Express/React monolith apps, it is important that we tell our Express application _which_ routes we want to allow our React Router to be in control of. Now that we're in a monolith application, we'll want Express to handle some routes (like our API endpoints!), and React Router to handle others (any pages we want to be rendered using React).

In some applications, you'll see this problem handled using a "catch-all" route, which basically tells our Express app exactly which routes we want handled by Express, and then says "for the rest of them, just use React Router". However, this is not ideal. We want to be more explicit, so that if a user goes to a page that just plain doesn't exist, they get a RESTful `404` "Not Found" error.

The monolith applications you've been seeing have already been set up to allow for React Router to take control of some routes - we just haven't been using that functionality yet! Take a moment to open up `server/src/routes/rootRouter.js`, and you'll see the following line _right above our export_:

```javascript
rootRouter.use("/", clientRouter)
```

It's very important that this line goes right above our export, _below_ any of our other routes, so that Express is able to handle for all Express-specific routes _before_ loading React Router in.

Now, let's take a look at `server/src/routes/cientRouter.js`. We can see that we're loading in some `index.html` files, but the most important part for us to pay attention to here is this section:

```javascript
const clientRoutes = ["/", "/milks"]

router.get(clientRoutes, (req, res) => {
  res.sendFile(indexPath)
})
```

The `clientRoutes` array is going to list _any routes_ that we want to be handled by React Router. Here, we've told it that we want React Router to handle our root route `/` (at http://localhost:3000), as well as our `/milks` route. Any time we want to add an additional route to our React Router, we will also need to add it directly into this `clientRoutes` array inside of our `clientRouter`, so that Express knows to hand that route over to React Router's control. _This is the only part of this file that we should need to update._

## Creating our React Router

Now that we know how to hand routes over to React Router for handling, let's actually build our React Router!

Similar to what we've done in Express in the past, we're going to use React Router to map specific URLs to particular React components that we want rendered on each page.

Let's start by taking a look at `client/src/components/App.js`:

```js
// client/src/components/App.js

import React from 'react'
import { hot } from "react-hot-loader/root"

import "../assets/scss/main.scss"

import CerealsIndexPage from "./CerealsIndexPage"

const App = props => {
  return (
    <div>
      <CerealsIndexPage />
    </div>
  )
}

export default hot(App)
```

Right now, our `App` component is rendering `CerealsIndexPage`, no matter what. Now, instead of just choosing which component `App` renders, we're going to use React Router to _conditionally_ render components based on the browser's current URL. You do this by having your `App` component render a `BrowserRouter` component imported from `react-router-dom`. We will need to import this `BrowserRouter` component, as well as the `Route` component from this package, so that we can define multiple routes within our React app. Add the below import in at the top of your file:

```javascript
import { BrowserRouter, Route } from "react-router-dom"
```

Now that we have the tools we need, let's refactor `App` to convert it into a router. Specifically, when a user visits the root path (`/`), we want to display `CerealsIndexPage`:

```js
// client/src/components/App.js

import React from 'react'
import { hot } from "react-hot-loader/root"
import { BrowserRouter, Route } from "react-router-dom"

import "../assets/scss/main.scss"

import CerealsIndexPage from "./CerealsIndexPage"

const App = props => {
  return (
    <BrowserRouter>
      <Route path="/" component={CerealsIndexPage} />
    </BrowserRouter>
  )
}

export default hot(App)
```

Here, we're first telling our application that we're going to set up a React `BrowserRouter`. Inside of that component, we nest any and all `Route`s that we want to include. Similar to Express, we need to tell each `Route` which _path_ we want it to use, and _what_ we want it to render. Here, we're saying that at the root path `/`, we want to render the `CerealsIndexPage`.

If you refresh the page in your browser, you should now see exactly the same content as before: a list of cereals!

### Using `<Switch>` to Define Multiple Routes

Let's make things more interesting. What if we want to display `MilksIndexPage` at `/milks`?

To add another route to our router, we need to import `Switch` and wrap it around our list of routes, so that React Router knows we have multiple path options in play. `Switch` works similarly to a JavaScript switch statement, in that it will start looking for a match at the top, and will stop looking as soon as it finds a match (otherwise, Router might find multiple matching routes and throw an error):

```js
// client/src/components/App.js

...
import { BrowserRouter, Route, Switch } from "react-router-dom"

import CerealsIndexPage from "./CerealsIndexPage"
import MilksIndexPage from "./MilksIndexPage"

const App = props => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" component={CerealsIndexPage} />
        <Route path="/milks" component={MilksIndexPage} />
      </Switch>
    </BrowserRouter>
  )
}

export default hot(App)
```

Navigate to `http://localhost:3000/milks` and prepare to be surprised. Instead of our `MilksIndexPage`, our `CerealsIndexPage` is rendering! Why? A hint: when the router is trying to match a URL to a route, it is matching the _beginning_ of the URL with the path specified for the route. Therefore, `/milks` would match both the `/` and `/milks` routes (it would also match routes for `/milk` or `/milks/5`, but not `/cereal` or `/cereals/5/milks`). Furthermore, React Router starts its search at the top of the file, and (thanks to `Switch`) will stop looking after the first match it finds. So, it encounters `/` before `/milks`, registers it as a match, serves up `CerealsIndexPage`, and doesn't even look at any routes below `/`. You can test this out by moving the line with the `/milks` route above the line with the `/` route and refreshing the page -- React Router will now match `/milks`, serve up `MilksIndexPage`, and go along its merry way.

### Using `exact` for Exact Matches

Rather than always having to be really careful about ordering, there's a better way to to ensure that Router matches the `/milks` path in the URL with the `/milks` route you've created: the `exact` prop. Move your routes back to their original order, and add the `exact` prop to your root route like so:

```js
// client/src/components/App.js

const App = props => {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={CerealsIndexPage} />
        <Route path="/milks" component={MilksIndexPage} />
      </Switch>
    </BrowserRouter>
  )
}
```

If you navigate to `/milks` now, the `MilksIndexPage` will be displayed because Router is looking for an _exact_ match to `/`, and `/milks` does not exactly match `/`. As a best practice, add `exact` to all your routes unless you have a compelling reason not to!

## Adding Links

The React Router library also includes a `Link` component, which provides us with a nifty helper for creating links in our app. At the moment, our `CerealsIndexPage` and `MilksIndexPage` each have anchor elements (`<a>`) linking to one another. These do the trick, but they're not React -- each time you click on one of these links, your browser is making an HTTP request to your server, ultimately causing a page reload. This is very un-React.

This is where `<Link>` comes into play -- it avoids the browser's default behavior and redirects us where we want to go, without reloading the page or making an HTTP request. Let's import this module and refactor out the anchor tags like so:

```js
// MilksIndexPage.js
// ...
import { Link } from 'react-router-dom';

// ...
    return (
      <div className="center-bg">
        <h3 className="so-great">Milks Are Also Great</h3>
        <Link to="/">But so are cereals</Link>
        {milkTiles}
      </div>
    )
  }
```

```js
// CerealsIndexPage.js

  // ...
import { Link } from 'react-router-dom';

    // ...

    return (
      <div className="center-bg">
        <h3 className="so-great">Cereals Are Great</h3>
        <Link to="/milks">So are milks!</Link>
        {cerealTiles}
      </div>
    )
  }
```

We've replaced our anchor tags with `Link` components. `Link` components expect a `prop` called `to`, which provides the path we want to link to (similar to our `href` attribute). Clicking these links will now immediately render the desired component, with no page reload -- try it out!

The other cool thing that React Router does behind the scenes here is that it uses JavaScript to update the URL in our browser window, even though we're not sending any HTTP requests. When you click from one link to another, keep an eye on your URL address bar and see it change!

## Nested Routes

The next step in perfecting our awesome cereal app is to implement a nav (_navigation_) bar. We want this bar to appear on every page. Thinking about React as boxes-within-boxes, our nav bar component will be the outermost box, rendering other components (like `CerealsIndexPage`) inside of it. To accomplish this, we're going to add a route to the `NavBar` component into `App.js` and move the routes for `CerealIndexPage` and `MilksIndexPage` into the `NavBar` component.

`App` becomes simply:

```js
// client/src/components/App.js

import React from 'react'
import { hot } from "react-hot-loader/root"
import { BrowserRouter, Route } from "react-router-dom"

import "../assets/scss/main.scss"

import NavBar from "./NavBar"

const App = props => {
  return (
    <BrowserRouter>
      <Route path="/" component={NavBar} />
    </BrowserRouter>
  )
}

export default hot(App)
```

(You can keep `<Switch>` if you prefer, but it's unnecessary for a single route.)

Next, we're going to add the routes to `MilksIndexPage` and `CerealsIndexPage` into `NavBar.js`:

```js
import React from "react"
import { Switch, Route, Link } from "react-router-dom"
import CerealsIndexPage from "./CerealsIndexPage"
import MilksIndexPage from "./MilksIndexPage"

const NavBar = props => {
  return (
    <div className="row column">
      <div className="navbar">
        <Link to="/">All Cereals</Link>
      </div>
      <div className="navbar">
        <Link to="/milks">All Milks</Link>
      </div>
      <div className="content">
        <h1 className="page-title">Cereals</h1>
      </div>
      <Switch>
        <Route exact path="/" component={CerealsIndexPage} />
        <Route exact path="/milks" component={MilksIndexPage} />
      </Switch>
      <div className="navbar">
        <p>I am a footer!</p>
      </div>
    </div>
  )
}

export default NavBar
```

That's right, we move our routing components right into the middle of the JSX that our NavBar provides. In this way, if a user navigates to any path beginning with `/` (which would be all routes), then React will begin rendering all of the elements of the page designated by the `NavBar` JSX. Once it gets to our `Switch` statement, it will look at the current path and render all of the JSX associated with appropriate component. For instance, if we navigate to `/milks`, then React will render all of the JSX in `NavBar` and render our `MilksIndexPage` in the middle of the `NavBar` JSX. It's just a matter of the right nesting.

This is how we can tell React Router to render some kind of wrapper component on _every single page_ (or some group of pages), and then conditionally choose the "innards" of that page once we get there.

## Dynamic Links

Let's say that we want to build a "show" page for our cereals, to see the details of a given cereal. In other words, we want to load a page at the path of `/cereals/:id` which shows the details for the cereal with the matching id.

While the React components are already built for you, there are two steps to getting these pages set up with our routers!

The first is to tell our Express app that we want React Router to be in control of this `/cereals/:id` route. Let's go to our `clientRouter` and update our `clientRoutes` array:

```js
// server/src/routes/clientRouter.js

const clientRoutes = ["/", "/milks", "/cereals/:id"]
```

Now that React is in charge here, we can update our React Router to know what to do at this path. In `NavBar` (remember that this is our outermost "box"), import and add a route for `CerealShowPage`:

```js
...
import CerealShowPage from "./CerealShowPage"

...

<Route exact path="/" component={CerealsIndexPage} />
<Route exact path="/cereals/:id" component={CerealShowPage} />
<Route exact path="/milks" component={MilksIndexPage} />

...
```

Our route is live! Try heading to http://localhost:3000/cereals/1 to make sure all is working as expected. 

Uh oh...we're getting our show page, but there are no cereal details! We need to update our `CerealShowContainer` so that it knows how to fetch the proper data.

If you look at `CerealShowPage`, you'll see that we need the `id` from the URL in order to determine which cereal's data we should fetch. Router provides us with that `id` via `props.match.params`. Kind of like how we "magically" have `req.params` with Express, we're "magically" given some extra `props` thanks to our React Router. Just like any other params, we can call on `props.match.params` in our React component. Update `CerealShowPage` such that it includes the following:

```js
// client/src/components/CerealShowPage.js

//...
let cerealId = props.match.params.id
const response = await fetch(`/api/v1/cereals/${cerealId}`)
//...
```

Now, our component should be able to fetch the proper data (the API endpoint has already been set up for you, and you can check it out in the Express `cerealsRouter` if you're curious). Refresh your show page, and we should see the information for that cereal appear on the page.

Finally, let's update our cereals index page to include links to these show pages!

In `CerealTile`, replace the `<h2>` in the return with

```
<Link to={`/cereals/${id}`}>{name}</Link>
```

Now, our list of cereals will contains links to each cereal's show page. Reload your index page to check it out.

## Summary

The ubiquitousness of React is driven in part by people want to create exceptional user experiences with transitions and changes in UI elements that are both non-disruptive and easy to implement. React Router allows us to create a layer of routing that prevents the long disruptive load times of normal HTTP requests, and instead replaces our backend handling with a relatively intuitive system for the conditional rendering components. This allows us to make asynchronous requests for data with an API like Fetch, without holding up the initial load of our page. Once we set up our base routes, use the proper nesting and syntax in our paths and links, and make use of the new props our components are given, we can create frontend experiences that have no page refresh at all. It's all managed by React!

### External Resources

- [ReactTraining/React Router](https://github.com/ReactTraining/react-router)
