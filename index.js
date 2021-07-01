const http = require('http');
const Transaction = require('./controller/transaction');
const tran = new Transaction();
const port = process.env.PORT || 3000;

http
	.createServer(tran.transaction)
	.listen(port, () => console.log(`server started on port ${port}`));
