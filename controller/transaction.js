const Allvalidator = require('../helper/allValidation');
const Validator = new Allvalidator();

class Transaction {
	transaction = (req, res) => {
		try {
			let data = '';
			req.on('data', (chunk) => {
				data += chunk;
			});

			req.on('end', () => {
				res.setHeader('Content-Type', 'application/json');
				const { cardNumber, expireDate, cvv, email, phoneNumber } =
					JSON.parse(data);
				let numberFormat;
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

				if (Validator.phoneFormatter(phoneNumber) === 'Invalid Number') {
					res.statusCode = 400;
					return res.end(
						JSON.stringify({ valid: false, error: 'Invalid Number' })
					);
				}

				numberFormat = Validator.phoneFormatter(phoneNumber);
				let cardType = Validator.checkCardType(cardNumber);
				let card = {
					valid: true,
					cardType,
					numberFormat,
					message: 'card charged'
				};
				res.statusCode = 200;
				res.end(JSON.stringify(card));
			});
		} catch (error) {
			res.statusCode = 503;
			return res.end(JSON.stringify({ valid: false, error: error.message }));
		}
	};
}

module.exports = Transaction;
