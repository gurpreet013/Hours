function DataFetcher(payload, successCallback, inputFieldChangeDetector) {
  this.payload = payload || {};
  this.successCallback = successCallback;
  this.inputFieldChangeDetector = inputFieldChangeDetector;
}

DataFetcher.prototype.sendRequest = function() {
  var _this = this,
      impersonatedSelectBox = $('#user_id'),
      payload = $.extend({}, this.payload, {slug: impersonatedSelectBox.val()});

  $.ajax({
    url: '/projects/new_index',
    data: payload,
    dataType: "json",
    success: _this.successHandler.bind(_this)
  });
};

DataFetcher.prototype.successHandler = function(data) {
  if(typeof this.successCallback == 'function') {
    this.successCallback(data);
  }
  this.initializeInputFieldChangeDetector();
}

DataFetcher.prototype.fetchData = function(currentTarget) {
  if(!this.inputFieldChangeDetector || !this.inputFieldChangeDetector.isInputFieldChanged || this.inputFieldChangeDetector.force) {
    this.sendRequest();
    this.inputFieldChangeDetector.force = false;
  } else {
    this.showSweetAlertMessage(currentTarget);
  }
}

DataFetcher.prototype.showSweetAlertMessage = function(currentTarget) {
  var _this = this;
  swal({
    title: "Are you sure?",
    text: "Your Changes are not saved yet.",
    type: "warning",
    showCancelButton: true,
    confirmButtonClass: "btn-danger sweetalert-btn",
    cancelButtonClass: 'sweetalert-btn',
    confirmButtonText: "Discard",
    closeOnConfirm: true
  },
  function() {
    _this.inputFieldChangeDetector.force = true;
    currentTarget.trigger('click');
  });
};

DataFetcher.prototype.initializeInputFieldChangeDetector = function() {
  this.inputFieldChangeDetector.refresh();
}
