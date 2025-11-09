import PageNotFound from "./components/misc/PageNotFound.jsx";
import MenuPlanMobile from "./components/menuPlan/MenuPlan_Mobile.jsx";
import MenuPlanOriginal from "./components/menuPlan/MenuPlan.jsx";
import { Routes, Route, Navigate } from "react-router-dom";
import NavigationBar from "./components/Navigation/NavigationBar";
import Statistics from "./components/statistics/Statistics";
import Notifications from "./components/notifications/Notifications";
import { createContext, useState, useEffect, useContext } from "react";
import MenuPlanSignup from "./components/signup/MenuPlanSignup";
import restClient from "./services/rest-client-service";
import DataInputView from "./components/statistics/DataInputView";

import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import OrderRegister from "./components/order/OrderRegister.jsx";

import { LOGIN_REQUEST, MSAL_CONFIGURATION, SCREEN_SIZE_CONDITIONER, USERS_URL } from "./data/clientConfiguration.js";
import {
  dateToStandardString,
  getCurrentStartDate,
} from "./services/date-service.js";
import useInterval from "./components/notifications/polling.js";
import { AuthenticatedTemplate, UnauthenticatedTemplate, useMsal } from "@azure/msal-react";
import { EventType } from '@azure/msal-browser';
import { UserContext } from "./index.js";
import PageForbidden from "./components/misc/PageForbidden.jsx";
import PollCreation from "./components/poll/Poll_Creation.jsx";
import Vote from "./components/vote/Vote.jsx";
export const NotificationsContext = createContext([]);
export let bearerAccessToken = '';

function App() {
  const [notifications, setNotifications] = useState([]);
  const { instance } = useMsal();
  const [user, setUser] = useContext(UserContext);

  useEffect(()=>{ 
    const getUser = () => { 
      instance.acquireTokenSilent({
        authority: MSAL_CONFIGURATION.auth.authority,
        scopes: [MSAL_CONFIGURATION.auth.clientId + "/.default"]
      }).then((resp) => {
        bearerAccessToken = `Bearer ${resp.accessToken}`;
        restClient.get(USERS_URL, {
          Authorization: `Bearer ${resp.accessToken}`
        })
        .then((response) => response.data)
        .then((data) => {
          const newUser = {...data,"roles":instance.getActiveAccount().idTokenClaims.roles??[]}; // roles are swapped with azure roles
          localStorage.setItem('user', JSON.stringify(newUser)); // Persist
          setUser(newUser);
        })
        .catch(response => {
          console.error(`Loading items for '${USERS_URL}' failed.`, response)
        })
      });
    };

    const handleLogin = (event) => { 
      if (event.eventType === EventType.LOGIN_SUCCESS && event.payload.account) {
        instance.setActiveAccount(event.payload.account);
        getUser(); // On Login
      }
    };

    instance.addEventCallback(handleLogin);

    instance.initialize().then(() => {
      instance.handleRedirectPromise().then(() => {
        if(instance.getActiveAccount()){
          getUser();
        } else {
          instance.loginRedirect(LOGIN_REQUEST);
        }
      }).catch(err=>{
        console.error(err);
      });
    }).catch(err => {
      console.error(err);
    });

  }, [instance, setUser]);

  useEffect(() => {
    if (user._id) {
      restClient
        .get("/api/notifications?_idUser=" + user._id)
        .then((response) => {
          setNotifications(
            response.data.sort((a, b) => {
              return (
                new Date(a.timeCreated).getTime() -
                new Date(b.timeCreated).getTime()
              );
            })
          );
        })
        .catch((response) =>
          console.error("Getting Notifications failed.", response)
        );
    }
  }, [user._id, setNotifications]);

  useInterval(() => {
    if (user._id) {
      restClient
        .get("/api/notifications?_idUser=" + user._id)
        .then((response) => {
          setNotifications(
            response.data.sort((a, b) => {
              return (
                new Date(a.timeCreated).getTime() -
                new Date(b.timeCreated).getTime()
              );
            })
          );
        })
        .catch((response) =>
          console.error("Getting Notifications failed.", response)
        );
    }
  }, 1000 * 10);

  return (
      <>
        <AuthenticatedTemplate>
          <ToastContainer />
          <NotificationsContext.Provider
            value={[notifications, setNotifications]}
          >
            {<Routes>
                <Route index element={
                  <NavigationBar
                    mainElement={
                      <Navigate
                        to={
                          "/menu-plan/" +
                          dateToStandardString(getCurrentStartDate())
                        }
                      />
                    }
                  />
                } />
                <Route
                  path="menu-plan"
                  element={
                    <NavigationBar
                      mainElement={
                        <Navigate
                          to={
                            "/menu-plan/" +
                            dateToStandardString(getCurrentStartDate())
                          }
                        />
                      }
                    />
                  }
                />
                <Route
                  path="menu-plan/:startDate"
                  element={
                    <NavigationBar
                      mainElement={
                        SCREEN_SIZE_CONDITIONER ? (
                          <MenuPlanOriginal />
                        ) : (
                          <MenuPlanMobile />
                        )
                      }
                    />
                  }
                />
                <Route
                  path="menu-plan/:menuplanId/poll-creation"
                  element={(user.roles.includes("chef") || 
                            user.roles.includes("admin"))?
                            <NavigationBar mainElement={<PollCreation />} />:
                            <PageForbidden />}
                />
                <Route
                  path="notifications"
                  element={<NavigationBar mainElement={<Notifications />} />} 
                />
                <Route
                  path="statistics"
                  element={(user.roles.includes("chef") || 
                            user.roles.includes("cook") || 
                            user.roles.includes("admin"))?
                            <NavigationBar mainElement={<Statistics />} />:
                            <PageForbidden />}
                />
                <Route
                  path="outputcounter"
                  element={user.roles.includes("chef")?<NavigationBar mainElement={<DataInputView />} />:<PageForbidden />}
                />
                <Route
                  path="vote"
                  element={<NavigationBar mainElement={<Vote />} />}
                />
                <Route
                  path="signup/:date"
                  element={<NavigationBar mainElement={<MenuPlanSignup />} />}
                />
                <Route path="order/:date" element={<NavigationBar mainElement={<OrderRegister />} />} />
                <Route path="*" element={<PageNotFound />} />
              </Routes>
            }
            </NotificationsContext.Provider>
        </AuthenticatedTemplate>

        <UnauthenticatedTemplate>
        </UnauthenticatedTemplate>
      </>
  );
}

export default App;
