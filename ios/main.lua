local Object = require("classic")
Button = require("button")
Network = require("network")
Card = require("card")

love.window.setMode(0, 0, nil)
local screen_width = love.graphics.getWidth()
local screen_height = love.graphics.getHeight()
print(screen_width)
print(screen_height)
window_size = {
  x = math.min(screen_width/2, 1436),
  y = math.min(screen_height/2, 1025)
}
love.window.setMode(window_size.x, window_size.y)

local lg = love.graphics

STATE = {
  lobby = 1,
  game = 2
}

card_size = Card(1, 1, -100, -100)
cards = {}
for i,s in pairs(SUIT) do
  for v=1, 13 do
    table.insert(cards, Card(s, v, v*card_size.w, s*card_size.h))
  end
end

buttons = {
  connect = Button(window_size.x/2, window_size.y/2, 100, 50, "connect")
}
function buttons.connect.click()
  res = network:connect()
  if res == nil then
    print("there was an error connecting")
  end
  load_game()
  return res
end

function love:load()
  network = Network()
  gameState = STATE.lobby

  selected = false
end

function load_game()
  buttons = {
    end_turn = Button(window_size.x - 200, window_size.y - 80, 200, 50, "discard")
  }
  gameState = STATE.game
end

function love.update(dt)
  x, y = love.mouse.getPosition()
  -- tcp:send(tostring(x..y))

  for k,button in pairs(buttons) do
    button:update(dt)
  end

  for i, card in ipairs(cards) do
    card:update(dt, x, y)
  end

end

function love.mousepressed(x, y, button, istouch, presses)
  for k,button in pairs(buttons) do
    if button:mouse_in_bounds(x, y) then
      button:click()
      return
    end
  end

  for i,card in ipairs(cards) do
    if card:mouse_in_bounds(x, y) and not selected then
      print(card:toString())
      card.isSelected = true
    end
  end
end

function love.mousereleased(x, y, button, istouch, presses)
  selected = false
end

-- function love.touchpressed(id, x, y, dx, dy, pressure)
--   print(string.format("touch at (%s, %s)", x, y))
-- end

function love.keypressed(k)
  if k == 'escape' then
    network.disconnect()
    love.event.quit()
  end
end

function love.draw()
  if gameState == STATE.lobby then
    -- lg.print(t, 20, 20)
  else
    lg.setColor(1, 1, 1, 1)
    v = 10
    s = 2
    suit_string = {
      "clover",
      "diamond",
      "heart",
      "spade",
    }

    for i,card in ipairs(cards) do
      card:draw()
    end
  end

  for k,button in pairs(buttons) do
    button:draw()
  end
end
