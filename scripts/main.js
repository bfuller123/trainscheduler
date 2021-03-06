var databaseRef = firebase.database().ref('trains');
var provider = new firebase.auth.GoogleAuthProvider();

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

function loginWithGoogle() {
  firebase.auth().signInWithPopup(provider).then(function(result){
    var token = result.credential.accessToken;
    var user = result.user;
  }).catch(function(error) {
    var errorCode = error.code;
    var errorMessage = error.message;
    var email = error.email;
    var credential = error.credential;
    $('.errorMessage').text(errorMessage);
  });
}

function signOut() {
  firebase.auth().signOut().then(function(){
    console.log('signout successful');
    $('.form').css('display', 'none');
    $('#logout').css('display', 'none');
    $('#login').css('display', 'block');
  });
}

firebase.auth().onAuthStateChanged(function(user){
  if(user){
    $('.form').css('display', 'block');
    $('#login').css('display', 'none');
    $('#logout').css('display', 'block');
    console.log('success!');
  }
});

$('#submit-button').on('click', pushTrain);
$('#login').on('click', loginWithGoogle);
$('#logout').on('click', signOut);
setInterval(addCurrentTime, 1000);
