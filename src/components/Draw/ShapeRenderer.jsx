import React from "react";
import { Arrow, Ellipse, Line, Rect } from "react-konva";
import { useDispatch, useSelector } from "react-redux";
import { setShapes } from "../../utils/drawSlice";

const ShapeRenderer = () => {
  const dispatch = useDispatch();
  const shapes = useSelector((state) => state.draw.shapes);

  const handleShapeSelect = (e,i) => {
    console.log(e)
    console.log(i)
  }

  return (
    <>
      {shapes.map((item, index) => {
        switch (item.type) {
          case "rectangle":
            return (
              <Rect
                key={index}
                x={item.x}
                y={item.y}
                strokeWidth={item.strokeWidth}
                stroke={item.strokeColor}
                fill={item.fillColor}
                width={item.width}
                height={item.height}
                lineJoin="round"
                onClick={(e) => handleShapeSelect(e, index)}
                // draggable
                // onDragEnd={(e) => handleDragEnd(e, index)}
              />
            );

          case "ellipse":
            return (
              <Ellipse
                key={index}
                x={item.x + item.width / 2}
                y={item.y + item.height / 2}
                radiusX={Math.abs(item.width) / 2}
                radiusY={Math.abs(item.height) / 2}
                strokeWidth={item.strokeWidth}
                stroke={item.strokeColor}
                fill={item.fillColor}

                // draggable
                // onDragEnd={(e) => handleDragEnd(e, index)}
              />
            );

          case "arrow":
            return (
              <Arrow
                key={index}
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

                // draggable
                // onDragEnd={(e) => handleDragEnd(e, index)}
              />
            );

          case "line":
            return (
              <Line
                key={index}
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

                // draggable
                // onDragEnd={(e) => handleDragEnd(e, index)}
              />
            );

          case "pencil":
            return (
              <Line
                key={index}
                points={item.points.flatMap((point) => [point.x, point.y])}
                stroke={item.strokeColor}
                fill={item.fillColor}
                hitStrokeWidth={30}
                strokeWidth={item.strokeWidth}
                lineCap="round"
                tension={0.5}
                lineJoin="round"

                // draggable
                // onDragEnd={(e) => handleDragEnd(e, index)}
              />
            );
        }
      })}
    </>
  );
};

export default ShapeRenderer;
