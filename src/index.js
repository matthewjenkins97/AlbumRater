import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { BrowserRouter as Router } from 'react-router-dom';
import { Auth0Provider } from "@auth0/auth0-react";

ReactDOM.render(<Router basename={process.env.PUBLIC_URL}>
    <Auth0Provider
        domain="dev-06brcesa.us.auth0.com"
        clientId="aExrjSgZXrCRZAcUVZ9Ol6w2P3nBkrue"
        redirectUri={window.location.origin + window.location.pathname}
        audience="https://dev-06brcesa.us.auth0.com/api/v2/"
        scope="read:current_user read:user_idp_tokens offline_access"
    >
        <App />
    </Auth0Provider>
</Router>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
