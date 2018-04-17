function DailyUpdatesViewBuilder(data, dateRange) {
  this.data = data;
  this.dateRange = dateRange;
  this.dailyUpdateHash = arrayToHash(data.daily_updates);
}

DailyUpdatesViewBuilder.prototype.generate = function() {
  this.showMustacheTemplate('#daily_update_template', this.templateData(), '#daily_entry_template');
  this.changeWeekHeaderHtml();
};

DailyUpdatesViewBuilder.prototype.prettyDateRange = function() {
  return this.dateRange.map(function(d) {
    var date = moment(d);
    return {
      value: date.format('ll'),
      dayName: date.format('ddd')
    }
  })
}

DailyUpdatesViewBuilder.prototype.templateData = function() {
  return {
    dates: this.prettyDateRange(),
    projects: this.buildProjectsData(),
    dailyUpdates: this.buildDailyUpdatesData()
  }
}

DailyUpdatesViewBuilder.prototype.buildHoursData = function(category, project) {
  var _this = this;
  return this.dateRange.map(function(date, index) {
    var obj = _this.data.hours.find(function(hour) { return hour.category_id == category.id && project.id == hour.project_id && moment(date).format('YYYY-MM-DD') == _this.dailyUpdateHash[hour.daily_update_id].date })
    obj = obj || { value: 0, id: null, date: moment(date).format('YYYY-MM-DD'), project_id: project.id, category_id: category.id };
    return $.extend(obj, { hoursName: 'hour_' + index + '_' + category.id + '_' + project.id })
  });
};

DailyUpdatesViewBuilder.prototype.buildCategoriesData = function(project) {
  var _this = this;
  return project.current_week_categories.map(function(category) {
    return {
      id: category.id,
      name: category.name,
      hours: _this.buildHoursData(category, project)
    }
  })
};

DailyUpdatesViewBuilder.prototype.buildProjectsData = function() {
  var _this = this;
  return this.data.projects.map(function(project) {
    return {
      id: project.id,
      name: project.name,
      currentWeekCategories: _this.buildCategoriesData(project)
    }
  })
}

DailyUpdatesViewBuilder.prototype.buildDailyUpdatesData = function() {
  var _this = this;
  return this.dateRange.map(function(date, index) {
    var obj = _this.data.daily_updates.find(function(daily_update) { return daily_update.date == moment(date).format('YYYY-MM-DD') });
    obj = obj || { description: 'NA', date: date };
    return $.extend(obj, {descriptionName: 'description_' + index})
  })
};

DailyUpdatesViewBuilder.prototype.changeWeekHeaderHtml = function() {
  $('#current_week').html(moment(this.data['range']['from']).format('DD-MM-YYYY') + ' - ' + moment(this.data['range']['to']).format('DD-MM-YYYY'))
}

DailyUpdatesViewBuilder.prototype.showMustacheTemplate = function(templateId, data, target) {
  var template = $('#category_row').html();
  Mustache.parse(template);
  var templateHandler = new MustacheTemplateHandler(templateId, target, data, {templates: { category_row: template }});
  templateHandler.display();
};
