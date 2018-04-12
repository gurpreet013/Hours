function DailyUpdatesManager() {
  this.payload = {};

}

DailyUpdatesManager.prototype.init = function() {
  this.bindEvents();
  this.fetchWeekUpdates();
}

DailyUpdatesManager.prototype.bindEvents = function() {
  var _this = this;

  $('#next_week').on('click', _this.weekChangeHandler.bind(_this));
  $('#previous_week').on('click', _this.weekChangeHandler.bind(_this));
};

DailyUpdatesManager.prototype.weekChangeHandler = function(e) {
  var currentTarget = $(e.currentTarget),
      previousWeekElement = $('#previous_week'),
      nextWeekElement = $('#next_week'),
      data = {}

  this.payload = currentTarget.data();
  this.fetchWeekUpdates();
  if(currentTarget.attr('id') == 'previous_week') {
    data['previous_week'] = { 'from': moment(this.payload['from']).subtract(7, 'days')._d, 'to': moment(this.payload['to']).subtract(7, 'days')._d }
    data['next_week'] = { 'from': moment(this.payload['from']).add(7, 'days')._d, 'to': moment(this.payload['to']).add(7, 'days')._d }
  } else {
    data['previous_week'] = { 'from': moment(this.payload['from']).subtract(7, 'days')._d, 'to': moment(this.payload['to']).subtract(7, 'days')._d }
    data['next_week'] = { 'from': moment(this.payload['from']).add(7, 'days')._d, 'to': moment(this.payload['to']).add(7, 'days')._d }
  }
  previousWeekElement.data('from', data['previous_week']['from'])
  previousWeekElement.data('to', data['previous_week']['to'])
  nextWeekElement.data('from', data['next_week']['from'])
  nextWeekElement.data('to', data['next_week']['to'])
}

DailyUpdatesManager.prototype.fetchWeekUpdates = function() {
  var _this = this,
      payload = this.payload;

  $.ajax({
    url: '/projects/new_index',
    data: payload,
    dataType: "json",
    success: _this.successHandler.bind(_this)
  });
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
    this.bulkUpdateFormManager.updateDateRange(dateRange);
  } else {
    this.bulkUpdateFormManager = new BulkUpdateFormManager(dateRange);
    this.bulkUpdateFormManager.init();
  }
}

$(function() {
  var bulkDailyUpdateManager = new DailyUpdatesManager();
  bulkDailyUpdateManager.init();
})
