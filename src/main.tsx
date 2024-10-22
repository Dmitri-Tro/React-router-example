import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ErrorPage } from './ErrorPage';
import { Index } from './routes';
import { Contact, contactAction, contactLoader } from './routes/Contact';
import { destroyAction } from './routes/Destroy';
import { editAction, EditContact } from './routes/Edit';
import { Root, rootLoader, rootAction } from './routes/Root';

const router = createBrowserRouter( [
  {
    path: '/',
    element: <Root/>,
    errorElement: <ErrorPage/>,
    loader: rootLoader,
    action: rootAction,
    children: [
      { index: true, element: <Index/> },
      {
        path: 'contacts/:contactId',
        element: <Contact/>,
        loader: contactLoader,
        action: contactAction,
      },
      {
        path: 'contacts/:contactId/edit',
        element: <EditContact/>,
        loader: contactLoader,
        action: editAction,
      },
      {
        path: 'contacts/:contactId/destroy',
        action: destroyAction,
        errorElement: <div>Oops! There was an error.</div>,
      },
    ],
  },
] );

createRoot( document.getElementById( 'root' ) ).render(
  <StrictMode>
    <RouterProvider router={ router }/>
  </StrictMode>,
);
