Template.main.events({
  "submit form": function(event){
    event.preventDefault();
    pay();
  }
});


pay = function() {
  Session.set('paymentInProgress', null);

  Session.set('paymentInProgress', true);
  console.log('braintree.api.Client', Session.get('btClientToken'));
  var client = new braintree.api.Client({
    clientToken: Session.get('btClientToken')
  });

  console.log('client created');

  client.tokenizeCard({
    number: $('#cc_num').val(),
    // cardholderName: "John Smith",
    // You can use either expirationDate
    expirationDate: $('#cc_expiry').val(),
    // or expirationMonth and expirationYear
    // expirationMonth: "10",
    // expirationYear: "2015",
    // CVV if required
    cvv: $('#cc_cvv').val()
  }, function (err, nonce) {
    var data = {
      amount: $('#Amount').val(),
      nonce: nonce
    };
    Meteor.call('createTransaction', data, function (err, result) {
      console.log("Payment in progress");
      console.log(result);
      Session.set('paymentInProgress', null);
//      Router.go('paymentConfirm');
    });

  });
}

Template.main.onRendered(function()
  {
    Meteor.call('getClientToken', function(err, token) {
      Session.set('btClientToken', null);

      if (err) {
        notifyError(err.reason);
      } else {
        Session.set('btClientToken', token);

        console.log('token set ',token );
      }

    });
  });
