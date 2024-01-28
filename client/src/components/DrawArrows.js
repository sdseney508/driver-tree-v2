import React, { useEffect, useState } from "react";
import Xarrow from "react-xarrows";
import { getArrows } from "../utils/arrows";

function DriverArrows({
  arrows, 
  ArrowModal,
  driverTreeObj,
  opacity,
  recordLockState,
  selOutcome,
  setArrows,
  tableState,
  viewId,
  viewArrows,
}) {
  // const [arrows, setArrows] = useState([]);
const [loading, setLoading] = useState(true);
  useEffect(() => {
    //get the arrows from the database
    const fetchData = async () => {
      await getArrows(selOutcome.id).then((data) => {
        setArrows(data.data);
      });
    }
    fetchData();
    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selOutcome, driverTreeObj]);

  //this function maps each arrow in the arrows array to a Xarrow component
  const arrowFunc = () => {
    return arrows.map((f, index) => {
      //see if the arrow is in the view,
      let opVal = 1;
      let viewCheck;
      if (viewArrows) {
        viewCheck = viewArrows.findIndex((v) => v.arrowId === arrows[index].id);
      }
      //set initial condition for opacity
      if (viewCheck === -1 && viewId) {
        opVal = opacity;
      }
      return (
        <Xarrow
          arrowBodyProps={{
            style: { opacity: opVal },
            onClick: (e) => {if (!recordLockState) {ArrowModal(e, arrows[index].id, tableState)}},
            id: "arrow" + arrows[index].id,
          }}
          arrowHeadProps={{
            style: { opacity: opVal },
            onClick: (e) => {if (!recordLockState) {ArrowModal(e, arrows[index].id, tableState)}},
          }}
          animateDrawing={false}
          animationSpeed={0}
          key={arrows[index].id}
          divContainerStyle={{
            position: "relative",
            animation: "none",
            overflow: "hide",
          }}
          SVGcanvasStyle={{
            position: "relative",
            animation: "none",
            overflow: "hide",
          }}
          SVGcanvasProps={{ id: "SVG" + arrows[index].id }}
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

  return <>{arrows && !loading ? arrowFunc():   null}</>;
}

export default DriverArrows;
