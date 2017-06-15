var db = require("../models");
var request = require("request");
var exphbs = require("express-handlebars");
var $ = require("jquery");
const nodemailer = require('nodemailer');
 var querystring = require('querystring');
var http = require('http');

'use strict';



module.exports = function(app) {

		app.get("/", function(req, res) {
			res.render("main.handlebars");
		});


	/*TWITCH API*/

	app.get("/api/addinfluencer", function(req, res) {

			console.log(req.query);
			console.log("==================");
			// create reusable transporter object using the default SMTP transport
			let transporter = nodemailer.createTransport({
				    pool: true,
    				host: 'smtp.gmail.com',
    				service: 'gmail',
				    port: 443,
  					secure: true,
				    auth: {
				        user: "tmhharvey@gmail.com",
				        pass: 'poonage123'
				    }
				});

				// setup email data with unicode symbols
				let mailOptions = {
				    from: req.query.channel_link + '<tmhharvey@gmail.com>', // sender address
				    to: 'tmhharvey@gmail.com', // list of receivers
				    subject: "Application: " + req.query.channel_link, // Subject line
				    text: "This is Text", // plain text body
				    html: "<b>" + "First Name: " + req.query.first_name + "<br>" +
				    	  "Twitch Name: " + req.query.influencer_name + "<br>" +
				    	  "Business Email: " + req.query.business_email + "<br>" +
				    	  "Channel Link: " + req.query.channel_link + "<br>" +
				    	  "Twitter: " + req.query.twitter_name + "<br>" +
				    	  "Youtube " + req.query.youtube_name + "<br>" +
				    	  "Streaming Language: " + req.query.stream_lang + "<br>" +
				    	  "Country: " + req.query.country + "</b>" // html body
				};

				// send mail with defined transport object
				transporter.sendMail(mailOptions, (error, info) => {
				    if (error) {
				        return console.log(error);
				    }
				    console.log('Message %s sent: %s', info.messageId, info.response);
				});

				console.log("Working up to API call");
				var influencer_name = req.query['influencer_name'];
				var options = { method: 'GET',
					  url: 'https://api.twitch.tv/kraken/channels/' + influencer_name,
					  qs: { client_id: 'fko5hnqrupt7b2tw6jfs93e7gn7gcu' },
					  headers: 
					   { 'postman-token': '1cb2bec7-b28d-789a-cb96-a67dbfc840a6',
					     'cache-control': 'no-cache' } };
				console.log("This is the name: " + influencer_name);

				request(options, function (error, response, body) {
				  if (error) throw new Error(error);
				  var info = JSON.parse(body);


				  console.log("working inside API call.");
					db.User.create({
						display_name: info.display_name,
						followers: info.followers,
						views: info.views,
						game: info.game,
						user_logo: info.logo,
						twitch_url: info.url,
						twitch_id: info._id,
						language: info.language

					}).then(function(results){
					res.redirect("http://www.streamfluence.io/thank-you-streamer.html");
				});

			 });

			//================ UNSURE OF CODE ================= //



		    var influencer_display_name = req.query.influencer_name
			var data = querystring.stringify({
			      influencer_display_name: influencer_display_name
			    });

			console.log("The data we want to send is " + data);

			var options = {
			    host: 'my.url',
			    port: 80,
			    path: '/',
			    method: 'POST',
			    headers: {
			        'Content-Type': 'application/x-www-form-urlencoded',
			        'Content-Length': Buffer.byteLength(data)
			    }
			};

			var req = http.request(options, function(res) {
			    res.setEncoding('utf8');
			    res.on('data', function (chunk) {
			        console.log("body: " + chunk);
			    });
			});

			req.write(data);
			req.end();
				


			//================ UNSURE OF CODE END =============//
		});
};

