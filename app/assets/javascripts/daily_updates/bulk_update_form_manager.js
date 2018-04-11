function BulkUpdateFormManager() {
  this.bulkUpdatesData = [];
}

BulkUpdateFormManager.prototype.init = function() {
  this.bindEvent();
}

BulkUpdateFormManager.prototype.bindEvent = function() {
  var _this = this;
  $('body').on('click', '.submit', _this.submitHandler.bind(_this));
}
