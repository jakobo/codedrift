var RaceExample = function() {
  var foo = 0;
  var bar = 0;

  // simulate set timeout that goes through while prompt is up...
  var startRandomSabotage = function() {
    window.setTimeout(function() {
      foo = "destroyer of code!";
    }, 4000);
  };

  // simulate a prompt
  var buttonClick = function(e) {
    foo = prompt("Enter a new value for foo");
    startRandomSabotage();
    bar = prompt(
      "Enter a new value for bar. Oh, and take your time... like 5 seconds or so while I overwrite foo in the background."
    );
    alert("Okay, now we have:\nfoo = " + foo + "\n bar = " + bar);
  };

  buttonClick();
};

var ProtectedRaceExample = function() {
  var foo = 0;
  var bar = 0;

  // new line, declares some locks
  Lock.declare("foo", "bar");

  // simulate set timeout that goes through while prompt is up...
  var startRandomSabotage = function() {
    var sabotage = function() {
      // try and get a foo lock
      var foo_lock = Lock.obtain("foo");

      if (!foo_lock.isOwner()) {
        window.setTimeout(sabotage, 10);
        return;
      }

      // got a lock, change foo
      foo = "destroyer of code!";

      // release lock
      foo_lock.release();
    };
    sabotage();
  };

  // simulate a prompt
  var buttonClick = function(e) {
    // lock foo, bar
    var foo_lock = Lock.obtain("foo");
    var bar_lock = Lock.obtain("bar");

    // if one of these isn't owner, retry
    if (!foo_lock.isOwner() || !bar_lock.isOwner()) {
      foo_lock.release();
      bar_lock.release();
      window.setTimeout(buttonClick, 10);
    }

    // locks are obtained

    foo = prompt("Enter a new value for foo");
    startRandomSabotage();
    bar = prompt(
      "Enter a new value for bar. Oh, and take your time... like 5 seconds or so while I overwrite foo in the background."
    );
    alert("Okay, now we have:\nfoo = " + foo + "\n bar = " + bar);
    foo_lock.release();
    bar_lock.release();
  };

  buttonClick();
};
