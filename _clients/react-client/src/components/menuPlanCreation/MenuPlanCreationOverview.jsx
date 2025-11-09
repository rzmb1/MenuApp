import { useNavigate } from "react-router-dom";
import React, { useState, useContext, useEffect, useMemo } from "react";
import { UserContext } from "../..";
import {MenuTable} from "../menuPlan/MenuTable";
import TopBar from "../menuPlan/MenuTopBar";
import restClient from "../../services/rest-client-service";
import Dialog from "@mui/material/Dialog";
import { MENUPLAN_URL } from "../../data/clientConfiguration";
import ChefDropdown from "./ChefDropdown";
import { DialogContent } from "@mui/material";
import Button from "../misc/Button";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";


export default function MenuPlanCreationOverview({
  text,
  startDate,
  editMode,
  menuPlan,
  setMenuPlan,
  setCurrPage,
  currDay,
  setCurrDay,
  setCurrMeal,
  disabled,
  toggleDayDisabled,
  handleEditMode,
  handleBackClicked,
  handleForwardClicked,
  handleWeekClicked,
  menuFilter,
  setMenuFilter,
  printMode,
  componentRef,
  handlePrint,
}) {

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [requestApprovalDialogOpen, setRequestApprovalDialogOpen] =
    useState(false);
  const navigate = useNavigate();
  const [user] = useContext(UserContext);
  const [dayToDisable, setDayToDisable] = useState('');
  const [disableDayDialogOpen, setDisableDayDialogOpen] = useState(false);
  const [disapproveDialogOpen, setDisapproveDialogOpen] = useState(false);
  const [invalidDayDialogOpen, setInvalidDayDialogOpen] = useState(false);
  const [invalidMenuplanDialogOpen, setInvalidMenuplanDialogOpen] =
    useState(false);
  const [withdrawDialogOpen, setWithdrawDialogOpen] = useState(false);
  const [disapprovalMessage, setDisapprovalMessage] = useState("");

  const [chefList, setChefList] = useState([]);
  const [selectedChefId, setSelectedChefId] = useState(0);

  const menuplanProblems = useMemo(() => {
    let problems = [];
    for (let day in menuPlan?.days) {
      if (
        !disabled?.[day] &&
        !menuPlan?.days[day].find(
          (dish) =>
            dish.tags.includes("Vegetarisch") &&
            dish.tags.includes("Hauptspeise")
        )
      ) {
        problems.push(`Am ${day} gibt es keine Vegetarische Hauptspeise`);
      }
    }
    return problems;
  }, [disabled, menuPlan]);

  function handleDishDeleted(day, dish) {
    setMenuPlan({
      ...menuPlan,
      days: {
        ...menuPlan.days,
        [day]: menuPlan.days[day].filter((d) => d.name !== dish.name),
      },
    });
  }

  function handleNewDish(day) {
    setCurrDay(day);
    if (!disabled[day]) {
      addNewDish(day);
    } else {
      setInvalidDayDialogOpen(true);
    }
  }

  function activateDayAndCreate(day) {
    toggleDayDisabled(day);
    setInvalidDayDialogOpen(false);
    addNewDish(day);
  }

  function addNewDish(day) {
    setCurrDay(day);
    setCurrMeal({});
    setCurrPage("dishCreation");
  }

  function handleDishClicked(day, dish) {
    setCurrMeal(dish);
    setCurrDay(day);
    setCurrPage("dishCreation");
  }

  useEffect(() => {
    
    if (menuPlan && menuPlan?._id) {
      restClient
        .patch(MENUPLAN_URL + "/" + menuPlan._id, {
          ...menuPlan,
          __v: undefined,
        })
        .catch((response) => {
          console.error(`Saving to '${MENUPLAN_URL}' failed.`, response)
        });
    }
  }, [menuPlan]);

  async function onDisableDayClicked(day, enable = false) {
    setDayToDisable(day);
    if (enable) {
      toggleDayDisabled(day);
    } else {
      /*menuPlan.days[day] = undefined;
      try {
        let newMenuPlan = (await restClient.patch(`${MENUPLAN_URL}/${menuPlan._id}`, menuPlan));
        setMenuPlan(newMenuPlan);
      } catch (err) {
        console.error(`Saving to '${MENUPLAN_URL}' failed.`, err);
      }*/
      setDisableDayDialogOpen(true);
    }
  }

  function disableDayToDisable() {
    toggleDayDisabled(dayToDisable);
    setDisableDayDialogOpen(false);
  }

  function handleDeleteClicked() {
    setDeleteDialogOpen(true);
  }

  function deleteMenuPlan() {
    setDeleteDialogOpen(false);
    setMenuPlan({...menuPlan, state: "cancelled"});
    restClient
      .patch(MENUPLAN_URL + "/" + menuPlan._id, { state: "cancelled" })
      .then((_response) => navigate(`/menu-plan/${menuPlan?.startDate}`))
      .catch((response) =>
        console.error(
          `Saving to '${MENUPLAN_URL}'
  failed.`,
          response
        )
      );
  }

  function cancelDisableDay() {
    setDisableDayDialogOpen(false);
  }

  function cancelDeleteMenuPlan() {
    setDeleteDialogOpen(false);
  }

  function cancelWithdrawApproval() {
    setWithdrawDialogOpen(false);
  }

  function handleApprovalRequest(chef) {
    if (!chef) return;
    restClient
      .patch(MENUPLAN_URL + "/" + menuPlan._id, { state: "in-review", approvedBy: chef._id })
      .then((response) => {
        //let newMenuPlan = {...response.data, state: "in-review", createdBy: user._id, approvedBy: chef._id};
        
        setMenuPlan({...response.data, state: "in-review", createdBy: user._id, approvedBy: chef._id});


        const notification = {
          _idUser: chef._id,
          title: "Freigabe angefordert",
          text: `Eine Freigabe wurde für den Menüplan 
          ${menuPlan.startDate.replaceAll("-", ".")}-${menuPlan.endDate.replaceAll("-", ".")}
          von ${user.firstname} ${user.lastname} angefordert.`,
          read: false,
          timeCreated: new Date(),
          priority: "HIGH",
          link: `/menu-plan/${menuPlan.startDate}?editMode=true`,
        };

        restClient
          .patch(MENUPLAN_URL + "/" + menuPlan._id, { createdBy: user._id })
          .then((_response) => navigate(`/menu-plan/${menuPlan?.startDate}`))
          .catch((response) =>
            console.error(
              `Saving to '${MENUPLAN_URL}'
        failed.`,
              response
            )
          );

        restClient
          .post("/api/notifications", notification)
          .then((_response) => {
            setRequestApprovalDialogOpen(false);
            setSelectedChefId(0);
          })
          .catch((error) =>
            console.error("Error sending approval request:", error)
          );
      })
      .catch((error) =>
        console.error("Error updating menu plan status:", error)
      );
  }

  function handleRequestApprovalClicked() {
    if (menuplanProblems.length) {
      setInvalidMenuplanDialogOpen(true);
    } else {
      requestApproval();
    }
  }
  function requestApproval() {
    setInvalidMenuplanDialogOpen(false);
    restClient
      .get("/api/users")
      .then((response) =>
        setChefList(
          response.data.filter(
            (u) => u.roles.includes("chef") && u._id !== user._id
          )
        )
      )
      .catch((error) => console.error("Error fetching chef list:", error));

    setRequestApprovalDialogOpen(true);
  }

  function approve() {
    setMenuPlan({ ...menuPlan, approvedBy: user._id, state: "approved" });
    restClient
      .patch(MENUPLAN_URL + "/" + menuPlan._id, { approvedBy: user._id, state: "approved" })
      .then((_response) => navigate(`/menu-plan/${menuPlan?.startDate}`))
      .catch((response) =>
        console.error(`Saving to '${MENUPLAN_URL}' failed.`, response)
      );

    const notification = {
      _idUser: menuPlan.createdBy,
      title: "Freigabe Angenommen",
      text:
        `Ihre angeforderte freigabe füden den Menüplan ${menuPlan.startDate.replaceAll(
          "-",
          "."
        )}-${menuPlan.endDate.replaceAll("-", ".")} wurde von ${
          user.firstname
        } ${user.lastname} angenommen` +
        (disapprovalMessage ? ": " + disapprovalMessage : "."),
      read: false,
      timeCreated: new Date(),
      link: `/menu-plan/${menuPlan.startDate}?editMode=true`,
      priority: "LOW",
    };

    restClient
      .post("/api/notifications", notification)
      .then((_response) => {
        setRequestApprovalDialogOpen(false);
        setSelectedChefId(0);
      })
      .catch((error) =>
        console.error("Error sending approval request:", error)
      );
  }

  function disapprove() {
    setMenuPlan({...menuPlan, state: "draft"})
    restClient
      .patch(MENUPLAN_URL + "/" + menuPlan._id, { state: "draft" })
      .then((_response) => navigate(`/menu-plan/${menuPlan?.startDate}`))
      .catch((response) =>
        console.error(
          `Saving to '${MENUPLAN_URL}'
    failed.`,
          response
        )
      );

    const notification = {
      _idUser: menuPlan.createdBy,
      title: "Freigabe abgelehnt",
      text:
        `Ihre angeforderte freigabe für den den Menüplan ${menuPlan.startDate.replaceAll(
          "-",
          "."
        )}-${menuPlan.endDate.replaceAll("-", ".")} wurde von ${
          user.firstname
        } ${user.lastname} abgelehnt` +
        (disapprovalMessage ? ": " + disapprovalMessage : "."),
      read: false,
      timeCreated: new Date(),
      link: `/menu-plan/${menuPlan.startDate}?editMode=true`,
      priority: "HIGH",
    };

    restClient
      .post("/api/notifications", notification)
      .then((_response) => {
        setRequestApprovalDialogOpen(false);
        setSelectedChefId(0);
      })
      .catch((error) =>
        console.error("Error sending approval request:", error)
      );
  }

  function withdraw() {
    setWithdrawDialogOpen(false);
    setMenuPlan({...menuPlan, state: "draft"})
    restClient
      .patch(MENUPLAN_URL + "/" + menuPlan._id, { state: "draft" })
      .then((_response) => navigate(`/menu-plan/${menuPlan?.startDate}`))
      .catch((response) =>
        console.error(
          `Saving to '${MENUPLAN_URL}'
    failed.`,
          response
        )
      );
  }

  function publish() {
    setMenuPlan({...menuPlan, state: "published"})
    handleEditMode();
    restClient
      .patch(MENUPLAN_URL + "/" + menuPlan._id, { state: "published" })
      .then((_response) => navigate(`/menu-plan/${menuPlan?.startDate}`))
      .catch((response) =>
        console.error(
          `Saving to '${MENUPLAN_URL}'
  failed.`,
          response
        )
      );
  }

  function openDisapproveDialog() {
    setDisapproveDialogOpen(true);
  }

  function openWithdrawDialog() {
    setWithdrawDialogOpen(true);
  }

  function closeDisapproveDialog() {
    setDisapproveDialogOpen(false);
  }

  function disapproveWithMessage() {
    disapprove();
    closeDisapproveDialog();
  }

  return (
    <div className="h-full menuPlan">
      <Dialog open={deleteDialogOpen} onClose={cancelDeleteMenuPlan}>
        <h3 className="text-center m-1.5">
          Bist du sicher, dass du den Menüplan löschen willst?
        </h3>
        <h3 className="text-center m-1.5 text-red-700">
          (Alle eingetragenen Gerichte des Menüplans werden dabei gelöscht!)
        </h3>
        <div className="flex flex-row items-center justify-center">
          <Button onClick={deleteMenuPlan}>Ja</Button>
          <Button onClick={cancelDeleteMenuPlan}>Nein</Button>
        </div>
      </Dialog>

      <Dialog open={disableDayDialogOpen} onClose={cancelDisableDay}>
        <h3 className="text-center m-1.5">
          {`Bist du sicher, dass du den ${dayToDisable} deaktivieren willst?`}
        </h3>
        <h3 className="text-center m-1.5 text-red-700">
          {`(Alle eingetragenen Gerichte des ${dayToDisable}s werden dabei gelöscht)`}
        </h3>
        <div className="flex flex-row items-center justify-center">
          <Button onClick={disableDayToDisable}>Ja</Button>
          <Button onClick={cancelDisableDay}>Nein</Button>
        </div>
      </Dialog>

      <Dialog
        open={invalidMenuplanDialogOpen}
        onClose={() => setInvalidMenuplanDialogOpen(false)}
      >
        <div className="p-5 pt-3 w-fit">
          <h3 className="text-lg text-center">Es gibt Probleme mit dem Menüplan</h3>
          <div className="mb-6">
            {menuplanProblems.map((problem, idx) => (
              <div key={idx} className="my-3 p-1 whitespace-nowrap flex border-solid border-yellow-100 border-2 rounded-md bg-yellow-100">
                <ExclamationTriangleIcon className="h-[1.2rem] text-yellow-600 mt-auto mb-[0.04rem] mr-1"/>
                <span className="text-yellow-600">{problem}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-center">
            <Button onClick={requestApproval} className="my-0 ml-0 mr-5 whitespace-nowrap">
              Freigabe trotzdem anfordern
            </Button>
            <Button onClick={() => setInvalidMenuplanDialogOpen(false)} className="my-0 ml-0 mr-5 whitespace-nowrap">
              Abbrechen
            </Button>
          </div>
        </div>
      </Dialog>

      <Dialog
        open={invalidDayDialogOpen}
        onClose={() => setInvalidDayDialogOpen(false)}
      >
        <h3 className="m-1.5 text-center">
          {currDay +
            " wurde als ausgetragen markiert, als eingetragen markieren?"}
        </h3>
        <div className="flex">
          <Button onClick={() => activateDayAndCreate(currDay)}>Ja</Button>
          <Button onClick={() => setInvalidDayDialogOpen(false)}>Nein</Button>
        </div>
      </Dialog>

      <Dialog
        maxWidth='35vw'
        open={requestApprovalDialogOpen}
        onClose={() => setRequestApprovalDialogOpen(false)}
      >
        <DialogContent className="p-[3%] w-[35vw] overflow-hidden h-[24.5rem]">
          <ChefDropdown
            setSelected={setSelectedChefId}
            chefs={chefList}
            selected={selectedChefId}
          />

          <div className="absolute bottom-[3%] w-fit left-1/3">
            <Button className="ml-0"
              onClick={() => {
                handleApprovalRequest(selectedChefId);
              }}
            >
              Freigabe anfordern
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={disapproveDialogOpen} onClose={closeDisapproveDialog}>
        <div className="flex flex-col items-center justify-center p-8">
          <h3>Bitte geben Sie eine Nachricht für die Ablehnung ein:</h3>
          <textarea
            className="w-full min-h-full mt-2.5"
            value={disapprovalMessage}
            onChange={(e) => setDisapprovalMessage(e.target.value)}
          />
          <div className="flex flex-row items-center justify-center mt-2.5">
            <Button onClick={disapproveWithMessage}>
              Ablehnen und Nachricht senden
            </Button>
            <Button className="ml-2.5" onClick={closeDisapproveDialog}>
              Abbrechen
            </Button>
          </div>
        </div>
      </Dialog>

      <Dialog open={withdrawDialogOpen} onClose={cancelWithdrawApproval}>
        <h3 className="text-center m-1.5">
          Bist du sicher, dass du den Menüplan jetzt noch bearbeiten willst?
        </h3>
        <h3 className="text-center m-1.5 text-red-700">
          (Der Freigabeprozess des Menüplans fängt dabei wieder von vorne an!)
        </h3>
        <div className="flex flex-row items-center justify-center">
          <Button onClick={withdraw}>Ja</Button>
          <Button onClick={cancelWithdrawApproval}>Nein</Button>
        </div>
      </Dialog>

      <div className="h-[10vh]">
        <TopBar
          text={text}
          startDate={startDate}
          editMode={editMode}
          saveMode={true}
          menuFilter={menuFilter}
          setMenuFilter={setMenuFilter}
          menuPlan={menuPlan}
          handleEditMode={handleEditMode}
          handleDeleteClicked={handleDeleteClicked}
          handleRequestApprovalClicked={handleRequestApprovalClicked}
          handleApprove={approve}
          handleDisapprove={openDisapproveDialog}
          handlePublish={publish}
          handleWithdraw={openWithdrawDialog}
          handleBackClicked={handleBackClicked}
          handleForwardClicked={handleForwardClicked}
          handleWeekClicked={handleWeekClicked}
          handleStartPollClicked={() => navigate(`/menu-plan/${menuPlan._id}/poll-creation`)}
          disabled={disabled}
          handlePrint={handlePrint}
        />
      </div>
      <div className="h-[36vw]">
        {(menuPlan?.state === "in-review" || menuPlan?.state === "approved" || menuPlan?.state === "published") ? (
          <MenuTable
            menuPlan={menuPlan}
            disabled={disabled}
            onDishClicked={handleDishClicked}
            menuFilter={menuFilter}
            printMode={printMode}
            ref={componentRef}
          />
        ) : (
          <MenuTable
            menuPlan={menuPlan}
            disabled={disabled}
            onDisableDayClicked={onDisableDayClicked}
            onAddClicked={handleNewDish}
            onDeleteClicked={handleDishDeleted}
            onDishClicked={handleDishClicked}
            menuFilter={menuFilter}
            printMode={printMode}
            ref={componentRef}
          />
        )}
      </div>
    </div>
  );
}
