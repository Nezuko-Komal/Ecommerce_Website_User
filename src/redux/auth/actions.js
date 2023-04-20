import { LOGIN_SUCCESS, LOGIN_FAILED, LOGOUT_REQUEST, SIGNUP_REQUEST, SIGNUP_SUCCESS, SIGNUP_FAILED } from "./action_types";

const SERVER_URL = process.env.REACT_APP_SERVER_URL;

const native_login = async (dispatch, get_state) => {

    const { form_data } = dispatch(get_state).AuthReducer;

    try {
        let response = await fetch(`${SERVER_URL}/account/login`, {
            method: "POST",
            body: JSON.stringify(form_data),
            headers: {
                "Content-Type": "application/json"
            }
        })

        let json = await response.json();

        if (json.error) {
            alert(json.error);
            return;
        }

        if (json.failed) {
            alert(json.failed);
            return;
        }


        dispatch({ type: LOGIN_SUCCESS, payload: { token: json.success.token, user: { name: json.success.name, email: json.success.email } } });
    } catch (error) {
        alert(error.message);
        dispatch({ type: LOGIN_FAILED, payload: error.message });
    }
}

const token_login = async (dispatch, get_state) => {

    const { token } = dispatch(get_state).AuthReducer;

    try {
        let response = await fetch(`${SERVER_URL}/account/token`, {
            method: "POST",
            headers: {
                "authorization": `Bearer ${token}`
            }
        })

        let json = await response.json();

        if (json.error) {
            let [key, message] = json.error.split(":");
            alert(message);
            return;
        }

        if (json.failed) {
            alert(json.failed);
            return;
        }

        dispatch({ type: LOGIN_SUCCESS, payload: { token: token, user: { name: json.success.name, email: json.success.email } } });
    } catch (error) {
        alert(error.message);
        dispatch({ type: LOGIN_FAILED, payload: error.message });
    }
}

const signup_request = async (dispatch, get_state) => {

    const { form_data } = dispatch(get_state).AuthReducer;

    try {
        let response = await fetch(`${SERVER_URL}/account/register`, {
            method: "POST",
            body: JSON.stringify(form_data),
            headers: {
                "Content-Type": "application/json"
            }
        })
        let json = await response.json();
        alert("Signup successful please login");
        dispatch({ type: SIGNUP_SUCCESS });
    } catch (error) {
        const [key, message] = error.message.split(":");
        alert(message);
        dispatch({ type: SIGNUP_FAILED, payload: message });
    }
}


const logout_request = (dispatch, get_state) => {
    localStorage.removeItem("isAuth");
    localStorage.removeItem("current_user");
    dispatch({ type: LOGOUT_REQUEST });
}

export { native_login, token_login, signup_request }