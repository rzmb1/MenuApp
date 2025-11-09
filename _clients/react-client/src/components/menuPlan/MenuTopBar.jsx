import {
  ArrowLeftCircleIcon,
  ArrowRightCircleIcon,
  ClipboardDocumentListIcon,
  DocumentCheckIcon,
  XMarkIcon,
  PencilSquareIcon,
  DocumentArrowUpIcon,
  TrashIcon,
  PrinterIcon,
  ArchiveBoxIcon,
} from "@heroicons/react/20/solid";
import React, { useContext } from "react";
import { WeekPicker } from "./WeekPicker/WeekPicker";
import Button from "../misc/Button";
import { UserContext } from "../..";
import { Tooltip } from 'flowbite-react';
import MenuToggle from "../menuPlanCreation/MenuToggle";


function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function MenuTopBar({
  handleBackClicked,
  text,
  startDate,
  handleWeekClicked,
  handleForwardClicked,
  editMode,
  menuFilter,
  setMenuFilter,
  menuPlan,
  handleDeleteClicked,
  handleRequestApprovalClicked,
  handleApprove,
  handleDisapprove,
  handlePublish,
  handleWithdraw,
  handlePrint,
  handleStartPollClicked
}) {

  function getMenuPlanStateText() {
    let text = '';
    switch(menuPlan?.state) {
      case 'in-review':
        text = 'In-Überprüfung';
        break;
      case 'approved':
        text = 'Freigegeben'
        break;
      case 'draft':
        text = 'Entwurf';
        break;
      case 'published':
        text = 'Veröffentlicht';
        break;
      default:
        text = '';
        break;
    }
    return text;
  }
  const [user] = useContext(UserContext);
  const handleMenuChange = (name) => {
    setMenuFilter({...menuFilter, [name]:!menuFilter[name]});
  }

  return (
    <div className="border-b border-b-slate-400 h-full ">
      <div className="flex items-center h-full">
        <div className={classNames(!handleBackClicked ? "invisible grow" : "grow")}>
          <ArrowLeftCircleIcon
            className="w-10 h-10 float-left cursor-pointer ml-3"
            onClick={handleBackClicked}
          />
        </div>

        {menuFilter &&
        <div className='flex my-4 mx-auto'>
          <MenuToggle name="A" onChange={handleMenuChange} isChecked={menuFilter.A} />
          <MenuToggle name="B" onChange={handleMenuChange} isChecked={menuFilter.B} />
          <MenuToggle name="C" onChange={handleMenuChange} isChecked={menuFilter.C} />
        </div>}

        <div className="grow">
          {handleWeekClicked?
          <WeekPicker
            startDate={startDate}
            onChange={(weekObj) => handleWeekClicked(weekObj.firstDay)}
            text={text}
          />
          :
          <h2 className="text-4xl w-full text-center text-[#454545]">{text}</h2>}
        </div>

        {
          (user.roles.includes("chef") ||
          user.roles.includes("cook") ||
          user.roles.includes("admin")) && menuPlan?.state &&
          <div className="grow">
            <h2 className="text-4xl w-full text-center">{getMenuPlanStateText()}</h2>
          </div>
        }

        { 
          (user.roles.includes("chef") ||
            user.roles.includes("cook") ||
            user.roles.includes("admin")) && !(menuPlan?.state === 'published') &&
          <div className="flex flex-row">

            {
              editMode && (!menuPlan?.state || menuPlan?.state === 'draft') && 
              <Tooltip content="Freigabe anfordern" placement="bottom">
                <Button
                  onClick={handleRequestApprovalClicked}
                  className="m-0 p-0 my-auto text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200"
                >
                  <ClipboardDocumentListIcon className="w-10 h-10 float-left cursor-pointer fill-black"/>
                </Button>
              </Tooltip>
            }

            {
              editMode && menuPlan?.state === 'in-review' && menuPlan?.approvedBy === user._id ? 
              <Tooltip content="Akzeptieren" placement="bottom">
                <Button
                  onClick={handleApprove}
                  className="m-0 p-0 my-auto text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200"
                >
                  <DocumentCheckIcon className="w-10 h-10 float-left cursor-pointer fill-black"/>
                </Button>
              </Tooltip> : editMode && menuPlan?.state === 'in-review' &&
              <Tooltip content="Keine Befugnis zur Freigabe!" placement="bottom" className="cursor-default">
                <Button
                  className="cursor-default m-0 p-0 my-auto text-sm font-medium text-gray-900 focus:outline-none bg-gray-400 rounded-lg border border-gray-400 hover:bg-gray-400"
                >
                  <DocumentCheckIcon className="w-10 h-10 float-left cursor-default fill-black"/>
                </Button>
              </Tooltip>
            }

            {
              editMode && menuPlan?.state === 'approved' && 
              <Tooltip content="Veröffentlichen" placement="bottom">
                <Button
                  onClick={handlePublish}
                  className="m-0 p-0 my-auto text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200"
                >
                  <DocumentArrowUpIcon className="w-10 h-10 float-left cursor-pointer fill-black"/>
                </Button>
              </Tooltip>
            }
              
            {
              editMode && (!menuPlan?.state || menuPlan?.state === 'draft') && 
              <>
                <Tooltip content="Abstimmung starten" placement="bottom">
                  <Button
                    onClick={handleStartPollClicked}
                    className="m-0 p-0 my-auto text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200"
                  >
                    <ArchiveBoxIcon className="w-10 h-10 float-left cursor-pointer fill-black"/>
                  </Button>
                </Tooltip>
                <Tooltip content="Löschen" placement="bottom">
                  <Button
                    onClick={handleDeleteClicked}
                    className="m-0 p-0 my-auto text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200"
                  >
                    <TrashIcon className="w-10 h-10 float-left cursor-pointer fill-black"/>
                  </Button>
              </Tooltip>
              </>
              
            }

            {
              editMode && menuPlan?.state === 'in-review' && menuPlan?.approvedBy !== user._id ?
              <Tooltip content="Keine Befugnis zur Ablehnung der Freigabe!" placement="bottom" className="cursor-default">
                <Button
                  className="cursor-default m-0 p-0 my-auto text-sm font-medium text-gray-900 focus:outline-none bg-gray-400 rounded-lg border border-gray-400 hover:bg-gray-400"
                >
                  <XMarkIcon className="w-10 h-10 float-left cursor-default fill-black"/>
                </Button>
              </Tooltip>
              : editMode && menuPlan?.state === 'in-review' ? 
              <Tooltip content="Ablehnen" placement="bottom">
                <Button
                  onClick={handleDisapprove}
                  className="m-0 p-0 my-auto text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200"
                >
                  <XMarkIcon className="w-10 h-10 float-left cursor-pointer fill-black"/>
                </Button>
              </Tooltip>
              : editMode && menuPlan?.state === 'approved' && 
              <Tooltip content="Bearbeiten" placement="bottom">
                <Button
                  onClick={handleWithdraw}
                  className="m-0 p-0 my-auto text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200"
                >
                  <PencilSquareIcon className="w-10 h-10 float-left cursor-pointer fill-black"/>
                </Button>
              </Tooltip> 
            }
          </div>
        }

        {
          menuFilter &&
          (user.roles.includes("chef") || user.roles.includes("cook") || user.roles.includes("admin")) &&
          <Tooltip content="Menüplan ausdrucken" placement="bottom">
            <Button
              onClick={handlePrint}
              className="m-0 p-0 my-auto text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200"
            >
              <PrinterIcon className="w-10 h-10 float-left cursor-pointer fill-black"/>
            </Button>
          </Tooltip>
        }
        
        <div className={classNames(!handleForwardClicked ? "invisible grow" : "grow")}>
          <ArrowRightCircleIcon
            className="h-10 w-10 float-right cursor-pointer mr-3"
            onClick={handleForwardClicked}
          />
        </div>
      </div>
    </div>
  );
}
