**STEPS TO RUN THE PROJECT**

 - Clone the project to your system
 - Navigate into the project
 - run npm start

**Request data**

    {
    "cardNumber": "Your valid card number",
    "expireDate":"Card expiration date",
    "cvv":"Card CVV",
    "email":"Your email",
    "phoneNumber":"11 digit phone number"
    }
**Response**

    {
    "valid":  true,
    "cardType":  "Your card type",
    "numberFormat":  "Formatted number with nigerian country code",
    "message":  "card charged"
    }
