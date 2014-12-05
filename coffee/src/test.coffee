Test =
  Models: {}
  Collections: {}
  Views: {}
  Templates: {}

Test.Models.Question = Backbone.Model.extend({})
Test.Collections.Questions = Backbone.Collection.extend(
  model: Test.Models.Question
  url: "data/questions.json"
  initialize: ->
    console.log "Tests initialize"
    return
)
Test.Templates.questions = _.template($("#tmplt-Tests").html())
Test.Collections.Answers = Backbone.Collection.extend(
  model: Test.Models.Answer
  url: "data/answers.json"
  initialize: ->
    console.log "Answers initialize"
    return
)
Test.Views.Questions = Backbone.View.extend(
  el: $("#mainContainer")
  template: Test.Templates.questions
  results: 0
  initialize: ->
    @collection.bind "reset", @render, this
    return

  render: ->
    console.log "render"
    $(@el).html @template()
    @addAll()
    return

  addAll: ->
    self = this
    selectionVal = `undefined`
    if @collection.length is 0
      $(".my-button").attr "style", "display: none !important"
      $(self.el).html "Test Result : " + self.results
    @collection.each (item, index) ->
      self.addOne item  if index is 0
      return

    return

  addOne: (model) ->
    console.log "addOne"
    @currentView = new Test.Views.Question(model: model)
    $("span", @el).append @currentView.render()
    return
)
Test.Templates.question = "<h1>{{id}}) {{text}}</h1><ul><li><input onClick='callSelected(1)'  name='chVal' value='1' type='radio'>True</input></li><li><input onClick='callSelected(0)' name='chVal' value='0' type='radio'>False</input></li></ul>"
Test.Views.Question = Backbone.View.extend(
  tagName: "li"
  template: Test.Templates.question
  initialize: ->
    @model.bind "remove", @removeItem, this
    return

  render: ->
    $(@el).html Mustache.to_html(@template, @model.toJSON())

  removeItem: (model) ->
    console.log "Remove - " + model.get("id")
    @remove()
    return
)
Test.Router = Backbone.Router.extend(
  routes:
    "": "defaultRoute"

  defaultRoute: ->
    console.log "defaultRoute"
    Test.questions = new Test.Collections.Questions()
    Test.answers = new Test.Collections.Answers()
    Test.answers.fetch()
    questionViews = new Test.Views.Questions( #Add this line
      collection: Test.questions
      answers: Test.answers
    )
    Test.questions.fetch()
    $("#butAddItem").click null, (event) ->
      if selectionVal?
        currentModel = questionViews.currentView.model
        questionViews.currentView.removeItem currentModel
        Test.answers.each (item, index) ->
          if currentModel.get("id") is item.get("id")
            questionViews.results = ++questionViews.results  if item.get("selected") is selectionVal
            Test.answers.remove item
          return

        questionViews.collection.remove currentModel
        questionViews.addAll()
      event.preventDefault()
      return

    return
)
appRouter = new Test.Router()
questionViews = undefined
Backbone.history.start()