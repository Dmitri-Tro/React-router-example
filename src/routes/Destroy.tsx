import { ActionFunction, redirect } from 'react-router-dom';
import { deleteContact } from '../contacts';

export const destroyAction: ActionFunction = async ({ params }) => {
  await deleteContact(params.contactId);
  return redirect("/");
}
