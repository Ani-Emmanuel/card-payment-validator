const Allvalidator = require('../helper/allValidation');
const Validator = new Allvalidator();

class Transaction {
	transaction = (req, res) => {
		try {
			if (
				req.headers['content-type'] == 'application/xml' ||
				req.headers['content-type'] == 'application/json'
			) {
				let data = '';
				req.on('data', (chunk) => {
					data += chunk;
				});

				req.on('end', () => {
					res.setHeader('Content-Type', 'application/json');
					const { cardNumber, expireDate, cvv, email, phoneNumber } =
						JSON.parse(data);

					if (!cardNumber || !expireDate || !cvv || !email || !phoneNumber) {
						res.statusCode = 400;
						return res.end(
							JSON.stringify({
								valid: false,
								error:
									'{cardNumber, expireDate, cvv,  email, phoneNumber} are required'
							})
						);
					}

					if (!Validator.cardCheck(cardNumber)) {
						res.statusCode = 400;
						return res.end(
							JSON.stringify({ valid: false, error: 'Card is invalid' })
						);
					}

					if (!Validator.checkCardExpiration(expireDate)) {
						res.statusCode = 400;
						return res.end(
							JSON.stringify({ valid: false, error: 'Card has Expired' })
						);
					}

					if (!Validator.validatsCvv(cvv)) {
						res.statusCode = 400;
						return res.end(
							JSON.stringify({ valid: false, error: 'Invalid CVV' })
						);
					}

					if (!Validator.mobileNumberValidator(mobile)) {
						res.statusCode = 400;
						return res.end(
							JSON.stringify({ valid: false, error: 'Invalid mobile number' })
						);
					}

					if (Validator.phoneFormatter(phoneNumber) === 'Invalid Number') {
						res.statusCode = 400;
						return res.end(
							JSON.stringify({ valid: false, error: 'Invalid Number' })
						);
					}

					if (!Validator.emailValidator(email)) {
						res.statusCode = 400;
						return res.end(
							JSON.stringify({ valid: false, error: 'Invalid Email' })
						);
					}

					let country = Validator.phoneFormatter(phoneNumber);
					let cardType = Validator.checkCardType(cardNumber);
					let card = {
						valid: true,
						cardType,
						country,
						message: 'card charged'
					};
					res.statusCode = 200;
					res.end(JSON.stringify(card));
				});
			} else {
				res.statusCode = 400;
				return res.end('Only requests in XML and JSON headers are supported');
			}
		} catch (error) {
			res.statusCode = 503;
			return res.end(JSON.stringify({ valid: false, error: error.message }));
		}
	};
}

module.exports = Transaction;
