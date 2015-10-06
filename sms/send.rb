from = @input.get("from")
to = @input.get("to")
body = @input.get("message")

if from == nil
  @log.debug("Geting 'from' from Global Config ")
  from = @config.global("flint-twilio.from") # It gives value for username field from aws config
end

account_sid = @config.global("flint-twilio.account_sid")
auth_token  = @config.global("flint-twilio.auth_token")

# Valuidate Authrization values
if account_sid.empty? && auth_token.empty?
   @output.exit(1,"you must configure sid and token in global configuration")
end

# validate sms message parameters
if from.empty? && to.empty? && body.empty?
   @output.exit(2,"you must supply correct from, to and message values")
end

from = @util.encodeurl(from)
to = @util.encodeurl(to)
body = @util.encodeurl(body)

http_body = "From=#{from}&To=#{to}&Body=#{body}"

auth_header = "Authorization: Basic "+@util.encode64(account_sid+":"+auth_token)

@log.trace("Calling Twilio API...")
twilio_response = @call.connector("http")
                    .set("method","post")                    #HTTP request method
                    .set("url","https://api.twilio.com/2010-04-01/Accounts/#{account_sid}/Messages.json")
                    .set("body",http_body)
                    .set("headers",["Cache-Control:no-cache","Content-Type: application/x-www-form-urlencoded",auth_header])                         #HTTP request headers
                    .set("timeout",10000)
                    .sync
                               #.timeout(10000)                                                   #Execution time of the Flintbit in milliseconds

#HTTP Connector Response Meta Parameters
response_exitcode = twilio_response.exitcode                                              #Exit status code
response_message = twilio_response.message                                                #Execution status message

#HTTP Connector Response Parameters
response_body = twilio_response.get("body")                                               #Response Body
response_headers = twilio_response.get("headers")                                         #Response Headers

if response_exitcode == 0
    @log.info('Success in executing HTTP Connector where, exitcode ::'+response_exitcode.to_s+' | message :: '+response_message)
    @output.setraw("result",@util.json(response_body).to_s)
else
    @log.error('Failure in executing HTTP Connector where, exitcode ::'+response_exitcode.to_s+' | message :: ' +response_message)
    @output.set("error",response_message)
end