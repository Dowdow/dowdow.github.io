# Enhancing our hash routing system with parameters and typescript

This article is a follow-up to [this one](#posts#routing), written last year.
To quickly recap, we built a routing system inspired by [`react-router`](https://reactrouter.com/), but based entirely on browser hashes. It's still being used on this website today.

However, the original version only supported static routes.
With the addition of a blog system, I needed dynamic routes, so I wouldn't have to create a new React component for every single article.
Also, since I migrated this site to TypeScript, this new version includes improvements and is fully written in TypeScript.

Now that we know where we want to go with this routing system, and still taking inspiration from React Router, we need a way to handle route parameters.

In a typical setup, you'd have route declarations like `/post/{slug}`.

That means the route for a blog post would look like `#post#{slug}`

And for this specific article, it would be `#post#routing-enhancement`

This means we’ll need a system to parse parameters from the URL, based on the route declaration.  
But also a way to generate routes dynamically based on those parameters.

## Parameter format

First of all, we need to create a `Param` type to represent our parameters, both for the route generation and parsing:

```tsx
// context.ts
export type Params = { [s: string]: string };
```

## Generating a route

Before we parse a route to determine which article to display in a `Post` component, let’s first look at how to generate a route in the `Posts` component.

This component lists all articles, and for each one, it includes our custom `<Link />` element.

What we want is a simple way to transform our route template with `{param}` placeholders, to an usable url in the browser.
Here’s the kind of result we’re aiming for:

```tsx
// Posts.tsx
export default function Posts() {
  const posts = usePosts();

  return (
    <div className="grid">
      {posts.map(({ title, slug }) => (
        <Link to={generateRoute("#post#{slug}", { slug })}>
          {title}
        </Link>
      )}
    </div>
  );
}
```
The code to convert a route template into a usable browser URL is pretty straightforward:
we just replace each `{param}` with its actual value.

With the `Param` type, this also allows us to use `reduce` and `replaceAll` easily:

```ts
// routing.ts
import { type Params } from "./context";

export function generateRoute(route: string, params: Params = {}) {
  return Object.entries(params).reduce(
    (acc, [key, value]) => acc.replaceAll(`{${key}}`, value),
    route,
  );
}
```

With this approach, a route like `#post#{id}-{slug}#{id}` would be transformed into the URL: `#post#3-test#3`  
using this call:
```ts
generateRoute("#post#{id}-{slug}#{id}", { id: 3, slug: "test" })
```

## Parsing a route with parameters

Following the pattern used in React Router, we want to create a `useParams` hook that returns an object with all the parameters from the current URL.

For example, given the route template `#post#{slug}` and the current URL `#post#article1`, the hook should return: `{ slug: "article1" }`

So we can use it like this:

```tsx
// Post.tsx
export default function Post() {
  const { slug } = useParams();
  const { title, content } = usePost(slug);

  return (
    <article>
      <h1>{title}</h1>
      <p>{content}</p>
    </article>
  );
}
```

But this introduces a new problem.

The `Post` component knows the current URL is `#post#article1`,
but that could match multiple route patterns, like `#post#{slug}` or `#post#{slug}{id}`.
So how can it know which one to use?

The answer is: **it shouldn’t**.
It's not the responsibility of the `Post` component to figure that out.

Instead, we need to update our `Routes` and `Route` components so they also understand parameterized routes.

## Updating the old Route* components

Taking all of this into account, the `Route` component now needs to be smart enough to tell whether its pattern matches the current URL,
and not just rely on something simple like `currentHash === myRouteHash`.

The `Routes` component, which manages the `RoutesContext`, also needs to expose more tools so both `Route` and the `useParams` hook can do their jobs properly.

To achieve this, the `RoutesContext` should no longer be just a simple string containing the current hash.
Instead, it should become a proper payload that still includes the hash, but also:
- the actual parameters extracted from the matching `Route` components
- and a function that allows `Route` components to register those parameters

Here is our new context:

```tsx
// context.ts
import { createContext } from "react";

export type Params = { [s: string]: string };

interface RoutesContextType {
  hash: string;
  params: Params;
  addParams: (params: Params) => void;
}

export const RoutesContext = createContext<RoutesContextType>({
  hash: "",
  params: {},
  addParams: () => {},
});

```

Here is our new `Routes` component:

```tsx
// Routes.tsx
import { useCallback, useEffect, useMemo, useReducer, useState, type PropsWithChildren} from "react";
import { RoutesContext, type Params } from "./context";

const ADD = "add";
const RESET = "reset";

interface ReducerType {
  type: string;
  payload: Params;
}

function reducer(
  state: Params = {},
  action: ReducerType = { type: "", payload: {} },
): Params {
  switch (action.type) {
    case ADD:
      return { ...state, ...action.payload };
    case RESET:
      return {};
    default:
      return state;
  }
}

export default function Routes({ children }: PropsWithChildren) {
  const [hash, setHash] = useState(window.location.hash);
  const [params, dispatch] = useReducer(reducer, {});

  useEffect(() => {
    function hashChange() {
      setHash(window.location.hash);
      dispatch({ type: RESET });
    }

    window.addEventListener("hashchange", hashChange);
    return () => {
      window.removeEventListener("hashchange", hashChange);
    };
  }, []);

  const addParams = useCallback((params: Params) => {
    dispatch({ type: ADD, payload: params });
  }, []);

  const payload = useMemo(
    () => ({ hash, params, addParams }),
    [hash, params, addParams],
  );

  return (
    <RoutesContext.Provider value={payload}>{children}</RoutesContext.Provider>
  );
}
```

Here, we use a reducer to store all the parameters coming from the `Route` components that matched, and we define the `addParams` method so each `Route` component can report its parameters back up.

Don’t forget to clear the params array when the route changes, typically inside the function that listens to the `hashchange` event.

With this in place, the `useParams` hook becomes very straightforward:

```tsx
// routing.ts
import { useContext } from "react";
import { RoutesContext, type Params } from "./context";

export function useParams(): Params {
  const { params } = useContext(RoutesContext);
  return params;
}
```

It simply returns the computed parameters from the `RoutesContext`.

Now we just need to update the `Route` component so it can parse the new route patterns, determine whether it matches, and send the matched parameters back to the context:

```tsx
// Route.tsx
import { useContext, useEffect, useMemo } from "react";
import { RoutesContext, type Params } from "./context";

interface RouteProps {
  to?: string;
  element: React.ReactNode;
}

const paramRegex = /\{[A-Za-z0-9]+\}/g;

export default function Route({ to = "", element }: RouteProps) {
  const { hash, addParams } = useContext(RoutesContext);

  const regex = useMemo(
    (): string => to.replaceAll(paramRegex, "([A-Za-z0-9\\-]+)"),
    [to],
  );

  const paramKeys = useMemo(
    (): string[] =>
      to.match(paramRegex)?.map((t) => t.replace("{", "").replace("}", "")) ??
      [],
    [to],
  );

  const matches = hash.match(regex);

  useEffect(() => {
    if (matches !== null && matches.includes(hash)) {
      matches.shift();
      addParams(
        paramKeys.reduce((acc: Params, key, index) => {
          acc[key] = matches[index];
          return acc;
        }, {}),
      );
    }
  }, [hash, regex, paramKeys, matches, addParams]);

  if (matches === null || !matches.includes(hash)) {
    return null;
  }

  return element;
}
```

We begin by processing the route pattern from `to` using a regex to extract all parameter names.  
These names are stored in `paramKeys`.

Then, using the same regex on the current `hash`, we check whether it matches and extract the corresponding parameter values.

Inside the `useEffect`, we send the matched parameters back to the context by merging the extracted keys with their values.

## Final result

You should now be able to use the entire system like this:

```tsx
// App.tsx
<Routes>
  <Route to="#posts" element={<Posts />} />
  <Route to="#post#{slug}" element={<Post />} />
</Routes>

// Posts.tsx
export default function Posts() {
  const posts = usePosts();

  return (
    <div className="grid">
      {posts.map(({ title, slug }) => (
        <Link to={generateRoute("#post#{slug}", { slug })}>
          {title}
        </Link>
      )}
    </div>
  );
}

// Post.tsx
export default function Post() {
  const { slug } = useParams();
  const { title, content } = usePost(slug);

  return (
    <article>
      <h1>{title}</h1>
      <p>{content}</p>
    </article>
  );
}
```

The hash-based routing system is still intentionally simple, but now it comes with much more practical functionality.
There’s still plenty of room for improvement, and I may write a follow-up post if new needs arise or if the system evolves further.

For now, this version is lightweight, flexible, and perfectly suited for small projects, or for anyone who wants to understand how routing works under the hood without relying on a full framework.
