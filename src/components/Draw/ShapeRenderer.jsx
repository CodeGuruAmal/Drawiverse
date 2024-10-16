import React, { useRef } from "react";
import { Arrow, Ellipse, Line, Rect } from "react-konva";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedShape } from "../../utils/drawSlice";

const ShapeRenderer = ({ onShapeSelect }) => {
  const dispatch = useDispatch();
  const shapes = useSelector((state) => state.draw.shapes);
  const toolSelected = useSelector((state) => state.control.toolSelected);
  const shapeRefs = useRef([]);

  const handleShapeSelect = (index) => {
    if (toolSelected === "mouse") {
      dispatch(setSelectedShape(index));
      onShapeSelect(shapeRefs.current[index]);
    }
  };

  return (
    <>
      {shapes.map((item, index) => {
        let shapeNode = null;
        switch (item.type) {
          case "rectangle":
            shapeNode = (
              <Rect
                key={index}
                ref={(node) => (shapeRefs.current[index] = node)}
                x={item.x}
                y={item.y}
                strokeWidth={item.strokeWidth}
                stroke={item.strokeColor}
                fill={item.fillColor}
                width={item.width}
                height={item.height}
                lineJoin="round"
                onClick={() => handleShapeSelect(index)}
                onTap={() => handleShapeSelect(index)}
                draggable
                // onDragEnd={(e) => handleDragEnd(e, index)}
              />
            );
            break;

          case "ellipse":
            shapeNode = (
              <Ellipse
                key={index}
                ref={(node) => (shapeRefs.current[index] = node)}
                x={item.x + item.width / 2}
                y={item.y + item.height / 2}
                radiusX={Math.abs(item.width) / 2}
                radiusY={Math.abs(item.height) / 2}
                strokeWidth={item.strokeWidth}
                stroke={item.strokeColor}
                fill={item.fillColor}
                onClick={() => handleShapeSelect(index)}
                onTap={() => handleShapeSelect(index)}
                // draggable
                // onDragEnd={(e) => handleDragEnd(e, index)}
              />
            );
            break;

          case "arrow":
            shapeNode = (
              <Arrow
                key={index}
                ref={(node) => (shapeRefs.current[index] = node)}
                points={[
                  item.x,
                  item.y,
                  item.x + item.width,
                  item.y + item.height,
                ]}
                strokeWidth={item.strokeWidth}
                stroke={item.strokeColor}
                fill={item.fillColor}
                hitStrokeWidth={30}
                pointerLength={10}
                pointerWidth={10}
                lineCap="round"
                tension={0.5}
                lineJoin="round"
                onClick={() => handleShapeSelect(index)}
                onTap={() => handleShapeSelect(index)}
                // draggable
                // onDragEnd={(e) => handleDragEnd(e, index)}
              />
            );
            break;

          case "line":
            shapeNode = (
              <Line
                key={index}
                ref={(node) => (shapeRefs.current[index] = node)}
                points={[
                  item.x,
                  item.y,
                  item.x + item.width,
                  item.y + item.height,
                ]}
                strokeWidth={item.strokeWidth}
                hitStrokeWidth={30}
                stroke={item.strokeColor}
                fill={item.fillColor}
                lineCap="round"
                tension={0.5}
                lineJoin="round"
                onClick={() => handleShapeSelect(index)}
                onTap={() => handleShapeSelect(index)}
                // draggable
                // onDragEnd={(e) => handleDragEnd(e, index)}
              />
            );
            break;

          case "pencil":
            shapeNode = (
              <Line
                key={index}
                ref={(node) => (shapeRefs.current[index] = node)}
                points={
                  item.points
                    ? item.points.flatMap((point) => [point.x, point.y])
                    : []
                }
                stroke={item.strokeColor}
                fill={item.fillColor}
                hitStrokeWidth={30}
                strokeWidth={item.strokeWidth}
                lineCap="round"
                tension={0.5}
                lineJoin="round"
                onClick={() => handleShapeSelect(index)}
                onTap={() => handleShapeSelect(index)}
                // draggable
                // onDragEnd={(e) => handleDragEnd(e, index)}
              />
            );
            break; 

          default:
            return null;
        }
        return shapeNode;
      })}
    </>
  );
};

export default ShapeRenderer;
