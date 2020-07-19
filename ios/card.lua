local Object = require("classic")
Card = Object.extend(Object)

local lg = love.graphics

SUIT = {
  clover = 1,
  diamond = 2,
  heart = 3,
  spade = 4,
}
local function suit_string(s)
  strings = {
    "clover",
    "diamond",
    "heart",
    "spade",
  }
  return strings[s]
end
local function val_string(v)
  strings = {
    [1] = "ace",
    [11] = "jack",
    [12] = "queen",
    [13] = "king"
  }

  return strings[v] or v
end

local function getSprite(s, v)
  return lg.newImage(string.format("assets/card_%s_%s.png", v, suit_string(s)))
end

function Card:new(s, v, x, y, is_face_down)
  self.is_face_down = is_face_down or false

  self.s = s
  self.v = v
  self.sprite = getSprite(s, v)

  self.x = x or 0
  self.y = y or 0
  self.w = 62
  self.h = 84

  self.highlight = false
  self.isSelected = false
end

function Card:update(dt, x, y)
  if self.is_face_down then
    return
  end
  if self.isSelected then
    self.x = x - self.w/2
    self.y = y - self.h/2
  end
  -- if self:mouse_in_bounds(x, y) == false then
  --   self.highlight = false
  -- end
end

function Card:mouse_in_bounds(mouse_x, mouse_y)
  if mouse_x > self.x and mouse_x < self.x + self.w and
   mouse_y > self.y and mouse_y < self.y + self.h then
    self.highlight = true
    return true
  else
    self.highlight = false
    return false
  end
end

function Card:draw()
  if self.highlight then
    lg.setColor(0.196, 1, 0.7373)
    lg.rectangle("fill", self.x - 2, self.y - 2, self.w + 4, self.h + 4)
  end
  lg.setColor(1, 1, 1, 1)
  lg.draw(self.sprite, self.x, self.y)
end

function Card:toString()
  print(self.s)
  return string.format("%s of %ss", val_string(self.v), suit_string(self.s))
end

return Card
