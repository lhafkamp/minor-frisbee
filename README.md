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
-  [ ] feedback about the voting process
-  [ ] loading indicator
-  [ ] styling
-  [ ] UX
-  [ ] feature detection where a user that cannot vote won't see the voting interface

