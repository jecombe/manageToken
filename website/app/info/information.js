import React, { useState, useEffect, useRef } from "react";
import "./information.css";
import { CircleLoader } from "react-spinners";
import {
  getRateLimits,
  parseAllowance,
  parseUserLogs,
  waitingRate,
} from "@/utils/utils";
import { getEventLogs, getActualBlock } from "@/utils/request";

export default function Information({ userAddress, isConnect }) {
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState([]);
  const [allowances, setAllowances] = useState([]);
  const [userLogs, setUserLogs] = useState([]);
  const [allLogs, setAllLogs] = useState([]);

  const [stop, setStop] = useState(false);
  const [selectedBlock, setSelectedBlock] = useState(null);
  const [saveData, setSaveData] = useState([]);
  const [lengthArray, setLengthArray] = useState({
    all: 0,
    user: 0,
    allo: 0,
  });
  const [objectData, setObjectData] = useState({
    save: [],
    iSave: 0,
    blockNumberStart: 0,
    timePerRequest: 0,
  });
  const [isStopped, setIsStopped] = useState(true);

  const stopRef = useRef(stop);

  const processLogsBatch = async () => {
    const batchStartTime = Date.now();
    const { logSave, i, blockNumber } = await getEventLogs(
      objectData.save,
      objectData.iSave,
      objectData.blockNumberStart
    );
    objectData.iSave = i;
    objectData.save = logSave;
    objectData.blockNumberStart = blockNumber;

    setAllLogs(objectData.save);
    setLogs(objectData.save);
    const user = parseUserLogs(objectData.save, userAddress);
    if (lengthArray.user < 11) setUserLogs(user);
    setAllowances(parseAllowance(user, userAddress));
    lengthArray.all = objectData.save.length;
    lengthArray.user = userLogs.length;
    lengthArray.allo = allowances.length;
    await waitingRate(batchStartTime, objectData.timePerRequest);
  };

  const getLogsContract = async () => {
    try {
      objectData.blockNumberStart = BigInt(await getActualBlock());
      objectData.timePerRequest = getRateLimits();

      while (!stopRef.current) {
        await processLogsBatch();
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    stopRef.current = stop;
  }, [stop]);

  useEffect(() => {
    if (isConnect && !stop) {
      getLogsContract();
    }
  }, [stop]);

  const stopRequest = () => {
    console.log("STOP");
    setStop(true);
    setIsStopped(false);
  };
  const startRequest = () => {
    setStop(false);
    setIsStopped(true);
    console.log("start");
    getLogsContract();
  };

  return (
    <div className="container">
      <div>
        {isStopped ? (
          <button className="stopButton" onClick={stopRequest}>
            Stop Fetching
          </button>
        ) : (
          <button className="startButton" onClick={startRequest}>
            Start Fetching
          </button>
        )}
      </div>
      <div className="top-table">
        <h2>Logs BUSD users</h2>
        {logs.length > 0 ? (
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
                {allLogs.map((action, index) => (
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
        ) : (
          <p>Loading...</p>
        )}
      </div>

      <div className="bottom-tables">
        <div className="side-by-side">
          <div className="table-container">
            <h2>Your BUSD logs</h2>
            {userLogs.length > 0 ? (
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
            ) : (
              <p>Loading...</p>
            )}
          </div>
          <div className="table-container">
            <h2>Your Allowances</h2>
            {allowances.length > 0 ? (
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
            ) : (
              <p>Loading...</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
