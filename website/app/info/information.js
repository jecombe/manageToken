import { useState, useEffect, useRef } from "react";
import "./information.css";
import React from "react";

import { CircleLoader } from "react-spinners";
import { filterAddresses, isAddressEq } from "@/utils/utils";
import { getEventLogs, getActualBlock } from "@/utils/request";
import { Accordion, AccordionItem } from "@nextui-org/react";

const parseAllowance = (event) => {
  return event.reduce((accumulator, currentValue) => {
    if (currentValue.eventName === "approval") {
      accumulator.push(currentValue);
    }
    return accumulator;
  }, []);
};

const parseUserLogs = (event, addressUser) => {
  return event.reduce((accumulator, currentValue) => {
    console.log("BEFORE FIRSTOOO => ", currentValue);
    if (isAddressEq(addressUser, currentValue?.owner || currentValue?.from)) {
      accumulator.push(currentValue);
    }
    return accumulator;
  }, []);
};

export default function Information({ userAddress, isConnect }) {
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState([]);
  const [allowances, setAllowances] = useState([]);
  const [userLogs, setUserLogs] = useState([]);
  const [stop, setStop] = useState(false);
  const [selectedBlock, setSelectedBlock] = useState(null);
  const [saveData, setSaveData] = useState([]);
  const stopRef = useRef(stop);

  const setData = ({ logSave, i, blockNumber }) => {};

  const processLogsBatch = async (params) => {
    const batchStartTime = Date.now();
    const { logSave, i, blockNumber } = await getEventLogs(
      params.save,
      params.iSave,
      params.blockNumberStart
    );
    params.iSave = i;
    params.save = logSave;
    params.blockNumberStart = blockNumber;

    setLogs(params.save);
    const user = parseUserLogs(params.save, userAddress);
    setUserLogs(user);
    setAllowances(parseAllowance(user, userAddress));

    await waitingRate(batchStartTime, params);
  };

  const waitingRate = async (batchStartTime, params) => {
    const elapsedTime = Date.now() - batchStartTime;
    const waitTime = Math.max(0, params.timePerRequest - elapsedTime);
    return new Promise((resolve) => setTimeout(resolve, waitTime));
  };

  const getRateLimits = () => {
    const requestsPerMinute = 1800;
    const millisecondsPerMinute = 60000;
    return millisecondsPerMinute / requestsPerMinute;
  };

  const getLogsContract = async () => {
    try {
      let params = {
        save: [],
        iSave: 0,
        blockNumberStart: BigInt(await getActualBlock()),
        timePerRequest: getRateLimits(),
      };
      while (!stopRef.current) {
        await processLogsBatch(params);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // const getLogsContract = async () => {
  //   const batchSize = 100; // Taille du lot
  //   const requestsPerMinute = 1800;
  //   const millisecondsPerMinute = 60000;
  //   const timePerRequest = millisecondsPerMinute / requestsPerMinute;

  //   try {
  //     let blockNumberStart = BigInt(await getActualBlock());
  //     let allLogs = [];
  //     let iSave = 0;

  //     const processLogsBatch = async () => {
  //       const batchStartTime = Date.now();
  //       const { logSave, i, blockNumber } = await getEventLogs(
  //         allLogs,
  //         iSave,
  //         blockNumberStart
  //       );
  //       iSave = i;
  //       allLogs = [...allLogs, ...logSave];
  //       blockNumberStart = blockNumber;

  //       setLogs(allLogs);
  //       const user = parseUserLogs(allLogs, userAddress);
  //       setUserLogs(user);
  //       setAllowances(parseAllowance(user, userAddress));

  //       const elapsedTime = Date.now() - batchStartTime;
  //       const waitTime = Math.max(0, timePerRequest - elapsedTime);
  //       await new Promise((resolve) => setTimeout(resolve, waitTime));
  //     };

  //     while (!stopRef.current) {
  //       await processLogsBatch();
  //     }
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  useEffect(() => {
    stopRef.current = stop; // Mettre à jour la valeur de stopRef.current lorsque stop change
  }, [stop]);

  useEffect(() => {
    if (isConnect && !stop) {
      getLogsContract();
    }
  }, [stop]);

  const stopRequest = () => {
    console.log("OOOOOOOOOOOOOOOOOOOOJK");
    setStop(true);
  };
  const startRequest = () => {
    setStop(false);
    getLogsContract();
  };

  // Fonction pour afficher les détails du bloc sélectionné
  const handleBlockClick = (blockNumber) => {
    setSelectedBlock(blockNumber); // Met à jour l'état du numéro de bloc sélectionné
  };

  return (
    <div className="container">
      <div className="top-table">
        <h2>Logs BUSD users</h2>
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Block</th>
                <th>Event</th>
                <th>From</th>
                <th>To</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((action, index) => (
                <tr
                  key={index}
                  style={{ overflowY: index >= 1 ? "auto" : "visible" }}
                >
                  <td>{action.blockNumber}</td>
                  <td>{action.eventName}</td>
                  <td>{action?.from || action?.sender}</td>
                  <td>{action?.to || action?.owner}</td>
                  <td>{action.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="bottom-tables">
        <div className="side-by-side">
          <div className="table-container">
            <h2>Your BUSD logs</h2>
            <table className="table">
              <thead>
                <tr>
                  <th>Block</th>
                  <th>Event</th>
                  <th>To</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody>
                {userLogs.map((action, index) => (
                  <tr
                    key={index}
                    style={{ overflowY: index >= 1 ? "auto" : "visible" }}
                  >
                    <td>{action.blockNumber}</td>
                    <td>{action.eventName}</td>
                    <td>{action?.to || action?.owner}</td>
                    <td>{action.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="table-container">
            <h2>Your Allowances</h2>
            <table className="table">
              <thead>
                <tr>
                  <th>Block</th>
                  <th>Sender</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody>
                {allowances.map((action, index) => (
                  <tr
                    key={index}
                    style={{ overflowY: index >= 1 ? "auto" : "visible" }}
                  >
                    <td>{action.blockNumber}</td>
                    <td>{action?.from || action?.sender}</td>
                    <td>{action.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div>
        {/* Boutons "Start" et "Stop" pour démarrer et arrêter le fetching */}
        <button onClick={startRequest}>Start</button>
        <button onClick={stopRequest}>Stop</button>
      </div>
    </div>
  );
}
