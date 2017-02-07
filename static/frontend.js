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
    $form.find('.payment-errors').text(response.error.message);
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
