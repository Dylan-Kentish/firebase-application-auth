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

    useEffect(() => {
        if (loading) return

        getRedirectResult(auth)
            .then(result => {
                if (!result) {
                    console.log("result is null")
                    signIn()
                } else {
                    console.log("Grabbed the user", result.user)

                    if (!result.user) {
                        return
                    }

                    result.user.getIdToken()
                        .then((token) => {
                            fetch(`https://us-central1-authentication-ab4cc.cloudfunctions.net/api/createAuthToken?id-token=${token}`)
                                .then((response) => {
                                    response.json()
                                        .then((json) => {
                                            window.location.replace(`vortex-client://signIn?authToken=${json.token}`)
                                        })
                                })
                        })
                }
            })
    }, [loading, signIn]);

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