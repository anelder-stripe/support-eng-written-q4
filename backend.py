import stripe
from flask import Flask, render_template, request

PUBLISHABLE_KEY = "pk_test_rGGe62bND8FrxWNAXHUcAfyU"
SECRET_KEY = "sk_test_W8xJYzw56NCHun0FT9iGIJeI"

# Configure Flask
application = Flask(__name__)

# Configure Stripe
stripe.api_key = SECRET_KEY


def render_response(kind, message):
    return '["{0}","{1}"]'.format(kind, message)


@application.route('/')
def index():
    return render_template('frontend.html', **{'pk': PUBLISHABLE_KEY})


@application.route('/create_and_charge_customer', methods=['POST'])
def create_and_charge_customer():
    token = request.form['token']
    email = request.form['email']
    amount_in_dollars = float(request.form['amount'])
    amount_in_cents = int(amount_in_dollars)

    try:
        customer = stripe.Customer.create(email=email, source=token)
        customer_id = customer['id']
        charge = stripe.Charge.create(
            amount=amount_in_cents,
            customer=customer_id,
            currency='aud'
        )
    except stripe.error.StripeError as e:
        body = e.json_body
        return render_response("error", body)
    except Exception as e:
        return render_response("error", "backend error")

    return render_response("success", "You made a successful payment!")


if __name__ == '__main__':
    application.run(host="0.0.0.0", port=5000, debug=True)
