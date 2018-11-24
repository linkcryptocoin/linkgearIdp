/* Purpose: report the posting data
     a report from the chainpost database on posts. 
     The fields are author, datetime, number of likes, feedbacks. 
     We need all posts.

   Author : Simon Li
   Date   : Nov 24, 2018
*/

const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://localhost:27017/";

MongoClient.connect(url, function(err, db) {
   //console.log('Connected');

   if (err) throw err;
   const dbo = db.db("ChainPage");
   if (!dbo)
      console('failed to create a db instance');

   const filter = {"Title":1, "postedBy":1, "postedTime":1, "comments":1, "votes":1};

   dbo.collection("posts").find({}, filter).toArray(function(err, posts) {
       if (err) throw err;
 
       if (posts.length < 1) throw "No Data found"; 
            
       console.log(`** Total posts: ${posts.length} **`);
       console.log('***************************************************');
       posts.forEach(function(post) {
           console.log(`Title   : ${post.Title}`);
           console.log(`Author  : ${post.postedBy}`);
           console.log(`Datetime: ${new Date(post.postedTime)}`);
           console.log(`Number of feedbacks: ${post.comments.length}`);

           var likeCount = 0;
           post.votes.forEach(function(elem) {
              if (elem.vote === "like")
                 likeCount++; 
           });

           console.log(`Number of likes    : ${likeCount}`);
           console.log('***************************************************');
       });
       console.log(`** Total posts: ${posts.length} **`);

       db.close();
   });
});

