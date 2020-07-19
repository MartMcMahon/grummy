local random = math.random
local function uuid()
  local template ='xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
  return string.gsub(template, '[xy]', function (c)
    local v = (c == 'x') and random(0, 0xf) or random(8, 0xb)
    return string.format('%x', v)
  end)
end

local json = require("json")
local Object = require("classic")
local socket = require("socket")
Network = Object.extend(Object)

function Network:new()
  self.url = "localhost"
  self.port = 6969
  self.tcp = nil
end

function Network:connect()
  self.tcp = socket.tcp()
  self.tcp:settimeout(1)
  self.tcp:connect(self.url, self.port)
  self.uid = uuid()
  self.tcp:send(json.encode({["action"] = "identify", ["uid"] = self.uid}))
  res = self.tcp:receive("*l")
  return res
end

function Network:sync()
  if self.tcp then
    return json.decode(self.tcp:send(json.encode({["action"] = "sync"})))
  end
  return ""
end

function Network:disconnect()
  tcp:shutdown("both")
end

return Network
