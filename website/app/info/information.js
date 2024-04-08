import React, { useState, useEffect } from "react";
import "./information.css";
import {
  getLogsUser,
  //  getAllowance,
  getWriteFunction,
  waitingTransaction,
} from "@/utils/utils";

export default function Information({ userAddress, isConnect }) {
  const [userActions, setUserActions] = useState([]);
  const [allActions, setAllActions] = useState([]);
  const [logs, setLogs] = useState([]);

  const getUserActions = async () => {
    const logs = await getLogsUser(
      "0x15A40d37e6f8A478DdE2cB18c83280D472B2fC35"
    );
    setLogs(logs);
    console.log(logs);
  };

  const getAllowances = async () => {
    // const logs = await getAllowance(
    //   "0x15A40d37e6f8A478DdE2cB18c83280D472B2fC35"
    // );
    // setLogs(logs);
    console.log(logs);
  };

  const getAllActions = async () => {};

  useEffect(() => {
    if (isConnect) {
      getUserActions();
      getAllActions();
    }
  }, []);

  return (
    <div className="information-container">
      <div className="user-actions">
        <h2>Last 10 action of user {userAddress}</h2>
        <table>
          <thead>
            <tr>
              <th>Event</th>
              <th>Block Number</th>
              <th>User</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log, index) => (
              <tr key={index}>
                <td>{log.eventName}</td>
                <td>{log.blockNumber.toString()}</td>
                <td>{log.args.from}</td>
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
              <th>User</th>
              <th>Action</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {allActions.map((action, index) => (
              <tr key={index}>
                <td>{action.user}</td>
                <td>{action.action}</td>
                <td>{action.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
