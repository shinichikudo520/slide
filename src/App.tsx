import Slide from "./component";
import { useRef, useState } from "react";
import { CONFIG } from "./component/config";
import { ROOT_ID } from "./config";

const App = () => {
  // const ref = useRef({ scale: CONFIG.DEFAULT });
  const [scale, setScale] = useState(CONFIG.DEFAULT);
  return (
    <div id={ROOT_ID} className="App">
      <h1 className="App-header">slide组件</h1>
      <Slide
        update={(v: number) => {
          // ref.current.scale = v;
          setScale(v);
          console.log("set scale...", v);
        }}
      ></Slide>
      <div className="App-show">
        <h3>刻度最大值: {CONFIG.MAX}</h3>
        <h3>刻度步进值: {CONFIG.STEP}</h3>
        {/* <h3>当前刻度: {ref.current.scale}</h3> */}
        <h3>当前刻度: {scale}</h3>
      </div>
    </div>
  );
};
export default App;
