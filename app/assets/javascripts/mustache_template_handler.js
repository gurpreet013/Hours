function MustacheTemplateHandler(templateId, target, data, options) {
  this.templateId = templateId;
  this.target = target;
  this.data = data;
  this.options = options || {};
}

MustacheTemplateHandler.prototype.display = function() {
  var template = $(this.templateId).html();
  Mustache.parse(template);
  var rendered = Mustache.render(template, this.data, (this.options.templates || {}));
  if(this.options.replaceWith) {
    $(this.target).replaceWith(rendered);
  } else if (this.options.after) {
    $(this.target).after(rendered);
  } else {
    $(this.target).html(rendered);
  }
}
