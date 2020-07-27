local random = math.random
math.randomseed(os.time())
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

function Network:ping()
  self.tcp = socket.tcp()
  self.tcp:settimeout(6)
  self.tcp:connect(self.url, self.port)
  self.tcp:send(json.encode({["action"] = "ping"}))
  res = self.tcp:receive("*l")
  self.tcp:close()
  return res
end

function Network:connect()
  self.tcp = socket.tcp()
  self.tcp:settimeout(1)
  self.tcp:connect(self.url, self.port)
  self.uid = uuid()
  -- debug
  self.uid = 20
  self.tcp:send(json.encode({["action"] = "identify", ["uid"] = self.uid}))
  res = self.tcp:receive("*l")
  return res
end

function Network:sync()
  if self.tcp then
    self.tcp:send(json.encode({["action"] = "sync", ["uid"] = "20"}))
    x = self.tcp:receive()
    print(x)
    print(json.decode(x))
    return json.decode(x)
    -- return json.decode(self.tcp:receive())
  end
  return ""
end

function Network:disconnect()
  if tcp then
    tcp:shutdown("both")
  end
end

return Network
