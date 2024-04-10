import React, { useState, useEffect } from "react";
import "./information.css";
import { CircleLoader } from "react-spinners";
import { filterAddresses, isAddressEq } from "@/utils/utils";
import { getEventLogs, getActualBlock } from "@/utils/request";

const parseAllowance = (event, addressUser) => {
  return event.reduce((accumulator, currentValue) => {
    if (
      currentValue.eventName === "approval" &&
      filterAddresses(addressUser) &&
      isAddressEq(addressUser, currentValue.owner)
    ) {
      accumulator.push(currentValue);
    }
    return accumulator;
  }, []);
};

const parseUserLogs = (event, addressUser) => {
  return event.reduce((accumulator, currentValue) => {
    if (isAddressEq(addressUser, currentValue.owner)) {
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

  const getLogsContract = async () => {
    let blockNumberStart = BigInt(await getActualBlock());
    console.log(blockNumberStart);
    let save = [];
    let iSave = 0;
    try {
      while (!stop) {
        const { logSave, i, blockNumber } = await getEventLogs(
          save,
          iSave,
          blockNumberStart
        );
        if (logSave) save = logSave;
        blockNumberStart = blockNumber;
        iSave = i;
        setLogs(save);
        console.log(save);
        setAllowances(parseAllowance(save, userAddress));
        setUserLogs(parseUserLogs(save, userAddress));
        if (stop) return;
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    console.log("STOP => ", stop);
  }, [stop]);

  useEffect(() => {
    if (isConnect && !stop) {
      getLogsContract();
    }
  }, [stop]);

  const stopRequest = () => {
    console.log("OOOOOOOOOOOOOOOOOOOOJK");
    setStop(true);
    console.log("État d'arrêt :", stop);
  };
  const startRequest = () => {
    setStop(false);
    getLogsContract();
  };

  return (
    <>
      <div>
        <button onClick={stopRequest}>Stop requests </button>
        <button onClick={startRequest}>Start requests </button>
      </div>
      <div className="information-container">
        <div className="user-actions">
          <h2>Last 10 action of user {userAddress}</h2>
          <table>
            <thead>
              <tr>
                <th>Event</th>
                <th>Block Number</th>
                <th>To</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((action, index) => (
                <tr key={index}>
                  <td>{action.eventName}</td>
                  <td>{action.blockNumber}</td>
                  <td>{action?.to || action?.sender}</td>
                  <td>{action.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="all-actions">
          <h2> Last 10 actions of all users</h2>
          <table>
            <thead>
              <tr>
                <th>Event</th>
                <th>Block</th>
                <th>From</th>
                <th>To</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((action, index) => (
                <tr key={index}>
                  <td>{action.eventName}</td>
                  <td>{action.blockNumber}</td>
                  <td>{action?.from || action?.owner}</td>
                  <td>{action?.to || action?.sender}</td>
                  <td>{action.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <h2>Allowances of User</h2>
          <table>
            <thead>
              <tr>
                <th>Block Number</th>
                <th>Sender</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {allowances.map((allowance, index) => (
                <tr key={index}>
                  <td>{allowance.blockNumber}</td>
                  <td>{allowance.sender}</td>
                  <td>{allowance.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
