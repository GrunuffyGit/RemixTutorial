import {
  Form,
  Link,
  /* <Link /> enables client-side rendering */
  Links,
  Meta,
  Outlet,
  /* <Outlet /> component acts as a placeholder for rendering child routes */
  Scripts,
  ScrollRestoration,
  json,
  useLoaderData,
} from "@remix-run/react";
import type { LinksFunction } from "@remix-run/node";
/* LinksFunction is a type in remix where a function returns an array of object that defines links
such as stylesheet that should be included in the HTML */
import appStylesHref from "./app.css?url";
import { getContacts } from "./data";
/* importing the stylesheet as a url
`?url` is a query paramenter that tells webpack that to import as a url instead of a module
*/

export const links: LinksFunction = () => [
  /* `links` is a special function in Remix. Remix automatically recognizes this function.
  It will call this function during server-side rendering to get a list of link tags that 
  should be included in the <head> section of HTML document.

  In this case, it is returning an array of objects. 
  This object has two properties:
    - rel: relationship of the link which it to a stylesheet
    - href: the url
  */
  { rel: "stylesheet", href: appStylesHref },
];

export const loader = async() => {
  /* `loader` is a special function in Remix. `loader` will make a server-side call to get data
  when the route is requested before rendering the page. The fetched data will be passed onto
  the component using useLoaderData hook.
  */
  const contacts = await getContacts();
  return json({contacts});
}

export default function App() {
  const {contacts} = useLoaderData<typeof loader>();

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <div id="sidebar">
          <h1>Remix Contacts</h1>
          <div>
            <Form id="search-form" role="search">
              <input
                id="q"
                aria-label="Search contacts"
                placeholder="Search"
                type="search"
                name="q"
              />
              <div id="search-spinner" aria-hidden hidden={true} />
            </Form>
            <Form method="post">
              <button type="submit">New</button>
            </Form>
          </div>
          <nav>
            {contacts.length ? (
              <ul>
                {contacts.map((contact) => (
                  <li key={contact.id}>
                    <Link to={`contacts/${contact.id}`}>
                      {contact.first || contact.last ? (
                        <>
                          {contact.first} {contact.last}
                        </>
                      ) : (
                        <i>No Name</i>
                      )}{" "}
                      {contact.favorite ? (
                        <span>★</span>
                      ) : null}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p>
                <i>No contacts</i>
              </p>
            )}
          </nav>
        </div>
        <div id="detail">
          <Outlet />
          {/* This is where children route components will render */}
        </div>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
