function DailyUpdatesViewModifier(projectsHash, dateRange) {
  this.projectsHash = projectsHash;
  this.dateRange = dateRange;
};

DailyUpdatesViewModifier.prototype.init = function() {
  this.bindEvent();
};

DailyUpdatesViewModifier.prototype.bindEvent = function() {
  var _this = this;
  $('body').on('click', '.add_category', _this.addCategoryButtonHandler.bind(_this))
  $('body').on('click', '.minus-row', _this.removeCategoryRowHandler.bind(_this))

};

DailyUpdatesViewModifier.prototype.addCategoryButtonHandler = function(e) {
  var currentTarget = $(e.currentTarget),
      parentTr = currentTarget.parents('tr'),
      projectId = currentTarget.data('projectId');
  this.showMustacheTemplate('#category_row', this.templateData(projectId), parentTr, {after: true});
  this.bindAutoCompleteEvent(projectId);
};

DailyUpdatesViewModifier.prototype.removeCategoryRowHandler = function(e) {
  var currentTarget = $(e.currentTarget),
      parentTr =  currentTarget.parents('tr');
  parentTr.remove()
};

DailyUpdatesViewModifier.prototype.bindAutoCompleteEvent = function(projectId) {
  var categories = this.projectsHash[projectId].categories.map(function(category) { return category.name });
  $('#category_input').autocomplete({ source: categories });
}

DailyUpdatesViewModifier.prototype.templateData = function(projectId) {
  return {
    name: null,
    hours: this.hourDefaultData(projectId)
  }
};

DailyUpdatesViewModifier.prototype.hourDefaultData = function(projectId) {
  return this.dateRange.map(function(date) {
    return {
      id: null,
      date: date,
      project_id: projectId,
      category_id: null,
      value: 0
    }
  })
}

DailyUpdatesViewModifier.prototype.showMustacheTemplate = function(templateId, data, target, options) {
  var templateHandler = new MustacheTemplateHandler(templateId, target, data, options);
  templateHandler.display();
};


DailyUpdatesViewModifier.prototype.updateData = function(projectsHash, dateRange) {
  this.projectsHash = projectsHash;
  this.dateRange = dateRange;
};
