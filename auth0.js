let auth0 = null;
const fetchAuthConfig = () => fetch("/auth_config.json");

const configureClient = async () => {

    const response = await fetchAuthConfig();
    const config = await response.json();
  
    auth0 = await createAuth0Client({
      domain: config.domain,
      client_id: config.clientId
    });
  };


  window.onload = async () => {
    console.log('window.onload');
    await configureClient();
    
    updateUI();
    const isAuthenticated = await auth0.isAuthenticated();

    if (isAuthenticated) {
        //show content that should only be shown if the user is authenticated (profile, logout button, etc)
        console.log('user is authenticated');
        return;
    }

    //check for the code and state parameters
    const query = window.location.search;
    
    if (query.includes("code=") && query.includes("state=")) {

        // Process the login state
        await auth0.handleRedirectCallback();
    
        updateUI();

        // Use replaceState to redirect the user away and remove the querystring parameters
        window.history.replaceState({}, document.title, "/");
    }
}

const updateUI = async () => {    
    const isAuthenticated = await auth0.isAuthenticated();
    //document.getElementById("btn-logout").disabled = !isAuthenticated;
    //document.getElementById("btn-login").disabled = isAuthenticated;
  };

async function universalLogin(){
    await auth0.loginWithRedirect({
        redirect_uri: "http://localhost:51761" //needs to be set in auth0 under the makerzero application
    });
}