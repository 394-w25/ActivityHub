# ActivityHub/MeetQuest
A smart social discovery app that effortlessly connects people for real-life experiences. Whether you're looking for a coffee buddy, a workout partner, or someone to explore a new city with, this app helps you find the right people at the right time, based on shared interests and availability.

This application supports multiple sign-up options, matching and discovery, in-app communication, and safety and trust features.

# Function Demo

ActivityHub has many features to facilitate meeting others in many contexts. You can log onto the app through Google or with an email and password.

Once on the app, you'll be greeted by the following homescreen:

[image]

From this screen, you can find events around you and send your interest to the creator of said event.

In the sidebar, we can see the full functionality of the app:

[sidebar image]

As of now, "My Profile", "Notifications", "Messages", "Create Activity", and "Sign Out" are implemented. There is UI functionality for "Saved" but nothing further.

On the home page, you're able to filter and sort posts by various criteria. Once you've found an activity you like, click on it to open further details. 

[activity details image here]

From here, you can send your interest to the host, view their profile for security, and even message them to ask further questions.

The host can accept your interest in their notifications tab. The two of you can then work out the details through the messages feature.

If you're creating an event, you can add data to help people find your event easier. We provide metadata such as tags and a specification of what you're looking for. You can add an image and address to the event, set a maximum group size, and specify a start and end time.

[create event image]

Users specify tags they're interested in during the onboarding - this currently doesn't affect the feed.

This app provides great functionality for users who want to meet people in their area through activities!

## Feature Set
- Login (Google and Manual)
- Onboarding
- Posts Feed (posts reflected on map)
- Create Posts
- View Post Details
- Send Interest in Event
- View Host Profile from Event
- Messaging
- Filtering and Sorting Posts
- Notification Center
- Message Notifications
- Notification of Interest
- Host Accepts Interest in Event

# Requirements

Firebase.
Node 20 or greater.

## Usage

```
mkdir your-app-name
cd your-app-name
npx degit criesbeck/react-vitest
npm install
```

If the third step hangs after printing `> cloned criesbeck/react-vitest#HEAD`,
just control-C to exit then run `npm install`.

Create a Firebase account at https://firebase.google.com/.
Configuration data can go inside `firebase.json`.
Data in JSON format can be imported into Firebase's Realtime Database.

An account at https://stadiamaps.com/ is required to ues the Stadia Maps OSM API.

## Test

Verify that the initial app works. Run

```
npm start
```

and open the URL displayed.

Verify that the unit tests work with

```
npm test
```

Two tests should run and pass.

## Scripts

**package.json** defines the following scripts:

| Script           | Description                                         |
| ---------------- | --------------------------------------------------- |
| npm start        | Runs the app in the development mode.               |
| npm run dev      | Runs the app in the development mode.               |
| npm run build    | Builds the app for production to the `dist` folder. |
| npm run serve    | Serves the production build from the `dist` folder. |
| npm test         | Starts a Jest-like test loop                        |
| npm run coverage | Runs the tests, displays code coverage results      |

## Credits

React-Vitest built and maintained by [Chris Riesbeck](https://github.com/criesbeck).

Inspired by [SafdarJamal/vite-template-react](https://github.com/SafdarJamal/vite-template-react).
Expanded to include Vitest and some sample tests.

Thanks to Rich Harris for [degit](https://www.npmjs.com/package/degit).

Gitignore file created with [the Toptal tool](https://www.toptal.com/developers/gitignore/api/react,firebase,visualstudiocode,macos,windows).

## License

This project is licensed under the terms of the [MIT license](./LICENSE).
