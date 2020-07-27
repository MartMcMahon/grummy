local Object = require("classic")
Button = Object.extend(Object)

local lg = love.graphics

function Button:new(x, y, w, h, text)
  self.pos = {x = x, y = y}
  self.w = w
  self.h = h
  self.text = text
  self.selected = false

  -- colors
  self.normal = {0.3, 0.65, 1, 0.6}
  self.highlight = {0.3, 0.65, 1, 1}
  self.pressed = {0.8, 0.8, 0.8, 0.4}
  self.color = self.normal
end

function Button:setHighlight(is_hl)
  if is_hl then
    self.color = self.highlight
  else
    self.color = self.normal
  end
end

function Button:update(dt)
  x,y = love.mouse.getPosition()
  -- local left_click = love.mouse.isDown(1)
  local in_bounds = self:mouse_in_bounds(x, y)
end

function Button:mouse_in_bounds(mouse_x, mouse_y)
  if mouse_x > self.pos.x and mouse_x < self.pos.x + self.w and
   mouse_y > self.pos.y and mouse_y < self.pos.y + self.h then
    self.color = self.highlight
    return true
  else
    self.color = self.normal
    return false
  end
end

function Button:click()
  print("clicked")
end

function Button:draw()
  lg.setColor(self.color)
  lg.rectangle("fill", self.pos.x, self.pos.y, self.w, self.h, 4, 4)
  lg.setColor({0, 0, 0, 1})
  lg.print(self.text, self.pos.x, self.pos.y)
end

return Button
