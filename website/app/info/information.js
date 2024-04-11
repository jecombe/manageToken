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
  const [loadingAll, setLoadingAll] = useState(true)
  const [loadingUser, setLoadingUser] = useState(true)
  const [loadingAllowance, setLoadingAllowance] = useState(true)

  const [allowances, setAllowances] = useState([]);
  const [userLogs, setUserLogs] = useState([]);
  const [allLogs, setAllLogs] = useState([]);

  const [stop, setStop] = useState(false);

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
    const user = parseUserLogs(objectData.save, userAddress);
    setUserLogs(user);
    setAllowances(parseAllowance(user, userAddress));
    await waitingRate(batchStartTime, objectData.timePerRequest);
  };

  const setLoading = (isLoading) => {
    setLoadingAll(isLoading);
    setLoadingUser(isLoading);
    setLoadingAllowance(isLoading);
  }

  const getLogsContract = async () => {
    try {
      objectData.blockNumberStart = BigInt(await getActualBlock());
      objectData.timePerRequest = getRateLimits();

      while (!stopRef.current) {
        await processLogsBatch();
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
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
    setLoading(false);
  };
  const startRequest = () => {
    setStop(false);
    setIsStopped(true);
    setLoading(true);
    console.log("start");
  };

  const cleanData = () => {
    setObjectData({
      save: [],
      iSave: 0,
      blockNumberStart: 0,
      timePerRequest: 0,
    })
  }

  const resetRequest = () => {
    setStop(true);
    setIsStopped(false);
    setLoading(false);
    cleanData()
    setTimeout(() => {
      setStop(false);
      setIsStopped(true);
      setLoading(true)
    }, 2000);

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
        <button className="startButton" onClick={resetRequest}>
          Reset
        </button>
      </div>
      <div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <h2 style={{ marginRight: "10px" }}>Logs BUSD users</h2>
          {loadingAll && (
            <CircleLoader color={"#000000"} loading={loadingAll} size={20} />
          )}
        </div>
        <div className="top-table">
          {allLogs.length > 0 && (
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
          )}
        </div>
      </div>

      <div className="bottom-tables">
        <div className="side-by-side">
          <div style={{ marginRight: '20px' }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <h2 style={{ marginRight: "10px" }}>Your BUSD logs</h2>
              {loadingUser && (
                <CircleLoader color={"#000000"} loading={loadingUser} size={20} />
              )}
            </div>

            {userLogs.length > 0 && (
              <div className="table-container">
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
            )}
          </div>

          <div style={{ marginLeft: '20px' }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <h2 style={{ marginRight: "10px" }}>Your BUSD Allowances</h2>
              {loadingAllowance && (
                <CircleLoader color={"#000000"} loading={loadingAllowance} size={20} />
              )}
            </div>
            {allowances.length > 0 && (
              <div className="table-container">
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
