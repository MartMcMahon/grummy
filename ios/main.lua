Object = require("classic")
local json = require("json")
local socket = require("socket")
Button = require("button")

love.window.setMode(0, 0, nil)
local screen_width = love.graphics.getWidth()
local screen_height = love.graphics.getHeight()
print(screen_width)
print(screen_height)
window_size = {math.min(screen_width, 2436), math.min(screen_height, 1125)}
love.window.setMode(unpack(window_size))

buttons = {
  connect = Button(window_size[1]/2, window_size[2]/2, 100, 100)
}

function love:load()
  t = "welcome to anor londo!"
  -- love.window.setMode(unpack(window_size))

  connect()

end

function love.update(dt)

  x, y = love.mouse.getPosition()
  tcp:send(tostring(x..y))

  t = love.timer.getFPS()
  for k,button in pairs(buttons) do
    button:update(dt)
  end

  x, y = love.mouse.getPosition()
end

-- function love.mousepressed(x, y, button, istouch, presses)
--   for i,clickable in ipairs(clickables) do
--     if clickable:mouse_in_bounds(x, y) then
--       clickable:click()
--     end
--   end
-- end

function love.draw()
  love.graphics.print(t, 20, 20)
  -- love.graphics.print(res, 20, 40)

  for k,button in pairs(buttons) do
    button:draw()
  end
end

function connect()
  url = "localhost"
  port = 6969
  tcp = socket.tcp()
  tcp:connect(url, port)
end

function disconnect()
  tcp:shutdown("both")
end
