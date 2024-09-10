/*
    In Remix, routes are created in file system convention.
    Breaking down the file name:
        contacts: created a route `/contacts`
        (.): indicates a nested route in `/contacts/`
        $contactId: ($) creates a dynamic route segment where the 'contractId'
            value can be captured as a parameter and used in your component or loader
*/


import { Form, json, useLoaderData } from "@remix-run/react";
import type { FunctionComponent } from "react";

import { getContact, type ContactRecord } from "../data";
import { LoaderFunctionArgs } from "@remix-run/node";
import invariant from "tiny-invariant";

export const loader = async({params}: LoaderFunctionArgs) => {
    invariant(params.contactId, "Missing contactId param"); //check if param exists else throw an error
    const contact = await getContact(params.contactId); // get contact
    if (!contact) { // if contact doesn't exist throw error
        throw new Response("Not Found", { status: 404 });
    }
    return json({contact}); //return contact if it exists
}

const Contact = () => {
    const { contact } = useLoaderData<typeof loader>(); //using contact data from the loader

    return (
        <div id="contact">
            <div>
                <img
                alt={`${contact.first} ${contact.last} avatar`}
                key={contact.avatar}
                src={contact.avatar}
                />
            </div>

            <div>
                <h1>
                {contact.first || contact.last ? (
                    <>
                    {contact.first} {contact.last}
                    </>
                ) : (
                    <i>No Name</i>
                )}{" "}
                <Favorite contact={contact} />
                </h1>

                {contact.twitter ? (
                <p>
                    <a
                    href={`https://twitter.com/${contact.twitter}`}
                    >
                    {contact.twitter}
                    </a>
                </p>
                ) : null}

                {contact.notes ? <p>{contact.notes}</p> : null}

                <div>
                <Form action="edit">
                    <button type="submit">Edit</button>
                </Form>

                <Form
                    action="destroy"
                    method="post"
                    onSubmit={(event) => {
                    const response = confirm(
                        "Please confirm you want to delete this record."
                    );
                    if (!response) {
                        event.preventDefault();
                    }
                    }}
                >
                    <button type="submit">Delete</button>
                </Form>
                </div>
            </div>
        </div>
    );
}

const Favorite: FunctionComponent<{
  contact: Pick<ContactRecord, "favorite">;
}> = ({ contact }) => {
  const favorite = contact.favorite;

  return (
    <Form method="post">
      <button
        aria-label={
          favorite
            ? "Remove from favorites"
            : "Add to favorites"
        }
        name="favorite"
        value={favorite ? "false" : "true"}
      >
        {favorite ? "★" : "☆"}
      </button>
    </Form>
  );
};

export default Contact;