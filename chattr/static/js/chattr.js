var Chattr = { views: {} };


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
    this.data = options.data;
  }

  , render: function() {
    this.$el.html(this.template(this.data));
    return this;
  }

});

Chattr.views.ChatView = Chattr.BaseView.extend({

  el: '#chat'

  , initialize: function(options) {
    this.messages = [];
    socket.on('chat', _.bind(this.addMessage, this));
  }

  , addMessage: function(data) {
    this.messages.push(data);
    var messageView = new Chattr.views.Message({data: data});
    this.$el.append(messageView.render().el);
    this.$el.scrollTop(this.$el.height() + this.$el.scrollTop());
    if (this.messages.length % 2) {
      messageView.$el.addClass('alternate');
    }
  }

  , render: function() {
    _.each(this.messages, this.addMessage, this);
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

$(document).ready(function() {

Chattr.chatForm = new Chattr.views.ChatForm();

Chattr.chatView = new Chattr.views.ChatView().render();

});
