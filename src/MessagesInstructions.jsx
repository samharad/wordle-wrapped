export default function MessagesInstructions({}) {
  const bigWidth = "400px";
  return (
    <div className={"flex flex-wrap justify-around text-2xl"}>

      <div className={"flex flex-col items-center py-3"}>
        <div className={"py-3"}>
          1) Select 2024's last message
        </div>
        <div>
          <img src="public/ww-step-click-bottom.gif" width={bigWidth}/>
        </div>
      </div>

      <div className={"flex flex-col items-center py-3"}>
        <div className={"py-3"}>
          2) <span className="font-mono font-bold text-light-green bg-red rounded">Shift-</span>click 2024's first
          message
        </div>
        <div>
          <img src="public/ww-step-click-top.gif" width={bigWidth}/>
        </div>
      </div>

      <div className={"flex flex-col items-center py-3"}>
        <div className={"py-3"}>
          3) <span className="font-mono font-bold text-light-green bg-red rounded">Cmd-C</span> copy
        </div>
        <div>
          <img src="public/ww-copy.png" width={bigWidth}/>
        </div>
      </div>
    </div>
  );
}