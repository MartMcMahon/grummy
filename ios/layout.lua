local lg = love.graphics
local screen_width = lg.getWidth()
local screen_height = lg.getHeight()
window_size = {
  x = math.min(screen_width/2, 1436),
  y = math.min(screen_height/2, 1025)
}

card_size = Card(1, 1, -100, -100)
layout = {
  hand = {
    x = 0,
    y = window_size.y - card_size.h
  },
  deck_stack = {
    x = window_size.x/2,
    y = window_size.y/2
  },
  discard_stack = {
    x = 70,
    y = 70
  },
}
return layout
