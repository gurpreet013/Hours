function InputFieldChangeDetector(selector) {
  this.selector = selector;
  this.defaultSelector = 'input, textarea';
}

InputFieldChangeDetector.prototype.init = function() {
  this.bindEvents();
  this.refresh();
};

InputFieldChangeDetector.prototype.refresh = function() {
  var _this = this;
  this.isInputFieldChanged = false;
  this.inputFieldHash = {};
  $(_this.defaultSelector).each(function(value) {
    var element = $(this);
    _this.inputFieldHash[element.attr('name')] = element.val();
  })
}

InputFieldChangeDetector.prototype.bindEvents = function() {
  var _this = this;
  if(_this.selector) {
    $('body').on('change', _this.selector, _this.changeHandler.bind(_this));
  } else {
    $('body').on('change', _this.defaultSelector, _this.changeHandler.bind(_this));
  }
};

InputFieldChangeDetector.prototype.changeHandler = function(e) {
  this.isInputFieldChanged = false;
  var _this= this, collection = $(_this.defaultSelector);
  collection.each(function(index) {
    var element = $(this);
    if(typeof(_this.inputFieldHash[element.attr('name')]) != 'undefined' && _this.inputFieldHash[element.attr('name')] != element.val()) {
      _this.isInputFieldChanged = true
      return false;
    }
  })
}
