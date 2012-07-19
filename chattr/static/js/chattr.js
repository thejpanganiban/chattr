var Chattr = { views: {}, models: {}, collections: {} };


(function($, undefined) {

socket = io.connect('/chat');

Chattr.BaseView = Backbone.View.extend({

  templateEl: ''

  , template: function(variables) {
    var variables = variables || {};
    return _.template($('script[type="text/html"]' + this.templateEl).html())(variables);
  }

});

Chattr.views.Message = Chattr.BaseView.extend({

  templateEl: '#message'

  , tagName: 'li'

  , className: 'message'

  , initialize: function(options) {
    this.data = options.model.toJSON();
  }

  , render: function() {
    this.$el.html(this.template(this.data));
    return this;
  }

});

Chattr.models.Message = Backbone.Model.extend({

  idAttribute: '_id'

});

Chattr.collections.Messages = Backbone.Collection.extend({

  model: Chattr.models.Message

  , comparator: function(model) {
    return model.get('time');
  }
});

Chattr.views.ChatView = Chattr.BaseView.extend({

  el: '#chat'

  , initialize: function(options) {
    this.messages = new Chattr.collections.Messages(options.messages);
    socket.on('chat', _.bind(this.rawAddMessage, this));
    this.count = 0;
  }

  , addMessage: function(model) {
    var messageView = new Chattr.views.Message({model: model});
    if (this.count % 2) {
      messageView.$el.addClass('alternate');
    }
    this.$el.append(messageView.render().el);
    this.$el.scrollTop(this.$el.height() + this.$el.scrollTop());
    this.count++;
  }

  , rawAddMessage: function(data) {
    var message = new Chattr.models.Message(data);
    this.messages.add(message);
    this.addMessage(message);
  }

  , render: function() {
    this.messages.each(this.addMessage, this);
    return this;
  }

});

Chattr.views.ChatForm = Chattr.BaseView.extend({

  el: '#chatform'

  , events: {
    'submit': 'sendMessage'
  }

  , sendMessage: function(e) {
    e.preventDefault();
    var payload = {
      message: this.$('input.message').val()
      , alias: this.$('input.alias').val() || 'Anon'
    };
    if (payload.message) {
      socket.emit('chat', payload);
      this.$('input.message').val('');
    }
  }

});

})(jQuery);
