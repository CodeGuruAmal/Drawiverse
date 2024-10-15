import React, { useEffect, useRef, useState } from "react";
import { Layer, Stage, Transformer } from "react-konva";
import { useDispatch, useSelector } from "react-redux";
import {
  addToUndoStack,
  setIsDrawing,
  setRedo,
  setShapes,
  setUndo,
} from "../../utils/drawSlice";
import ShapeRenderer from "./ShapeRenderer";
import { setMenuClick, setToolSelected } from "../../utils/controlSlice";
import { BiMinus, BiPlus, BiRedo, BiUndo } from "react-icons/bi";
import { useSetting } from "../../context/SettingContext";

const Canvas = () => {
  const dispatch = useDispatch();
  const toolSelected = useSelector((state) => state.control.toolSelected);
  const shapes = useSelector((state) => state.draw.shapes);
  const isDrawing = useSelector((state) => state.draw.isDrawing);
  const undoStack = useSelector((state) => state.draw.undoStack);
  const redoStack = useSelector((state) => state.draw.redoStack);
  const selectedShape = useSelector((state) => state.draw.selectedShape);

  // console.log(undoStack)
  // console.log(redoStack)

  const { strokeColor, strokeWidth, strokeStyle, fillColor } = useSetting();

  const [stageScale, setStageScale] = useState(1);
  const [stagePosition, setStagePosition] = useState({ x: 0, y: 0 });
  const transformerRef = useRef();
  const [selectedNode, setSelectedNode] = useState(null);

  const zoomPercentage = Math.round(stageScale * 100);

  const handleWheel = (e) => {
    e.evt.preventDefault();
    const scaleBy = 1.1;
    const direction = e.evt.deltaY < 0 ? scaleBy : 1 / scaleBy;
    const pointer = e.target.getStage().getPointerPosition();
    zoomStage(direction, pointer);
  };

  const zoomStage = (scaleFactor, pointer) => {
    const oldScale = stageScale;

    const newScale = oldScale * scaleFactor;
    const clampedScale = Math.max(0.1, Math.min(30, newScale));

    const mousePointTo = {
      x: (pointer.x - stagePosition.x) / oldScale,
      y: (pointer.y - stagePosition.y) / oldScale,
    };

    setStageScale(clampedScale);
    setStagePosition({
      x: pointer.x - mousePointTo.x * clampedScale,
      y: pointer.y - mousePointTo.y * clampedScale,
    });
  };

  const transformPointerPosition = (pointer) => ({
    x: (pointer.x - stagePosition.x) / stageScale,
    y: (pointer.y - stagePosition.y) / stageScale,
  });

  const handleStart = (e) => {
    if (toolSelected !== "mouse") {
      dispatch(addToUndoStack());
      dispatch(setIsDrawing(true));
      const pointer = e.target.getStage().getPointerPosition();
      const { x, y } = transformPointerPosition(pointer);

      if (toolSelected === "pencil" && toolSelected !== "hand") {
        dispatch(
          setShapes([
            ...shapes,
            {
              id: shapes.length,
              points: [{ x, y }],
              type: toolSelected,
              strokeColor: strokeColor,
              fillColor: fillColor,
              strokeWidth: strokeWidth,
            },
          ])
        );
      } else {
        dispatch(
          setShapes([
            ...shapes,
            {
              id: shapes.length,
              x,
              y,
              width: 0,
              height: 0,
              type: toolSelected,
              strokeColor: strokeColor,
              fillColor: fillColor,
              strokeWidth: strokeWidth,
            },
          ])
        );
      }
    }
    // dispatch(setShapes([...shapes, newShape]));
  };

  const handleMove = (e) => {
    if (!isDrawing) return;
    const pointer = e.target.getStage().getPointerPosition();
    const { x, y } = transformPointerPosition(pointer);
    const lastShape = shapes[shapes.length - 1];

    if (
      toolSelected !== "pencil" &&
      (lastShape.width === 0 ||
        lastShape.height === 0 ||
        lastShape.type === "hand")
    ) {
      dispatch(setShapes(shapes.slice(0, -1)));
    }

    const updatedShapes = shapes.map((shape, index) =>
      index === shapes.length - 1
        ? {
            ...shape,
            ...(toolSelected === "pencil"
              ? { points: [...shape.points, { x, y }] }
              : { width: x - shape.x, height: y - shape.y }),
          }
        : shape
    );

    dispatch(setShapes(updatedShapes));
  };

  const handleEnd = () => {
    dispatch(setIsDrawing(false));
    if (toolSelected !== "hand" && toolSelected !== "pencil") {
      dispatch(setToolSelected("mouse"));
    }
  };

  const handleUndo = () => dispatch(setUndo());
  const handleRedo = () => dispatch(setRedo());

  const handleShapeSelect = (node) => {
    setSelectedNode(node);
  };

  useEffect(() => {
    if (selectedNode) {
      transformerRef.current.nodes([selectedNode]);
      transformerRef.current.getLayer().batchDraw();
    }
  }, [selectedNode]);

  return (
    <>
      <div className="flex items-center justify-center gap-3 absolute bottom-4 left-4 text-zinc-300 z-50">
        <div className="bg-[#232329] p-1 rounded-md flex items-center overflow-hidden">
          <button
            onClick={() =>
              zoomStage(1.02, {
                x: window.innerWidth / 2,
                y: window.innerHeight / 2,
              })
            }
            className="hover:bg-[#694a8b] p-2 rounded-md"
          >
            <BiPlus />
          </button>
          <span className="px-5 text-xs">{zoomPercentage}%</span>
          <button
            onClick={() =>
              zoomStage(1 / 1.02, {
                x: window.innerWidth / 2,
                y: window.innerHeight / 2,
              })
            }
            className="hover:bg-[#694a8b] p-2 rounded-md"
          >
            <BiMinus />
          </button>
        </div>

        <div className="bg-[#232329] p-1 rounded-md flex gap-1 items-center overflow-hidden">
          <button
            onClick={handleUndo}
            disabled={undoStack.length === 0}
            className={` bg-[#232329] p-2 rounded-md ${
              undoStack.length === 0
                ? "cursor-not-allowed opacity-40"
                : "hover:bg-[#694a8b]"
            }`}
          >
            <BiUndo />
          </button>
          <button
            onClick={handleRedo}
            disabled={redoStack.length === 0}
            className={` bg-[#232329] p-2 rounded-md ${
              redoStack.length === 0
                ? "cursor-not-allowed opacity-40"
                : "hover:bg-[#694a8b]"
            }`}
          >
            <BiRedo />
          </button>
        </div>
      </div>
      <Stage
        className="overflow-hidden bg-[#121212]"
        onClick={() => dispatch(setMenuClick(false))}
        width={window.innerWidth}
        height={window.innerHeight}
        onMouseDown={handleStart}
        onMouseMove={handleMove}
        onMouseUp={handleEnd}
        onTouchStart={handleStart}
        onTouchMove={handleMove}
        onTouchEnd={handleEnd}
        scaleX={stageScale}
        scaleY={stageScale}
        x={stagePosition.x}
        y={stagePosition.y}
        draggable={toolSelected === "hand"}
        onWheel={handleWheel}
        onDragEnd={(e) => {
          setStagePosition({ x: e.target.x(), y: e.target.y() });
        }}
      >
        <Layer>
        <ShapeRenderer onShapeSelect={handleShapeSelect} />
        <Transformer ref={transformerRef} />
        </Layer>
      </Stage>
    </>
  );
};

export default Canvas;
