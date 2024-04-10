import { useState, useEffect, useRef } from "react";
import "./information.css";
import React from "react";

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
  const [stop, setStop] = useState(false);
  const [selectedBlock, setSelectedBlock] = useState(null);
  const [saveData, setSaveData] = useState([]);
  const stopRef = useRef(stop);

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

    await waitingRate(batchStartTime, params.timePerRequest);
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

  useEffect(() => {
    stopRef.current = stop;
  }, [stop]);

  useEffect(() => {
    if (isConnect && !stop) {
      getLogsContract();
    }
  }, [stop]);

  const stopRequest = () => {
    setStop(true);
  };
  const startRequest = () => {
    setStop(false);
    getLogsContract();
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
