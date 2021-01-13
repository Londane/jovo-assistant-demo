function isTelegramRequest(request) {
    if (request.originalDetectIntentRequest) {
        if (request.originalDetectIntentRequest.source == "telegram") {
            return true;
        } else {
            console.log("request from: " + request.originalDetectIntentRequest.source);
        }
    } else {
        console.log("No originalDetectIntentRequest detected!");
    }
    return false;
}

//see also https://core.telegram.org/bots/api#user
function getTelegramUserObject(request) {
    var user = "";
    try {
        user = request.originalDetectIntentRequest.payload.data.from
    } catch (ex) {
        console.log("request has no telegram user");
    }
    return user;
}
module.exports = {isTelegramRequest, getTelegramUserObject};