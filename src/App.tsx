import { Button, Space, Typography } from 'antd';
import React, { useEffect, useState } from 'react'
import { Rnd } from 'react-rnd';
import { v4 as uuid } from 'uuid'
const { Text } = Typography
import s from './app.module.css';
import { createDummyStream } from './FakeStream';
import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch';

interface Box {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  content?: any;
  ratio?: number;
}

export const App: React.FC = () => {

  const [boxes, setBoxes] = useState<Box[]>([]);

  const addBox = () => {
    setBoxes([
      ...boxes,
      {
        id: uuid(),
        x: 50,
        y: 50,
        width: 200,
        height: 150,
      }
    ]);
  }

  const addStream = () => {

    const stream = createDummyStream();
    const videoTrack = stream.getVideoTracks()[0];
    const settings = videoTrack.getSettings();
    const aspectRatio = settings.width && settings.height ? settings.width / settings.height : 4 / 3;

    setBoxes([
      ...boxes,
      {
        id: uuid(),
        x: 50,
        y: 50,
        width: 300,
        height: 300 / aspectRatio,
        content: (<video className={s.video} ref={(video) => {
          if (video) {
            video.srcObject = stream;
          }
        }} autoPlay />),
        ratio: aspectRatio
      }
    ]);
  }

  const removeBox = (id: string) => {
    setBoxes((prev) => prev.filter(box => box.id !== id));
  }

  const updateBox = (id: string, newData: Partial<Box>) => {
    setBoxes(prev =>
      prev.map(box =>
        box.id === id ? { ...box, ...newData } : box
      )
    );
  }

  useEffect(() => {
    const canvas = document.querySelector(`.${s.canvas}`);

    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey && canvas?.contains(e.target as Node)) {
        e.preventDefault(); // Only block when inside the canvas
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      window.removeEventListener("wheel", handleWheel);
    };
  }, []);

  return (
    <Space>
      <Button onClick={addBox}>Add a new box</Button>
      <Button onClick={addStream}>Add a fake stream</Button>
      <TransformWrapper
        wheel={{ step: 1, activationKeys: ['shift'] }}
        onWheel={() => console.log('Zoom detected')}
        onWheelStop={() => console.log('wheel stopped')}
        minScale={0.2}
        maxScale={2}
        panning={{ excluded: [s.box] }}
      >
        <TransformComponent>
          <div className={s.canvas}>
            {boxes.map((box, index) => (
              <Rnd
                bounds='parent'
                position={{ x: box.x, y: box.y }}
                onDragStop={(_, d) => updateBox(box.id, { x: d.x, y: d.y })}
                size={{ width: box.width, height: box.height }}
                onResizeStop={(_, __, ref, ___, position) =>
                  updateBox(box.id, { width: ref.offsetWidth, height: ref.offsetHeight, x: position.x, y: position.y })}
                className={s.box}
                lockAspectRatio={box.ratio}
                key={index}>
                {box.content}
                <Text className={s.boxId}>{box.id}</Text>
                <Button className={s.removeButton} onClick={() => removeBox(box.id)}>✖</Button>
              </Rnd>
            )
            )}
          </div>
        </TransformComponent>
      </TransformWrapper>
    </Space>
  )
}
