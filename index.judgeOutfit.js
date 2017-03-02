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
var APP_ID = "amzn1.ask.skill.1cbc9d24-cb69-4af2-99b8-65180a3d4af2"; //replace with "amzn1.echo-sdk-ams.app.[your-unique-value-here]";

// Make endpoint requests
var http = require('http');

/**
 * The AlexaSkill prototype and helper functions
 */
var AlexaSkill = require('./AlexaSkill');

/**
 * JudgeOutfit is a child of AlexaSkill.
 * To read more about inheritance in JavaScript, see the link below.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Introduction_to_Object-Oriented_JavaScript#Inheritance
 */
var JudgeOutfit = function () {
    AlexaSkill.call(this, APP_ID);
};

// Extend AlexaSkill
JudgeOutfit.prototype = Object.create(AlexaSkill.prototype);
JudgeOutfit.prototype.constructor = JudgeOutfit;

JudgeOutfit.prototype.eventHandlers.onSessionStarted = function (sessionStartedRequest, session) {
    console.log("JudgeOutfit onSessionStarted requestId: " + sessionStartedRequest.requestId
        + ", sessionId: " + session.sessionId);
    // any initialization logic goes here
};

JudgeOutfit.prototype.eventHandlers.onLaunch = function (launchRequest, session, response) {
    console.log("JudgeOutfit onLaunch requestId: " + launchRequest.requestId + ", sessionId: " + session.sessionId);
        getClothingRec(function(rec) {
            var comment = rec;
            
            response.tell(comment);
        });
};

JudgeOutfit.prototype.eventHandlers.onSessionEnded = function (sessionEndedRequest, session) {
    console.log("JudgeOutfit onSessionEnded requestId: " + sessionEndedRequest.requestId
        + ", sessionId: " + session.sessionId);
    // any cleanup logic goes here
};

JudgeOutfit.prototype.intentHandlers = {
    // register custom intent handlers
    "JudgeOutfitIntent": function (intent, session, response) {
        getClothingRec(function(rec) {
            var advice = rec; 
            response.tell(advice);
        });
    },
    "AMAZON.HelpIntent": function (intent, session, response) {
        response.ask("Ask me for fashion advice", "Ask me for fashion advice");
    }
};

// Call judgeOutfit endpoint
function getClothingRec(eventCallback) {
    var url = "http://104.196.100.15:8042/judge-outfit";

    http.get(url, function(res) {
        var body = '';

        res.on('data', function (chunk) {
            body += chunk;
        });

        res.on('end', function () {
            console.log(body);
            //var response = JSON.parse(body);
            //var stringResult = response.complimentary;
            eventCallback(body);
        });
    }).on('error', function (e) {
        console.log("Got error: ", e);
    });
}

// Create the handler that responds to the Alexa Request.
exports.handler = function (event, context) {
    // Create an instance of the JudgeOutfit skill.
    var judgeOutfit = new JudgeOutfit();
    judgeOutfit.execute(event, context);
};