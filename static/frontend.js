jQuery(function($) {
  $('#checkout-form').submit(function(e) {
    var $form = $(this);
    Stripe.card.createToken($form, stripeResponseHandler);
    e.preventDefault();
  });
});

function stripeResponseHandler(status, response) {
  var $form = $('#checkout-form');
  if (response.error) {

    // ADDED THESE CONSOLE LOGS TO HELP WITH DEBUGGING!
    console.log('response.error >> ');
    console.log(response.error);
    
    $form.find('.payment-errors').text(response.error);
  } else {
    var token = response.id;
    $.ajax({
      method: "POST",
      url: "/create_and_charge_customer",
      dataType: "json",
      data: { token: token, email: "test@mailinator.com", amount: 100 }
    })
    .done(function(data) {
      $form.find('.payment-errors').text(data[1]);
    });
  }
};
