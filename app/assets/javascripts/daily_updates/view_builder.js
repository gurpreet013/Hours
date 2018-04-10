function DailyUpdatesViewBuilder(data) {
  this.data = data;
  this.dateRange = getDates(new Date(data.range.from), new Date(data.range.to));
  this.dailyUpdateHash = arrayToHash(data.daily_updates);
}

DailyUpdatesViewBuilder.prototype.generate = function() {
  this.showMustacheTemplate('#daily_update_template', this.templateData(), '#daily_entry_template');
  this.changeWeekHeaderHtml();
};

DailyUpdatesViewBuilder.prototype.prettyDateRange = function() {
  return this.dateRange.map(function(d) { return moment(d).format('ll'); })
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
  return this.dateRange.map(function(date) {
    var obj = _this.data.hours.find(function(hour) { return hour.category_id == category.id && project.id == hour.project_id && moment(date).format('YYYY-MM-DD') == _this.dailyUpdateHash[hour.daily_update_id].date })
    return obj || { value: 0 };
  });
};

DailyUpdatesViewBuilder.prototype.buildCategoriesData = function(project) {
  var _this = this;
  return project.categories.map(function(category) {
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
      name: project.name,
      categories: _this.buildCategoriesData(project)
    }
  })
}

DailyUpdatesViewBuilder.prototype.buildDailyUpdatesData = function() {
  var _this = this;
  return this.dateRange.map(function(date) {
    var obj = _this.data.daily_updates.find(function(daily_update) { return daily_update.date == moment(date).format('YYYY-MM-DD') });
    return obj || { description: 'NA', date: date };
  })
};

DailyUpdatesViewBuilder.prototype.changeWeekHeaderHtml = function() {
  $('#current_week').html(moment(this.data['range']['from']).format('YYYY-MM-DD') + '..' + moment(this.data['range']['to']).format('YYYY-MM-DD'))
}


DailyUpdatesViewBuilder.prototype.showMustacheTemplate = function(templateId, data, target, options) {
  var templateHandler = new MustacheTemplateHandler(templateId, target, data, options);
  templateHandler.display();
};
