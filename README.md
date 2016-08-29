# Test 2

## To use

### Node

```sh
npm install
node server.js
```

And visit <http://localhost:3000/>. Try opening multiple tabs!

## Changing the port

You can change the port number by setting the `$PORT` environment variable before invoking any of the scripts above, e.g.,

```sh
PORT=3001 node server.js
```

!!! ----- IMPORTANT ----- !!!!

Widget Explanation

When user enters something on input field and submits the form the code will follow this logic:

1. Make a get request to twitter for tweets related to the text submitted by the user.
2. Search for hashtags inside all tweets retrieved that are equal to user's input, or hashtags that contains user input inside them with a basic regex. E.g input: AIN will match hashtags #PAIN #AIN #ain #drain #NoPain (regex is case-insensitive so we can have more results).
3. In case we couldn't find hashtags matching user input, a second response array is always filled with a max of 6 different hashtags found on the tweets retrieved by get request.
4. In case all the tweets retrieved by get request don't contain any hashtag, a third response array is filled with fixed suggestions (hardcoded).
5. Finally we checked if first array (the one with real matches) is not empty, if that's the case that will be the array with the hashtags that will be shown to the user as results of the search, if not we will go with the second array (the one with suggestions from hashtags found on tweets retrieved), if both arrays (1st and 2nd) are empty we will always have 3rd (hardcoded array) to send as response.

Important Notes: 
1. I noticed that suggestions must come from dictionary.com but I couldn't find an API for that quickly, so I decided to took the approach explained above for the suggestions, which I think makes sense for the sake of this test.

2. I didn't have time to implement a loader so be pacient after you submit the form, 100 tweets sometimes takes a little time to be retrieved and manipulated.