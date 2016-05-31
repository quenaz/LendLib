import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

Meteor.startup(() => {
  // code to run on server at startup
  lists = new Mongo.Collection("lists");

  lists.allow({
    'insert': function( userId, doc ) {
      if( !userId && !doc)
        return false;
      else {
        console.log("UserId: " + userId);
        return true;
      }
    },
    'update': function( userId, doc ) {
      if( !userId && !doc )
        return false;
      else {
        console.log("UserId: " + userId);
        return true;
      }
    }
  });

}); // Meteor.startup()
