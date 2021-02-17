const axios = require('axios');
const crypto = require('crypto');
const baseUrl = 'https://api-testnet.bybit.com';
const slaveApiKey = process.env.slaveApiKey;
const slaveSecret = process.env.slaveSecret;
exports.submitOrder = (data) => {
    const timestamp = Date.now() - 1200;
    const {
        price,
        percentage,
        leverage,
        side,
        symbol,
        order_type,
        qty,
        take_profit,
        stop_loss,
    } = data;
    const activeOrderQueryString = `api_key=${slaveApiKey}&close_on_trigger=false&order_type=Limit&price=${price}&qty=${qty}&reduce_only=false&side=${side}&stop_loss=${stop_loss}&symbol=${symbol}&take_profit=${take_profit}&time_in_force=GoodTillCancel&timestamp=${timestamp}`;
    //api_key=AV8RJ4hjD9nxB2LamP&order_type=Limit&price=37939.00&qty=0.002&reduce_only=false&side=buy&stop_loss=1138.1699999999998&symbol=XTZUSDT&take_profit=379.39&time_in_force=GoodTillCancel&timestamp=1612728641577
    const activeOrderSignature = crypto
        .createHmac('sha256', slaveSecret)
        .update(activeOrderQueryString)
        .digest('hex');

    const orderEndPoint = '/private/linear/order/create';
    axios
        .post(baseUrl + orderEndPoint, {
            api_key: slaveApiKey,
            close_on_trigger: false,
            order_type: 'Limit',
            price: price,
            qty: qty,
            reduce_only: false,
            side: side,
            stop_loss: stop_loss,
            symbol: symbol,
            take_profit: take_profit,
            time_in_force: 'GoodTillCancel',
            timestamp: timestamp,
            sign: activeOrderSignature,
        })
        .then((result2) => {
            console.log(result2.data);
        })
        .catch((err) => {
            console.error(err);
        });
};
