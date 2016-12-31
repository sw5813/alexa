/**
    Copyright 2014-2015 Amazon.com, Inc. or its affiliates. All Rights Reserved.
    Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
        http://aws.amazon.com/apache2.0/
    or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/

/**
 * This simple sample has no external dependencies or session management, and shows the most basic
 * example of how to create a Lambda function for handling Alexa Skill requests.
 *
 * Examples:
 * One-shot model:
 *  User: "Alexa, tell Hello World to say hello"
 *  Alexa: "Hello World!"
 */

/**
 * App ID for the skill
 */
var APP_ID = "amzn1.ask.skill.f24a5b09-8703-4f98-9a0d-c15a195a9fea"; //replace with "amzn1.echo-sdk-ams.app.[your-unique-value-here]";

// Make endpoint requests
var http = require('http');

/**
 * The AlexaSkill prototype and helper functions
 */
var AlexaSkill = require('./AlexaSkill');

/**
 * LaunchPhoto is a child of AlexaSkill.
 * To read more about inheritance in JavaScript, see the link below.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Introduction_to_Object-Oriented_JavaScript#Inheritance
 */
var LaunchPhoto = function () {
    AlexaSkill.call(this, APP_ID);
};

// Extend AlexaSkill
LaunchPhoto.prototype = Object.create(AlexaSkill.prototype);
LaunchPhoto.prototype.constructor = LaunchPhoto;

LaunchPhoto.prototype.eventHandlers.onSessionStarted = function (sessionStartedRequest, session) {
    console.log("LaunchPhoto onSessionStarted requestId: " + sessionStartedRequest.requestId
        + ", sessionId: " + session.sessionId);
    // any initialization logic goes here
};

LaunchPhoto.prototype.eventHandlers.onLaunch = function (launchRequest, session, response) {
    console.log("LaunchPhoto onLaunch requestId: " + launchRequest.requestId + ", sessionId: " + session.sessionId);
        getOutfitOpinion(function(rec) {
            var comment;
            if (rec == 1) {
                comment = "Okay, please stand in front of the mirror so that I can see your outfit. Did you know that complimentary colors create the most vivid contrast in an outfit? But they can also clash very easily. Something to keep in mind when you're trying to get dressed in the morning.";
            } else if (rec == 2) {
                comment = "Sure thing, I've got you covered. Please stand in front of the mirror! One tip: triad colors create the most balanced form of contrast, which makes it a good scheme for an outfit with lots of pieces.";
            } else if (rec == 3) {
                comment = "Absolutely, I'm an expert! Can you stand in front of the mirror? Analogous colors, which are adjacent on the color wheel, create a minimuzed contrast, giving a very consistent look.";
            } else if (rec == 4) {
                comment = "For sure, all you need to do is to stand in front of the mirror, and I'll take a look. Tip of the day: you always have tints and shades to play with.";
            } else {
                comment = "Hmm, let me think about it, please stand in front of the mirror so that I can see your outfit. Keep in mind that mixing colors is very tricky; on the one hand, too few colors will look bland, but on the other hand, too many colors will make you look disorganized.";
            }
            
            response.tell(comment);
        });
};

LaunchPhoto.prototype.eventHandlers.onSessionEnded = function (sessionEndedRequest, session) {
    console.log("LaunchPhoto onSessionEnded requestId: " + sessionEndedRequest.requestId
        + ", sessionId: " + session.sessionId);
    // any cleanup logic goes here
};

LaunchPhoto.prototype.intentHandlers = {
    // register custom intent handlers
    "ShouldTakePicIntent": function (intent, session, response) {
        console.log("Getting outfit rec");
        getOutfitOpinion(function(rec) {
            var comment = "Eww, what are you wearing";
            
            response.tell(comment);
        });
    },
    "AMAZON.HelpIntent": function (intent, session, response) {
        response.ask("Ask me for fashion advice", "Ask me for fashion advice");
    }
};

// Call shouldTakePhoto endpoint
function getOutfitOpinion(eventCallback) {
    var url = "http://54.161.179.203:8042/should-take-photo";

    http.get(url, function(res) {
        var body = '';

        res.on('data', function (chunk) {
            body += chunk;
        });

        res.on('end', function () {
            console.log(body);
            //var response = JSON.parse(body);
            eventCallback(body);
        });
    }).on('error', function (e) {
        console.log("Got error: ", e);
    });
}

// Create the handler that responds to the Alexa Request.
exports.handler = function (event, context) {
    // Create an instance of the LaunchPhoto skill.
    var launchPhoto = new LaunchPhoto();
    launchPhoto.execute(event, context);
};