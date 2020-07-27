local json = require("json")
local Object = require("classic")
Button = require("button")
Network = require("network")
Card = require("card") local layout = require("layout")

local lg = love.graphics

love.window.setMode(0, 0, nil)
local screen_width = lg.getWidth()
local screen_height = lg.getHeight()
window_size = {
  x = math.min(screen_width/2, 1436),
  y = math.min(screen_height/2, 1025)
}
love.window.setMode(window_size.x, window_size.y)


local player = {}

STATE = {
  lobby = 1,
  game = 2
}
PHASE = {
  draw = 1,
  main = 2,
  discard = 3
}

data_age = 0
is_synced = false

card_size = Card(1, 1, -100, -100)
cards = {}
for i,s in pairs(SUIT) do
  for v=1, 13 do
    table.insert(cards, Card(s, v, 0, 0))
  end
end

current_turn = nil
phase = nil
hand = {}
mouse_is_over = nil

buttons = {
  connect = Button(window_size.x/2, window_size.y/2, 100, 50, "connect")
}
function buttons.connect.click()
  local res = network:connect()
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

  deck_stack = Card(1, 1, layout.deck_stack.x, layout.deck_stack.y, true)
  deck_stack.sprite = lg.newImage("assets/cat_back.png")
  discard = {
    stack = {},
  }
  function discard.draw()
    if #discard.stack > 0 then
      for i,c in ipairs(discard.stack) do
        c:draw()
      end
    else
      lg.setColor(0.2, 0.2, 0.9)
      lg.rectangle("line", layout.discard_stack.x, layout.discard_stack.y, 40, 60)
    end
  end

  -- ping the server and establish socket
  -- seats = network:ping()
  -- print(seats["seats"][1])
end

function load_game()
  buttons = {
    draw = Button(window_size.x/2, window_size.y - 80, 100, 50, "draw"),
    discard = Button(window_size.x - 200, window_size.y - 80, 200, 50, "discard")
  }
  function buttons.draw.click()
    if draw_selected then

    end
  end

  gameState = STATE.game
  is_synced = false
end

function build_game_state(ob)
  current_turn = ob.turn
  phase = ob.phase
  if ob.seat then
    player.seat = ob.seat
  end

  for i = 1, #ob.discard, 1 do
    c = ob.discard[i]
    table.insert(discard.stack, Card(c.s+1, c.v+1, layout.discard_stack.x, layout.discard_stack.y + 30*(#ob.discard - i)))
  end

  for i = 1, #ob.hand, 1 do
    c = ob.hand[i]
    table.insert(hand, Card(c.s+1, c.v+1, layout.hand.x + i*card_size.w/2, layout.hand.y))
  end

end

function love.update(dt)
  data_age = data_age + dt
  if gameState == STATE.lobby and data_age >= 1 then
    res = network:ping()
    -- seats = json.decode(res)
    data_age = 0
  elseif gameState == STATE.game and data_age >= 1 then
    res = network:sync()
    -- for i,x in pairs(res) do
    --   print(i, x)
    -- end
    -- print(res)
    for i,x in ipairs(res.hand) do
      print(i,x)
      for j,y in pairs(x) do
        print(j,y)
      end
    end
    build_game_state(res)

    data_age = 0
  end

  x, y = love.mouse.getPosition()
  -- tcp:send(tostring(x..y))

  for k,button in pairs(buttons) do
    button:update(dt)
  end

  for i, card in ipairs(cards) do
    card:update(dt, x, y)
  end

  -- reversed to pick top cards first
  mouse_is_over = false
  for i = #cards, 1, -1 do
    local card = cards[i]
    if card:mouse_in_bounds(x, y) and mouse_is_over == false then
      card.highlight = true
      mouse_is_over = card
    else
      card.highlight = false
    end
  end

  for i = 1, #discard.stack, 1 do
  -- for i = #discard.stack, 1, -1 do
    local card = discard.stack[i]
    if card:mouse_in_bounds(x, y) then
      mouse_is_over = card
      card.highlight = true
      break
    else
      card.highlight = false
    end
  end

  if gameState == STATE.game then
    -- TODO actually check turn
    -- check turn
    if current_turn == player.seat then
      -- TODO actually check turn phase
      -- check turn-phase
      if turn_phase == PHASE.draw then
        -- update for draw phase
        -- player can only really select where to draw from

      elseif turn_phase == PHASE.main then
        -- player can play shit. let them select cards by clicking
        -- show the 'play this' button
        -- show the 'discard' button
      elseif turn_phase == PHASE.discard then
        -- player can select card to discard
        -- show the 'select' button
      end
    else
      -- look to update_data
      -- update what other players are doing
    end
  end

end

function love.mousepressed(x, y, button, istouch, presses)
  for k,button in pairs(buttons) do
    if button:mouse_in_bounds(x, y) then
      button:click()
      return
    end
  end

  if mouse_is_over then
    mouse_is_over:click()
  end

end

function love.keypressed(k)
  if k == 'escape' then
    network.disconnect()
    love.event.quit()
  end
end

function love.draw()
  if gameState == STATE.lobby then
    -- lg.print(t, 20, 20)
  elseif gameState == STATE.game then

    -- deck in center
    deck_stack:draw()
    discard:draw()

    -- cards in hand
    for i = #hand, 1, -1 do
    -- for i=1,5 do
      card = hand[i]
      card:draw()
      -- cards[i].x = i * card_size.w/2
      -- cards[i].y = window_size.y - card_size.h
      -- cards[i]:draw()
    end

    if current_turn == player.seat then
      if turn_phase == PHASE.draw then
        -- show the draw button
        -- player can't really do anything else
      elseif turn_phase == PHASE.main then
        -- player can play shit. let them select cards by clicking
        -- show the 'play this' button
        -- show the 'discard' button
      elseif turn_phase == PHASE.discard then
        -- player can select card to discard
        -- show the 'select' button
      end
    else
      -- look to update_data
      -- draw what other players are doing
    end


    if area.is_mouse_over and selected then
      lg.setColor(.5, .5, 1, .7)
      lg.rectangle("fill", 0, 0, window_size.x, window_size.y/2)
    end

  end

  if gameState == STATE.game and current_turn == player.seat then
    if phase == PHASE.draw then
      buttons.draw:draw()
    elseif phase == PHASE.discard then
      buttons.discard:draw()
    end
  else
    for k,button in pairs(buttons) do
      button:draw()
    end
  end

end

area = {x=0, y=0, w=window_size.x, h=window_size.y/2}
function area:mouse_in_bounds(mouse_x, mouse_y)
  self.is_mouse_over = mouse_x > self.x and mouse_x < self.x + self.w and mouse_y > self.y and mouse_y < self.y + self.h
  return self.is_mouse_over
end

