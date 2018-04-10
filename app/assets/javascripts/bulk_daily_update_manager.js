function BulkDailyUpdateManager() {

}


BulkDailyUpdateManager.prototype.init = function() {
  this.bindEvents();
  this.fetchWeekUpdates();
}

BulkDailyUpdateManager.prototype.bindEvents = function() {
  var _this = this;

  $('#next_week').on('click', _this.weekChangeHandler.bind(_this));
  $('#previous_week').on('click', _this.weekChangeHandler.bind(_this));
};

BulkDailyUpdateManager.prototype.weekChangeHandler = function(e) {
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

BulkDailyUpdateManager.prototype.fetchWeekUpdates = function() {
  var _this = this,
      payload = this.payload;

  $.ajax({
    url: '/projects/new_index',
    data: payload,
    dataType: "json",
    success: _this.successHandler.bind(_this)
  });
};

// Returns an array of dates between the two dates
BulkDailyUpdateManager.prototype.getDates = function(startDate, endDate) {
  var dates = [],
      currentDate = startDate,
      addDays = function(days) {
        var date = new Date(this.valueOf());
        date.setDate(date.getDate() + days);
        return date;
      };
  while (currentDate <= endDate) {
    dates.push(currentDate);
    currentDate = addDays.call(currentDate, 1);
  }
  return dates;
}

BulkDailyUpdateManager.prototype.arrayToHash = function(collection) {
  var hash = {}
  collection.forEach(function(obj) {
    hash[obj.id] = obj;
  })
  return hash;
}

BulkDailyUpdateManager.prototype.successHandler = function(data) {
  var projects_collection = [],
      dateRange = this.getDates(new Date(data.range.from), new Date(data.range.to)),
      dailyUpdates = [];
      dailyUpdateHash = this.arrayToHash(data.daily_updates);

  data.projects.forEach(function(project) {
    var obj = {
      name: project.name,
      categories: project.categories.map(function(category) {
        return {
          id: category.id,
          name: category.name,
          hours: dateRange.map(function(date){
            var obj = data.hours.find(function(hour) { return hour.category_id == category.id && project.id == hour.project_id && moment(date).format('YYYY-MM-DD') == dailyUpdateHash[hour.daily_update_id].date })
            if(!obj) {
              obj = { value: 0 }
            }
            return obj;
          })
        }
      })
    }
    projects_collection.push(obj)
  })
  dateRange.forEach(function(date) {
    var obj = data.daily_updates.find(function(daily_update) { return daily_update.date == moment(date).format('YYYY-MM-DD') })
    if(!obj) {
      obj = { description: 'NA', date: date }
    }
    dailyUpdates.push(obj)
  })
  var templateData = {
    dates: dateRange.map(function(d) { return moment(d).format('ll'); }),
    projects: projects_collection,
    dailyUpdates: dailyUpdates
  }
  this.showMustacheTemplate('#daily_update_template', templateData, '#daily_entry_template');
  $('#current_week').html(moment(this.payload['from']).format('YYYY-MM-DD') + '..' + moment(this.payload['to']).format('YYYY-MM-DD'))
};

BulkDailyUpdateManager.prototype.showMustacheTemplate = function(templateId, data, target, options) {
  var templateHandler = new MustacheTemplateHandler(templateId, target, data, options);
  templateHandler.display();
};

$(function() {
  var bulkDailyUpdateManager = new BulkDailyUpdateManager();
  bulkDailyUpdateManager.init();
})
