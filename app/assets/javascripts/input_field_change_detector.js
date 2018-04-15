function InputFieldChangeDetector(selector) {
  this.selector = selector;
  this.defaultSelector = 'input, textarea';
  this.inputFieldHash = {};
  this.isInputFieldChanged = false;
}

InputFieldChangeDetector.prototype.init = function() {
  var _this = this;
  this.bindEvents();
  $(_this.defaultSelector).each(function(value) {
    var element = $(this);
    _this.inputFieldHash[element.attr('name')] = element.val();
  })
};

InputFieldChangeDetector.prototype.bindEvents = function() {
  var _this = this;
  if(_this.selector) {
    $(_this.selector).on('change', _this.changeHandler.bind(_this));
  } else {
    $(_this.defaultSelector).on('change', _this.changeHandler.bind(_this));
  }
};

InputFieldChangeDetector.prototype.changeHandler = function(e) {
  this.isInputFieldChanged = false;
  var _this= this, collection = $(_this.defaultSelector);
  collection.each(function(index) {
    var element = $(this);
    if(_this.inputFieldHash[element.attr('name')] != element.val()) {
      _this.isInputFieldChanged = true
      return false;
    }
  })
}
