# firebase-electron-auth

This repository demonstrates using the firebase/auth functionality.

The endpoint /desktopSignin redirects the user to google authentication.

Once authenticated the user returns to the web app. The web app then makes use of the function in [electron-firebase-auth-functions](https://github.com/Dylan-Kentish/electron-firebase-auth-functions) to retrieve a custom token.

The web app then redirects the user to a custom protocol, which is assumed to be handled by an installed electron application.

This flow is suitable for custom authentication within an untrusted application.

