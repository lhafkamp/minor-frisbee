# minor-frisbee
Assignment for Windmill, a real-time score app for the upcoming ultimate frisbee tournaments.

## Concept
One of the most remarkable things about Ultimate Frisbee is that there is no referee on the field to blow a whistle when something goes wrongs. In Ultimate Frisbee, anyone can decide whether it was a goal or not. In this app I want to enhance this honorable task by giving the users the option to vote for goals. The users can all decide if a point should be increased or stay the same whether on what they think is right, the majority vote wins and settles the score.

## Core functionality
-  [x] oauth2 login with the Leaguevine API
-  [x] a page that displays the matches in the tournament
-  [x] the ability to go to that match in order to participate in the score event
-  [ ] a 30 second time-based event where users can vote real-time to increase/halt the score of both teams
-  [ ] socket rooms with their own unique time-based events
-  [ ] voting interface is only enabled during the time-based event
-  [x] an option to adjust the score
-  [x] an option to send the score to the Leaguevine API

## Core flow
<img src="media/coreflow.png"/>

## Extra features
-  [ ] real-time percentage of votes in the time-based events
-  [ ] display all tournament matches (pools/brackets/finals etc)
-  [ ] different roles for players/organizers
-  [ ] stats on the teams that are competing during the voting event

## TODO
-  [x] saving the voting events/game rooms in a database
-  [ ] synchronise the voting system or let incoming users wait
-  [ ] enable the interface during the time-based event, disable it otherwise
-  [ ] users should only be able to vote once during a time-based event
-  [ ] feedback about the voting process
-  [ ] loading indicator
-  [ ] styling
-  [ ] UX
-  [ ] feature detection where a user that cannot vote won't see the voting interface

## Coding process
### Week 1
The first week I started out by getting to know the Leaguevine API. I set up the OAuth 2.0 protocol so that users can log in with Leaguevine in order to get the correct data/rights for the app. The most important thing I had to check was to see if I could make a POST to the API with an adjustable score. The way I did this that was to move the adjustable score into another "final score" form where the user could still adjust it if the event/scoring would have gone wrong. After I fixed that I knew I could start making the app.

-  [x] researched the API
-  [x] OAuth 2.0 protocol
-  [x] simple increment/decrement interface where users could raise/lower the score of each team
-  [x] a final score form where the changed numbers are put in as values, can still be changed by the user
-  [x] POST the final score to the API
-  [x] made a client side time event prototype

### Week 2
This week it was important that the time-based events could be done in real-time. The biggest challenge was getting multiple rooms to show unique events, next to socket rooms I had to add a database so that users would see the same data when they just entered an ongoing socket event. I tried out Lockr, a server side version of localStorage but it didn't live up to my standards because I would lose all data when the client/Javascript would not work for some reason. I decided to stick to MongoDB and carry on. 

To my suprise I managed to get a lot of the technical difficulties working which gives me a lot of confidence to finish the app properly. The next big challenge is being able to exact synchronised data when joining an ongoing event, the best solution here might be to let the user know that he has to wait for the event to be over.

-  [x] got all pool matches to display on the main page
-  [x] each pool match has its unique page/data using socket rooms
-  [x] added MongoDB for the voting events in each room
-  [x] made the voting event timer server side instead of client side
-  [x] all voting data gets saved real-time so a user can join a room while a voting event is being played and still participate (there are still some sync issues)

