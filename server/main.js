import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

Meteor.startup(() => {
  // code to run on server at startup
  lists = new Mongo.Collection("lists");

  lists.allow({
    'insert': function( userId, doc ) {
      return true;
    },
    'update': function( userId, doc ) {
      return true;
    }
  });

  Meteor.publish("Categories", function() {
    return lists.find( {}, { fields: { Category : 1 }});
  });

  Meteor.publish("listdetails", function( category_id ) {
    return lists.find({ _id : category_id });
  });

}); // Meteor.startup()
