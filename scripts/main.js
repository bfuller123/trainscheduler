var databaseRef = firebase.database().ref('trains');

databaseRef.on('child_added', updateTrainSchedule);

function pushEmployee(event) {
  console.log('pushed employee!');
  databaseRef.push({
    name: $('#train-name').val().trim(),
    destination: $('#train-destination').val().trim(),
    start_time: $('#train-start-time').val().trim(),
    frequency: $('#train-frequency').val().trim(),
    date_added: firebase.database.ServerValue.TIMESTAMP
  });
  clearForm();
}

function updateTrainSchedule(snapshot) {
  var tableBody = $('#train-schedule');
  var newTableRow = $('<tr>');
  //var nextTrainArrival = findNextArrival(snapshot.val().start_time);
  newTableRow.append('<td>' + snapshot.val().name + '</td>');
  newTableRow.append('<td>' + snapshot.val().destination + '</td>');
  newTableRow.append('<td>' + '10:15' + '</td>'); //this will be replaced by the finding next arrival time
  newTableRow.append('<td>' + 10 + '</td>'); //we will create a function to find minutes until next train
  newTableRow.append('<td>' + snapshot.val().frequency + '</td>');
  tableBody.append(newTableRow);
}

function clearForm() {
  $('#train-name').val("");
  $('#train-destination').val("");
  $('#train-start-time').val("");
  $('#train-frequency').val("");
}

function findNextArrival(startDate) {
  var dateAsArray = startDate.split('/');
  var reformattedDate = dateAsArray[2]+dateAsArray[0]+dateAsArray[1];
  console.log(reformattedDate);
  var timeFromNow = moment(reformattedDate, 'YYYYMMDD').fromNow('MM');
  if (timeFromNow.includes('years')) {
    timeFromNow = timeFromNow.split(' ');
    timeFromNow = timeFromNow[0] * 12;
  }
  else if (timeFromNow.includes('months')) {
    timeFromNow = timeFromNow.split(' ');
    timeFromNow = timeFromNow[0];
  }
  return timeFromNow;
}

$('#submit-button').on('click', pushEmployee);
