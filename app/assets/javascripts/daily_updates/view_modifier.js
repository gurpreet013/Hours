function DailyUpdatesViewModifier(projectsHash, dateRange) {
  this.projectsHash = projectsHash;
  this.dateRange = dateRange;
  this.projectRemainingCategoriesHash = {}
};

DailyUpdatesViewModifier.prototype.init = function() {
  this.prepareCategoriesLeftData();
  this.bindEvent();
};

DailyUpdatesViewModifier.prototype.bindEvent = function() {
  var _this = this;
  $('body').on('click', '.add_category', _this.addCategoryButtonHandler.bind(_this));
  $('body').on('click', '.minus-row', _this.removeCategoryRowHandler.bind(_this));
  $('body').on('blur', '#category_input', _this.categoryInputBlurHandler.bind(_this));
};

DailyUpdatesViewModifier.prototype.categoryInputBlurHandler = function(e) {
  var currentTarget = $(e.currentTarget),
      currentValue = currentTarget.val(),
      parentTd = currentTarget.parents('td'),
      projectId = parentTd.data('projectId'),
      newTdElement = $('<td>', { text: currentValue }),
      categoryNames = this.projectsHash[projectId].categories.map(function(category) { return category.name } );
  if(categoryNames.includes(currentValue)) {
    parentTd.replaceWith(newTdElement);
  }
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
      parentTr =  currentTarget.parents('tr'),
      projectId = parentTr.data('projectId'),
      categoryId = parentTr.data('categoryId'),
      removeCategoryObj = this.projectsHash[projectId].categories.find(function(category) {return category.id == categoryId})

  this.projectRemainingCategoriesHash[projectId].push(removeCategoryObj);
  this.toggleAddCategoryIfRequired(projectId);
  parentTr.remove()
};

DailyUpdatesViewModifier.prototype.bindAutoCompleteEvent = function(projectId) {
  var categories = this.projectRemainingCategoriesHash[projectId].map(function(category) { return {value: category.name, id: category.id }}),
      _this = this;
  $('#category_input').autocomplete({
    source: categories,
    select: function(event, ui) {
      $(this).parents('tr').find('input[type="number"]').data('categoryId', ui.item.id)
      $(this).parents('tr').data('categoryId', ui.item.id)
      _this.projectRemainingCategoriesHash[projectId] = _this.projectRemainingCategoriesHash[projectId].filter(function(obj){ return obj.id != ui.item.id })
      _this.toggleAddCategoryIfRequired(projectId);
    }
  });
  $('#category_input').focus();
}

DailyUpdatesViewModifier.prototype.templateData = function(projectId) {
  return {
    name: null,
    project_id: projectId,
    hours: this.hourDefaultData(projectId)
  }
};

DailyUpdatesViewModifier.prototype.hourDefaultData = function(projectId) {
  var _this = this;
  return this.dateRange.map(function(date, index) {
    return {
      id: null,
      date: moment(date).format('YYYY-MM-DD'),
      project_id: projectId,
      category_id: null,
      value: 0,
      minusRequiredClass: (index + 1 == _this.dateRange.length) ? 'last-td' : ''
    }
  })
}

DailyUpdatesViewModifier.prototype.showMustacheTemplate = function(templateId, data, target, options) {
  var templateHandler = new MustacheTemplateHandler(templateId, target, data, options);
  templateHandler.display();
};

DailyUpdatesViewModifier.prototype.prepareCategoriesLeftData = function() {
  var _this = this;
  Object.values(this.projectsHash).forEach(function(project) {
    _this.projectRemainingCategoriesHash[project.id] = project.categories.filter(function(obj) {
      return !project.current_week_categories.some(function(category){
        return obj.id === category.id;
      });
    })
    _this.toggleAddCategoryIfRequired(project.id)
  })
};

DailyUpdatesViewModifier.prototype.toggleAddCategoryIfRequired = function(projectId) {
  var addCategoryBtn = $('[data-project-id="' + projectId + '"].add_category');
  if(this.projectRemainingCategoriesHash[projectId].length == 0) {
    addCategoryBtn.hide();
  } else {
    addCategoryBtn.show();
  }
};

DailyUpdatesViewModifier.prototype.updateData = function(projectsHash, dateRange) {
  this.projectsHash = projectsHash;
  this.dateRange = dateRange;
  this.prepareCategoriesLeftData();
};
