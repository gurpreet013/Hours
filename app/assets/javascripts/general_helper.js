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
