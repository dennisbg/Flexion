 
var Test = {
    Models: {},
    Collections: {},
    Views: {},
    Templates:{}
}

Test.Models.Question = Backbone.Model.extend({})
Test.Collections.Questions = Backbone.Collection.extend({
    model: Test.Models.Question,
    url: "data/questions.json",
    initialize: function(){
        console.log("Tests initialize")
    }
});

Test.Templates.questions = _.template($("#tmplt-Tests").html())
Test.Collections.Answers = Backbone.Collection.extend({
    model: Test.Models.Answer,
    url: "data/answers.json",
    initialize: function(){
        console.log("Answers initialize");
     }
});
Test.Views.Questions = Backbone.View.extend({
    el: $("#mainContainer"),
    template: Test.Templates.questions,
	results: 0,
	 
    initialize: function () {
         this.collection.bind("reset", this.render, this);		 
      },
    render: function () {
        console.log("render")
        $(this.el).html(this.template());
        this.addAll();
    },
    addAll: function () {
 		self = this;
		selectionVal = undefined;
 		if(this.collection.length == 0 ) {
			$('.my-button').attr('style', 'display: none !important');
			$(self.el).html('Test Result : '+self.results );
		}	
 		this.collection.each(function(item, index){
			if(index ==0)  
				self.addOne(item); 	
			return;		
		});
		
	 
    },

    addOne: function (model) {
        console.log("addOne");		 
        this.currentView = new Test.Views.Question({ model: model });
        $("span", this.el).append(this.currentView.render()); 
    }
})

Test.Templates.question = "<h1>{{id}}) {{text}}</h1><ul><li><input onClick='callSelected(1)'  name='chVal' value='1' type='radio'>True</input></li><li><input onClick='callSelected(0)' name='chVal' value='0' type='radio'>False</input></li></ul>";
Test.Views.Question = Backbone.View.extend({
    tagName: "li",
    template: Test.Templates.question,
	
 
    initialize: function () {
         this.model.bind('remove', this.removeItem, this);
    },

    render: function () {
		 
   		return $(this.el).html(Mustache.to_html(this.template, this.model.toJSON())); 		
     },
    removeItem: function (model) {
        console.log("Remove - " + model.get("id"))
        this.remove();
    }
})

Test.Router = Backbone.Router.extend({
    routes: {
        "": "defaultRoute"  
    },

    defaultRoute: function () {
        console.log("defaultRoute");
        Test.questions = new Test.Collections.Questions();
		Test.answers = new Test.Collections.Answers();
		Test.answers.fetch();
        questionViews =new Test.Views.Questions({ collection: Test.questions, answers : Test.answers }); //Add this line
        Test.questions.fetch();
		 
		$("#butAddItem").click(null, function (event) {
			if(selectionVal != undefined) {
				var currentModel = questionViews.currentView.model;
				questionViews.currentView.removeItem(currentModel); 
				Test.answers.each(function(item, index){
				
					if(currentModel.get("id") == item.get("id")) {
						 
						if( item.get("selected") == selectionVal )
							questionViews.results = ++questionViews.results;  
							Test.answers.remove(item);
					}
						 
				});
				
				questionViews.collection.remove(currentModel);
				questionViews.addAll();
			}
			event.preventDefault();
		});

    }
})

var appRouter = new Test.Router();
var questionViews;
Backbone.history.start();
