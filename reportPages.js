/* Purpose: report the Chainpage data
     a report from the chainpage database on posts. 
     The fields are author, datetime, number of likes, feedbacks. 
     We need all posts.

   Author : Simon Li
   Date   : Nov 25, 2018
*/

const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://localhost:27017/";

MongoClient.connect(url, function(err, db) {
   //console.log('Connected');

   if (err) throw err;
   const dbo = db.db("ChainPage");
   if (!dbo)
      console('failed to create a db instance');

   const filter = {};

   dbo.collection("listings").find({}, filter).toArray(function(err, posts) {
   //dbo.collection("listings").find({}, filter).toArray(err => posts => {
       if (err) throw err;
 
       //showPosts(posts);        // show the report in stored order
       //showPosts(posts, false); // show the report in ascending order
       showPosts(posts, true);  // show the report in descending order

       db.close();
   });
});

// Show the posts 
function showPosts(posts, descSorting) {
   if (posts.length < 1) throw "No Data found"; 

   if (typeof descSorting == "boolean") {  
      // Sorting the elements per postedTime - ascending order
      posts.sort(a => b => (descSorting)? b.postedTime-a.postedTime : a.postedTime-b.postedTime);
   }
           
   console.log(`** Total posts: ${posts.length} **`);
   console.log('***************************************************');
   posts.forEach(post => {
       console.log(`Name               : ${post.name}`);
       console.log(`Business Name      : ${post.businessName}`);
       console.log(`Street             : ${post.street}`);
       console.log(`City               : ${post.city}`);
       console.log(`State              : ${post.state}`);
       console.log(`Zip Code           : ${post.zip}`);
       console.log(`Country            : ${post.country}`);
       console.log(`Email Address      : ${post.email}`);
       console.log(`Telphone           : ${post.phone}`);
       console.log(`Web Page           : ${post.webPage}`);
       console.log(`Service Type       : ${post.service}`);
       console.log(`Service Area       : ${post.servicingArea}`);
       console.log(`Business Hour      : ${post.businessHour}`);
       console.log(`Business Main      : ${post.businessMainCategory}`);
       console.log(`Business Sub       : ${post.businessSubCategory}`);
       console.log(`Posted Time        : ${getLocalTime(post.postedTime)}`);
       console.log(`Number of feedbacks: ${post.comments.length}`);

       var likeCount = 0;
       var dislikeCount = 0;
       post.votes.forEach(elem => { 
          switch (elem.vote) {
             case "like": 
                 likeCount++;
                 break;
             case "dislike":
                 dislikeCount++;
                 break; 
          }
       });
       console.log(`Number of likes    : ${likeCount}`);
       if (dislikeCount > 0)
          console.log(`Number of dislikes : ${dislikeCount}`);
       console.log('***************************************************')
   });
   console.log(`** Total posts: ${posts.length} **`);
}

/* For AWS, the local time is UTC */

// Get the UTC time string for the post
function getUtcTime(utcTime) {
   const date = new Date(utcTime);
   return date.getUTCFullYear() + "-" + 
          (date.getUTCMonth() + 1) + "-" + 
          date.getUTCDate() + " " + 
          date.getUTCHours() + ":" + 
          date.getUTCMinutes().pad();
}

// Get the local time string for the post
function getLocalTime(utcTime) {
   const date = new Date(utcTime);
   
   return date.getFullYear() + "-" + 
          (date.getMonth() + 1) + "-" + 
          date.getDate() + " " + 
          date.getHours() + ":" + 
          date.getMinutes().pad();
}

// Integrate "pad" to Number object
Number.prototype.pad = function(size) {
    var str = String(this);
    while (str.length < (size || 2)) 
       {str = "0" + str;}
    
     return str;
}
