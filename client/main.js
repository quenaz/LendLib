import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';

lists = new Meteor.Collection("lists");

if (Meteor.isClient) {
  console.log("in Line Client");

  // We are declaring the adding_category flag
  Session.set('adding_category', false);

  // counter starts at 0
  Session.setDefault('counter', 0);

  /*
  Template.hello.onCreated(function helloOnCreated() {
    // counter starts at 0
    this.counter = new ReactiveVar(0);
  });

  Template.hello.helpers({
    counter() {
      return Template.instance().counter.get();
    },
  });

  Template.hello.events({
    'click button'(event, instance) {
      // increment the counter when button is clicked
      instance.counter.set(instance.counter.get() + 1);
    },
  });
  */

  Template.categories.helpers({
    lists : function() {
      return lists.find({}, { sort: { Category : 1 }});
    },
     new_cat: function() {
    // returns true if adding_category has been assigned a value of true
    return Session.equals('adding_category', true);
    },
    list_status: function() {
      if( Session.equals('current_list', this._id))
        return " btn-info";
      else
        return " btn-primary";
    }
  });

  Template.categories.events({
    'click #btnNewCat': function( e, t ) {
      Session.set('adding_category', true);
      Tracker.flush();
      focusText(t.find("#add-category"));
    },

    'keyup #add-category': function( e, t ) {
      if( e.which === 13) {
        var catVal = String( e.target.value || "");
        if( catVal ) {
          lists._collection.insert({ Category : catVal });
          Session.set('adding_category', false);
        }
      }
    },

    'focusout #ad-category': function( e, t ) {
      Session.set('adding_category', false);
    },
    'click .category': selectCategory
  });

  /// Generic Helper Functions ///
  // this function puts our cursor where it needs to be.
  function focusText( i, val ) {
    //if( i.focus() === "" ) 
    i.focus();
    i.value = val ? val : "";
    i.select();
  };

  function selectCategory( e, t ) {
    Session.set('current_list', this._id);
  };

  function addItem(list_id, item_name) {
    if( !item_name && !list_id) return;
    lists._collection.update({ _id : list_id }, { $addToSet: { items: { Name: item_name }}});
  };

  function removeItem( list_id, item_name ) {
    if( !item_name && !list_id) return;
    lists._collection.update({ _id: list_id}, { $pull: { items: { Name: item_name }}});
  };

  function updateLendee( list_id, item_name, lendee_name ) {
    var l = lists.findOne({ "_id": list_id, "items.Name": item_name });
    if( l && l.items ) {
      for( var i = 0; i < l.items.length; i++ ) {
        if( l.items[i].Name === item_name ) {
          var updateItem = {};
          updateItem['items.' + i + '.LentTo'] = lendee_name;
          lists._collection.update({ '_id': list_id }, { $set: updateItem });
          break;
        }
      }
    }
  }

  Template.list.helpers({
    items: function() {
      if( Session.equals( 'current_list', null ))
        return null;
      else {
        var cats = lists.findOne({
          _id: Session.get('current_list')
        });
        if( cats && cats.items) { // if both is not null
          for( var i = 0; i < cats.items.length; i++ ) {
            var itm = cats.items[i];
            itm.Lendee = itm.LentTo ? itm.LentTo : "free";
            itm.LendClass = itm.LentTo ? "label-danger" : "label-success";
          }
          return cats.items;
        }
      }
    },
    list_selected: function() {
      return ((Session.get('current_list') != null) && (!Session.equals('current_list', null)));
    },
    list_adding: function() {
      return (Session.equals('list_adding', true));
    },
    lendee_editing: function() {
      return (Session.equals('lendee_input', this.Name));
    }
  });

  Template.list.events({
    'click #btnAddItem': function( e, t ) {
      Session.set('list_adding', true);
      Tracker.flush();
      focusText(t.find("#item_to_add"));
    },
    'keyup #item_to_add': function( e, t ) {
      if(e.which === 13) {
        addItem(Session.get('current_list'), e.target.value);
        Session.set('list_adding', false);
      }
    },
    'focusout #item_to_add': function( e, t ) {
      Session.set('list_adding', false);
    },
    'click .delete_item': function( e, t ) {
      removeItem(Session.get('current_list'), e.target.id);
    },
    'click .lendee': function( e, t ) {
      Session.set('lendee_input', this.Name);
      Tracker.flush();
      focusText(t.find("#edit_lendee"), this.LentTo);
    },
    'keyup #edit_lendee': function( e, t ) {
      if( e.which === 13) {
        updateLendee(Session.get('current_list'), this.Name, e.target.value );
        Session.set('lendee_input', null);
      }
      if( e.which === 27) {
        Session.set('lendee_input', null);
      }
    }

  });

} // if (isClient)?

if (Meteor.isServer) {
  console.log("in line server");
}
