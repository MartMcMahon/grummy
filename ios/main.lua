
window_size = {200, 200}

function love:load()
  love.window.setMode(unpack(window_size) {fullscreen = true})
  t = "welcome to anor londo!"
end

function love.draw()
  love.graphics.print(t, 20, 20)
end
