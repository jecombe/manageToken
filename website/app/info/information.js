import React, { useState, useEffect } from "react";
import "./information.css";
import {
  getActualBlock,
  getAllAllowance,
  getLogsUser,
  getLogsUsers,
  //  getAllowance,
  getWriteFunction,
  waitingTransaction,
} from "@/utils/utils";


const isBlockExist = (toCompare, keyToCheck) => {
  return Object.keys(toCompare).includes(keyToCheck);


}

const addingData = (isExist, model, log) => {
  if (isExist) {
    model.push(log)
  } else {
    model.push({ [log.blockNumber]: { ...log } });
  }
  return model;
}


const getObjet = (toFind, key) => {
  return toFind.findIndex(obj => Object.keys(obj).includes(key));
};


export default function Information({ userAddress, isConnect }) {
  const [userActions, setUserActions] = useState([]);
  const [allActions, setAllActions] = useState([]);
  const [loading, setLoading] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const [logs, setLogs] = useState([]);

  /*const parseFinal = (save, model, indexStart) => {




    save.forEach((log, index) => {
      if (index > indexStart) {

        if (log.eventName === "transfer") {
          const index = getObjet(model, "transfer");
          const isExist = isBlockExist(model[index].transfer, log.blockNumber);
          console.log(isExist);
          model[index].transfer = addingData(isExist, model[index].transfer, log);
        } else if (log.eventName === "approval") {
          const index = getObjet(model, "approval");
          const isExist = isBlockExist(model[index].approval, log.blockNumber);
          model[index].approval = addingData(isExist, model[index].approval, log);
        }
      }
    });

    return model;
  }*/

  const getUserActions = async () => {
    let blockNumberStart = BigInt(await getActualBlock());
    let save = [];
    let iSave = 0;
    let index = 0
    // let saveFinal = [{ transfer: [] }, { approval: [] }];

    while (save.length < 7) {
      const { logSave, i, blockNumber } = await getLogsUser(save, iSave, blockNumberStart);
      //const final = parseFinal(logSave, saveFinal, index)
      index = logSave.length - 1;
      //saveFinal = final;
      save = logSave
      blockNumberStart = blockNumber;
      iSave = i;
      setLogs(save)
    }
  };
  const getAllowances = async () => {
    // const logs = await getAllowance(
    //   "0x15A40d37e6f8A478DdE2cB18c83280D472B2fC35"
    // );
    // setLogs(logs);
    console.log(logs);

  };

  const getAllActions = async () => {
    let blockNumberStart = BigInt(await getActualBlock());
    let save = [];
    let iSave = 0;
    let index = 0
    // let saveFinal = [{ transfer: [] }, { approval: [] }];

    while (save.length < 7) {
      console.log("**************************", userAddress);
      const { logSave, i, blockNumber } = await getLogsUsers(save, iSave, blockNumberStart, userAddress);
      //const final = parseFinal(logSave, saveFinal, index)
      index = logSave.length - 1;
      //saveFinal = final;
      save = logSave
      blockNumberStart = blockNumber;
      iSave = i;
      console.log(save);
      //setLogs(save)
    }
  };

  const getAllo = async () => {
    let blockNumberStart = BigInt(await getActualBlock());
    let save = [];
    let iSave = 0;
    let index = 0
    while (save.length < 7) {
      console.log("**************************", userAddress);
      const { logSave, i, blockNumber } = await getAllAllowance(save, iSave, blockNumberStart, userAddress);
      //const final = parseFinal(logSave, saveFinal, index)
      index = logSave.length - 1;
      //saveFinal = final;
      save = logSave
      blockNumberStart = blockNumber;
      iSave = i;
      console.log(save);
      //setLogs(save)
    }
  }

  useEffect(() => {
    if (isConnect) {
      getAllo()
      //  getUserActions();
     /// getAllActions();
    }
  }, []);


  function renderTableRow(eventName, event, index) {
    return (
      <tr key={index}>
        <td>{eventName}</td>
        {Object.keys(event).map(blockNumber => (
          <React.Fragment key={blockNumber}>
            <td>{event[blockNumber].from}</td>
            <td>{event[blockNumber].to}</td>
            <td>{blockNumber}</td>
          </React.Fragment>
        ))}
      </tr>
    );
  }



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
            {console.log(logs)}

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
                <td>{action?.from || action?.sender}</td>
                <td>{action?.to || action?.owner}</td>
                <td>{action.value}</td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

