// Returns an array of dates between the two dates
function getDates(startDate, endDate) {
  var dates = [],
      currentDate = startDate,
      addDays = function(days) {
        var date = new Date(this.valueOf());
        date.setDate(date.getDate() + days);
        return date;
      };
  while (currentDate <= endDate) {
    dates.push(currentDate);
    currentDate = addDays.call(currentDate, 1);
  }
  return dates;
}

function arrayToHash(collection) {
  var hash = {}
  collection.forEach(function(obj) {
    hash[obj.id] = obj;
  })
  return hash;
}

if(!window.location.query) {
  window.location.query = function(){
    var map = {};

    if ("" != this.search) {
      var groups = this.search.substr(1).split("&"), i;

      for (i in groups) {
        i = groups[i].split("=");
        map[decodeURIComponent(i[0])] = decodeURIComponent(i[1]);
      }
    }

    return map;
  };
}
