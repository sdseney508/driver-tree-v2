import React from "react";
import Xarrow from "react-xarrows";

function DriverArrows({
  arrows, 
  ArrowModal,
  viewId,
  opacity,
  viewArrows,
  tableState,
}) {
    //this function maps each arrow in the arrows array to a Xarrow component
  const arrowFunc = () => {
    return arrows.map((f, index) => {
      //see if the arrow is in the view, 
      let opVal = 1;
      let viewCheck;
      if (viewArrows) {viewCheck = viewArrows.findIndex((v) => v.arrowId === arrows[index].id);}
      //set initial condition for opacity
      if (viewCheck === -1 && viewId) {
        opVal = opacity;
      }
      return (
          <Xarrow
            arrowBodyProps={{ style: {opacity: opVal}, onClick: (e) => ArrowModal(e, arrows[index].id, tableState), id: "arrow" + arrows[index].id }}
            arrowHeadProps={{ style: {opacity: opVal}, onClick: (e) => ArrowModal(e, arrows[index].id, tableState), id: "arrowhead" + arrows[index].id }}
            animateDrawing={false}
            animationSpeed={0}
            key={arrows[index].id}
            divContainerStyle={{position: "relative", overflow: "hide"}}
            SVGcanvasStyle={{position: "relative", animation: "none", overflow: "hide"}}
            SVGcanvasProps={{id: "SVG"+arrows[index].id}}
            color={arrows[index].color}
            dashness={arrows[index].dashness}
            end={arrows[index].end}
            endAnchor={arrows[index].endAnchor}
            gridBreak={arrows[index].gridBreak}
            headSize={4}
            path={arrows[index].path}
            showHead={true}
            start={arrows[index].start}
            startAnchor={arrows[index].startAnchor}
            strokeWidth={arrows[index].strokeWidth}
            zIndex={10}
          />

      );
    });
  };

  return (
    <>
     {arrowFunc()}
    </>
  );
}

export default DriverArrows;
