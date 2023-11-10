import React from "react";
import Xarrow from "react-xarrows";

function DriverArrows({ arrows, ArrowModal }) {

  //this function maps each arrow in the arrows array to a Xarrow component
  const arrowFunc = () => {
    return arrows.map((f, index) => {
      return (<div onClick={(e) => ArrowModal(e, arrows[index].id)}>
        <Xarrow
            arrowBodyProps={{ onClick: (e) => ArrowModal(e, arrows[index].id) }}
            color={arrows[index].color}
            dashness={arrows[index].dashness}
            end={arrows[index].end}
            endAnchor={arrows[index].endAnchor}
            gridBreak={arrows[index].gridBreak}
            headSize={4}
            id={arrows[index].id}
            path={arrows[index].path}
            showHead={true}
            start={arrows[index].start}
            startAnchor={arrows[index].startAnchor}
            strokeWidth={arrows[index].strokeWidth}
            zIndex={1}
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
