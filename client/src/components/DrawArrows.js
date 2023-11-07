import React from "react";
import Xarrow from "react-xarrows";
import ArrowModal from "./ArrowModal";

function DriverArrows({ arrows }) {

  //this function maps each arrow in the arrows array to a Xarrow component
  const arrowFunc = () => {
    return arrows.map((f, index) => {
      return (<div onClick={(e) => ArrowModal(e, arrows[index].id)}>
        <Xarrow
        start={arrows[index].start}
        color={arrows[index].color}
        end={arrows[index].end}
        path={arrows[index].path}
        startAnchor={arrows[index].startAnchor}
        endAnchor={arrows[index].endAnchor}
        strokeWidth={arrows[index].strokeWidth}
        headSize={arrows[index].headSize}
        gridBreak={arrows[index].gridBreak}
        showTail={arrows[index].showTail}
        showHead={arrows[index].showHead}
        dashness={arrows[index].dashness}
        id={arrows[index].id}
        />
      </div>);
    });
  };

  return (
    <>
      <div>{arrowFunc()}</div>
    </>
  );
}

export default DriverArrows;
