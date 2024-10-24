import { useEffect, useState } from 'react';
import {
  ActionFunction,
  Form,
  Link,
  LoaderFunction,
  NavLink,
  Outlet,
  useLoaderData,
  useNavigation, useSubmit
} from 'react-router-dom';
import { createContact, getContacts } from '../contacts.js';
import { ContactDTO } from '../models/ContactDTO';

export const rootLoader: LoaderFunction = async ({ request }): Promise<{ contacts: ContactDTO[], q: string }> => {
  const url = new URL(request.url);
  const q = url.searchParams.get("q") || "";
  const contacts = await getContacts(q);
  return {contacts, q}
}

export const rootAction: ActionFunction = async (): Promise<ContactDTO> => {
  return await createContact();
}

export const Root = () => {

  const { contacts, q } = useLoaderData() as ContactDTO[];
  const [query, setQuery] = useState<string>(q);
  const navigation = useNavigation();
  const submit = useSubmit();

  const searching =
    navigation.location &&
    new URLSearchParams(navigation.location.search).has(
      "q"
    );

  useEffect(() => {
    setQuery(q);
  }, [q]);

  return (
    <>
      <div id="sidebar">
        <h1>React Router Contacts</h1>
        <div>
          <Form id="search-form" role="search">
            <input
              id="q"
              aria-label="Search contacts"
              placeholder="Search"
              className={searching ? "loading" : ""}
              type="search"
              name="q"
              value={query}
              onChange={(event) => {
                const isFirstSearch = q == null;
                submit(event.currentTarget.form, {
                  replace: !isFirstSearch,
                });
              }}
            />
            <div
              id="search-spinner"
              aria-hidden
              hidden={!searching}
            />
            <div
              className="sr-only"
              aria-live="polite"
            ></div>
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
                  <NavLink
                    to={`contacts/${contact.id}`}
                    className={({ isActive, isPending }) =>
                      isActive
                      ? "active"
                      : isPending
                        ? "pending"
                        : ""
                    }
                  >
                    {contact.first || contact.last ? (
                      <>
                        {contact.first} {contact.last}
                      </>
                    ) : (
                       <i>No Name</i>
                     )}{" "}
                    {contact.favorite && <span>★</span>}
                  </NavLink>
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
      <div id="detail"
           className={
             navigation.state === "loading" ? "loading" : ""
           }
      >
        <Outlet />
      </div>
    </>
  );
};