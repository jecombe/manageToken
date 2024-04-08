import React, { useState, useEffect } from "react";
import "./information.css";
import { getLogsUser, getWriteFunction, waitingTransaction } from "@/utils/utils";

export default function Information({userAddress}) {
  const [userActions, setUserActions] = useState([]);
  const [allActions, setAllActions] = useState([]);

  // Fonction pour obtenir les 10 dernières actions du smart contract BUSD de l'utilisateur
  const getUserActions = async () => {
    // Votre logique pour obtenir les actions de l'utilisateur
    // Par exemple :
    // const userActions = await getUserActionsFromSmartContract();
    // setUserActions(userActions);
    const rep = await getLogsUser("0x15A40d37e6f8A478DdE2cB18c83280D472B2fC35");
    console.log("::::::::::::::::::::::::::::::", rep);
  };

  // Fonction pour obtenir toutes les actions des utilisateurs
  const getAllActions = async () => {
    // Votre logique pour obtenir toutes les actions des utilisateurs
    // Par exemple :
    // const allActions = await getAllActionsFromSmartContract();
    // setAllActions(allActions);
  };

  // Appel des fonctions pour obtenir les actions au chargement du composant
  useEffect(() => {
    getUserActions();
    getAllActions();
  }, []);

  return (
    <div className="information-container">
      <div className="user-actions">
        <h2>Last 10 action of user {userAddress}</h2>
        <table>
          <thead>
            <tr>
              <th>Action</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {userActions.map((action, index) => (
              <tr key={index}>
                <td>{action.action}</td>
                <td>{action.date}</td>
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
