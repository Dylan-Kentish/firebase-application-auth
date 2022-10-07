import React, { useEffect, useCallback } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase"
import {
    GoogleAuthProvider,
    signInWithRedirect,
    getRedirectResult,
} from "firebase/auth";

function Dashboard() {
    const [user, loading] = useAuthState(auth);

    const signIn = useCallback(async () => {
        const provider = new GoogleAuthProvider()
        await signInWithRedirect(auth, provider)
    }, [])

    const getAuthToken = useCallback(async (user) => {
        const token = await user.getIdToken()

        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                authorization: `Bearer ${token}`
            }
        }
        const response = await fetch(`https://us-central1-authentication-ab4cc.cloudfunctions.net/api/custom-token`, options)
        const json = await response.json()
        window.location.replace(`my-app://signIn?authToken=${json.token}`);
    }, [])

    useEffect(() => {
        if (loading) return

        if (user) {
            return getAuthToken();
        } else {
            getRedirectResult(auth)
                .then(result => {
                    if (!result) {
                        signIn()
                    } else {
                        if (!result.user) {
                            return
                        }
                        return getAuthToken();
                    }
                })
        }
    }, [loading, user, getAuthToken, signIn]);

    return (
        <div className="dashboard">
            {
                !user &&
                <button
                    className="login__btn"
                    onClick={signIn}>
                    Login
                </button>
            }
            {
                user &&
                <div>
                    <p>Logged in to google.</p>
                    <p>now return to the app.</p>
                </div>
            }
        </div>
    );
}
export default Dashboard;
