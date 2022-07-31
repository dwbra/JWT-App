# JWT Application

## A simple Typescript/ReactJS and NodeJS application to illustrate JWT and how to secure user data on the clientside.

I was interested in understanding more about JWT and exactly how it worked so I thought making a simple application with a login form with a component that could only be accessed with a correctly signed JWT token was the best way to accomplish this.

Therefore on the server side, using Express, Mongoose and Mongodb, I created a series of functions to handle userAuth scenarios and also JWT token generation. There is a JWT function that is used to check a users JWT token from the frontend and ensure the token is still valid. If it is they can continue to access the home page, if not, they are redirected to the auth component.

I used Universal Cookie library to help achieve this on the clientside. I also used conditional logic alongside ReactJS useState hooks to determine which component is rendered on the "/" route at the parent app level.

#### Install Instructions

Run npm i in both the client and server folders.
Run npm run start in the client folder
Open a new temrinal tab, cd into the server folder and then run npm run dev

Be sure to create an .env file in your server root folder and enter your mongodb URL, secrets, and JWT secrets.

Cheers,
Dan
