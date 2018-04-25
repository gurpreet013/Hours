function WeekChangeManager(successCallback, inputFieldChangeDetector) {
  this.successCallback = successCallback;
  this.inputFieldChangeDetector = inputFieldChangeDetector;
}

WeekChangeManager.prototype.init = function() {
  var _this = this;
  $('#next_week, #previous_week').on('click', _this.weekChangeHandler.bind(_this));
};

WeekChangeManager.prototype.weekChangeHandler = function(e) {
  var currentTarget = $(e.currentTarget), _this = this;
  this.currentTarget = currentTarget;
  this.payload = currentTarget.data()
  dataFetcher = new DataFetcher(this.payload, this.successCallbacks.bind(_this), this.inputFieldChangeDetector);
  dataFetcher.fetchData(currentTarget);
};

WeekChangeManager.prototype.successCallbacks = function(data) {
  this.changeWeekHeaderSuccessCallback();
  if(typeof this.successCallback == 'function') {
    this.successCallback(data);
  }
}

WeekChangeManager.prototype.changeWeekHeaderSuccessCallback = function() {
  var previousWeekElement = $('#previous_week'),
      nextWeekElement = $('#next_week'),
      data = {}
  if(this.currentTarget.attr('id') == 'previous_week') {
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
