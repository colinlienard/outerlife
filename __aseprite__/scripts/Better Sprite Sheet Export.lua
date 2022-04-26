--[[

Description:
This script will flatten the groups of layers and then export a sprite sheet.
This is useful if you work with several groups of layers but you want each group to be a single layer when exporting.
You can choose to export only the visible layers or all of them (they will be automatically made visible).

GitHub:
https://github.com/ColinLienard/aseprite-scripts

]]--

local sprite = app.activeSprite

-- Makes all layers and sub layers visible
local function makesAllLayersVisible(layers)
  for index, layer in ipairs(layers) do
    layer.isVisible = true
    if layer.isGroup then
      makesAllLayersVisible(layer.layers)
    end
  end
end

-- Flatten groups of layers if visible
local function flattenGroups()
  for index, layer in ipairs(sprite.layers) do
    if layer.isGroup and layer.isVisible then
      app.range.layers = { layer }
      app.command.FlattenLayers()
    end
  end
end

-- Export the sprite sheet as png file
local function exportSpriteSheet(file)
	app.command.ExportSpriteSheet {
	  askOverwrite=true,
	  type=SpriteSheetType.ROWS,
	  textureFilename=file,
	  splitLayers=true,
    allLayers=true,
	}
end

-- Get the output file
local dialog = Dialog()
dialog:label{ id="label", text="Save your new sprite sheet:" }
dialog:file{ id="file", open=false, save=true, filetypes={ "png" }, focus=true }
dialog:check{ id="visibleOnly", text="Export only visible layers." }
dialog:button{ id="ok", text="Export" }
dialog:button{ id="cancel", text="Cancel", onclick = function() dialog:close() end }
dialog:show()

-- Perform everything
if dialog.data.ok and dialog.data.file then
	app.transaction(function() -- Store sprite modifications
    if not dialog.data.visibleOnly then
      makesAllLayersVisible(sprite.layers)
    end
    flattenGroups()
  end)
  exportSpriteSheet(dialog.data.file)
  app.undo() -- Undo sprite modifications
end
