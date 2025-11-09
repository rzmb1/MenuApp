import React, { useContext } from "react";
import NavigationEntry from "./NavigationEntry";
import NavigationProfile from "./NavigationProfile";
import { NotificationsContext } from "../../App";
import {
  BellIcon,
  TableCellsIcon,
  ChartBarIcon,
  HashtagIcon,
  ArrowLeftOnRectangleIcon,
  ArchiveBoxArrowDownIcon
} from "@heroicons/react/20/solid";
import NavigationCategory from "./NavigationCategory";
import { SCREEN_SIZE_CONDITIONER } from "../../data/clientConfiguration";
import NavigationEntryMobile from "./NavigationEntryMobile";
import { UserContext } from "../..";

export default function NavigationBar({ mainElement }) {
  const [notifications] = useContext(NotificationsContext);
  const [user] = useContext(UserContext);

  return (
    <>
      {SCREEN_SIZE_CONDITIONER ? (
        <div className="fixed top-0 left-0 z-40 w-[20%] min-h-screen bg-gray-white">
          <div className="flex flex-col w-full min-h-screen bg-slate-100 rounded-r-3xl overflow-hidden">
            <div className="flex items-center justify-center h-20 shadow-md">
              <NavigationProfile />
            </div>
            <ul className="flex flex-col py-2">
              <NavigationCategory name="Menüplan">
                <NavigationEntry
                  imageElement={<TableCellsIcon className="w-5 h-5" />}
                  link="/menu-plan"
                  text="Menüplan"
                />
              </NavigationCategory>

              <NavigationCategory name="Statistik">
                {(user.roles.includes("chef") ||
                  user.roles.includes("cook") ||
                  user.roles.includes("admin")) && (
                  <NavigationEntry
                    imageElement={<ChartBarIcon className="w-5 h-5" />}
                    link="/statistics"
                    text="Statistik"
                  />
                )}
                {user.roles.includes("chef") && (
                  <NavigationEntry
                    imageElement={<HashtagIcon className="w-5 h-5" />}
                    link="/outputcounter"
                    text="Ausgabenzähler"
                  />
                )}
              </NavigationCategory>

              <NavigationCategory name="Sonstiges">
                <NavigationEntry
                  imageElement={<BellIcon className="w-5 h-5" />}
                  badge={
                    notifications.filter((notification) => !notification.read)
                      .length
                  }
                  link="/notifications"
                  text="Benachrichtigungen"
                />
                
                {/*<NavigationEntry
                  imageElement={<Cog6ToothIcon className="w-5 h-5" />}
                  link="/settings"
                  text="Einstellungen"
                />*/}
              </NavigationCategory>

              <div className="border-t my-2">
                <NavigationEntry
                  imageElement={
                    <ArrowLeftOnRectangleIcon className="w-5 h-5" />
                  }
                  text="Logout"
                  textColor="text-red-500"
                  hoverTextColor="text-red-800"
                />
              </div>
            </ul>
          </div>
        </div>
      ) : (
        ""
      )}

      <div className={SCREEN_SIZE_CONDITIONER ? "ml-[20%] w-[80%] min-w-[80%] max-w-[80%] h-full" : "w-full h-[90%] min-h-[90%] max-h-[90%] overflow-auto"}>
        {mainElement}
      </div>

      {SCREEN_SIZE_CONDITIONER ? ("") : (
      <div className="fixed bottom-0 left-0 z-40 h-[10%] w-full bg-gray-white">
        <div className="flex h-full w-full bg-slate-100 overflow-hidden">
          <NavigationEntryMobile
            imageElement={
              <ArrowLeftOnRectangleIcon className="w-8 h-8" />
            }
            textColor="text-red-500"
            hoverTextColor="text-red-800"
            className="flex-grow"
          />

          <NavigationEntryMobile
            imageElement={<TableCellsIcon className="w-8 h-8" />}
            link="/menu-plan"
            className="flex-grow"
          />

          <NavigationEntryMobile
            imageElement={<ArchiveBoxArrowDownIcon className="w-8 h-8" />}
            link="/vote"
            text="Abstimmen"
          />

          <NavigationEntryMobile
            imageElement={<BellIcon className="w-8 h-8" />}
            badge={
              notifications.filter((notification) => !notification.read)
                .length
            }
            link={"/notifications"}
            className="flex-grow"
          />
        </div>
      </div>
      )}
    </>
  );
}
