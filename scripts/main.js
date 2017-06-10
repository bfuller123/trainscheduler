var databaseRef = firebase.database().ref('trains');

databaseRef.on('child_added', updateTrainSchedule);

function pushTrain(event) {
  console.log('pushed train!');
  databaseRef.push({
    name: $('#train-name').val().trim(),
    destination: $('#train-destination').val().trim(),
    start_time: $('#train-start-time').val().trim(),
    frequency: $('#train-frequency').val().trim(),
    date_added: firebase.database.ServerValue.TIMESTAMP
  });
  clearForm();
}

function addCurrentTime() {
  var currentTime = moment().format('LT');
  $('.time').text(currentTime);
}

function updateTrainSchedule(snapshot) {
  databaseKeys.push(snapshot.val());
  var tableBody = $('#train-schedule');
  var newTableRow = $('<tr>');
  var startTime = snapshot.val().start_time;
  var frequency = snapshot.val().frequency;
  var name = snapshot.val().name;
  var minutesTillTrain = findMinutesUntilTrain(startTime, frequency);
  var nextArrival = findNextArrival(minutesTillTrain);
  newTableRow.append('<td>' + name + '</td>');
  newTableRow.append('<td>' + snapshot.val().destination + '</td>');
  newTableRow.append('<td class="next-arrival" data-train-name="'+name+'">' + nextArrival + '</td>');
  newTableRow.append('<td class="minutes-till" data-train-name="'+name+'">' + minutesTillTrain + '</td>');
  newTableRow.append('<td>' + frequency + '</td>');
  tableBody.append(newTableRow);
}

function clearForm() {
  $('#train-name').val("");
  $('#train-destination').val("");
  $('#train-start-time').val("");
  $('#train-frequency').val("");
}

function findMinutesUntilTrain(startTime, frequency) {
  var currentTime = moment();
  startTime = moment(startTime, 'hh:mm').subtract(1, 'years');
  var diffInTimes = currentTime.diff(moment(startTime), 'minutes');
  var minutesTillTrain = frequency - (diffInTimes % frequency);
  return minutesTillTrain;
}

function findNextArrival(minutes) {
  var nextTrainArrival = moment().add(minutes, 'minutes');
  return nextTrainArrival.format('LT');
}

$('#submit-button').on('click', pushTrain);
setInterval(addCurrentTime, 1000);
