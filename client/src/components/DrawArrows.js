import React, { useState, useEffect } from "react";
import Xarrow, { Xwrapper } from "react-xarrows";
import { getArrows } from "../utils/arrows";
import { useParams } from "react-router"; //to store state in the URL

function DriverArrows({ selOutcome }) {
  // Call the function to connect cards with arrows
  const [arrows, setArrows] = useState([]);
  

  useEffect(() => {
    const fetchData = async () => {
      await getArrows(selOutcome.id).then((data) => {
        setArrows(data.data);
      });
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selOutcome]);

  //this function maps each arrow in the arrows array to a Xarrow component
  const arrowFunc = () => {
    console.log(arrows);
    return arrows.map((arrow) => {
      return (
        <Xarrow
          start={arrow.start}
          end={arrow.end}
          path={arrow.path}
          startAnchor={arrow.startAnchor}
          endAnchor={arrow.endAnchor}
          strokeWidth={arrow.strokeWidth}
          headSize={arrow.headSize}
          gridBreak={arrow.gridBreak}
          showTail={arrow.showTail}
          showHead={arrow.showHead}
        />
      );
    });
  };

  return <>
  <div>
    
    {arrowFunc()}
    </div>
    </>;
}

export default DriverArrows;
