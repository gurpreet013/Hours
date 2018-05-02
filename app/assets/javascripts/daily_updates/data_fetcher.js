function DataFetcher(payload, options) {
  options = options || {};
  this.payload = payload || {};
  this.readonly = options.readonly;
  this.successCallback = options.successCallback;
  this.inputFieldChangeDetector = options.inputFieldChangeDetector;
}

DataFetcher.prototype.sendRequest = function() {
  var _this = this,
      payload = this.payload,
      userSlug = window.location.query().slug;

  if(userSlug) { payload['slug'] = userSlug; }

  $.ajax({
    url: window.I18n.en.routes.daily_updates_path,
    data: payload,
    dataType: "json",
    success: _this.successHandler.bind(_this)
  });
};

DataFetcher.prototype.successHandler = function(data) {
  data = data.collection ? data : $.extend(data.users[0], {readonly: this.readonly});
  if(typeof this.successCallback == 'function') {
    this.successCallback(data);
  }
  this.initializeInputFieldChangeDetector();
}

DataFetcher.prototype.fetchData = function(currentTarget) {
  if(!this.inputFieldChangeDetector || !this.inputFieldChangeDetector.isInputFieldChanged || this.inputFieldChangeDetector.force) {
    this.sendRequest();
    if(!this.readonly) {
      this.inputFieldChangeDetector.force = false;
    }
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
  if(!this.readonly) {
    this.inputFieldChangeDetector.refresh();
  }
}
