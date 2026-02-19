import { Composition } from "remotion";
import { OlaMundo } from "./OlaMundo";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="OlaMundo"
      component={OlaMundo}
      durationInFrames={150}
      fps={30}
      width={1920}
      height={1080}
    />
  );
};
