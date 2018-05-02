function WeekChangeManager(successCallback, inputFieldChangeDetector, readonly) {
  this.successCallback = successCallback;
  this.inputFieldChangeDetector = inputFieldChangeDetector;
  this.readonly = readonly;
}

WeekChangeManager.prototype.init = function() {
  var _this = this;

  $('body').on('click', '.next_week, .previous_week', _this.weekChangeHandler.bind(_this));
};

WeekChangeManager.prototype.weekChangeHandler = function(e) {
  var currentTarget = $(e.currentTarget), _this = this,
      dataFetcherOptions = {
        successCallback: this.successCallbacks.bind(_this),
        inputFieldChangeDetector: this.inputFieldChangeDetector,
        readonly: this.readonly
      };
  this.currentTarget = currentTarget;
  this.payload = currentTarget.data()
  this.payload['readonly'] = currentTarget.parents('div').data('readonly');
  dataFetcher = new DataFetcher(this.payload, dataFetcherOptions);
  dataFetcher.fetchData(currentTarget);
};

WeekChangeManager.prototype.successCallbacks = function(data) {
  this.changeWeekHeaderSuccessCallback();
  var dateRange = getDates(new Date(data.range.from), new Date(data.range.to)),
      mustacheHandlerOptions = {
        target: '#' + data.user.slug,
        readonly: this.readonly
      }

      viewBuilder = new DailyUpdatesViewBuilder(data, dateRange, mustacheHandlerOptions);

  viewBuilder.generate();
  if(typeof this.successCallback == 'function') {
    this.successCallback(data);
  }
}

WeekChangeManager.prototype.changeWeekHeaderSuccessCallback = function() {
  var previousWeekElement = $('[data-user-slug="' + this.payload.slug +'"].previous_week'),
      nextWeekElement = $('[data-user-slug="' + this.payload.slug +'"].next_week')
      data = {};

  if(this.currentTarget.hasClass('previous_week')) {
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
