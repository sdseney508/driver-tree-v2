import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFViewer,
} from "@react-pdf/renderer";
import { useLocation } from "react-router-dom";
import React, { useState, useContext, useEffect } from "react";
import { state, stateContext } from "../App";
import { Container, Row, Col, Form } from "react-bootstrap";
// Create styles
const styles = StyleSheet.create({
  section: {
    margin: 10,
    padding: 10,
  },
  viewer: {
    width: window.innerWidth, //the pdf viewer will take up all of the width and height
    height: window.innerHeight,
  },
});

// Create Document Component
function OpLimitReport() {
  const location = useLocation();

  return (
    <Container>
      <div id="capture" className="op-limits-page">
        <h1>Hi</h1>
      </div>
      <PDFViewer style={styles.viewer}>

        <Document>

          <Page size="A4">
            <Text>
              <div id="capture" className="op-limits-page">
                hello there
              </div>
            </Text>
          </Page>
        </Document>
      </PDFViewer>
    </Container>
  );
}
export default OpLimitReport;
