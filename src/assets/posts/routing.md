# Simple routing system using hashes in React

Sometimes, you might prefer not to rely on third-party dependencies, especially for simple tasks or during the proof-of-concept phase.
However, implementing such functionalities can be complex, even for simple use cases.

In the case of client-side routing, you could rely on libraries like [`react-router`](https://reactrouter.com/) for example, or code your own.
This seems simple at first glance, but you may encounter numerous nuances to consider, such as `history management`, `back navigation`, and `default browser behaviors`.

So why bother ?

In the case of [`GitHub Pages`](https://pages.github.com/), you can't use standard routing, because adding `/route` to the url will search for a `route` file in your repository.
This is not a problem when you use those pages with generated documentation, because the libraries take care of this behavior natively.

But when dealing with a Single Page Application and not statically generated html, this can become an issue.
A solution I find for this, is using the `hash` fragments of urls as a simple routing mecanism.

In this brief post, I'll guide you through the process of building a straightforward routing system in React using hashes, inspirired by the syntax of `react-router`.

This system is currently in use on this website.

## Browser Hashes

In web development, a browser hash, also known as a fragment identifier, is a portion of a URL that starts with the `#` symbol.

It's commonly used to navigate to specific sections within a webpage or to maintain application state in client-side routing.
When a browser encounters a hash in a URL, it scrolls to the element on the page with a matching ID or triggers JavaScript logic associated with that hash.

## HTML and JavaScript APIs

In HTML, the `<a>` tag natively supports hashes, but the default behavior is about anchoring and scrolling.

This means we can use the href attribute of the `<a>` tag to pass our routing information but need to override the default browser behavior regarding anchoring and scrolling.

That also means we can't use the usual anchor system on our website.

In JavaScript, [`window.location.hash`](https://developer.mozilla.org/en-US/docs/Web/API/Location/hash) allows you to access or set the hash portion of the current URL.
We can use it to read the current hash value or modify it to trigger changes in our application's state.

But as we want to use history and back navigation like any other website, we need to rely on the [`window.history.pushState`](https://developer.mozilla.org/en-US/docs/Web/API/History/pushState) method from the [`History API`](https://developer.mozilla.org/en-US/docs/Web/API/History_API) to push a new route in our history and keep the traditionnal behavior.

We can also listen to the [`window.onhashchange`](https://developer.mozilla.org/en-US/docs/Web/API/Window/hashchange_event) event.
This event is triggered whenever the hash portion of the URL changes.
We can attach an event listener to it to track if the user has changed the url directly from the address bar.

## Routing code

First, we'll create a `Routes.jsx` component to centralize the hash state in our application.
This involves initializing the state with the current hash values and updating it with the onhashchange event.

Serving as a wrapper for our upcoming `Route` components, it uses a React `context` to pass hash information across all `Route` elements. We use context here because sub `Route` may not be direct children of the Routes wrapper.

```jsx
// Routes.jsx
import React, { useEffect, useState } from 'react';

export const RoutesContext = React.createContext();

export default function Routes({ children }) {
  const [hash, setHash] = useState(window.location.hash);

  useEffect(() => {
    function hashChange() {
      setHash(window.location.hash);
    }

    window.addEventListener('hashchange', hashChange);
    return () => {
      window.removeEventListener('hashchange', hashChange);
    };
  }, []);

  return (
    <RoutesContext.Provider value={hash}>
      {children}
    </RoutesContext.Provider>
  );
}
```

Now, let's create our `Route` component. It serves to render a `React element` when the current hash matches its defined hash. Using the context we set up in the `Routes` component, it retrieves the current hash information. If there's a match, it returns the passed element; otherwise, it returns `null`. This is where you could implement more complex behaviors like wildcards `*` or fallbacks.

For simplicity, we'll keep it straightforward: if there's a match, we return the element. If the defined hash is null, we assume it's the homepage. If nothing matches, it just shows a blank page.

```jsx
// Route.jsx
import { useContext } from 'react';
import { RoutesContext } from './Routes';

export default function Route({ to = null, element }) {
  const hash = useContext(RoutesContext);

  if (hash === to || (hash === '' && to === null)) {
    return element;
  }

  return null;
}
```

We can now use everything we have coded above to create a simple `App.jsx` component that will route our application. The syntax stay very close to `react-router`.

```jsx
// App.jsx
import React, { Suspense, lazy } from 'react';
import Route from './Route';
import Routes from './Routes';
import Loading from './Loading';

const Home = lazy(() => import('./Home'));
const Page1 = lazy(() => import('./Page1'));
const Page2 = lazy(() => import('./Page2'));

export default function App() {
  return (
    <>
      <header>
        <nav>
          <a href="/">Home</a>
          <a href="#page1">Page 1</a>
          <a href="#page2">Page 2</a>
        </nav>
      </header>
      <main>
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route to="#page1" element={<Page1 />} />
            <Route to="#page2" element={<Page2 />} />
            <Route element={<Home />} />
          </Routes>
        </Suspense>
      </main>
    </>
  );
}
```

Everything seems fine until we click on a `<a>` tag... Remember those default browser behaviors ?

## Linking code

As we discussed earlier, overriding the default behaviors of `<a>` tags is essential.
Rather than tackling this for each individual `<a>` tag, we'll streamline the process by creating a custom `Link` component.

```jsx
// Link.jsx
import React from 'react';

export default function Link({ to, children, state = {}, ...props }) {
  const handleClick = (e) => {
    e.preventDefault();
    window.history.pushState(state, '', to);
    window.dispatchEvent(new HashChangeEvent('hashchange'));
  };

  return <a href={to} onClick={handleClick} {...props}>{children}</a>;
}
```

The `Link` component acts as a simple wrapper around `<a>` with customized behavior.

When clicked, the `onClick` method first invokes `preventDefault` on the click event to halt any default browser actions, such as page reloading.

Next, we utilize the `History API` to push our new route, followed by dispatching a [`HashChangeEvent`](https://developer.mozilla.org/en-US/docs/Web/API/HashChangeEvent) for our `Routes.jsx` component to intercept and update all relevant components through the context.

With these updates in place, our `App.jsx` component should function correctly now:

```jsx
// App.jsx
import React, { Suspense, lazy } from 'react';
import Link from './Link';
import Route from './Route';
import Routes from './Routes';
import Loading from './Loading';

const Home = lazy(() => import('./Home'));
const Page1 = lazy(() => import('./Page1'));
const Page2 = lazy(() => import('./Page2'));

export default function App() {
  return (
    <>
      <header>
        <nav>
          <Link to="/">Home</Link>
          <Link to="#page1">Page 1</Link>
          <Link to="#page2">Page 2</Link>
        </nav>
      </header>
      <main>
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route to="#page1" element={<Page1 />} />
            <Route to="#page2" element={<Page2 />} />
            <Route element={<Home />} />
          </Routes>
        </Suspense>
      </main>
    </>
  );
}
```

So there you have it! We've built a simple client-side routing system in React using browser hashes. With hooks, components, and some event handling magic, we've created a lightweight alternative to `react-router`.

There's still plenty of room for upgrades and enhancements, do as you please.
