<h1 align="center">
  <img src="media/demo.jpg" alt="demo">
  <br>
  <br>
  Windmill score app
</h1>
<br>

## Live version
<a href="http://minor-frisbee.herokuapp.com/">Live demo here</a>. Go to /admin and log in to get extra functions like updating the final score.

## Concept
One of the most remarkable things about Ultimate Frisbee is that there is no referee on the field to blow a whistle when something goes wrongs. In Ultimate Frisbee, its not always clear which team made a goal or not. In this app I want to enhance this honorable task by giving the users the option to vote for which team made the goal so that its clear for everyone. The users can all decide if a point should be increased or stay the same whether on what they think is right, the majority vote wins and settles the score.

## Core functionality
-  [x] oauth2 login with the Leaguevine API
-  [x] a page that displays the matches in the tournament
-  [x] the ability to go to that match in order to participate in the score event
-  [x] a 15 second time-based event where users can vote real-time to increase/halt the score of both teams
-  [x] socket rooms with their own unique time-based events
-  [x] voting interface is only enabled during the time-based event
-  [x] an option to adjust the score in the end
-  [x] an option to send the score to the Leaguevine API
-  [x] time event button shouldn't be accessible during the time event
-  [x] user needs to be notified when entering a room during a time event

## Extra features
-  [x] real-time percentage of votes in the time-based events
-  [x] cool animations
-  [x] a progress bar for the time event
-  [x] admin role
-  [x] success message after submitting the score
-  [x] see what match just got updated on the main page
-  [x] ability to change the team colors real-time
-  [x] scores on the main page (not real-time)
-  [x] user gets notified when offline
-  [x] user gets notified when the server is offline
-  [x] looks like a native app when you put it on your homescreen (Android)

## Core flow
<img src="media/coreflow.png"/>

## Getting the matches from the Leaguevine API
<img src="media/matches.png" width="20%"/>

## Changing team colors
<img src="media/color.png" width="20%"/>

## Voting
<img src="media/voting.png" width="20%"/>

## Wait for voting to end
<img src="media/wait.png" width="20%"/>

## Submit final score (admin)
<img src="media/finalscore.png" width="20%"/>

## Success message
<img src="media/success.png" width="20%"/>

## Server/Internet down
<img src="media/server.png" width="20%"/>
<img src="media/offline.png" width="20%"/>

## Feature detection/progressive enhancement
Here I make sure the voting options are only available when you have Javascript. These elements have 'display = none' class on them and once the Javascript gets loaded this class gets removed:
```Javascript
startButton.classList.remove('hide');
progress.classList.remove('hide');
votingOptions.forEach(function(option) {
	return option.classList.remove('hide');
});
```

Progressive enhancement for when the user supports input type="color":
```Javascript
colorInputs.forEach(function(input) {
	if (input.type === 'color') {
		input.classList.remove('hide');
	} else {
		input.value = null;
	}
});
```

A fallback for when a browser doesn't support SVG:
```HTML
<img src="/images/frisbee.svg" onerror="this.onerror=null,this.src="/images/frisbee.png""/>
```

For when a browser doesn't support flexbox:
```CSS
@supports not (display: -webkit-flex) or (display: -moz-flex) or (display: flex) {
}
```


## Performance
-  [x] Gzip
-  [x] Uglify bundle.js

## Coding process
### Week 1
The first week I started out by getting to know the Leaguevine API. I set up the OAuth 2.0 protocol so that users can log in with Leaguevine in order to get the correct data/rights for the app. The most important thing I had to check was to see if I could make a POST to the API with an adjustable score. The way I did this that was to move the adjustable score into another "final score" form where the user could still adjust it if the event/scoring would have gone wrong. After I fixed that I knew I could start making the app.

-  [x] researched the API
-  [x] OAuth 2.0 protocol
-  [x] simple increment/decrement interface where users could raise/lower the score of each team
-  [x] a final score form where the changed numbers are put in as values, can still be changed by the user
-  [x] POST the final score to the API
-  [x] made a client side time-based event prototype
-  [x] voting percentage changes depending on how many upvotes/downvotes there are
-  [x] score gets updated if the voting percentages is higher than 50%

### Week 2
This week it was important that the time-based events could be done in real-time. The biggest challenge was getting multiple rooms to show unique events, next to socket rooms I had to add a database so that users would see the same data when they just entered an ongoing socket event. I tried out Lockr, a server side version of localStorage but it didn't live up to my standards because I would lose all data when the client/Javascript would not work for some reason. I decided to stick to MongoDB and carry on. 

