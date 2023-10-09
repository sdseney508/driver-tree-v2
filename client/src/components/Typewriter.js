import React from "react";
import TypeWriterEffect from 'react-typewriter-effect';

function Typewriter() {


  return (
    <TypeWriterEffect
    textStyle={{
        fontFamily: 'Helvetica',
        color: "rgb(0, 173, 14)",
        fontWeight: 500,
        fontSize: '1em',
      }}
      startDelay={2000}
      cursorColor = "green"
      multiText={[
        "Powered",
        "By",
        "The",
        "Ingenuity",
        "of IPS"
      ]}
      multiTextDelay={1000}
      typeSpeed={40}  

    />
  );
}

export default Typewriter;