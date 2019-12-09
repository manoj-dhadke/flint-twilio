/**
** Creation Date: 21st November 2019
** Summary: This flintbit is used send sms using twilio.
** Description: This flintbit is used send sms using twilio
**/
log.trace("Started execution of 'flint-twilio:twilio_send_message.js' flintbit..")

log.debug("Input :: "+input)

from = input.get("twilio_number")
to = input.get("send_sms_to")
body = input.get("text_message")
account_sid = input.get("twilio_account_sid")
auth_token  = input.get("twilio_auth_token")
connector_name = "http"

// Validate Authorization values

if (account_sid == null || account_sid == "") {
    throw "Please provide account sid"
  }

  if (auth_token== null || auth_token == "") {
    throw "Please provide auth token"
  }

// validate sms message parameters

if (from == null || from == "") {
    throw "Please provide from parameter "
  }

if (to == null || to == "") {
    throw "Please provide to parameter "
  }

if (body == null || body== "") {
    throw "Please provide body parameter "
  }

from = util.encodeurl(from)
to = util.encodeurl(to)
body = util.encodeurl(body)

http_body = "From="+from+"&To="+to+"&Body="+body

log.info("http_body:"+http_body)

auth_header = "Authorization: Basic "+util.encode64(account_sid+":"+auth_token)

log.info("auth_header::"+auth_header)

log.trace("Calling Twilio API...")
twilio_response = call.connector(connector_name)
                      .set("method","post")                    //HTTP request method
                      .set("url","https://api.twilio.com/2010-04-01/Accounts/"+account_sid+"/Messages.json")
                      .set("body",http_body)
                      .set("headers",["Cache-Control:no-cache","Content-Type: application/x-www-form-urlencoded",auth_header])                         //HTTP request headers
                      .set("timeout",60000)
                      .sync()

//HTTP Connector Response Meta Parameters
response_exitcode = twilio_response.exitcode()                                              //Exit status code
response_message = twilio_response.message()                                                //Execution status message

log.info("response_message::"+response_message)

//HTTP Connector Response Parameters
response_body = twilio_response.get("body")                                               //Response Body
response_headers = twilio_response.get("headers")                                         //Response Headers

if (response_exitcode == 0){
    log.info('Success in executing HTTP Connector where, exitcode ::'+response_exitcode.to_s+' | message :: '+response_message)
    output.set("result",(response_body))
    to = util.decodeurl(to)
    user_message = 'SMS successfully send to ' + to + ' number'
    output.set("user_message", user_message)
}
else
{
    log.error('Failure in executing HTTP Connector where, exitcode ::'+response_exitcode.to_s+' | message :: ' +response_message)
    output.set("error",response_message)
    to = util.decodeurl(to)
    user_message = 'Unable to send SMS to ' + to + ' number'
    output.set("user_message", user_message)
    output.exit(-1, response_message)
}   
log.trace("Finished execution of 'flint-twilio:twilio_send_message.js' flintbit..")