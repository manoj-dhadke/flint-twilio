# flint-twilio
Flintbox to communicate with Twilio. Now you can integrate twilio in your automation workflows

- Send SMS from Flint using Twilio

#### What is Flint IT Automation Patform?
Flint is a lean IT Process Automation & Orchestration Platform for IT infrastructure and applications. It empowers teams to leverage existing scripting (Ruby or Groovy) skills to develop powerful workflows and processes which can be published as microservices.

Flint helps in automation of routine IT tasks & activities which saves time and cost thus allowing the team to focus on strategic initiatives and innovation. Know more: http://www.getflint.io

#### What is Twilio?
Twilio powers the future of business communications.
Enabling phones, VoIP, and messaging to be embedded into web, desktop, and mobile software.
Know more: https://www.twilio.com

## Add new Flintbox from Flint Console
* Go to flintbox
* Click on Add Flintbox
* set Git url of this repo 
* Click add
* Enable the flintbox

## Global Configuration in flint

#### Name: flint-twilio
#### Config JSON
```json
{
    "account_sid": "your twilio account SID",
    "auth_token": "your twilio account auth token",
    "from": "+12706814777",
    "http_connector":"http"
}
```
| Name | Description          |
| ------------- | ----------- |
| account_sid      | your twilio account SID|
| auth_token     | your twilio account auth token|
| from     | default 'From' telephone number or short code|
| http_connector| Name of HTTP connector which is enabeled on Flint|

## How to use it from Flintbits
#### Ruby
```ruby 
# call the flintbit
@response = @call.bit("flint-twilio:sms:send.rb")
            .set("to","+19800000000")
            .set("message":"message to send")
            .sync
# read the value. Exit code 0 means success
exit_code = @response.exitcode
```
