function ProjectsAssignManager() {

}

ProjectsAssignManager.prototype.init = function() {
  this.bindEvent();
};


ProjectsAssignManager.prototype.bindEvent = function() {
  var _this = this;
  $('#select_all').on('click', _this.toggleAllProjects.bind(_this, true));
  $('#select_none').on('click', _this.toggleAllProjects.bind(_this, false));
};

ProjectsAssignManager.prototype.toggleAllProjects = function(checked) {
  $('.project_checkbox').prop('checked', checked)
}


$(function() {
  var projectsAssignManager = new ProjectsAssignManager();
  projectsAssignManager.init();
})
