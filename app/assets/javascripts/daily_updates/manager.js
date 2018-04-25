//= require daily_updates/view_builder.js
//= require daily_updates/view_modifier.js
//= require daily_updates/bulk_update_form_manager.js
//= require daily_updates/data_fetcher.js
//= require daily_updates/week_change_manager.js

function DailyUpdatesManager() {
}

DailyUpdatesManager.prototype.init = function() {
  this.inputFieldChangeDetector = new InputFieldChangeDetector();
  this.inputFieldChangeDetector.init()
  this.initializeWeekChangeModifier();
  this.bindEvents();
  this.fetchWeekUpdates();
}

DailyUpdatesManager.prototype.initializeWeekChangeModifier = function() {
  this.WeekChangeManager = new WeekChangeManager(this.successHandler.bind(this), this.inputFieldChangeDetector);
  this.WeekChangeManager.init();
}

DailyUpdatesManager.prototype.bindEvents = function() {
  var _this = this;
  $('#user_id').on('change', _this.impersonateUserHandler.bind(_this));
};

DailyUpdatesManager.prototype.impersonateUserHandler = function(e) {
  var currentTarget = $(e.currentTarget),
      currentValue = currentTarget.val(),
      url = currentTarget.data('href') + "?slug=" + currentValue;

  if(currentValue) {
    window.location.href = url;
  }
}

DailyUpdatesManager.prototype.fetchWeekUpdates = function(payload) {
  var dataFetcher = new DataFetcher(payload || this.payload, this.successHandler.bind(this), this.inputFieldChangeDetector);
  dataFetcher.sendRequest()
};

DailyUpdatesManager.prototype.successHandler = function(data) {
  var dateRange = getDates(new Date(data.range.from), new Date(data.range.to));
  this.viewBuilder = new DailyUpdatesViewBuilder(data, dateRange);
  this.viewBuilder.generate();
  this.initializeOrUpdateViewModifier(data.projects, dateRange);
  this.initializeOrUpdateBulkUpdateFormManager(dateRange);
};

DailyUpdatesManager.prototype.initializeOrUpdateViewModifier = function(projects, dateRange) {
  var projectsHash = arrayToHash(projects);
  if(this.viewModifier) {
    this.viewModifier.updateData(projectsHash, dateRange);
  } else {
    this.viewModifier = new DailyUpdatesViewModifier(projectsHash, dateRange);
    this.viewModifier.init();
  }
}

DailyUpdatesManager.prototype.initializeOrUpdateBulkUpdateFormManager = function(dateRange) {
  if(this.bulkUpdateFormManager) {
    this.bulkUpdateFormManager.updateDateRange(dateRange, this.bulkUpdateSuccessCallback.bind(this));
  } else {
    this.bulkUpdateFormManager = new BulkUpdateFormManager(dateRange, this.bulkUpdateSuccessCallback.bind(this));
    this.bulkUpdateFormManager.init();
  }
}

DailyUpdatesManager.prototype.bulkUpdateSuccessCallback = function() {
  this.refreshInputFieldChangeDetector();
}

DailyUpdatesManager.prototype.refreshInputFieldChangeDetector = function() {
  this.inputFieldChangeDetector.refresh();
};

$(function() {
  var bulkDailyUpdateManager = new DailyUpdatesManager();
  bulkDailyUpdateManager.init();
})
