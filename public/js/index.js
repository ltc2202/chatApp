$('#btn-signup').on('click',function(e) {
  e.preventDefault();
  var email = $('[name=email]').val();
  var name = $('[name=name]').val();
  var password = $('[name=password-signup]').val();
  var data = JSON.stringify({
    email: email,
    password: password,
    name: name
  });
  $.ajax({
    method: 'POST',
    url: '/users',
    dataType: 'json',
    contentType: 'application/json',
    data : data
  })
  .done(function(res) {
    // $('#form-signup').attr('action','/lobby').submit();
    window.location.href = '/lobby';
  })
  .fail(function(err) {
    alert('Invalid information!!!');
    console.log(err);
  })

});

$('#btn-login').on('click', function(e) {
  e.preventDefault();
  var info = $('[name=info-login]').val();
  var password = $('[name=password-login]').val();

  var data = JSON.stringify({
    info: info,
    password: password
  });

  $.ajax({
    method: 'POST',
    url: '/users/me',
    dataType: 'json',
    contentType: 'application/json',
    data : data
  })
  .done(function(res) {
    // $('#form-login').attr('action','/lobby').submit();
    window.location.href = '/lobby';
  })
  .fail(function(err) {
    alert('Invalid information!!!');
    console.log(err);
  })

// window.location.href =  window.location.href.split("?")[0];
});

// function isEmail(email) {
//     var filter = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
//     if (filter.test(email)) {
//         return true;
//     }
//     else {
//         return false;
//     }
// }​