To my suprise I managed to get a lot of the technical difficulties working which gives me a lot of confidence to finish the app properly. The next big challenge is being able to exact synchronised data when joining an ongoing event, the best solution here might be to let the user know that he has to wait for the event to be over.

-  [x] got all pool matches to display on the main page
-  [x] each pool match has its unique page/data using socket rooms
-  [x] added MongoDB for the voting events in each room
-  [x] made the voting event timer server side instead of client side
-  [x] all voting data gets saved real-time so a user can join a room while a voting event is being played and still participate (there are still some sync issues)

### Week 3
This week I tested my app on the Windmill tournament. Long story short there were a couple of tiny bugs to fix and I found out that 30 seconds was way too long for the time event. I also found out that I needed to use a progress bar instead of a countdown because the client doesn't always sync well.

This week I made some good progress on the core functionality. The voting interface is only enabled during time events and every user has 1 vote per event. I also started with CSS and made some cool animations.

Only a few things left to do. I have to make a 'wait for voting' screen for when the user comes into a room where the time event is already ticking. Besides that I also have to make sure that the event button can only be used once during an event.

-  [x] fixed a bug where the percentage was reset on different clients
-  [x] voting interface is only enabled during an event
-  [x] 1 vote per event per user
-  [x] made a progress bar instead of a countdown for the time event
-  [x] styling for the score page
-  [x] sweet animations for score updates/events

### Week 4
After talking to the client I refactored the code in a way that you now vote for 'which team scored' instead of 'if a team scored'. I created an admin page so that only admin users get the 'done' button that displays the final score page. Another thing that took me a while was getting the right scores on the main page, I found out that I had to refactor almost all my code in order to do that. I was using a global variable to spread the retrieved data to the score pages and created the score rooms once you clicked on one. Now all the rooms are created and saved to the DB once you go to the main page.

Besides all that I took a look at accessability by creating a message once the server is down and once the client is offline to inform the user what he/she should do. I also made sure that the page is still intact if the users device doesn't support flexbox. If the users Javascript doesn't work I hide a couple of voting options so that the user doesn't get confused when it doesn't work.

-  [x] what team scored > if a team scored (refactor)
-  [x] refactored the code so that I could get scores on the main page
-  [x] /admin page that grants the user the permission to go to the final score page
-  [x] feature detection for JS
-  [x] flexbox fallback
-  [x] notification with instructions when the server is down
-  [x] notification with instructions when the clien is offline
-  [x] 404 page
-  [x] styling the main/admin/final score page

### Week 5 (final week)
In the last week I had to focus on fixing bugs, improving the interface and creating fallbacks for other browsers. Feature-wise I managed to tackle the last big problem which was that users could still press the 'start voting' button during a time-event. I fixed this problem by making a 'wait for voting' message once the user enters a room during an event. This way an event won't be manipulated by users that weren't there during the initial start of the event.

I also made sure that I improved the perfomance, the app was already quite fast aside from the API so I just added gzip compression and uglyfied bundle.js. To improve the mobile experience on Android I also removed the URL bar on android once you download it to your home screen for a more native feel.

-  [x] 'wait for voting' message once the user enters a room during an event
-  [x] success flash message on the main page once you submit the final score
-  [x] success message is emphasized in the match you submitted the score for
-  [x] fallback for input type="color"
-  [x] added icons and a login button in the nav
-  [x] cleaned up all files
-  [x] added gzip
-  [x] uglified bundle.js
-  [x] removed the URL bar on android for a more native feel (PWA)
-  [x] ad

## Build
To run the application:
```bash
git clone
```

In order to get this app working you need to fill in the following <a href="https://www.npmjs.com/package/dotenv">dotenv</a> variables:  

```bash
CLIENT_ID={your client id here}
```  
```bash
CLIENT_SECRET={your client secret here}
```  
```bash
REDIRECT_URI={your redirect uri here}
```  

You can receive theses variables by making a new "Sandbox" on the Leaguevine development site:  
<a href="http://www.playwithlv.com/docs/api/">http://www.playwithlv.com/docs/api/</a>  
  
Now you only have to make sure to pass in your <a href="https://www.mongodb.com/">MongoDB</a> database. Simply place your database link inside the mongoose.connect braces:

```javascript
mongoose.connect({your link here})
```  

Finally, to use the app you need to run the following commands:  
```bash
npm install
```
To install the Node dependencies.

```bash
npm start
```  

To start the server.

## License

MIT License  

Copyright © 2017 Luuk Hafkamp