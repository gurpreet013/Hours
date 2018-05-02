//= require daily_updates/data_fetcher.js
//= require daily_updates/view_builder.js
//= require daily_updates/week_change_manager.js

function AllTimeCardsManager() {
  this.readonly = true;
  this.payload = { all: true };
  this.viewBuilder = {};
}

AllTimeCardsManager.prototype.init = function() {
  this.fetchInitialDataForAllUsers();
  this.initializeWeekChangeModifier();
}

AllTimeCardsManager.prototype.fetchInitialDataForAllUsers = function() {
  var dataFetcherOptions = {
    successCallback: this.successHandler.bind(this),
    readonly: this.readonly
  }, dataFetcher = new DataFetcher(this.payload, dataFetcherOptions);

  dataFetcher.sendRequest();
}

AllTimeCardsManager.prototype.initializeWeekChangeModifier = function() {
  this.weekChangeModifier = new WeekChangeManager(undefined, undefined, this.readonly);
  this.weekChangeModifier.init();
}

AllTimeCardsManager.prototype.successHandler = function(data) {
  var _this = this,
      viewBuilderOptions = {
        readonly: data.readonly,
        mustacheOptions: { append: true }
      },
      initialObject = data.users[0],
      dateRange = getDates(new Date(initialObject.range.from), new Date(initialObject.range.to));

  data.users.forEach(function(obj) {
    _this.viewBuilder[obj.user.slug] = new DailyUpdatesViewBuilder(obj, dateRange, viewBuilderOptions);
    _this.viewBuilder[obj.user.slug].generate();
  })
}

$(function() {
  var allTimeCardsManager = new AllTimeCardsManager()
  allTimeCardsManager.init();
});
