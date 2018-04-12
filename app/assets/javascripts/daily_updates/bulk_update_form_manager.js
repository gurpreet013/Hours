function BulkUpdateFormManager(dateRange) {
  this.bulkUpdatesData = [];
  this.dateRange = dateRange;
}

BulkUpdateFormManager.prototype.init = function() {
  this.bindEvent();
}

BulkUpdateFormManager.prototype.bindEvent = function() {
  var _this = this;
  $('body').on('click', '.submit', _this.submitHandler.bind(_this));
}

BulkUpdateFormManager.prototype.updateDateRange = function(dateRange) {
  this.dateRange = dateRange;
}

BulkUpdateFormManager.prototype.submitHandler = function() {
  this.bulkUpdatesData = [];
  this.prepareCollectionData();
  this.submitForm();
}

BulkUpdateFormManager.prototype.prepareHoursData = function() {
  var _this = this, hoursHash = {}
  $('.hours-td').each(function(index, hourInput) {
    hourInput = $(hourInput);
    var data = hourInput.data(),
        value = hourInput.val(),
        hourData = { id: data.hourId, category_id: data.categoryId, project_id: data.projectId, date: data.date, value: value }

    hoursHash[data.date] = hoursHash[data.date] ? hoursHash[data.date] : []
    hoursHash[data.date].push(hourData);
  })
  return hoursHash;
}

BulkUpdateFormManager.prototype.prepareCollectionData = function() {
  var _this = this,
      hoursHash = this.prepareHoursData(),
      descriptionHash = this.prepareDescriptionHash();

  this.dateRange.map(function(date) {
    var formattedDate = moment(date).format('YYYY-MM-DD'),
        dailyUpdatesData = {
          date: formattedDate,
          description: descriptionHash[formattedDate],
          hours_attributes: hoursHash[formattedDate]
        }
    _this.bulkUpdatesData.push(dailyUpdatesData);
  })
};

BulkUpdateFormManager.prototype.prepareDescriptionHash = function() {
  var _this = this, descriptionsHash = {}
  $('.td-description').each(function(index, descriptionTextarea) {
    descriptionTextarea = $(descriptionTextarea);
    var data = descriptionTextarea.data(),
        value = descriptionTextarea.val();

    descriptionsHash[data.date] = value;
  });
  return descriptionsHash;
}

BulkUpdateFormManager.prototype.submitForm = function() {
  var _this = this;
  $.ajax({
    url: '/daily_updates/bulk_update',
    method: 'POST',
    data: {daily_updates: _this.bulkUpdatesData},
    dataType: "json",
    success: _this.successHandler.bind(_this)
  })
}

BulkUpdateFormManager.prototype.successHandler = function(data) {
  $('.hours-td').each(function(index, hourInput) {
    hourInput = $(hourInput);
    if(hourInput.val() == 0) {
      hourInput.data('hourId', null)
    }
  })
}
