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

                    const params = new URLSearchParams(window.location.search)

                    result.user.getIdToken()
                        .then((token) => {
                            const code = params.get("ot-auth-code")
                            fetch(`https://us-central1-authentication-ab4cc.cloudfunctions.net/api/create-auth-token?ot-auth-code=${code}&id-token=${token}`)
                                .then((response) => {
                                    response.json()
                                        .then(() => {
                                            window.close()
                                        })
                                })
                        })
                }
            })
    }, [auth, loading, signIn]);

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